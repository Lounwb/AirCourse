import React, { useState, useRef, useEffect, Fragment } from 'react';
import { AppState, Course, TimeSlot, Period } from './types';
import { parseTimetableImage, GuestQuota } from './services/geminiService';
import { classTimesToPeriods, searchUniversityCampuses, UniversityCampusSuggestion } from './services/universityService';
import { supabase } from './services/supabaseClient';
import { SpeedInsights } from "@vercel/speed-insights/react";

// --- i18n Translations ---

const translations = {
  zh: {
    heroTitle: "让你的课程表瞬间同步",
    heroSub: "上传你的课程表图片。AI 会自动识别细节并生成可导入手机或电脑的日历文件。",
    uploadTitle: "1. 上传课程表",
    uploadDrop: "将课程表图片拖到这里",
    uploadBrowse: "或浏览文件",
    scanning: "AI 正在扫描表格结构...",
    structureIdentified: "已识别表格结构",
    recognitionFailed: "识别失败",
    basicInfoTitle: "2. 基本信息",
    schoolName: "学校 / 机构名称",
    schoolPlaceholder: "搜索你的大学...",
    campusAddress: "校区地址",
    campusPlaceholder: "街道、城市、教学楼",
    startDate: "学期开始日期",
    totalWeeks: "总周数",
    timeSlotsTitle: "开课时间段",
    timeSlotsSub: "这些时间段将定义课表中的行位置。",
    addPeriod: "添加时段",
    continueConfig: "继续配置",
    configTitle: "课程配置",
    configSub: "微调 AI 识别出的课程和时间安排。",
    addCourse: "添加课程",
    editCourse: "编辑课程详情",
    courseName: "课程名称",
    instructor: "授课教师",
    scheduleSlots: "上课时间",
    day: "星期",
    frequency: "频率",
    startPeriod: "起始节次",
    endPeriod: "结束节次",
    snapToPeriod: "对齐节次",
    location: "地点 / 教室",
    cancel: "取消",
    save: "保存更改",
    back: "返回",
    backToList: "返回列表",
    viewTimetable: "查看周课表",
    weeklyTimetable: "周课表预览",
    timetableSub: "预览即将导入日历的课程安排。",
    week: "第",
    weekSuffix: "周",
    even: "双周",
    odd: "单周",
    downloadIcs: "下载 .ics 文件",
    compatible: "兼容性",
    successTitle: "同步成功！",
    successSub: "你的日历文件已准备就绪，可以导入。支持华为、苹果、谷歌、三星等系统。",
    startNew: "开始新的同步",
    deleteConfirm: "确认删除该课程？",
    days: {
      Monday: "星期一",
      Tuesday: "星期二",
      Wednesday: "星期三",
      Thursday: "星期四",
      Friday: "星期五",
      Saturday: "星期六",
      Sunday: "星期日"
    },
    freqs: {
      "Weekly": "每周",
      "Odd Weeks": "单周",
      "Even Weeks": "双周"
    }
  },
  en: {
    heroTitle: "Turn your schedule into sync",
    heroSub: "Upload a photo of your timetable. Our AI extracts the details and creates an ICS calendar file for your phone or laptop.",
    uploadTitle: "1. Upload Timetable",
    uploadDrop: "Drop your timetable here",
    uploadBrowse: "Or browse files",
    scanning: "Analyzing Timetable...",
    structureIdentified: "Structure identified",
    recognitionFailed: "Recognition Failed",
    basicInfoTitle: "2. Basic Information",
    schoolName: "School / Institution Name",
    schoolPlaceholder: "Search for your university...",
    campusAddress: "Campus Address",
    campusPlaceholder: "Street, City, Building",
    startDate: "Semester Start Date",
    totalWeeks: "Total Weeks",
    timeSlotsTitle: "Class Time Slots",
    timeSlotsSub: "These slots will define your timetable grid rows.",
    addPeriod: "Add Slot",
    continueConfig: "Continue to Configuration",
    configTitle: "Configuration",
    configSub: "Fine-tune the courses and schedules identified by AI.",
    addCourse: "Add Course",
    editCourse: "Edit Course Details",
    courseName: "Course Name",
    instructor: "Instructor",
    scheduleSlots: "Schedule Slots",
    day: "Day",
    frequency: "Frequency",
    startPeriod: "Start Period",
    endPeriod: "End Period",
    snapToPeriod: "Snap to Period",
    location: "Room / Location",
    cancel: "Cancel",
    save: "Save Changes",
    back: "Back",
    backToList: "Back to List",
    viewTimetable: "Go to Timetable View",
    weeklyTimetable: "Weekly Timetable",
    timetableSub: "Preview your schedule as it will appear in your calendar.",
    week: "Week",
    weekSuffix: "",
    even: "EVEN",
    odd: "ODD",
    downloadIcs: "Download .ics File",
    compatible: "Compatible with",
    successTitle: "Sync Success!",
    successSub: "Your calendar file is ready for import. Works seamlessly with HUAWEI, Samsung, Apple, and Google.",
    startNew: "Start New Sync",
    deleteConfirm: "Delete this course?",
    days: {
      Monday: "Monday",
      Tuesday: "Tuesday",
      Wednesday: "Wednesday",
      Thursday: "Thursday",
      Friday: "Friday",
      Saturday: "Saturday",
      Sunday: "Sunday"
    },
    freqs: {
      "Weekly": "Weekly",
      "Odd Weeks": "Odd Weeks",
      "Even Weeks": "Even Weeks"
    }
  }
};

