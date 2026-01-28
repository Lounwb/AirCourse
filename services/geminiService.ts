import type { Course, Period, TimeSlot } from "../types";
import { supabase } from "./supabaseClient";

export type GuestQuota = { limit: number; used: number };
export type ParseTimetableResult = { courses: Course[]; guestQuota?: GuestQuota };

type ApiCourse = {
  name?: string;
  teacher?: string;
  timeSlots?: Array<{
    location?: string;
    startWeek?: number;
    endWeek?: number;
    dayOfWeek?: number; // 1-7
    startClass?: number; // 1-based
    endClass?: number; // 1-based
  }>;
};

function dayOfWeekToInternal(dayOfWeek?: number): string {
  switch (dayOfWeek) {
    case 1:
      return "Monday";
    case 2:
      return "Tuesday";
    case 3:
      return "Wednesday";
    case 4:
      return "Thursday";
    case 5:
      return "Friday";
    case 6:
      return "Saturday";
    case 7:
      return "Sunday";
    default:
      return "Monday";
  }
}

function pickTimeFromPeriods(periods: Period[], startClass?: number, endClass?: number): { startTime: string; endTime: string } {
  const sIdx = Math.max(0, (startClass || 1) - 1);
  const eIdx = Math.max(0, (endClass || startClass || 1) - 1);
  const startTime = periods[sIdx]?.start || periods[0]?.start || "08:00";
  const endTime = periods[eIdx]?.end || periods[periods.length - 1]?.end || "09:00";
  return { startTime, endTime };
}

function readGuestQuotaHeaders(resp: Response): GuestQuota | undefined {
  const limitRaw = resp.headers.get("x-guest-limit");
  const usedRaw = resp.headers.get("x-guest-used");
  const limit = limitRaw ? parseInt(limitRaw, 10) : NaN;
  const used = usedRaw ? parseInt(usedRaw, 10) : NaN;
  if (!Number.isFinite(limit) || !Number.isFinite(used)) return undefined;
  return { limit, used };
}

export const parseTimetableImage = async (base64Image: string, periods: Period[]): Promise<ParseTimetableResult> => {
  const { data } = await supabase.auth.getSession();
  const accessToken = data.session?.access_token;

  // 说明：
  // - 生产环境：VITE_API_BASE_URL 为空字符串，直接走同源 /api/analyze-schedule（由 Vercel 托管）
  // - 本地开发如果只跑 `npm run dev`，没有本地 /api 路由，可以在 .env.local 里配置：
  //   VITE_API_BASE_URL="https://你的-vercel-域名"
  const apiBase = (import.meta as any).env?.VITE_API_BASE_URL || "";
  const url = apiBase ? `${apiBase.replace(/\/$/, "")}/api/analyze-schedule` : "/api/analyze-schedule";

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
    },
    body: JSON.stringify({ image: base64Image })
  });

  const guestQuota = readGuestQuotaHeaders(resp);
  const json = await resp.json().catch(() => null);
  if (!resp.ok) {
    const err: any = new Error(json?.error || `AI 请求失败: ${resp.status}`);
    err.status = resp.status;
    if (guestQuota) err.guestQuota = guestQuota;
    throw err;
  }

  const apiCourses: ApiCourse[] = json?.data?.courses || [];
  const courses: Course[] = (apiCourses || []).map((c) => {
    const courseId = Math.random().toString(36).substr(2, 9);
    const timeSlots: TimeSlot[] = (c.timeSlots || []).map((ts) => {
      const times = pickTimeFromPeriods(periods, ts.startClass, ts.endClass);
      return {
        id: Math.random().toString(36).substr(2, 9),
        day: dayOfWeekToInternal(ts.dayOfWeek),
        period: "",
        startTime: times.startTime,
        endTime: times.endTime,
        location: ts.location || "",
        frequency: "Weekly"
      };
    });

    return {
      id: courseId,
      name: c.name || "未命名课程",
      instructor: c.teacher || "",
      timeSlots
    };
  });

  return { courses, guestQuota };
};
