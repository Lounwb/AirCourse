import { supabase } from "./supabaseClient";
import type { UniversityCampusSuggestion } from "./universityService";

// 说明：
// - 前端只用 anon key 读数据，因此需要在 Supabase 开启 RLS 并允许 public select
// - 表结构建议见 README（下方会补充）
export async function searchUniversityCampusesFromDb(query: string, limit = 8): Promise<UniversityCampusSuggestion[]> {
  const q = (query || "").trim();
  if (!q) return [];

  // campuses.display_name 建议存 “学校（校区）”
  // campuses.address 存详细地址
  // campuses.class_times 存 JSON 数组：[{start,end},...]
  const { data, error } = await supabase
    .from("campuses")
    .select("display_name,address,class_times")
    .or(`display_name.ilike.%${q}%,address.ilike.%${q}%`)
    .limit(limit);

  if (error) {
    // 读库失败时由调用方兜底到本地数据
    console.warn("[universityDb] search failed:", error.message);
    return [];
  }

  return (data || []).map((row: any) => ({
    key: row.display_name,
    name: row.display_name,
    address: row.address || "",
    classTimes: Array.isArray(row.class_times) ? row.class_times : undefined
  }));
}