const INITIAL_PERIODS: Period[] = [
  { id: 1, name: "1", start: "08:00", end: "08:45" },
  { id: 2, name: "2", start: "08:55", end: "09:40" },
  { id: 3, name: "3", start: "10:00", end: "10:45" },
  { id: 4, name: "4", start: "10:55", end: "11:40" },
  { id: 5, name: "5", start: "12:00", end: "12:45" },
  { id: 6, name: "6", start: "12:55", end: "13:40" },
  { id: 7, name: "7", start: "14:00", end: "14:45" },
  { id: 8, name: "8", start: "14:55", end: "15:40" },
  { id: 9, name: "9", start: "16:00", end: "16:45" },
  { id: 10, name: "10", start: "16:55", end: "17:40" },
  { id: 11, name: "11", start: "18:30", end: "19:15" },
  { id: 12, name: "12", start: "19:25", end: "20:10" },
];

const DAYS_INTERNAL = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// --- UI Components ---

const Header: React.FC<{ language: 'zh' | 'en'; setLanguage: (l: 'zh' | 'en') => void }> = ({ language, setLanguage }) => (
  <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e7edf3] dark:border-b-slate-800 px-6 md:px-10 py-3 glass-panel sticky top-0 z-50">
    <div className="flex items-center gap-4">
      <div className="size-8 flex items-center justify-center bg-primary text-white rounded-lg">
        <span className="material-symbols-outlined">calendar_today</span>
      </div>
      <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] dark:text-white">AirCourse AI</h2>
    </div>
    <div className="flex flex-1 justify-end gap-4 items-center">
      <button
        onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
        className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-bold flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
      >
        <span className="material-symbols-outlined text-sm">language</span>
        {language === 'zh' ? 'English' : '中文'}
      </button>
    </div>
  </header>
);

const Footer: React.FC = () => (
  <footer className="mt-12 py-8 border-t border-slate-200 dark:border-slate-800 flex justify-center items-center opacity-40 text-sm">
    <p>© 2026 AirCourse AI. Intelligent Schedule Syncing.</p>
  </footer>
);

