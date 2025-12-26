import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Calendar, 
  Clock, 
  ChevronLeft, 
  UserPlus,
  PieChart,
  Award,
  Zap,
  TrendingUp,
  Target,
  AlertTriangle,
  Download,
  Banknote,
  Users,
  GitBranch,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
  ArrowDownToLine,
  History,
  Briefcase,
  ExternalLink,
  ChevronRight,
  Activity,
  Timer,
  Settings2,
  Check,
  Filter,
  Users2,
  BarChart3,
  RotateCcw,
  Wallet,
  UserCheck,
  Circle,
  LayoutDashboard,
  X,
  Layout,
  Heart,
  GraduationCap,
  LineChart,
  MousePointer2,
  Save,
  Trash2,
  Edit3,
  Code2,
  PlaneTakeoff
} from 'lucide-react';
import { Employee, LeaveRequest } from '../types';

const mockEmployeesData: Employee[] = [
  { 
    id: '1', 
    name: 'سارة خالد', 
    role: 'مطور واجهات أمامية أول', 
    department: 'التطوير', 
    status: 'نشط', 
    email: 'sara@tech.com', 
    phone: '0501234567', 
    salary: 14000,
    allowances: { housing: 3500, transport: 1000, other: 500 },
    deductions: { insurance: 1400, tax: 0, other: 0 },
    salaryHistory: [
      { date: '2021-05-10', amount: 12000, reason: 'راتب البداية' },
      { date: '2023-01-01', amount: 14000, reason: 'ترقية سنوية' }
    ],
    hourlyRate: 95, 
    joinDate: '2021-05-10', 
    docExpiry: '2024-12-10',
    leaveBalance: 21, 
    contractType: 'دوام كامل',
    skills: ['React', 'TypeScript', 'Tailwind CSS'],
    productivity: { 
      tasksCompleted: 45, 
      tasksAssigned: 48, 
      avgTaskTime: 6.5, 
      milestonesReached: 8, 
      impactScore: 88, 
      gitCommits: 450 
    }
  },
  { 
    id: '2', 
    name: 'محمد علي', 
    role: 'مدير منتج', 
    department: 'الإدارة', 
    status: 'نشط', 
    email: 'mo@tech.com', 
    phone: '0501234568', 
    salary: 18000,
    allowances: { housing: 4500, transport: 1000, other: 1000 },
    deductions: { insurance: 1800, tax: 0, other: 200 },
    salaryHistory: [
      { date: '2020-01-15', amount: 18000, reason: 'راتب البداية' }
    ],
    hourlyRate: 150, 
    joinDate: '2020-01-15', 
    docExpiry: '2023-11-20',
    leaveBalance: 14, 
    contractType: 'دوام كامل',
    skills: ['Agile', 'Strategy'],
    productivity: { 
      tasksCompleted: 120, 
      tasksAssigned: 125, 
      avgTaskTime: 4.2, 
      milestonesReached: 15, 
      impactScore: 94, 
      gitCommits: 120 
    }
  }
];

const mockLeaves: LeaveRequest[] = [
  { id: 'l1', employeeId: '1', employeeName: 'سارة خالد', type: 'سنوية', startDate: '2023-11-20', endDate: '2023-11-25', status: 'approved', days: 5 },
  { id: 'l2', employeeId: '2', employeeName: 'محمد علي', type: 'مرضية', startDate: '2023-11-22', endDate: '2023-11-23', status: 'approved', days: 1 },
];

