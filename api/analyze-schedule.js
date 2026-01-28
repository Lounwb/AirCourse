// Vercel Serverless Function - API代理
// 文件路径：/api/analyze-schedule.js

export default async function handler(req, res) {
    // 设置CORS头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // 处理OPTIONS预检请求
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    // 只允许POST请求
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const { image, model = 'qwen-vl-max' } = req.body;
        
        if (!image) {
            return res.status(400).json({ error: '缺少图片数据' });
        }
        
        // --- Supabase：每日限额统计（未登录用户限制 10 次/天） ---
        // 说明：
        // - 所有请求都会在 guest_daily_usage 中记录使用次数（便于观察数据）
        // - 只有“未携带 Supabase access token”的请求才会被实际限流（返回 429）
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        const quotaTable = process.env.SUPABASE_GUEST_QUOTA_TABLE || "guest_daily_usage";
        const quotaSalt = process.env.GUEST_QUOTA_SALT || "default_salt_change_me";

        const authHeader = req.headers.authorization || req.headers.Authorization;
        const hasUserToken = typeof authHeader === "string" && authHeader.toLowerCase().startsWith("bearer ");

        if (supabaseUrl && supabaseServiceKey) {
          try {
            const { createClient } = await import("@supabase/supabase-js");
            const crypto = await import("crypto");
            const supabase = createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false } });

            // Vercel 常见来源：x-forwarded-for 可能是逗号分隔
            const xff = req.headers["x-forwarded-for"];
            const rawIp = (Array.isArray(xff) ? xff[0] : (xff || "")).split(",")[0].trim()
              || req.socket?.remoteAddress
              || "unknown";
            const ipHash = crypto.createHash("sha256").update(`${rawIp}:${quotaSalt}`).digest("hex");

            const today = new Date();
            const y = today.getUTCFullYear();
            const m = String(today.getUTCMonth() + 1).padStart(2, "0");
            const d = String(today.getUTCDate()).padStart(2, "0");
            const dayKey = `${y}-${m}-${d}`; // UTC 日期

            const { data: row, error: readErr } = await supabase
              .from(quotaTable)
              .select("count")
              .eq("day", dayKey)
              .eq("ip_hash", ipHash)
              .maybeSingle();

            if (readErr) {
              console.error("配额读取失败:", readErr.message);
            }

            const used = row?.count || 0;
            const limit = 10;

            // 仅对未登录用户做真正限流
            if (!hasUserToken && used >= limit) {
              res.setHeader("X-Guest-Limit", String(limit));
              res.setHeader("X-Guest-Used", String(used));
              return res.status(429).json({ error: "未登录用户今日免费次数已用完（10 次）" });
            }

            const next = used + 1;
            const { error: upsertErr } = await supabase
              .from(quotaTable)
              .upsert(
                { day: dayKey, ip_hash: ipHash, count: next, updated_at: new Date().toISOString() },
                { onConflict: "day,ip_hash" }
              );

            if (upsertErr) {
              console.error("配额写入失败:", upsertErr.message);
            } else {
              res.setHeader("X-Guest-Limit", String(limit));
              res.setHeader("X-Guest-Used", String(next));
            }
          } catch (quotaErr) {
            console.error("配额统计异常:", quotaErr);
            // 不阻塞后续 AI 调用
          }
        }

        // 从环境变量获取API Key
        const apiKey = process.env.DASHSCOPE_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'API Key未配置' });
        }
        
        // 构建请求数据
        const prompt = `请分析这张课表图片，提取出所有课程信息，并按照以下JSON格式返回：

{
  "courses": [
    {
      "name": "课程名称",
      "teacher": "教师姓名",
      "timeSlots": [
        {
          "location": "上课地点",
          "startWeek": 1,
          "endWeek": 16,
          "dayOfWeek": 1,
          "startClass": 1,
          "endClass": 2
        }
      ]
    }
  ]
}

注意：
1. dayOfWeek: 1=星期一, 2=星期二, ..., 7=星期日
2. startClass和endClass: 第几节课（从1开始）
3. 如果同一门课程在不同周次有不同安排，请为每个时间段创建单独的timeSlot
4. 请仔细识别所有课程信息，包括课程名称、教师、地点、时间等
5. 只返回JSON格式，不要包含其他文字`;

        const requestBody = {
            model: model,
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'image_url',
                            image_url: {
                                url: image
                            }
                        },
                        {
                            type: 'text',
                            text: prompt
                        }
                    ]
                }
            ],
            max_tokens: 4000,
            temperature: 0.1
        };
        
        // 调用Qwen API
        const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return res.status(response.status).json({
                error: errorData.error?.message || errorData.message || `API请求失败: ${response.status}`
            });
        }
        
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        
        if (!content) {
            return res.status(500).json({ error: 'API返回数据格式错误' });
        }
        
        try {
            // 尝试提取JSON
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                return res.status(500).json({ error: '无法从响应中提取JSON数据' });
            }
            
            const jsonData = JSON.parse(jsonMatch[0]);
            
            // 返回成功结果
            return res.status(200).json({
                success: true,
                data: jsonData
            });
            
        } catch (parseError) {
            console.error('JSON解析错误:', parseError);
            return res.status(500).json({ error: 'AI返回的数据格式不正确' });
        }
        
    } catch (error) {
        console.error('API代理错误:', error);
        return res.status(500).json({ error: '服务器内部错误' });
    }
}