const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
          <h3 className="text-xl font-bold">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    step: 'upload',
    language: 'zh',
    image: null,
    institution: '',
    address: '',
    startDate: '',
    totalWeeks: 16,
    duration: 60,
    courses: [],
    periods: INITIAL_PERIODS,
    loading: false,
    statusMessage: 'Ready'
  });

  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<UniversityCampusSuggestion[]>([]);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [authUserEmail, setAuthUserEmail] = useState<string | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authStatus, setAuthStatus] = useState<string>("");
  const [guestQuota, setGuestQuota] = useState<GuestQuota | null>(null);
  const [selectedInstitutionKey, setSelectedInstitutionKey] = useState<string | null>(null);

  const t = translations[state.language];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const githubUrl = (import.meta as any).env?.VITE_GITHUB_URL;

  useEffect(() => {
    // 初始化与订阅登录态
    supabase.auth.getSession().then(({ data }) => {
      setAuthUserEmail(data.session?.user?.email || null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthUserEmail(session?.user?.email || null);
    });
    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let interval: number;
    if (state.loading) {
      setLoadingProgress(0);
      interval = window.setInterval(() => {
        setLoadingProgress(prev => (prev < 90 ? prev + (90 - prev) * 0.1 : prev));
      }, 500);
    } else {
      setLoadingProgress(100);
      const timeout = setTimeout(() => setLoadingProgress(0), 1000);
      return () => clearTimeout(timeout);
    }
    return () => clearInterval(interval);
  }, [state.loading]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 重置 input 的值，保证即便用户再次选择同一张图片也会触发 onChange
    e.target.value = "";

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setState(prev => ({ ...prev, image: base64, loading: true, statusMessage: t.scanning }));

      try {
        const result = await parseTimetableImage(base64, state.periods);
        if (result.guestQuota) setGuestQuota(result.guestQuota);
        setState(prev => ({
          ...prev,
          courses: result.courses,
          loading: false,
          statusMessage: t.structureIdentified
        }));
      } catch (err) {
        console.error(err);
        const anyErr: any = err;
        if (anyErr?.guestQuota) setGuestQuota(anyErr.guestQuota);
        const msg =
          anyErr?.status === 429
            ? (state.language === 'zh' ? '未登录用户今日免费次数已用完（10 次），请登录继续。' : 'Daily free guest quota exceeded. Please sign in.')
            : t.recognitionFailed;
        setState(prev => ({ ...prev, loading: false, statusMessage: msg }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleInstitutionChange = (val: string) => {
    setState(prev => ({
      ...prev,
      institution: val,
      // 当用户把学校名称清空时，自动清空校区地址
      address: val.trim() === "" ? "" : prev.address
    }));
    // 只要用户手动改动学校名称，就认为不再是列表选择的固定校区
    if (val !== selectedInstitutionKey) {
      setSelectedInstitutionKey(null);
    }
    const trimmed = val.trim();
    if (!trimmed) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const results = searchUniversityCampuses(trimmed, 8);
    setSuggestions(results);
    setShowSuggestions(results.length > 0);
  };

  const handleInstitutionSelect = (item: UniversityCampusSuggestion) => {
    setState(prev => {
      const next: AppState = { ...prev, institution: item.key, address: item.address };
      if (item.classTimes && item.classTimes.length > 0) {
        next.periods = classTimesToPeriods(item.classTimes);
      }
      return next;
    });
    setSelectedInstitutionKey(item.key);
    setShowSuggestions(false);
  };

  const handleReset = () => {
    setState({
      step: 'upload', language: state.language, image: null, institution: '', address: '', startDate: '', totalWeeks: 16, duration: 60, courses: [], periods: INITIAL_PERIODS, loading: false, statusMessage: 'Ready'
    });
    setSelectedWeek(1);
  };

  const deleteCourse = (id: string) => {
    if (window.confirm(t.deleteConfirm)) {
      setState(prev => ({ ...prev, courses: prev.courses.filter(c => c.id !== id) }));
    }
  };

  const saveEditedCourse = (updated: Course) => {
    setState(prev => ({ ...prev, courses: prev.courses.map(c => c.id === updated.id ? updated : c) }));
    setEditingCourse(null);
  };

  const addNewCourse = (newCourse: Course) => {
    setState(prev => ({ ...prev, courses: [...prev.courses, { ...newCourse, id: Math.random().toString(36).substr(2, 9) }] }));
    setIsAddingCourse(false);
  };

  const generateICS = () => {
    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//AirCourse AI//EN\n";
    state.courses.forEach(course => {
      course.timeSlots.forEach(slot => {
        icsContent += "BEGIN:VEVENT\n";
        icsContent += `SUMMARY:${course.name}\n`;
        icsContent += `DESCRIPTION:Instructor: ${course.instructor}\n`;
        icsContent += `LOCATION:${slot.location}\n`;
        let frequencyRule = `RRULE:FREQ=WEEKLY;COUNT=${state.totalWeeks}`;
        if (slot.frequency === 'Odd Weeks') frequencyRule = `RRULE:FREQ=WEEKLY;INTERVAL=2;COUNT=${Math.ceil(state.totalWeeks / 2)}`;
        else if (slot.frequency === 'Even Weeks') frequencyRule = `RRULE:FREQ=WEEKLY;INTERVAL=2;COUNT=${Math.floor(state.totalWeeks / 2)}`;
        icsContent += frequencyRule + "\n";
        icsContent += "END:VEVENT\n";
      });
    });
    icsContent += "END:VCALENDAR";
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'timetable.ics';
    a.click();
    setState(prev => ({ ...prev, step: 'success' }));
  };

  const shouldShowInWeek = (slot: TimeSlot, week: number) => {
    if (slot.frequency === 'Weekly') return true;
    if (slot.frequency === 'Odd Weeks') return week % 2 !== 0;
    if (slot.frequency === 'Even Weeks') return week % 2 === 0;
    return true;
  };

  const findCourseAtSlot = (day: string, periodStart: string, periodEnd: string) => {
    const pStart = periodStart.replace(':', '');
    const pEnd = periodEnd.replace(':', '');
    for (const course of state.courses) {
      for (const slot of course.timeSlots) {
        if (slot.day === day && shouldShowInWeek(slot, selectedWeek)) {
          const sStart = slot.startTime.replace(':', '');
          const sEnd = slot.endTime.replace(':', '');
          if ((sStart >= pStart && sStart < pEnd) || (sEnd > pStart && sEnd <= pEnd) || (sStart <= pStart && sEnd >= pEnd)) return { course, slot };
        }
      }
    }
    return null;
  };

  const updatePeriod = (id: number, field: keyof Period, value: string) => {
    setState(prev => ({
      ...prev,
      periods: prev.periods.map(p => p.id === id ? { ...p, [field]: value } : p)
    }));
  };

  const addPeriod = () => {
    const last = state.periods[state.periods.length - 1];
    const newId = (last?.id || 0) + 1;
    setState(prev => ({
      ...prev,
      periods: [...prev.periods, { id: newId, name: `${newId}`, start: "08:00", end: "09:00" }]
    }));
  };

  const removePeriod = (id: number) => {
    setState(prev => ({
      ...prev,
      periods: prev.periods.filter(p => p.id !== id)
    }));
  };

  const renderHighlightedText = (text: string) => {
    const query = state.institution.trim();
    if (!query) return text;
    const regex = new RegExp(`(${escapeRegExp(query)})`, "ig");
    const parts = text.split(regex);
    return parts.map((part, idx) =>
      regex.test(part) ? (
        <mark
          key={idx}
          className="bg-yellow-100 text-primary font-bold rounded px-0.5"
        >
          {part}
        </mark>
      ) : (
        <Fragment key={idx}>{part}</Fragment>
      )
    );
  };

  return (
    <div className="flex flex-col min-h-screen text-[#0d141b] dark:text-slate-100">
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e7edf3] dark:border-b-slate-800 px-6 md:px-10 py-3 glass-panel sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="size-8 flex items-center justify-center bg-primary text-white rounded-lg">
            <span className="material-symbols-outlined">calendar_today</span>
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] dark:text-white">AirCourse AI</h2>
        </div>
        <div className="flex flex-1 justify-end gap-3 items-center">
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">code</span>
              GitHub
            </a>
          )}
          <button
            onClick={() => setState(prev => ({ ...prev, language: prev.language === 'zh' ? 'en' : 'zh' }))}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-bold flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">language</span>
            {state.language === 'zh' ? 'English' : '中文'}
          </button>

          {authUserEmail ? (
            <>
              <div className="hidden sm:flex items-center gap-2 text-xs font-bold opacity-70">
                <span className="material-symbols-outlined text-sm">person</span>
                <span className="truncate max-w-[200px]">{authUserEmail}</span>
              </div>
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                }}
                className="flex min-w-[92px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 border border-slate-200 dark:border-slate-700 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                {state.language === 'zh' ? '退出' : 'Sign out'}
              </button>
            </>
          ) : (
            <button
              onClick={() => { setIsAuthOpen(true); setAuthStatus(""); }}
              className="flex min-w-[92px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-opacity"
            >
              {state.language === 'zh' ? '登录' : 'Sign In'}
            </button>
          )}
        </div>
      </header>

      {loadingProgress > 0 && (
        <div className="fixed top-0 left-0 right-0 z-[110] h-1 bg-slate-100 dark:bg-slate-800">
          <div className="h-full bg-primary transition-all duration-300 ease-out" style={{ width: `${loadingProgress}%` }} />
        </div>
      )}

      <main className="flex-1 flex flex-col items-center py-12 px-4 md:px-6">

        {state.step === 'upload' && (
          <>
            <div className="max-w-[1100px] w-full text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em] mb-4">{t.heroTitle}</h1>
              <p className="text-base md:text-lg opacity-80 max-w-2xl mx-auto">{t.heroSub}</p>
            </div>

            <div className="max-w-[1100px] w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div className="flex flex-col gap-6">
                <div className="glass-panel p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">image</span>
                    {t.uploadTitle}
                  </h3>
                  <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-primary/30 rounded-xl p-12 flex flex-col items-center justify-center gap-4 bg-primary/5 hover:bg-primary/10 transition-all cursor-pointer group">
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform"><span className="material-symbols-outlined text-4xl">cloud_upload</span></div>
                    <div className="text-center"><p className="text-lg font-medium">{t.uploadDrop}</p></div>
                    <button className="mt-2 text-primary font-bold text-sm">{t.uploadBrowse}</button>
                  </div>
                  {state.image && (
                    <div className="mt-8 p-4 rounded-lg bg-white/40 dark:bg-black/20 flex items-center gap-4 transition-all">
                      {(() => {
                        const isError =
                          !state.loading &&
                          state.statusMessage !== t.scanning &&
                          state.statusMessage !== t.structureIdentified;
                        const iconBg = isError ? "bg-red-500" : "bg-primary";
                        const iconName = state.loading ? "auto_awesome" : isError ? "error" : "check";
                        return (
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                              state.loading ? "ai-pulse" : ""
                            } ${iconBg}`}
                          >
                            <span className="material-symbols-outlined text-xl">{iconName}</span>
                          </div>
                        );
                      })()}
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-semibold">{state.statusMessage}</p>
                        {!authUserEmail && guestQuota && (
                          <p className="text-[10px] font-bold opacity-60">
                            {state.language === 'zh'
                              ? `未登录今日剩余 ${Math.max(0, guestQuota.limit - guestQuota.used)} / ${guestQuota.limit} 次`
                              : `Guest remaining ${Math.max(0, guestQuota.limit - guestQuota.used)} / ${guestQuota.limit}`}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  {state.image && <div className="mt-6"><div className="w-full h-48 bg-center bg-no-repeat bg-cover rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden shadow-inner" style={{ backgroundImage: `url(${state.image})` }} /></div>}
                </div>

                <div className="glass-panel p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">schedule</span>
                      {t.timeSlotsTitle}
                    </h3>
                    <button onClick={addPeriod} className="p-2 hover:bg-primary/10 rounded-lg text-primary transition-colors">
                      <span className="material-symbols-outlined">add_circle</span>
                    </button>
                  </div>
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {state.periods.map((p) => (
                      <div key={p.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 group">
                        <div className="w-8 h-8 rounded bg-primary/10 text-primary font-black text-xs flex items-center justify-center shrink-0">
                          {p.id}
                        </div>
                        <div className="grid grid-cols-2 gap-2 flex-1">
                          <input
                            type="time"
                            className="text-xs p-2 rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                            value={p.start}
                            onChange={(e) => updatePeriod(p.id, 'start', e.target.value)}
                          />
                          <input
                            type="time"
                            className="text-xs p-2 rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                            value={p.end}
                            onChange={(e) => updatePeriod(p.id, 'end', e.target.value)}
                          />
                        </div>
                        <button
                          onClick={() => removePeriod(p.id)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-[10px] text-slate-400 italic">{t.timeSlotsSub}</p>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div className="glass-panel p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">info</span>
                    {t.basicInfoTitle}
                  </h3>
                  <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2 relative">
                      <label className="text-sm font-semibold opacity-80">{t.schoolName}</label>
                      <input className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 p-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all pr-10" placeholder={t.schoolPlaceholder} value={state.institution} onChange={(e) => handleInstitutionChange(e.target.value)} onFocus={() => suggestions.length > 0 && setShowSuggestions(true)} />
                      {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-[60] overflow-hidden max-h-60 overflow-y-auto">
                          {suggestions.map((s, i) => (
                            <div key={i} className="p-3 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer text-sm border-b last:border-0 border-slate-100 dark:border-slate-700" onClick={() => handleInstitutionSelect(s)}>
                              <div className="font-bold">
                                {renderHighlightedText(s.key)}
                              </div>
                              <div className="text-xs text-slate-500 truncate">{s.address}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold opacity-80">{t.campusAddress}</label>
                      <input
                        className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 p-3 disabled:bg-slate-100 disabled:dark:bg-slate-800 disabled:text-slate-400"
                        placeholder={t.campusPlaceholder}
                        value={state.address}
                        onChange={(e) => setState({ ...state, address: e.target.value })}
                        disabled={!!selectedInstitutionKey}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold opacity-80">{t.startDate}</label>
                        <input type="date" className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 p-3" value={state.startDate} onChange={(e) => setState({ ...state, startDate: e.target.value })} />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold opacity-80">{t.totalWeeks}</label>
                        <input type="number" className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 p-3" value={state.totalWeeks} onChange={(e) => setState({ ...state, totalWeeks: parseInt(e.target.value) })} />
                      </div>
                    </div>
                    <button disabled={!state.image || state.loading} onClick={() => setState({ ...state, step: 'config' })} className="w-full py-4 rounded-xl bg-primary text-white font-bold text-lg shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50">{t.continueConfig}</button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {state.step === 'config' && (
          <div className="max-w-[960px] w-full flex flex-col gap-8">
            <div className="flex justify-between items-end border-b border-slate-200 dark:border-slate-800 pb-6">
              <div>
                <h1 className="text-4xl font-black tracking-tight">{t.configTitle}</h1>
                <p className="text-slate-500 mt-2">{t.configSub}</p>
              </div>
              <button onClick={() => setIsAddingCourse(true)} className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all"><span className="material-symbols-outlined">add</span>{t.addCourse}</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {state.courses.map(course => (
                <div key={course.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold group-hover:text-primary transition-colors cursor-pointer inline-flex items-center gap-2" onClick={() => setEditingCourse(course)}>
                        {course.name}<span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-40 transition-opacity">edit</span>
                      </h3>
                      <p className="text-slate-500 text-sm flex items-center gap-2"><span className="material-symbols-outlined text-xs">person</span>{course.instructor || 'TBA'}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingCourse(course)} className="p-2.5 hover:bg-primary/10 rounded-xl text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined text-xl">edit</span></button>
                      <button onClick={() => deleteCourse(course.id)} className="p-2.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition-colors"><span className="material-symbols-outlined text-xl">delete</span></button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">{t.scheduleSlots}</p>
                    <div className="flex flex-wrap gap-3">
                      {course.timeSlots.map(slot => (
                        <div key={slot.id} className="flex items-center gap-3 px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-xs font-semibold shadow-sm">
                          <div className="flex flex-col">
                            <span className="text-primary font-black uppercase text-[10px] leading-none mb-1">{(t.days as any)[slot.day]?.slice(0, 3)} {slot.frequency !== 'Weekly' ? `(${(t.freqs as any)[slot.frequency]?.split(' ')[0]})` : ''}</span>
                            <span className="text-slate-700 dark:text-slate-300">{slot.startTime} - {slot.endTime}</span>
                          </div>
                          {slot.location && <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>}
                          {slot.location && <div className="flex items-center gap-1.5 text-slate-500"><span className="material-symbols-outlined text-sm">location_on</span><span className="truncate max-w-[120px]">{slot.location}</span></div>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-12 pt-8 border-t border-slate-100 dark:border-slate-800">
              <button onClick={() => setState({ ...state, step: 'upload' })} className="px-8 py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-bold hover:bg-slate-50 transition-all">{t.back}</button>
              <button onClick={() => setState({ ...state, step: 'review' })} className="px-12 py-3 bg-primary text-white rounded-xl font-bold shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">{t.viewTimetable}</button>
            </div>
          </div>
        )}

        {state.step === 'review' && (
          <div className="w-full max-w-[1400px] flex flex-col gap-6 mb-32 animate-in fade-in slide-in-from-bottom duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div><h1 className="text-3xl font-black tracking-tight">{t.weeklyTimetable}</h1><p className="text-slate-500">{t.timetableSub}</p></div>
              <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <button onClick={() => setSelectedWeek(Math.max(1, selectedWeek - 1))} className="size-10 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"><span className="material-symbols-outlined">chevron_left</span></button>
                <div className="px-4 font-black flex items-center gap-2">
                  <span className="text-sm opacity-50 uppercase">{t.week}</span>
                  <span className="text-xl text-primary">{selectedWeek}</span>
                  <span className="text-sm opacity-50 uppercase">{t.weekSuffix}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary font-bold">{selectedWeek % 2 === 0 ? t.even : t.odd}</span>
                </div>
                <button onClick={() => setSelectedWeek(Math.min(state.totalWeeks, selectedWeek + 1))} className="size-10 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"><span className="material-symbols-outlined">chevron_right</span></button>
              </div>
            </div>

            <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-x-auto">
              <div className="min-w-[1000px]">
                {/* Header Row */}
                <div className="grid grid-cols-[100px_repeat(7,minmax(0,1fr))] border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20">
                  <div className="p-4 flex items-center justify-center font-bold text-[10px] text-slate-400 uppercase tracking-widest">Time</div>
                  {DAYS_INTERNAL.map(dayEn => (
                    <div key={dayEn} className="p-4 text-center border-l border-slate-100 dark:border-slate-800">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{(t.days as any)[dayEn]?.slice(0, 3)}</p>
                      <p className="font-bold text-sm truncate">{(t.days as any)[dayEn]}</p>
                    </div>
                  ))}
                </div>

                {/* Grid Content using user-defined periods */}
                {state.periods.map(period => (
                  <div key={period.id} className="grid grid-cols-[100px_repeat(7,minmax(0,1fr))] border-b last:border-0 border-slate-50 dark:border-slate-800">
                    <div className="p-3 bg-slate-50/30 dark:bg-slate-800/10 flex flex-col items-center justify-center gap-1 border-r border-slate-100 dark:border-slate-800 shrink-0">
                      <span className="text-xl font-black text-primary/30 leading-none">{period.id}</span>
                      <div className="flex flex-col items-center opacity-40 text-[9px] font-bold">
                        <span>{period.start}</span>
                        <span>{period.end}</span>
                      </div>
                    </div>
                    {DAYS_INTERNAL.map(day => {
                      const result = findCourseAtSlot(day, period.start, period.end);
                      return (
                        <div key={`${day}-${period.id}`} className="relative h-28 p-1 border-l border-slate-100 dark:border-slate-800/50 flex flex-col overflow-hidden">
                          {result && (
                            <div
                              onClick={() => setEditingCourse(result.course)}
                              className="w-full h-full bg-primary/[0.04] dark:bg-primary/[0.08] border-l-[3px] border-l-primary rounded-md p-2 flex flex-col gap-1.5 cursor-pointer hover:bg-primary/10 dark:hover:bg-primary/15 transition-all group overflow-hidden shadow-sm"
                            >
                              <div className="min-h-0 flex-1">
                                <h4 className="text-[11px] font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors text-slate-800 dark:text-slate-200">
                                  {result.course.name}
                                </h4>
                                <div className="flex items-center gap-1 text-[9px] font-medium opacity-60 truncate mt-1">
                                  <span className="material-symbols-outlined text-[10px]">person</span>
                                  <span>{result.course.instructor || 'Staff'}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 text-[9px] font-bold text-primary opacity-80 shrink-0 truncate">
                                <span className="material-symbols-outlined text-[11px]">location_on</span>
                                <span>{result.slot.location || 'TBA'}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-6 z-[60] flex justify-center">
              <div className="max-w-[1200px] w-full flex items-center justify-between">
                <button onClick={() => setState({ ...state, step: 'config' })} className="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-bold hover:bg-slate-50 transition-all">{t.backToList}</button>
                <div className="flex items-center gap-6">
                  <div className="hidden lg:flex flex-col gap-1 items-end mr-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.compatible}</p>
                    <div className="flex gap-3 text-slate-300">
                      <span className="material-symbols-outlined text-sm">phone_iphone</span>
                      <span className="material-symbols-outlined text-sm">android</span>
                      <span className="material-symbols-outlined text-sm">hub</span>
                    </div>
                  </div>
                  <button onClick={generateICS} className="flex items-center gap-2 bg-primary text-white px-10 py-3 rounded-xl font-bold shadow-2xl shadow-primary/40 hover:scale-105 active:scale-95 transition-all">
                    <span className="material-symbols-outlined">download</span>
                    {t.downloadIcs}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {state.step === 'success' && (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-8 animate-in fade-in slide-in-from-bottom duration-500">
            <div className="w-28 h-28 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-full flex items-center justify-center shadow-inner"><span className="material-symbols-outlined text-7xl">check_circle</span></div>
            <div className="space-y-2"><h1 className="text-5xl font-black tracking-tight">{t.successTitle}</h1><p className="text-xl opacity-70">{t.successSub}</p></div>
            <button onClick={handleReset} className="mt-4 px-12 py-5 bg-primary text-white rounded-2xl font-bold text-lg shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all">{t.startNew}</button>
          </div>
        )}

      </main>

      <Modal isOpen={editingCourse !== null} onClose={() => setEditingCourse(null)} title={t.editCourse}>
        {editingCourse && <CourseForm language={state.language} initial={editingCourse} periods={state.periods} onSave={saveEditedCourse} onCancel={() => setEditingCourse(null)} />}
      </Modal>

      <Modal isOpen={isAddingCourse} onClose={() => setIsAddingCourse(false)} title={t.addCourse}>
        <CourseForm language={state.language} periods={state.periods} onSave={addNewCourse} onCancel={() => setIsAddingCourse(false)} />
      </Modal>

      <Modal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} title={state.language === 'zh' ? '登录 / 注册' : 'Sign in / Sign up'}>
        <div className="space-y-4">
          <p className="text-sm opacity-70">
            {state.language === 'zh'
              ? '使用邮箱获取登录链接（无需密码）。'
              : 'Sign in with a magic link (no password).'}
          </p>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-slate-400 tracking-widest">{state.language === 'zh' ? '邮箱' : 'Email'}</label>
            <input
              className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4 focus:ring-2 focus:ring-primary transition-all"
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
              placeholder="you@example.com"
              type="email"
            />
          </div>
          {authStatus && (
            <div className="text-xs font-bold opacity-70 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-3">
              {authStatus}
            </div>
          )}
          <button
            onClick={async () => {
              setAuthStatus(state.language === 'zh' ? '发送中...' : 'Sending...');
              const redirectTo =
                (import.meta as any).env?.VITE_SUPABASE_REDIRECT_URL || window.location.origin;
              const { error } = await supabase.auth.signInWithOtp({
                email: authEmail,
                options: {
                  emailRedirectTo: redirectTo
                }
              });
              if (error) {
                setAuthStatus((state.language === 'zh' ? '发送失败：' : 'Failed: ') + error.message);
              } else {
                setAuthStatus(state.language === 'zh' ? '已发送登录链接，请查收邮箱。' : 'Magic link sent. Check your email.');
              }
            }}
            disabled={!authEmail}
            className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {state.language === 'zh' ? '发送登录链接' : 'Send magic link'}
          </button>
        </div>
      </Modal>

      <Footer />
      <SpeedInsights />
    </div>
  );
};

const CourseForm: React.FC<{ language: 'zh' | 'en'; initial?: Course; periods: Period[]; onSave: (c: Course) => void; onCancel: () => void; }> = ({ language, initial, periods, onSave, onCancel }) => {
  const t = translations[language];
  const [data, setData] = useState<Course>(initial || {
    id: '', name: '', instructor: '', timeSlots: [{ id: Math.random().toString(), day: 'Monday', startTime: periods[0]?.start || "08:00", endTime: periods[1]?.end || "09:40", location: '', frequency: 'Weekly', period: '' }]
  });

  const addSlot = () => {
    setData({ ...data, timeSlots: [...data.timeSlots, { id: Math.random().toString(), day: 'Monday', startTime: periods[0]?.start || "08:00", endTime: periods[1]?.end || "09:40", location: '', frequency: 'Weekly', period: '' }] });
  };

  const removeSlot = (id: string) => {
    setData({ ...data, timeSlots: data.timeSlots.filter(s => s.id !== id) });
  };

  const getStartPeriodIdForSlot = (slot: TimeSlot): number => {
    const found = periods.find(p => p.start === slot.startTime);
    return found ? found.id : periods[0]?.id || 1;
  };

  const getEndPeriodIdForSlot = (slot: TimeSlot): number => {
    const found = periods.find(p => p.end === slot.endTime);
    if (found) return found.id;
    // 默认结束节次为第 2 节，如不存在则退回最后一节
    const second = periods[1];
    if (second) return second.id;
    return periods[periods.length - 1]?.id || 1;
  };

  return (
    <div className="space-y-8 p-1">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2"><label className="block text-xs font-black uppercase text-slate-400 tracking-widest">{t.courseName}</label><input className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4 focus:ring-2 focus:ring-primary transition-all" value={data.name} onChange={e => setData({ ...data, name: e.target.value })} placeholder="e.g. Advanced Calculus" /></div>
        <div className="space-y-2"><label className="block text-xs font-black uppercase text-slate-400 tracking-widest">{t.instructor}</label><input className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4 focus:ring-2 focus:ring-primary transition-all" value={data.instructor} onChange={e => setData({ ...data, instructor: e.target.value })} placeholder="e.g. Dr. Newton" /></div>
      </div>
      <div className="space-y-6">
        <div className="flex justify-between items-center"><label className="block text-xs font-black uppercase text-slate-400 tracking-widest">{t.scheduleSlots}</label><button onClick={addSlot} className="text-sm text-primary font-bold hover:bg-primary/5 px-3 py-1 rounded-lg transition-colors flex items-center gap-1"><span className="material-symbols-outlined text-lg">add_circle</span>{t.addPeriod}</button></div>
        <div className="space-y-4">
          {data.timeSlots.map((slot, idx) => (
            <div key={slot.id} className="p-6 border border-slate-100 dark:border-slate-800 rounded-2xl space-y-4 relative bg-slate-50/50 dark:bg-slate-800/20 group/slot transition-all hover:bg-white dark:hover:bg-slate-800 shadow-sm">
              <div className="absolute top-4 right-4 flex items-center gap-2"><span className="text-[10px] font-bold text-slate-300 opacity-0 group-hover/slot:opacity-100 transition-opacity uppercase">Slot {idx + 1}</span>{data.timeSlots.length > 1 && (<button onClick={() => removeSlot(slot.id)} className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-all"><span className="material-symbols-outlined text-lg">close</span></button>)}</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5"><label className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">{t.day}</label><select className="w-full text-sm font-medium p-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900" value={slot.day} onChange={e => setData({ ...data, timeSlots: data.timeSlots.map(s => s.id === slot.id ? { ...s, day: e.target.value } : s) })}>{DAYS_INTERNAL.map(d => <option key={d} value={d}>{(t.days as any)[d]}</option>)}</select></div>
                <div className="space-y-1.5"><label className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">{t.frequency}</label><select className="w-full text-sm font-medium p-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900" value={slot.frequency} onChange={e => setData({ ...data, timeSlots: data.timeSlots.map(s => s.id === slot.id ? { ...s, frequency: e.target.value as any } : s) })}>
                  <option value="Weekly">{t.freqs.Weekly}</option><option value="Odd Weeks">{t.freqs["Odd Weeks"]}</option><option value="Even Weeks">{t.freqs["Even Weeks"]}</option>
                </select></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">{t.startPeriod}</label>
                  <select
                    className="w-full text-xs p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                    value={getStartPeriodIdForSlot(slot)}
                    onChange={(e) => {
                      const id = parseInt(e.target.value, 10);
                      const startPeriod = periods.find(p => p.id === id) || periods[0];
                      if (!startPeriod) return;

                      // 起始节次变更时，统一将结束节次设为“下一节”的结束（若无下一节则为当前节）
                      const startIndex = periods.findIndex(p => p.id === startPeriod.id);
                      const endCandidate =
                        periods[Math.min(startIndex + 1, periods.length - 1)] || startPeriod;

                      setData({
                        ...data,
                        timeSlots: data.timeSlots.map(s =>
                          s.id === slot.id
                            ? {
                                ...s,
                                startTime: startPeriod.start,
                                endTime: endCandidate.end
                              }
                            : s
                        )
                      });
                    }}
                  >
                    {periods.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.id} ({p.start})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">{t.endPeriod}</label>
                  <select
                    className="w-full text-xs p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                    value={getEndPeriodIdForSlot(slot)}
                    onChange={(e) => {
                      const id = parseInt(e.target.value, 10);
                      const period = periods.find(p => p.id === id) || periods[1] || periods[0];
                      if (!period) return;
                      setData({
                        ...data,
                        timeSlots: data.timeSlots.map(s =>
                          s.id === slot.id ? { ...s, endTime: period.end } : s
                        )
                      });
                    }}
                  >
                    {periods.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.id} ({p.end})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">{t.location}</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">location_on</span>
                  <input placeholder="e.g. Building A, Room 302" className="w-full text-sm font-medium pl-9 p-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900" value={slot.location} onChange={e => setData({ ...data, timeSlots: data.timeSlots.map(s => s.id === slot.id ? { ...s, location: e.target.value } : s) })} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-4 pt-8 border-t border-slate-100 dark:border-slate-800"><button onClick={onCancel} className="flex-1 py-4 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition-all text-slate-500">{t.cancel}</button><button onClick={() => onSave(data)} disabled={!data.name || data.timeSlots.length === 0} className="flex-1 py-4 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50">{t.save}</button></div>
    </div>
  );
};

export default App;