const StatItem = ({ label, value, sub, icon: Icon, color, isVisible = true }: any) => {
  if (!isVisible) return null;
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm group hover:border-blue-200 transition-all animate-in zoom-in-95 duration-300">
      <div className={`w-12 h-12 rounded-2xl bg-${color}-50 text-${color}-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        <Icon size={24} />
      </div>
      <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">{label}</p>
      <h3 className="text-xl font-black text-slate-800">{value}</h3>
      <p className="text-[10px] text-slate-500 mt-1">{sub}</p>
    </div>
  );
};

const HROverviewSection = () => {
  const [isCustomizing, setIsCustomizing] = useState(false);
  
  const [visibleWidgets, setVisibleWidgets] = useState(() => {
    const saved = localStorage.getItem('hr_dashboard_widgets_config_v3');
    return saved ? JSON.parse(saved) : {
      performance: true,
      alerts: true,
      hiring: true,
      diversity: true,
      retention: true,
      costs: false,
      satisfaction: true,
      training: false,
      growth: true
    };
  });

  const toggleWidget = (widget: string) => {
    const updated = { ...visibleWidgets, [widget]: !visibleWidgets[widget] };
    setVisibleWidgets(updated);
    localStorage.setItem('hr_dashboard_widgets_config_v3', JSON.stringify(updated));
  };

  const setAllWidgets = (status: boolean) => {
    const updated = Object.keys(visibleWidgets).reduce((acc, key) => ({ ...acc, [key]: status }), {});
    setVisibleWidgets(updated);
    localStorage.setItem('hr_dashboard_widgets_config_v3', JSON.stringify(updated));
  };

  const widgetsList = [
    { id: 'performance', label: 'أداء الأقسام', icon: BarChart3, desc: 'تحليل مقارن لمعدلات إنجاز المهام حسب القسم.' },
    { id: 'alerts', label: 'التنبيهات الفورية', icon: AlertTriangle, desc: 'تنبيهات انتهاء الوثائق والمتطلبات القانونية.' },
    { id: 'hiring', label: 'مسار التوظيف', icon: Users2, desc: 'متابعة عدد المرشحين في كل مرحلة توظيف.' },
    { id: 'diversity', label: 'التنوع الوظيفي', icon: PieChart, desc: 'إحصائيات النوع الاجتماعي والجنسيات في الفريق.' },
    { id: 'retention', label: 'معدل الاستبقاء', icon: UserCheck, desc: 'قياس نسبة استقرار الموظفين داخل الشركة.' },
    { id: 'costs', label: 'تكاليف التوظيف', icon: Wallet, desc: 'متوسط تكلفة استقطاب الموظف الجديد.' },
    { id: 'satisfaction', label: 'رضا الموظفين', icon: Heart, desc: 'قياس مؤشر السعادة والولاء الوظيفي (eNPS).' },
    { id: 'training', label: 'إكمال التدريب', icon: GraduationCap, desc: 'نسبة إنجاز الدورات التدريبية والشهادات.' },
    { id: 'growth', label: 'نمو الفريق', icon: LineChart, desc: 'تطور أعداد الموظفين شهرياً.' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      {isCustomizing && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsCustomizing(false)}></div>
          <div className="relative w-full max-w-lg bg-white h-full shadow-2xl animate-in slide-in-from-left duration-500 flex flex-col">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-100">
                    <Settings2 size={24} />
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-slate-800 tracking-tight">تخصيص لوحة المعلومات</h3>
                    <p className="text-xs text-slate-500 font-medium mt-1">اختر الإحصائيات التي تهمك لمراقبة أداء شركتك.</p>
                 </div>
              </div>
              <button onClick={() => setIsCustomizing(false)} className="p-2 hover:bg-white rounded-xl transition-all text-slate-400">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
               <div className="flex gap-2">
                  <button onClick={() => setAllWidgets(true)} className="flex-1 py-2 px-4 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-100 transition-colors">تفعيل الكل</button>
                  <button onClick={() => setAllWidgets(false)} className="flex-1 py-2 px-4 bg-slate-50 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-colors">إخفاء الكل</button>
               </div>

               <div className="grid grid-cols-1 gap-3">
                  {widgetsList.map((w) => (
                    <button 
                      key={w.id}
                      onClick={() => toggleWidget(w.id)}
                      className={`flex items-start gap-4 p-5 rounded-[2rem] border transition-all text-right group ${
                        visibleWidgets[w.id] 
                          ? 'bg-blue-600 border-blue-600 shadow-xl shadow-blue-100 text-white' 
                          : 'bg-white border-slate-100 hover:border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className={`p-3 rounded-2xl shrink-0 transition-colors ${
                        visibleWidgets[w.id] ? 'bg-white/20 text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100'
                      }`}>
                        <w.icon size={22} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-black">{w.label}</span>
                          {visibleWidgets[w.id] ? <CheckCircle2 size={20} className="text-white" /> : <Circle size={20} className="text-slate-200" />}
                        </div>
                        <p className={`text-[10px] leading-relaxed font-medium ${visibleWidgets[w.id] ? 'text-blue-50' : 'text-slate-400'}`}>{w.desc}</p>
                      </div>
                    </button>
                  ))}
               </div>
            </div>

            <div className="p-8 border-t border-slate-100 bg-slate-50/50">
               <button 
                onClick={() => setIsCustomizing(false)}
                className="w-full py-4 bg-slate-900 text-white rounded-[1.5rem] font-black text-sm shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
               >
                 <Save size={18} /> حفظ وتطبيق التغييرات
               </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-5">
           <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner">
             <LayoutDashboard size={28} />
           </div>
           <div>
              <h3 className="text-xl font-black text-slate-800 tracking-tighter">مركز تحليلات الموارد البشرية</h3>
              <p className="text-xs text-slate-500 font-bold mt-1">تتبع نمو الفريق، الرضا الوظيفي، والامتثال التقني.</p>
           </div>
        </div>
        <div className="flex gap-2">
           <button className="p-3 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-slate-100"><RotateCcw size={20}/></button>
           <button 
             onClick={() => setIsCustomizing(true)}
             className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-[1.25rem] text-xs font-black shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
           >
             <Settings2 size={18} /> تخصيص لوحة البيانات
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {visibleWidgets.performance && (
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm animate-in zoom-in-95 duration-300 hover:border-blue-100 transition-all group">
            <div className="flex justify-between items-center mb-10">
               <h3 className="text-sm font-black text-slate-800 flex items-center gap-3"><BarChart3 size={20} className="text-blue-600"/> أداء الأقسام</h3>
               <button className="p-2 text-slate-300 hover:text-blue-600 rounded-lg group-hover:bg-slate-50 transition-colors"><ChevronRight size={18} className="rotate-180" /></button>
            </div>
            <div className="space-y-6">
              {[
                { name: 'الهندسة والتطوير', score: 92, color: 'blue' },
                { name: 'المنتج والتصميم', score: 85, color: 'indigo' },
                { name: 'المبيعات والنمو', score: 78, color: 'emerald' },
              ].map((dept, i) => (
                <div key={i} className="space-y-2">
                   <div className="flex justify-between text-[11px] font-black text-slate-600">
                      <span>{dept.name}</span>
                      <span className={`text-${dept.color}-600`}>{dept.score}%</span>
                   </div>
                   <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden shadow-inner">
                      <div className={`h-full bg-${dept.color}-600 transition-all duration-1000 shadow-sm`} style={{ width: `${dept.score}%` }}></div>
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {visibleWidgets.alerts && (
          <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl flex flex-col justify-between animate-in zoom-in-95 duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-110 transition-transform"></div>
            <div>
              <h3 className="text-sm font-black text-white mb-8 flex items-center gap-3"><AlertTriangle size={20} className="text-rose-500"/> تنبيهات الامتثال</h3>
              <div className="space-y-4 relative z-10">
                 <div className="p-5 bg-white/5 rounded-[1.5rem] border border-white/10 flex items-center gap-4 hover:bg-white/10 transition-all cursor-pointer group/item">
                    <div className="p-2 bg-emerald-500/20 text-emerald-500 rounded-xl group-hover/item:scale-110 transition-transform"><ShieldCheck size={20} /></div>
                    <span className="text-xs font-bold text-slate-300">تم تجديد تأمين 5 موظفين</span>
                 </div>
                 <div className="p-5 bg-white/5 rounded-[1.5rem] border border-white/10 flex items-center gap-4 hover:bg-white/10 transition-all cursor-pointer group/item">
                    <div className="p-2 bg-rose-500/20 text-rose-500 rounded-xl group-hover/item:scale-110 transition-transform"><XCircle size={20} /></div>
                    <span className="text-xs font-bold text-slate-300">انتهاء إقامة (محمد علي) قريباً</span>
                 </div>
              </div>
            </div>
            <button className="mt-8 text-xs font-black text-blue-400 hover:text-blue-300 text-right flex items-center justify-end gap-1 group">
              إدارة التراخيص <ChevronRight size={14} className="rotate-180 group-hover:-translate-x-1 transition-transform"/>
            </button>
          </div>
        )}

        {visibleWidgets.satisfaction && (
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm animate-in zoom-in-95 duration-300 hover:border-rose-100 transition-all group">
            <div className="flex justify-between items-center mb-8">
               <h3 className="text-sm font-black text-slate-800 flex items-center gap-3"><Heart size={20} className="text-rose-500 fill-rose-500/20"/> رضا الموظفين (eNPS)</h3>
               <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-lg">إيجابي جداً</span>
            </div>
            <div className="flex items-center justify-center py-6">
               <div className="relative">
                  <svg className="w-32 h-32 rotate-[-90deg]">
                     <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-50" />
                     <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="364.42" strokeDashoffset="54.66" className="text-rose-500 transition-all duration-1000" strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                     <span className="text-3xl font-black text-slate-800">85</span>
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Score</span>
                  </div>
               </div>
            </div>
            <p className="text-[10px] text-slate-500 text-center font-bold leading-relaxed mt-2">زيادة بنسبة 4% عن استبيان الشهر الماضي. الموظفون يقدرون "مرونة العمل".</p>
          </div>
        )}

        {visibleWidgets.hiring && (
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm animate-in zoom-in-95 duration-300 hover:border-blue-100 transition-all group">
            <div className="flex justify-between items-center mb-8">
               <h3 className="text-sm font-black text-slate-800 flex items-center gap-3"><Users2 size={20} className="text-indigo-600"/> مسار التوظيف</h3>
               <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[9px] font-black uppercase">Active</span>
            </div>
            <div className="space-y-4">
              {[
                { stage: 'مقابلات أولية', count: 8, color: 'blue' },
                { stage: 'تحدي تقني', count: 3, color: 'indigo' },
                { stage: 'عرض عمل (Offer)', count: 2, color: 'emerald' },
              ].map((stage, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-[1.5rem] hover:bg-blue-50 transition-all cursor-pointer group/item">
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full bg-${stage.color}-500 group-hover/item:scale-125 transition-transform`}></div>
                    <span className="text-xs font-bold text-slate-700">{stage.stage}</span>
                  </div>
                  <span className="text-sm font-black text-slate-800">{stage.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {visibleWidgets.growth && (
          <div className="bg-blue-50 p-8 rounded-[2.5rem] border border-blue-100 animate-in zoom-in-95 duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10"><LineChart size={80} /></div>
            <h3 className="text-sm font-black text-blue-900 mb-8 flex items-center gap-3 relative z-10"><TrendingUp size={20} className="text-blue-600"/> نمو القوة العاملة</h3>
            <div className="space-y-4 relative z-10">
               <div className="flex items-baseline gap-2">
                  <p className="text-5xl font-black text-blue-800 tracking-tighter">+12</p>
                  <span className="text-sm font-bold text-blue-500">موظف جديد / سنة</span>
               </div>
               <div className="flex gap-1 items-end h-16">
                  {[20, 35, 45, 30, 60, 85, 95].map((h, i) => (
                    <div key={i} className="flex-1 bg-blue-600/30 hover:bg-blue-600 rounded-t-lg transition-all duration-500 cursor-pointer" style={{ height: `${h}%` }}></div>
                  ))}
               </div>
               <p className="text-[10px] font-bold text-blue-700">أعلى وتيرة نمو في قسم (تطوير البرمجيات).</p>
            </div>
          </div>
        )}

        {visibleWidgets.training && (
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm animate-in zoom-in-95 duration-300 hover:border-indigo-100 transition-all group">
            <div className="flex justify-between items-center mb-8">
               <h3 className="text-sm font-black text-slate-800 flex items-center gap-3"><GraduationCap size={20} className="text-indigo-600"/> إكمال التدريب التقني</h3>
               <button className="p-2 text-slate-300 hover:text-indigo-600"><Plus size={16}/></button>
            </div>
            <div className="space-y-6">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black">74%</div>
                  <div className="flex-1">
                     <p className="text-xs font-black text-slate-700">شهادات AWS Cloud</p>
                     <div className="mt-1.5 h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-600" style={{ width: '74%' }}></div>
                     </div>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center font-black">40%</div>
                  <div className="flex-1">
                     <p className="text-xs font-black text-slate-700">أمن المعلومات (ISO)</p>
                     <div className="mt-1.5 h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-600" style={{ width: '40%' }}></div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>

      {/* Empty State */}
      {Object.values(visibleWidgets).every(v => v === false) && (
        <div className="py-24 text-center bg-white rounded-[3rem] border border-slate-100 shadow-sm animate-in zoom-in-95 duration-500">
           <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
             <LayoutDashboard size={48} className="text-slate-200" />
           </div>
           <h4 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">لوحة معلومات مخصصة فارغة</h4>
           <p className="text-slate-500 text-sm mb-10 max-w-sm mx-auto leading-relaxed font-medium">قم باختيار البيانات والإحصائيات التي ترغب في مراقبتها لتظهر هنا في شاشتك الرئيسية.</p>
           <button 
             onClick={() => setIsCustomizing(true)}
             className="px-12 py-4 bg-blue-600 text-white rounded-[1.5rem] font-black text-sm shadow-2xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-3 mx-auto"
           >
             <Settings2 size={20} /> تخصيص لوحتك الآن
           </button>
        </div>
      )}
    </div>
  );
};

const EmployeesTable = ({ employees, onSelect, onToggleStatus }: { 
  employees: Employee[], 
  onSelect: (e: Employee) => void,
  onToggleStatus: (id: string, e: React.MouseEvent) => void 
}) => {
  const [search, setSearch] = useState('');
  
  const filteredEmployees = useMemo(() => {
    return employees.filter(e => e.name.includes(search));
  }, [employees, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100 w-full max-w-md focus-within:ring-2 focus-within:ring-blue-500 transition-all">
          <Search size={18} className="text-slate-400 mr-2" />
          <input 
            type="text" 
            placeholder="بحث بالاسم أو الرقم الوظيفي..." 
            className="bg-transparent border-none text-xs w-full outline-none py-2"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="px-6 py-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm bg-white">
          <Filter size={16} /> تصفية متقدمة
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-3xl border border-slate-100 shadow-sm">
        <table className="w-full text-right text-sm">
          <thead className="bg-slate-50 text-slate-500 font-bold text-[10px] uppercase tracking-widest border-b border-slate-100">
            <tr>
              <th className="px-6 py-6">الموظف</th>
              <th className="px-6 py-6">الدور الوظيفي</th>
              <th className="px-6 py-6">الوثائق والإقامة</th>
              <th className="px-6 py-6">الإنتاجية (Impact)</th>
              <th className="px-6 py-6 text-center">الحالة</th>
              <th className="px-6 py-6"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredEmployees.map((emp) => {
              const docExpiry = new Date(emp.docExpiry);
              const daysLeft = Math.ceil((docExpiry.getTime() - new Date().getTime()) / (1000 * 3600 * 24));
              const isUrgent = daysLeft < 30;

              return (
                <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer" onClick={() => onSelect(emp)}>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <img src={`https://picsum.photos/seed/${emp.id}/48/48`} className="w-12 h-12 rounded-2xl shadow-sm border-2 border-white" />
                      <div>
                        <p className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{emp.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium">ID: {emp.id} • {emp.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-xs font-bold text-slate-700">{emp.role}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{emp.department}</p>
                  </td>
                  <td className="px-6 py-5">
                    <div className={`flex items-center gap-1.5 text-[10px] font-bold ${isUrgent ? 'text-rose-500' : 'text-slate-500'}`}>
                      <AlertTriangle size={14} className={isUrgent ? 'animate-pulse' : ''} />
                      {emp.docExpiry}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                       <div className="flex-1 h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full ${emp.productivity.impactScore > 90 ? 'bg-emerald-500' : 'bg-blue-600'} transition-all duration-1000`} style={{ width: `${emp.productivity.impactScore}%` }}></div>
                       </div>
                       <span className="text-[10px] font-black text-slate-700">{emp.productivity.impactScore}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col items-center gap-1.5">
                      <button 
                        onClick={(e) => onToggleStatus(emp.id, e)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          emp.status === 'نشط' ? 'bg-emerald-500' : 'bg-slate-200'
                        }`}
                      >
                        <span className="sr-only">تغيير حالة الموظف</span>
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            emp.status === 'نشط' ? 'translate-x-1 rtl:-translate-x-6' : 'translate-x-6 rtl:-translate-x-1'
                          }`}
                        />
                      </button>
                      <span className={`text-[8px] font-black uppercase tracking-tighter ${
                        emp.status === 'نشط' ? 'text-emerald-600' : 'text-slate-400'
                      }`}>
                        {emp.status === 'نشط' ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-left">
                    <button className="p-2 text-slate-300 group-hover:text-blue-600 transition-colors">
                      <ChevronRight size={18} className="rotate-180" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const PayrollSection = ({ employees }: { employees: Employee[] }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const simulateBankFile = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      alert('تم توليد ملف مسير الرواتب (WPS) بنجاح بصيغة .dat المتوافقة مع البنوك المحلية.');
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-50 pb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800">مسير الرواتب الجماعي - نوفمبر 2023</h3>
          <p className="text-xs text-slate-500">مراجعة وتوليد كشوفات الرواتب لجميع الموظفين.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2 transition-colors">
            <Download size={18} /> تحميل كشف PDF
          </button>
          <button 
            onClick={simulateBankFile}
            disabled={isGenerating}
            className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-xl flex items-center gap-2 disabled:opacity-50 transition-all hover:bg-slate-800"
          >
            {isGenerating ? <Clock size={18} className="animate-spin" /> : <FileSpreadsheet size={18} />}
            توليد ملف صرف الرواتب (Bank File)
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-3xl border border-slate-100 shadow-sm">
        <table className="w-full text-right text-xs">
          <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-100">
            <tr>
              <th className="px-6 py-5">الموظف</th>
              <th className="px-6 py-5">الأساسي</th>
              <th className="px-6 py-5">بدل سكن</th>
              <th className="px-6 py-5">بدل نقل</th>
              <th className="px-6 py-5">أخرى (+)</th>
              <th className="px-6 py-5">تأمينات (-)</th>
              <th className="px-6 py-5">خصومات (-)</th>
              <th className="px-6 py-5 bg-blue-50/50">الصافي</th>
              <th className="px-6 py-5">الحالة</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {employees.map((emp) => {
              // Fix: Added type assertion to resolve 'unknown' type error in reduce function
              const totalAll = (Object.values(emp.allowances) as number[]).reduce((a, b) => a + b, 0);
              // Fix: Added type assertion to resolve 'unknown' type error in reduce function
              const totalDed = (Object.values(emp.deductions) as number[]).reduce((a, b) => a + b, 0);
              const net = emp.salary + totalAll - totalDed;
              
              return (
                <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-5 font-bold text-slate-800">{emp.name}</td>
                  <td className="px-6 py-5 text-slate-600">{emp.salary.toLocaleString()}</td>
                  <td className="px-6 py-5 text-emerald-600">{emp.allowances.housing.toLocaleString()}</td>
                  <td className="px-6 py-5 text-emerald-600">{emp.allowances.transport.toLocaleString()}</td>
                  <td className="px-6 py-5 text-emerald-600">{emp.allowances.other.toLocaleString()}</td>
                  <td className="px-6 py-5 text-rose-500">{emp.deductions.insurance.toLocaleString()}</td>
                  <td className="px-6 py-5 text-rose-500">{(emp.deductions.tax + emp.deductions.other).toLocaleString()}</td>
                  <td className="px-6 py-5 font-black text-blue-700 bg-blue-50/30">{net.toLocaleString()} ر.س</td>
                  <td className="px-6 py-5">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 text-amber-600">بانتظار الصرف</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const EmployeeProfile = ({ employee, onBack }: { employee: Employee, onBack: () => void }) => {
  const [localSkills, setLocalSkills] = useState(employee.skills);
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [editingSkillIndex, setEditingSkillIndex] = useState<number | null>(null);
  const [skillInputValue, setSkillInputValue] = useState('');
  
  // Leave Management State
  const [userLeaves, setUserLeaves] = useState<LeaveRequest[]>(mockLeaves.filter(l => l.employeeId === employee.id));
  const [isAddingLeave, setIsAddingLeave] = useState(false);

  const handleAddSkill = () => {
    if (skillInputValue.trim()) {
      setLocalSkills([...localSkills, skillInputValue.trim()]);
      setSkillInputValue('');
      setIsAddingSkill(false);
    }
  };

  const handleUpdateSkill = (index: number) => {
    if (skillInputValue.trim()) {
      const updated = [...localSkills];
      updated[index] = skillInputValue.trim();
      setLocalSkills(updated);
      setEditingSkillIndex(null);
      setSkillInputValue('');
    }
  };

  const handleDeleteSkill = (index: number) => {
    setLocalSkills(localSkills.filter((_, i) => i !== index));
  };

  const handleAddLeave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const start = formData.get('startDate') as string;
    const end = formData.get('endDate') as string;
    
    const diffTime = Math.abs(new Date(end).getTime() - new Date(start).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const newLeave: LeaveRequest = {
      id: 'l' + Date.now(),
      employeeId: employee.id,
      employeeName: employee.name,
      type: formData.get('type') as string,
      startDate: start,
      endDate: end,
      status: 'pending',
      days: diffDays
    };

    setUserLeaves([newLeave, ...userLeaves]);
    setIsAddingLeave(false);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-left-4 duration-500">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-500 font-bold hover:text-blue-600 transition-colors">
        <ChevronLeft size={20} /> العودة للدليل
      </button>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-8">
          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-10 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full -mr-32 -mt-32"></div>
             <img src={`https://picsum.photos/seed/${employee.id}/200/200`} className="w-40 h-40 rounded-[2.5rem] object-cover border-8 border-white shadow-xl relative z-10" />
             <div className="flex-1 text-center md:text-right relative z-10">
                <h1 className="text-4xl font-black text-slate-800 mb-2">{employee.name}</h1>
                <p className="text-xl font-bold text-blue-600 mb-6">{employee.role} • {employee.department}</p>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                   <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">الراتب الأساسي</p>
                      <p className="text-sm font-black text-slate-800">{employee.salary.toLocaleString()} ر.س</p>
                   </div>
                   <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                      <p className="text-[10px] text-emerald-400 font-bold uppercase mb-1">مجموع البدلات</p>
                      {/* Fix: Added type assertion to resolve 'unknown' type error in reduce function */}
                      <p className="text-sm font-black text-emerald-700">{(Object.values(employee.allowances) as number[]).reduce((a, b) => a + b, 0).toLocaleString()} ر.س</p>
                   </div>
                   <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100">
                      <p className="text-[10px] text-rose-400 font-bold uppercase mb-1">الاستقطاعات</p>
                      {/* Fix: Added type assertion to resolve 'unknown' type error in reduce function */}
                      <p className="text-sm font-black text-rose-700">{(Object.values(employee.deductions) as number[]).reduce((a, b) => a + b, 0).toLocaleString()} ر.س</p>
                   </div>
                   <div className="p-4 bg-blue-600 rounded-2xl text-white shadow-lg">
                      <p className="text-[10px] text-blue-100 font-bold uppercase mb-1">الصافي الشهري</p>
                      {/* Fix: Added type assertions to ensure operands are numbers in arithmetic expression */}
                      <p className="text-sm font-black">{(employee.salary + (Object.values(employee.allowances) as number[]).reduce((a, b) => a + b, 0) - (Object.values(employee.deductions) as number[]).reduce((a, b) => a + b, 0)).toLocaleString()} ر.س</p>
                   </div>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col h-full">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2"><History size={18} className="text-blue-600" /> تاريخ الزيادات والرواتب</h3>
                <div className="space-y-4">
                   {employee.salaryHistory.map((history, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 border-r-4 border-r-blue-500">
                         <div>
                            <p className="text-xs font-black text-slate-800">{history.amount.toLocaleString()} ر.س</p>
                            <p className="text-[10px] text-slate-500">{history.reason}</p>
                         </div>
                         <p className="text-[10px] font-bold text-slate-400">{history.date}</p>
                      </div>
                   ))}
                </div>
             </div>

             <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden flex flex-col h-full">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <PlaneTakeoff size={18} className="text-indigo-600" /> سجل الإجازات الشخصي
                  </h3>
                  <button 
                    onClick={() => setIsAddingLeave(true)}
                    className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-all shadow-sm"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                
                <div className="space-y-4 overflow-y-auto max-h-[300px] no-scrollbar pr-1">
                   {userLeaves.length > 0 ? userLeaves.map((leave) => (
                      <div key={leave.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 border-r-4 border-r-indigo-500 hover:bg-white transition-all group">
                         <div className="flex justify-between items-start mb-1">
                            <span className="text-xs font-black text-slate-800">{leave.type} ({leave.days} أيام)</span>
                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-lg ${
                              leave.status === 'approved' ? 'bg-emerald-100 text-emerald-600' : 
                              leave.status === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600'
                            }`}>
                              {leave.status === 'approved' ? 'مقبولة' : leave.status === 'pending' ? 'معلقة' : 'مرفوضة'}
                            </span>
                         </div>
                         <p className="text-[10px] text-slate-400 font-bold">{leave.startDate} ↔ {leave.endDate}</p>
                      </div>
                   )) : (
                     <div className="flex flex-col items-center justify-center py-10 opacity-40">
                        <PlaneTakeoff size={32} />
                        <p className="text-xs font-bold mt-2">لا يوجد سجل إجازات لهذا العام.</p>
                     </div>
                   )}
                </div>

                {isAddingLeave && (
                  <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-20 flex items-center justify-center p-6 animate-in fade-in zoom-in-95">
                    <form onSubmit={handleAddLeave} className="w-full space-y-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-black text-indigo-600">تقديم طلب إجازة</h4>
                        <button type="button" onClick={() => setIsAddingLeave(false)} className="text-slate-400 hover:text-rose-500"><X size={20}/></button>
                      </div>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase">نوع الإجازة</label>
                          <select name="type" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500">
                            <option value="سنوية">إجازة سنوية</option>
                            <option value="مرضية">إجازة مرضية</option>
                            <option value="اضطرارية">إجازة اضطرارية</option>
                            <option value="غير مدفوعة">إجازة غير مدفوعة</option>
                          </select>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase">تاريخ البدء</label>
                            <input name="startDate" type="date" required className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase">تاريخ الانتهاء</label>
                            <input name="endDate" type="date" required className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none" />
                          </div>
                        </div>
                        <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-xl text-xs font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all">إرسال الطلب الآن</button>
                      </div>
                    </form>
                  </div>
                )}
             </div>

             <div className="space-y-8">
               <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden">
                  <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl"></div>
                  <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2"><Zap size={18} className="text-amber-500" /> تحليلات الإنتاجية العميقة</h3>
                  <div className="space-y-6 relative z-10">
                     <div className="flex items-center justify-between p-6 bg-slate-900 rounded-[2rem] text-white shadow-2xl">
                        <div>
                           <p className="text-[10px] text-slate-400 font-bold uppercase mb-1 tracking-widest">Impact Score</p>
                           <p className="text-4xl font-black text-emerald-400">{employee.productivity.impactScore}%</p>
                        </div>
                        <Activity className="text-blue-500" size={40} />
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-white hover:shadow-md transition-all group">
                           <div className="flex items-center gap-2 mb-3">
                              <CheckCircle2 size={16} className="text-emerald-500 group-hover:scale-110 transition-transform" />
                              <p className="text-[10px] text-slate-500 font-bold uppercase">إنجاز المهام</p>
                           </div>
                           <p className="text-xl font-black text-slate-800">{employee.productivity.tasksCompleted} <span className="text-xs font-normal text-slate-400">/ {employee.productivity.tasksAssigned}</span></p>
                           <div className="mt-2 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${(employee.productivity.tasksCompleted / employee.productivity.tasksAssigned) * 100}%` }}></div>
                           </div>
                        </div>

                        <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-white hover:shadow-md transition-all group">
                           <div className="flex items-center gap-2 mb-3">
                              <Timer size={16} className="text-blue-500 group-hover:scale-110 transition-transform" />
                              <p className="text-[10px] text-slate-500 font-bold uppercase">متوسط الوقت</p>
                           </div>
                           <p className="text-xl font-black text-slate-800">{employee.productivity.avgTaskTime} <span className="text-xs font-normal text-slate-400">ساعة/مهمة</span></p>
                           <p className="text-[9px] text-emerald-600 font-bold mt-1">كفاءة تشغيلية عالية</p>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      <Code2 size={18} className="text-blue-600" /> إدارة مهارات الكفاءة
                    </h3>
                    <button 
                      onClick={() => setIsAddingSkill(true)}
                      className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all shadow-sm"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {localSkills.map((skill, index) => (
                      <div 
                        key={index}
                        className={`group relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all border ${
                          editingSkillIndex === index ? 'bg-white border-blue-500 ring-2 ring-blue-100' : 'bg-slate-50 border-slate-100 hover:border-blue-200'
                        }`}
                      >
                        {editingSkillIndex === index ? (
                          <div className="flex items-center gap-2">
                            <input 
                              autoFocus
                              type="text"
                              value={skillInputValue}
                              onChange={(e) => setSkillInputValue(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleUpdateSkill(index)}
                              className="text-xs font-bold text-slate-700 outline-none w-24"
                            />
                            <button onClick={() => handleUpdateSkill(index)} className="text-emerald-500"><Check size={14} /></button>
                            <button onClick={() => setEditingSkillIndex(null)} className="text-slate-400"><X size={14} /></button>
                          </div>
                        ) : (
                          <>
                            <span className="text-xs font-bold text-slate-700">{skill}</span>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => {
                                  setEditingSkillIndex(index);
                                  setSkillInputValue(skill);
                                }}
                                className="p-1 text-slate-400 hover:text-blue-500"
                              >
                                <Edit3 size={12} />
                              </button>
                              <button 
                                onClick={() => handleDeleteSkill(index)}
                                className="p-1 text-slate-400 hover:text-rose-500"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}

                    {isAddingSkill && (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-blue-500 bg-white shadow-lg animate-in zoom-in-95">
                        <input 
                          autoFocus
                          type="text"
                          placeholder="أدخل المهارة..."
                          value={skillInputValue}
                          onChange={(e) => setSkillInputValue(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                          className="text-xs font-bold text-slate-700 outline-none w-28"
                        />
                        <button onClick={handleAddSkill} className="p-1 bg-emerald-500 text-white rounded-lg"><Check size={12}/></button>
                        <button onClick={() => setIsAddingSkill(false)} className="p-1 bg-slate-100 text-slate-400 rounded-lg"><X size={12}/></button>
                      </div>
                    )}
                  </div>

                  {localSkills.length === 0 && !isAddingSkill && (
                    <div className="py-6 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                      <p className="text-xs text-slate-400 font-bold">لا توجد مهارات مسجلة حالياً.</p>
                      <button 
                        onClick={() => setIsAddingSkill(true)}
                        className="text-[10px] text-blue-600 font-black mt-2 underline"
                      >
                        إضافة أول مهارة
                      </button>
                    </div>
                  )}
               </div>
             </div>
          </div>
        </div>

        <div className="lg:w-80 space-y-8">
           <div className="bg-slate-900 p-8 rounded-[2rem] text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><ShieldCheck size={80} /></div>
              <h4 className="text-sm font-bold text-slate-400 mb-6 uppercase tracking-widest">الامتثال والوثائق</h4>
              <div className="space-y-4">
                 <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-2">انتهاء الإقامة / الهوية</p>
                    <p className="text-lg font-bold flex items-center gap-2">{employee.docExpiry} <AlertTriangle size={16} className="text-amber-500" /></p>
                 </div>
                 <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-2">رصيد الإجازات</p>
                    <p className="text-lg font-bold">{employee.leaveBalance} <span className="text-xs font-normal opacity-50">يوم عمل</span></p>
                 </div>
                 <button className="w-full py-4 bg-blue-600 rounded-2xl text-xs font-bold shadow-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                   <ArrowDownToLine size={18} /> تحميل الملف الكامل
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const LeavesSection = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-bold text-slate-800">إدارة طلبات الإجازة</h3>
      <button className="px-6 py-3 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">+ طلب إجازة جديد</button>
    </div>
    <div className="grid grid-cols-1 gap-4">
      {mockLeaves.map(leave => (
        <div key={leave.id} className="p-6 bg-white border border-slate-100 rounded-[1.5rem] flex flex-col md:flex-row items-center justify-between hover:border-blue-200 hover:shadow-lg transition-all gap-4 group">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-2xl group-hover:scale-110 transition-transform shadow-sm">
              {leave.employeeName[0]}
            </div>
            <div>
              <p className="text-base font-bold text-slate-800">{leave.employeeName}</p>
              <p className="text-xs text-slate-400 font-medium">{leave.type} • {leave.days} أيام</p>
            </div>
          </div>
          <div className="flex items-center gap-10">
             <div className="text-right">
                <p className="text-[10px] text-slate-400 font-bold mb-1 uppercase tracking-widest">الفترة الزمنية</p>
                <p className="text-sm font-bold text-slate-700">{leave.startDate} ↔ {leave.endDate}</p>
             </div>
             {leave.status === 'pending' ? (
               <div className="flex gap-2">
                 <button className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-all shadow-sm"><CheckCircle2 size={22} /></button>
                 <button className="p-3 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-all shadow-sm"><XCircle size={22} /></button>
               </div>
             ) : (
               <div className="flex items-center gap-2 px-5 py-2 bg-emerald-100 text-emerald-600 rounded-full text-xs font-black">
                 <Check size={14} /> مقبولة
               </div>
             )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const Team = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'directory' | 'payroll' | 'leaves'>('overview');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [employeesList, setEmployeesList] = useState<Employee[]>(mockEmployeesData);

  const toggleEmployeeStatus = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // منع فتح الملف الشخصي عند النقر على التبديل
    setEmployeesList(prev => prev.map(emp => {
      if (emp.id === id) {
        return { ...emp, status: emp.status === 'نشط' ? 'غير نشط' : 'نشط' };
      }
      return emp;
    }));
  };

  const stats = useMemo(() => {
    const totalPayroll = employeesList.reduce((acc, emp) => {
      // Fix: Added type assertion to resolve 'unknown' type error in reduce function
      const totalAll = (Object.values(emp.allowances) as number[]).reduce((a, b) => a + b, 0);
      // Fix: Added type assertion to resolve 'unknown' type error in reduce function
      const totalDed = (Object.values(emp.deductions) as number[]).reduce((a, b) => a + b, 0);
      // Fix: Ensured operands are numbers to resolve arithmetic operation error
      return acc + (emp.salary + totalAll - totalDed);
    }, 0);

    return {
      workforce: employeesList.length + 22,
      turnover: '4.2%',
      pendingLeaves: mockLeaves.filter(l => l.status === 'pending').length,
      payrollCost: totalPayroll
    };
  }, [employeesList]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tighter flex items-center gap-3">
             إدارة رأس المال البشري <span className="px-4 py-1 bg-blue-100 text-blue-600 rounded-2xl text-sm font-black">{stats.workforce}</span>
          </h2>
          <p className="text-slate-500 text-sm font-medium">نظام متكامل لإدارة الكفاءات، المزايا، وتحليلات الأداء والرواتب.</p>
        </div>
        {!selectedEmployee && (
           <div className="flex gap-3">
              <button className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 shadow-sm flex items-center gap-2 transition-all">
                <ArrowDownToLine size={18} /> تصدير السجلات
              </button>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-black shadow-2xl shadow-blue-100 hover:bg-blue-700 flex items-center gap-2 transition-all active:scale-95">
                <UserPlus size={18} /> إضافة موظف جديد
              </button>
           </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatItem label="إجمالي القوة العاملة" value={stats.workforce} sub="موظف نشط ومفعل" icon={Users} color="blue" />
        <StatItem label="معدل الدوران السنوي" value={stats.turnover} sub="أقل من المستهدف بـ 2%" icon={TrendingUp} color="emerald" />
        <StatItem label="طلبات إجازة معلقة" value={stats.pendingLeaves} sub="تتطلب مراجعة فورية" icon={Clock} color="amber" />
        <StatItem label="تكلفة الرواتب (شهري)" value={`${stats.payrollCost.toLocaleString()} ر.س`} sub="تقديرات نوفمبر 2023" icon={Banknote} color="indigo" />
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-100 overflow-x-auto no-scrollbar bg-slate-50/50">
          {[
            { id: 'overview', label: 'لوحة التحكم (Dashboard)', icon: PieChart },
            { id: 'directory', label: 'دليل الموظفين الكامل', icon: Users },
            { id: 'payroll', label: 'مسير الرواتب و WPS', icon: FileSpreadsheet },
            { id: 'leaves', label: 'الإجازات والغياب', icon: Calendar },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as any); setSelectedEmployee(null); }}
              className={`flex items-center gap-3 px-10 py-6 text-sm font-black whitespace-nowrap transition-all border-b-4 ${
                activeTab === tab.id 
                  ? 'border-blue-600 text-blue-600 bg-white shadow-[0_-8px_20px_-10px_rgba(37,99,235,0.1)]' 
                  : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-white/50'
              }`}
            >
              <tab.icon size={20} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-10">
          {selectedEmployee ? (
            <EmployeeProfile employee={selectedEmployee} onBack={() => setSelectedEmployee(null)} />
          ) : (
            <>
              {activeTab === 'overview' && <HROverviewSection />}
              {activeTab === 'directory' && <EmployeesTable employees={employeesList} onSelect={setSelectedEmployee} onToggleStatus={toggleEmployeeStatus} />}
              {activeTab === 'payroll' && <PayrollSection employees={employeesList} />}
              {activeTab === 'leaves' && <LeavesSection />}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Team;