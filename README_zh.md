<div align="center">
  <img src="./favicon.svg" width="96" alt="AirCourse AI Logo" />
  <h2>AirCourse AI · 课表转 ICS 工具</h2>
  <p>上传课表图片 · 一键生成 Apple/Google 日历可用的 ICS 文件</p>
  <p>
    <img src="https://img.shields.io/github/stars/lounwb/apple-timetable?style=social" alt="GitHub Stars" />
    <img src="https://img.shields.io/github/forks/lounwb/apple-timetable?style=social" alt="GitHub Forks" />
    <img src="https://img.shields.io/github/license/lounwb/apple-timetable" alt="License" />
    <a href="./README.md">
      <img src="https://img.shields.io/badge/lang-English-blue?logo=google-translate" alt="English README" />
    </a>
  </p>
</div>

---

## ✨ 项目简介

**AirCourse AI** 是一个为中国高校学生优化的课表转 ICS 网页工具，你可以：

- 上传课表截图，使用 **阿里通义千问视觉模型** 自动识别课程信息  
- 按学校（含多个校区）自动填充 **上课时间段 + 校区地址**  
- 支持 **单/双周（Odd/Even Weeks）**、多时间段课程等复杂安排  
- 一键导出标准 **`.ics` 日历文件**，可导入：
  - Apple 日历（iPhone / iPad / Mac）
  - Google Calendar
  - 其它支持 ICS 的日历应用

在线预览：`https://apple-timetable.vercel.app`

---

## 🎯 功能特性

- **AI 课表识别**
  - 上传图片（JPG/PNG 等），通过 DashScope Qwen 模型识别课程、教师、教室、星期与节次。
  - 识别失败会有清晰的错误状态提示。

- **985 / 211 大学时间配置**
  - 本地 `data/universities.js` 内置多所中国高校及其校区地址与作息时间。
  - 搜索时支持模糊匹配，关键字将会在下拉列表中**高亮显示**。
  - 从下拉列表选择学校时：
    - 自动填充校区地址与节次数组（periods）
    - 地址输入框锁定为只读，避免误改
  - 手工输入学校名时：
    - 地址输入框自动解锁，支持自由编辑
    - 若清空学校名，地址也会自动清空

- **课程配置体验优化**
  - 课程支持多个时间段（不同周次、不同星期、不同教室）。
  - “起始节次 / 结束节次”：
    - 各自只有一个简洁的下拉框（不再出现“对齐节次”的辅助下拉）。
    - 选择起始节次时，结束节次会**自动默认为下一节**（例如从第 2 节开始则默认第 3 节结束）。
    - 多次调整起始节次时，结束节次会始终跟随为“下一节”，保证默认连续两节课体验。

- **周课表预览与导出**
  - 可切换查看不同周次课表（含单周 / 双周标记）。
  - 支持一键导出 `.ics` 文件。

- **登录与配额**
  - 使用 **Supabase Auth** 提供邮箱 Magic Link 登录：
    - 点击“登录”，输入邮箱，系统发送登录链接。
    - 点击邮箱中的链接后自动登录，前端顶部会展示当前登录邮箱。
  - **未登录用户每日 10 次免费 AI 识别**：
    - 所有调用会在 Supabase `guest_daily_usage` 表中记录。
    - 未登录用户超出 10 次后，将收到 429 提示，界面会展示“今日剩余 0 / 10 次，请登录继续”。
    - 登录用户目前不受 10 次限制（仍会记录统计数据）。

---

## 🧱 技术栈

- 前端：**React 19 + Vite + TypeScript**
- UI：**Tailwind CSS**，响应式设计，暗色模式支持
- AI 模型：阿里 **DashScope / Qwen** 兼容模式 API
- 鉴权与数据：**Supabase**
  - Auth：邮箱 Magic Link 登录
  - `guest_daily_usage`：未登录用户每日配额统计

---

## 🚀 本地运行

### 1. 环境要求

- Node.js 18+（推荐 18 或 20）

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

在项目根目录创建 `.env.local`（你已经有一份，可以按需补充）：

```env
# 前端调用的 API 基地址（本地开发可以指向线上 Vercel 域名，也可以空着用 vercel dev）
VITE_API_BASE_URL=https://apple-timetable.vercel.app

# Supabase 前端配置（Anon Key 是公开可用的）
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=你的_supabase_anon_key

# DashScope / 通义千问 API Key（仅在 Serverless 中使用，前端拿不到）
DASHSCOPE_API_KEY=你的_dashscope_key

# Supabase 服务端配置（Service Role Key 权限很大，只能用在 /api 中）
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=你的_service_role_key

# 未登录配额统计的盐值（任意随机长字符串）
GUEST_QUOTA_SALT=随机长字符串

# README / 代码展示的 GitHub 仓库地址（用于导航栏 GitHub 按钮）
VITE_GITHUB_URL=https://github.com/Lounwb/apple-timetable

# 可选：Magic Link 登录完成后的重定向地址
VITE_SUPABASE_REDIRECT_URL=https://apple-timetable.vercel.app
```

### 4. Supabase 数据表

在 Supabase SQL 控制台中创建未登录配额统计表：

```sql
create table if not exists guest_daily_usage (
  day text not null,
  ip_hash text not null,
  count int not null default 0,
  updated_at timestamptz not null default now(),
  primary key(day, ip_hash)
);
```

> 提示：你也可以为 `guest_daily_usage(day)` 创建索引，以便后续统计更快。

### 5. 启动开发服务器

本地直接只跑前端（`/api` 指向线上 Vercel）：

```bash
npm run dev
```

如果你希望本地也同时起 Vercel 的 Serverless 函数，可以使用：

```bash
vercel dev
```


## 🤝 贡献与反馈

- 欢迎通过 GitHub Issues 提交：
  - Bug 反馈（识别异常、导出问题、UI 问题等）
  - 功能建议（支持更多学校、更多导出格式、更多提醒模式等）
- 如果你为某所学校整理了完整的节次时间配置，也欢迎 PR 补充到 `data/universities.js`。


## 📄 License

本项目基于 [MIT License](LICENSE) 开源协议。

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=Lounwb/apple-timetable&type=date&legend=bottom-right)](https://www.star-history.com/#Lounwb/apple-timetable&type=date&legend=bottom-right)

---