
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  Plus, 
  Download, 
  Sparkles, 
  ShieldAlert, 
  Compass, 
  Zap, 
  CheckCircle2, 
  Clock, 
  Activity, 
  ListTodo, 
  Trash2, 
  Tag, 
  Calendar as CalendarIcon, 
  Layers, 
  Users, 
  Rocket, 
  Globe, 
  Palette, 
  Flag, 
  ExternalLink,
  Twitter,
  Linkedin,
  MessageSquare,
  MoreVertical,
  Check,
  Edit3,
  X,
  Save,
  BarChart3,
  Instagram,
  Facebook,
  FileImage,
  Paintbrush,
  FileSpreadsheet,
  Share2,
  AlertCircle,
  TrendingDown,
  ShieldCheck,
  ChevronDown,
  Send,
  Loader2,
  BrainCircuit,
  LayoutDashboard,
  AlignRight,
  Info,
  ChevronLeft
} from 'lucide-react';
import { 
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer
} from 'recharts';
import { getStrategicAdvice, chatWithAssistant } from '../services/geminiService';

type PlanningTab = 'okrs' | 'roadmap' | 'tasks' | 'marketing' | 'risks' | 'ai-planner';

interface TacticalTask {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  completed: boolean;
  dueDate?: string;
}

interface RoadmapItem {
  id: string;
  title: string;
  status: 'In Progress' | 'Planning' | 'Completed';
  quarter: string;
}

interface OKRItem {
  id: string;
  title: string;
  progress: number;
  type: 'growth' | 'technical' | 'financial';
}

interface RiskItem {
  id: string;
  risk: string;
  impact: 'عالي' | 'متوسط' | 'منخفض';
  mitigation: string;
  color: 'rose' | 'amber' | 'blue';
}

interface MarketingCampaign {
  id: string;
  name: string;
  platform: 'LinkedIn' | 'Twitter' | 'Meta' | 'Google' | string;
  status: string;
  reach: number;
  target: number;
  budget: number;
}

interface BrandColor {
  id: string;
  label: string;
  hex: string;
}

interface BrandLogo {
  id: string;
  name: string;
  format: string;
  type: string;
}

const radarData = [
  { subject: 'التقنية', A: 95, fullMark: 100 },
  { subject: 'الحصة السوقية', A: 60, fullMark: 100 },
  { subject: 'الفريق', A: 85, fullMark: 100 },
  { subject: 'المالية', A: 75, fullMark: 100 },
  { subject: 'الامتثال', A: 90, fullMark: 100 },
];

const Planning = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<PlanningTab>('okrs');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [isInitiativeModalOpen, setIsInitiativeModalOpen] = useState(false);
  const [showNavDropdown, setShowNavDropdown] = useState(false);

  const [roadmapItems, setRoadmapItems] = useState<RoadmapItem[]>([
    { id: '1', title: 'إطلاق تطبيق الموظف الجديد', status: 'In Progress', quarter: 'الربع الأول 2024' },
    { id: '2', title: 'تكامل الدفع مع Apple Pay', status: 'In Progress', quarter: 'الربع الأول 2024' },
    { id: '3', title: 'محرك التحليلات التنبؤية بالذكاء الاصطناعي', status: 'Planning', quarter: 'الربع الثاني 2024' },
    { id: '5', title: 'تجديد واجهة المستخدم (V3)', status: 'Completed', quarter: 'الربع الرابع 2023' },
  ]);

  const [tasks, setTasks] = useState<TacticalTask[]>([
    { id: '1', title: 'مراجعة أمان السيرفرات السحابية', priority: 'high', category: 'DevOps', completed: false, description: 'تحليل سجلات الوصول وتحديث جدران الحماية للإنتاج وتغيير مفاتيح الوصول الدورية.', dueDate: '2024-01-15' },
    { id: '2', title: 'تحسين تجربة تسجيل الدخول الموحد', priority: 'medium', category: 'UX', completed: true, description: 'دمج تقنية WebAuthn لدعم البصمة في المتصفحات وتقليل وقت الدخول بنسبة 30%.', dueDate: '2023-12-20' },
    { id: '3', title: 'تحديث توثيق API للمطورين الجدد', priority: 'low', category: 'Docs', completed: false, description: 'كتابة أمثلة برمجية بـ Python و Go لجميع نقاط النهاية (Endpoints) وشرح بروتوكول المصادقة.', dueDate: '2024-02-10' },
  ]);

  const [okrs, setOkrs] = useState<OKRItem[]>([
    { id: 'o1', title: 'تحسين سرعة الاستجابة للنظام بنسبة 40%', progress: 65, type: 'technical' },
    { id: 'o2', title: 'توسيع قاعدة العملاء في قطاع التجزئة', progress: 40, type: 'growth' },
    { id: 'o3', title: 'تحقيق نمو في الإيرادات بنسبة 25%', progress: 80, type: 'financial' },
  ]);

  const [risks, setRisks] = useState<RiskItem[]>([
    { id: 'r1', risk: 'تأخر في توريد الأجهزة التقنية', impact: 'عالي', mitigation: 'البحث عن مورد بديل محلي وتوقيع عقد إطاري.', color: 'rose' },
    { id: 'r2', risk: 'ثغرات أمنية في مكتبات خارجية', impact: 'متوسط', mitigation: 'تفعيل تدقيق أمني آلي في مسار الـ DevSecOps.', color: 'amber' },
    { id: 'r3', risk: 'تذبذب سعر الصرف للعملات', impact: 'منخفض', mitigation: 'تحويل ميزانيات السحابة إلى عملة مستقرة.', color: 'blue' },
  ]);

  const avgOkrProgress = useMemo(() => {
    return Math.round(okrs.reduce((acc, curr) => acc + curr.progress, 0) / okrs.length);
  }, [okrs]);

  const runAiAnalysis = async () => {
    setIsAnalyzing(true);
    const advice = await getStrategicAdvice(
      okrs.map(o => ({ goal: o.title, progress: o.progress })),
      risks.map(r => ({ risk: r.risk, level: r.impact }))
    );
    setAiAdvice(advice);
    setIsAnalyzing(false);
  };

  const exportUnifiedReport = () => {
    const headers = ["النوع", "العنوان/الاسم", "الحالة/التقدم", "التفاصيل"];
    const rows = [
      ...roadmapItems.map(i => ["مبادرة استراتيجية", i.title, i.status, i.quarter]),
      ...okrs.map(o => ["هدف (OKR)", o.title, `${o.progress}%`, o.type]),
      ...risks.map(r => ["مخاطرة", r.risk, r.impact, r.mitigation])
    ];
    
    const csvContent = "\uFEFF" + [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `مركز_القيادة_الاستراتيجي_${new Date().toLocaleDateString('ar-SA')}.csv`;
    link.click();
  };

  const addInitiative = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newItem: RoadmapItem = {
      id: Date.now().toString(),
      title: formData.get('title') as string,
      status: formData.get('status') as any,
      quarter: formData.get('quarter') as string,
    };
    setRoadmapItems([newItem, ...roadmapItems]);
    setIsInitiativeModalOpen(false);
    setActiveTab('roadmap');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20"><Compass size={24} /></div>
              <h2 className="text-3xl font-black tracking-tighter">مركز القيادة الاستراتيجي</h2>
            </div>
            <p className="text-slate-400 text-sm max-w-xl font-medium mb-4">الرؤية الكبرى، الجدولة الزمنية، والتحركات التكتيكية في واجهة واحدة موحدة.</p>
            <div className="relative inline-block text-right">
              <button 
                onClick={() => setShowNavDropdown(!showNavDropdown)}
                className="flex items-center gap-3 px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10 transition-all text-slate-300"
              >
                انتقال سريع لصفحات التنفيذ <ChevronDown size={14} className={`transition-transform ${showNavDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showNavDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-[60] animate-in slide-in-from-top-2 duration-200">
                  <button 
                    onClick={() => { navigate('/calendar'); setShowNavDropdown(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-blue-50 rounded-xl transition-all text-right group"
                  >
                    <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors"><CalendarIcon size={16} /></div>
                    <div className="flex-1">
                      <p className="text-xs font-black">تقويم العمليات</p>
                      <p className="text-[10px] text-slate-400">متابعة مواعيد الفرق التنفيذية</p>
                    </div>
                  </button>
                  <button 
                    onClick={() => { navigate('/'); setShowNavDropdown(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-emerald-50 rounded-xl transition-all text-right group"
                  >
                    <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors"><LayoutDashboard size={16} /></div>
                    <div className="flex-1">
                      <p className="text-xs font-black">لوحة التحكم</p>
                      <p className="text-[10px] text-slate-400">نظرة عامة على النتائج</p>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={exportUnifiedReport}
              className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-2xl text-xs font-bold hover:bg-white/10 transition-all flex items-center gap-2 group"
            >
              <Download size={18} className="group-hover:translate-y-0.5 transition-transform" /> تصدير التقرير الموحد
            </button>
            <button 
              onClick={() => setIsInitiativeModalOpen(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-2xl text-xs font-bold shadow-xl shadow-blue-500/30 hover:bg-blue-700 transition-all flex items-center gap-2 active:scale-95"
            >
              <Plus size={18} /> مبادرة جديدة
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'تقدم الأهداف (OKRs)', value: `${avgOkrProgress}%`, icon: Target, color: 'blue' },
          { label: 'المبادرات المكتملة', value: roadmapItems.filter(i=>i.status==='Completed').length, icon: Rocket, color: 'emerald' },
          { label: 'المهام التكتيكية', value: tasks.filter(t=>!t.completed).length, icon: ListTodo, color: 'amber' },
          { label: 'المخاطر النشطة', value: risks.length, icon: ShieldAlert, color: 'rose' },
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
             <div className={`p-2 bg-${kpi.color}-50 text-${kpi.color}-600 rounded-xl`}>
               <kpi.icon size={20} />
             </div>
             <div>
               <p className="text-[10px] text-slate-400 font-bold uppercase">{kpi.label}</p>
               <p className="text-sm font-black text-slate-800">{kpi.value}</p>
             </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-100 overflow-x-auto no-scrollbar bg-slate-50/50">
          {[
            { id: 'okrs', label: 'الأهداف (OKRs)', icon: Target },
            { id: 'roadmap', label: 'خارطة الطريق', icon: Rocket },
            { id: 'tasks', label: 'المهام التكتيكية', icon: ListTodo },
            { id: 'marketing', label: 'التسويق والهوية', icon: Palette },
            { id: 'risks', label: 'المخاطر', icon: ShieldAlert },
            { id: 'ai-planner', label: 'مخطط الذكاء الاصطناعي', icon: BrainCircuit },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as PlanningTab)}
              className={`flex items-center gap-2 px-8 py-5 text-sm font-bold whitespace-nowrap transition-all border-b-2 ${
                activeTab === tab.id 
                  ? 'border-blue-600 text-blue-600 bg-white shadow-[0_4px_20px_-10px_rgba(37,99,235,0.2)]' 
                  : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-white/50'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-8">
          {activeTab === 'okrs' && <OKRsTab okrs={okrs} setOkrs={setOkrs} runAi={runAiAnalysis} isAnalyzing={isAnalyzing} aiAdvice={aiAdvice} />}
          {activeTab === 'roadmap' && <RoadmapTab items={roadmapItems} setItems={setRoadmapItems} />}
          {activeTab === 'tasks' && <TacticalTasksTab tasks={tasks} setTasks={setTasks} />}
          {activeTab === 'marketing' && <MarketingTab />}
          {activeTab === 'risks' && <RisksTab risks={risks} setRisks={setRisks} />}
          {activeTab === 'ai-planner' && <AIPlannerTab />}
        </div>
      </div>

      {isInitiativeModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-100">
                   <Plus size={24} />
                 </div>
                 <div>
                   <h3 className="text-xl font-black text-slate-800">إطلاق مبادرة جديدة</h3>
                   <p className="text-xs text-slate-500 font-medium mt-1">حدد المسار الاستراتيجي الجديد للشركة</p>
                 </div>
              </div>
              <button 
                onClick={() => setIsInitiativeModalOpen(false)}
                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={addInitiative} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">اسم المبادرة</label>
                <input 
                  required
                  name="title"
                  type="text" 
                  placeholder="مثال: التوسع في السوق الخليجي"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">الربع الزمني</label>
                  <select 
                    name="quarter"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    <option value="الربع الأول 2024">الربع الأول 2024</option>
                    <option value="الربع الثاني 2024">الربع الثاني 2024</option>
                    <option value="الربع الثالث 2024">الربع الثالث 2024</option>
                    <option value="الربع الرابع 2024">الربع الرابع 2024</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">الحالة المبدئية</label>
                  <select 
                    name="status"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    <option value="Planning">مخطط لها</option>
                    <option value="In Progress">قيد التنفيذ</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-4 pt-6">
                <button 
                  type="button"
                  onClick={() => setIsInitiativeModalOpen(false)}
                  className="flex-1 py-4 text-slate-600 font-black bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all active:scale-95"
                >
                  إلغاء
                </button>
                <button 
                  type="submit"
                  className="flex-[2] py-4 bg-blue-600 text-white font-black rounded-2xl shadow-2xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                  <Save size={20} /> اعتماد المبادرة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const OKRsTab = ({ okrs, setOkrs, runAi, isAnalyzing, aiAdvice }: { okrs: OKRItem[], setOkrs: any, runAi: any, isAnalyzing: boolean, aiAdvice: string | null }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newOkr, setNewOkr] = useState<Partial<OKRItem>>({ title: '', progress: 0, type: 'technical' });

  const handleAdd = () => {
    if (!newOkr.title) return;
    setOkrs([...okrs, { ...newOkr, id: Date.now().toString() } as OKRItem]);
    setIsAdding(false);
    setNewOkr({ title: '', progress: 0, type: 'technical' });
  };

  const updateProgress = (id: string, val: number) => {
    setOkrs(okrs.map(o => o.id === id ? { ...o, progress: Math.min(100, Math.max(0, val)) } : o));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-4">
      <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex flex-col items-center">
        <h3 className="text-sm font-black text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-tighter">
          <Activity size={18} className="text-blue-600" /> رادار النضج المؤسسي
        </h3>
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} />
              <Radar name="تكنولوجي" dataKey="A" stroke="#2563eb" fill="#2563eb" fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 rounded-[2rem] text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Zap size={80} /></div>
          <div className="flex justify-between items-center mb-4">
             <h4 className="text-xs font-bold text-blue-100 opacity-60 mb-1 uppercase tracking-widest">الهدف الاستراتيجي النشط</h4>
             <button onClick={() => setIsAdding(true)} className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-all"><Plus size={16} /></button>
          </div>
          <div className="space-y-6">
            {okrs.map(okr => (
              <div key={okr.id} className="group relative">
                <div className="flex justify-between items-end mb-2">
                   <div>
                     <p className="text-xs font-bold text-blue-100 opacity-60 mb-1 uppercase">{okr.type}</p>
                     <p className="text-sm font-black">{okr.title}</p>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="flex items-center bg-white/10 rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={() => updateProgress(okr.id, okr.progress - 5)} className="p-1 hover:text-blue-200"><TrendingDown size={14}/></button>
                         <button onClick={() => updateProgress(okr.id, okr.progress + 5)} className="p-1 hover:text-blue-200"><TrendingUp size={14}/></button>
                         <button onClick={() => setOkrs(okrs.filter(o => o.id !== okr.id))} className="p-1 hover:text-rose-300 ml-1"><Trash2 size={14}/></button>
                      </div>
                      <span className="text-xs font-black">{okr.progress}%</span>
                   </div>
                </div>
                <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white shadow-lg transition-all duration-1000" style={{ width: `${okr.progress}%` }}></div>
                </div>
              </div>
            ))}
          </div>
          {isAdding && (
            <div className="mt-8 p-6 bg-white/10 rounded-2xl border border-white/10 animate-in zoom-in-95">
               <h5 className="text-[10px] font-black uppercase mb-4">إضافة نتيجة رئيسية جديدة</h5>
               <div className="space-y-4">
                  <input 
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-xs outline-none placeholder:text-blue-200"
                    placeholder="وصف الهدف..."
                    value={newOkr.title}
                    onChange={e => setNewOkr({...newOkr, title: e.target.value})}
                  />
                  <div className="flex gap-2">
                    <select 
                      className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-xs outline-none"
                      value={newOkr.type}
                      onChange={e => setNewOkr({...newOkr, type: e.target.value as any})}
                    >
                      <option value="technical">تقني</option>
                      <option value="growth">نمو</option>
                      <option value="financial">مالي</option>
                    </select>
                    <button onClick={handleAdd} className="px-6 py-2 bg-white text-blue-600 rounded-xl text-xs font-black">إضافة</button>
                    <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-xs font-bold text-white/60">إلغاء</button>
                  </div>
               </div>
            </div>
          )}
        </div>
        <div className="bg-amber-50 p-6 rounded-[2rem] border border-amber-100">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-amber-900 flex items-center gap-2">
              <Sparkles size={18} className="text-amber-500" /> نصيحة النمو (Gemini AI)
            </h4>
            <button onClick={runAi} disabled={isAnalyzing} className="text-[10px] font-black bg-amber-200 text-amber-800 px-3 py-1 rounded-full hover:bg-amber-300 transition-all">
              {isAnalyzing ? "جاري التوليد..." : "تحليل المسار"}
            </button>
          </div>
          <p className="text-xs text-amber-800 leading-relaxed italic">{aiAdvice || "مستعد لتحليل مسارك الاستراتيجي بناءً على أهدافك الحالية..."}</p>
        </div>
      </div>
    </div>
  );
};

const RoadmapTab = ({ items, setItems }: { items: RoadmapItem[], setItems: any }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<RoadmapItem>>({});

  const quarters = ['الربع الرابع 2023', 'الربع الأول 2024', 'الربع الثاني 2024'];

  const handleAddItem = (q: string) => {
    const newItem: RoadmapItem = {
      id: Date.now().toString(),
      title: 'مبادرة جديدة...',
      status: 'Planning',
      quarter: q
    };
    setItems([...items, newItem]);
    setEditingId(newItem.id);
    setEditForm(newItem);
  };

  const handleSave = () => {
    setItems(items.map(i => i.id === editingId ? { ...i, ...editForm } : i));
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه المبادرة؟')) {
      setItems(items.filter(i => i.id !== id));
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800">خارطة الطريق التقنية (Product Roadmap)</h3>
        <div className="flex gap-2">
           <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> مكتمل</span>
           <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400"><div className="w-2 h-2 rounded-full bg-blue-500"></div> قيد العمل</span>
           <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400"><div className="w-2 h-2 rounded-full bg-slate-300"></div> مخطط له</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quarters.map((q) => (
          <div key={q} className="space-y-4">
             <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-xs font-black text-slate-600">{q}</span>
                <button onClick={() => handleAddItem(q)} className="p-1 hover:bg-white rounded-lg text-blue-600 transition-colors"><Plus size={16}/></button>
             </div>
             <div className="space-y-3">
                {items.filter(item => item.quarter === q).map(item => (
                  <div key={item.id} className={`p-4 rounded-2xl border transition-all relative group bg-white ${
                    item.status === 'In Progress' ? 'border-blue-100 shadow-blue-50 shadow-sm' : 
                    item.status === 'Completed' ? 'border-emerald-100 bg-emerald-50/20' : 'border-slate-100'
                  }`}>
                    {editingId === item.id ? (
                      <div className="space-y-3 animate-in fade-in duration-300">
                        <input 
                          className="w-full text-xs font-bold border-b border-blue-200 outline-none pb-1"
                          value={editForm.title}
                          onChange={e => setEditForm({...editForm, title: e.target.value})}
                          autoFocus
                        />
                        <select 
                          className="w-full text-[10px] bg-slate-50 rounded p-1 outline-none"
                          value={editForm.status}
                          onChange={e => setEditForm({...editForm, status: e.target.value as any})}
                        >
                          <option value="Planning">مخطط له</option>
                          <option value="In Progress">قيد التنفيذ</option>
                          <option value="Completed">مكتمل</option>
                        </select>
                        <div className="flex gap-2">
                          <button onClick={handleSave} className="flex-1 bg-blue-600 text-white text-[10px] py-1 rounded-lg">حفظ</button>
                          <button onClick={() => setEditingId(null)} className="flex-1 bg-slate-100 text-slate-500 text-[10px] py-1 rounded-lg">إلغاء</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between items-start mb-2">
                          <div className={`w-2 h-2 rounded-full mt-1 ${
                            item.status === 'In Progress' ? 'bg-blue-500' : 
                            item.status === 'Completed' ? 'bg-emerald-500' : 'bg-slate-300'
                          }`}></div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => {setEditingId(item.id); setEditForm(item);}} className="p-1 text-slate-300 hover:text-blue-600"><Edit3 size={12}/></button>
                            <button onClick={() => handleDelete(item.id)} className="p-1 text-slate-300 hover:text-rose-500"><Trash2 size={12}/></button>
                          </div>
                        </div>
                        <p className="text-xs font-bold text-slate-700 leading-relaxed">{item.title}</p>
                      </>
                    )}
                  </div>
                ))}
                {items.filter(item => item.quarter === q).length === 0 && (
                  <div className="py-8 text-center border-2 border-dashed border-slate-100 rounded-2xl text-[10px] text-slate-300 font-bold">لا توجد خطط لهذا الربع</div>
                )}
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TacticalTasksTab = ({ tasks, setTasks }: { tasks: TacticalTask[], setTasks: any }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [viewingTask, setViewingTask] = useState<TacticalTask | null>(null);
  const [taskForm, setTaskForm] = useState<Partial<TacticalTask>>({ title: '', description: '', priority: 'medium', category: 'عام' });

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskForm.title) return;
    const task: TacticalTask = {
      id: Date.now().toString(),
      title: taskForm.title,
      description: taskForm.description || '',
      priority: taskForm.priority as any,
      category: taskForm.category || 'عام',
      completed: false
    };
    setTasks([task, ...tasks]);
    setIsAdding(false);
    setTaskForm({ title: '', description: '', priority: 'medium', category: 'عام' });
  };

  const handleUpdateTask = (e: React.FormEvent) => {
    e.preventDefault();
    setTasks(tasks.map(t => t.id === editingTaskId ? { ...t, ...taskForm } : t));
    setEditingTaskId(null);
    setTaskForm({ title: '', description: '', priority: 'medium', category: 'عام' });
  };

  const startEdit = (task: TacticalTask) => {
    setEditingTaskId(task.id);
    setTaskForm(task);
    setIsAdding(false);
    setViewingTask(null);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800">المهام التكتيكية النشطة</h3>
        <button onClick={() => { setIsAdding(true); setEditingTaskId(null); }} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-2">
          <Plus size={16} /> إضافة مهمة
        </button>
      </div>

      {(isAdding || editingTaskId) && (
        <form onSubmit={editingTaskId ? handleUpdateTask : handleAddTask} className="bg-slate-50 p-6 rounded-2xl border border-blue-100 animate-in slide-in-from-top-2 duration-300">
          <h4 className="text-xs font-black text-blue-600 mb-4 uppercase tracking-widest">{editingTaskId ? 'تعديل المهمة' : 'تعبئة مهمة جديدة'}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase">عنوان المهمة</label>
              <input 
                className="w-full bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="وصف مختصر..."
                value={taskForm.title}
                onChange={e => setTaskForm({...taskForm, title: e.target.value})}
                autoFocus
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase">الأولوية</label>
                <select 
                  className="w-full bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs outline-none"
                  value={taskForm.priority}
                  onChange={e => setTaskForm({...taskForm, priority: e.target.value as any})}
                >
                  <option value="high">عالية</option>
                  <option value="medium">متوسطة</option>
                  <option value="low">منخفضة</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase">القسم</label>
                <input 
                  className="w-full bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs outline-none"
                  placeholder="مثال: DevOps"
                  value={taskForm.category}
                  onChange={e => setTaskForm({...taskForm, category: e.target.value})}
                />
              </div>
            </div>
          </div>
          <div className="space-y-1 mb-4">
            <label className="text-[10px] font-black text-slate-400 uppercase">وصف تفصيلي</label>
            <textarea 
              rows={3}
              className="w-full bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="اكتب كامل التفاصيل التقنية هنا..."
              value={taskForm.description}
              onChange={e => setTaskForm({...taskForm, description: e.target.value})}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => { setIsAdding(false); setEditingTaskId(null); }} className="px-4 py-2 text-xs font-bold text-slate-500">إلغاء</button>
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-2">
              <Save size={14} /> {editingTaskId ? 'حفظ التعديلات' : 'تأكيد الإضافة'}
            </button>
          </div>
        </form>
      )}

      <div className="bg-slate-50 p-2 rounded-[2rem] border border-slate-100">
        <div className="divide-y divide-slate-200/50">
          {tasks.map((task) => (
            <div 
              key={task.id} 
              onClick={() => setViewingTask(task)}
              className="p-4 flex items-center justify-between hover:bg-white transition-all rounded-xl group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setTasks(tasks.map(t => t.id === task.id ? {...t, completed: !t.completed} : t));
                  }}
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                    task.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 text-transparent hover:border-blue-400'
                  }`}
                >
                  <Check size={14} />
                </button>
                <div className="text-right">
                  <p className={`text-sm font-bold ${task.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{task.title}</p>
                  <div className="flex gap-2 mt-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{task.category}</span>
                    <span className="text-[10px] text-slate-300">•</span>
                    <span className={`text-[10px] font-black uppercase ${
                      task.priority === 'high' ? 'text-rose-500' : task.priority === 'medium' ? 'text-amber-500' : 'text-blue-500'
                    }`}>أولوية {task.priority === 'high' ? 'عالية' : task.priority === 'medium' ? 'متوسطة' : 'منخفضة'}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                <button 
                  onClick={(e) => { e.stopPropagation(); startEdit(task); }} 
                  className="p-2 text-slate-300 hover:text-blue-600 hover:bg-slate-50 rounded-lg"
                >
                  <Edit3 size={16} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setTasks(tasks.filter(t => t.id !== task.id)); }} 
                  className="p-2 text-slate-300 hover:text-rose-500 hover:bg-slate-50 rounded-lg"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Viewing Task Modal */}
      {viewingTask && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
           <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                 <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl ${
                      viewingTask.completed ? 'bg-emerald-500 text-white' : 'bg-blue-600 text-white'
                    }`}>
                       {viewingTask.completed ? <CheckCircle2 size={28} /> : <Clock size={28} />}
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-slate-800">{viewingTask.title}</h3>
                       <p className="text-xs text-slate-500 font-medium mt-1">
                         {viewingTask.completed ? 'مهمة منجزة بنجاح' : 'مهمة قيد التنفيذ'}
                       </p>
                    </div>
                 </div>
                 <button onClick={() => setViewingTask(null)} className="p-2 text-slate-400 hover:text-rose-500 rounded-xl transition-all"><X size={24} /></button>
              </div>

              <div className="p-10 space-y-8">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                         <Flag size={12} /> الأولوية
                       </p>
                       <p className={`text-sm font-black uppercase ${
                         viewingTask.priority === 'high' ? 'text-rose-600' : viewingTask.priority === 'medium' ? 'text-amber-600' : 'text-blue-600'
                       }`}>
                         {viewingTask.priority === 'high' ? 'عالية جداً' : viewingTask.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
                       </p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                         <Tag size={12} /> القسم / التصنيف
                       </p>
                       <p className="text-sm font-black text-slate-800">{viewingTask.category}</p>
                    </div>
                 </div>

                 <div className="space-y-3">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <AlignRight size={14} /> تفاصيل المهمة والوصف
                    </h4>
                    <div className="p-6 bg-blue-50/30 border border-blue-100 rounded-2xl min-h-[120px]">
                       <p className="text-sm text-slate-700 leading-relaxed font-medium">
                          {viewingTask.description || 'لا يوجد وصف تفصيلي لهذه المهمة.'}
                       </p>
                    </div>
                 </div>

                 {viewingTask.dueDate && (
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                       <CalendarIcon size={16} className="text-blue-500" /> موعد التسليم المتوقع: 
                       <span className="font-mono text-blue-600">{viewingTask.dueDate}</span>
                    </div>
                 )}
              </div>

              <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex gap-4">
                 <button 
                  onClick={() => startEdit(viewingTask)}
                  className="flex-1 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-black text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm"
                 >
                    <Edit3 size={18} /> تعديل المهمة
                 </button>
                 <button 
                  onClick={() => setViewingTask(null)}
                  className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all"
                 >
                    إغلاق التفاصيل
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const MarketingTab = () => {
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>([
    { id: '1', name: 'إطلاق نظام الـ ERP الجديد', platform: 'LinkedIn', status: 'نشطة', reach: 12400, target: 20000, budget: 5000 },
    { id: '2', name: 'حملة استقطاب المطورين', platform: 'Twitter', status: 'نشطة', reach: 5200, target: 10000, budget: 1500 },
  ]);

  const [colors, setColors] = useState<BrandColor[]>([
    { id: 'c1', label: 'اللون الرئيسي', hex: '#2563eb' },
    { id: 'c2', label: 'اللون الثانوي', hex: '#10b981' },
    { id: 'c3', label: 'لون التنبيه', hex: '#f43f5e' },
  ]);

  const [logos, setLogos] = useState<BrandLogo[]>([
    { id: 'l1', name: 'الشعار الرئيسي (Horizontal)', format: 'SVG', type: 'Light' },
    { id: 'l2', name: 'شعار الوضع الليلي', format: 'PNG', type: 'Dark' },
    { id: 'l3', name: 'أيقونة التطبيق (Favicon)', format: 'ICO', type: 'Icon' },
  ]);

  const [isAddingCampaign, setIsAddingCampaign] = useState(false);
  const [editingCampaignId, setEditingCampaignId] = useState<string | null>(null);
  const [campaignForm, setCampaignForm] = useState<Partial<MarketingCampaign>>({ name: '', platform: 'LinkedIn', status: 'نشطة', reach: 0, target: 1000, budget: 0 });

  const handleSaveCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignForm.name) return;
    if (editingCampaignId) {
      setCampaigns(campaigns.map(c => c.id === editingCampaignId ? { ...c, ...campaignForm } as MarketingCampaign : c));
    } else {
      setCampaigns([...campaigns, { ...campaignForm, id: Date.now().toString() } as MarketingCampaign]);
    }
    setIsAddingCampaign(false);
    setEditingCampaignId(null);
    setCampaignForm({ name: '', platform: 'LinkedIn', status: 'نشطة', reach: 0, target: 1000, budget: 0 });
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'LinkedIn': return <Linkedin size={20} />;
      case 'Twitter': return <Twitter size={20} />;
      case 'Meta': return <Facebook size={20} />;
      case 'Google': return <BarChart3 size={20} />;
      default: return <Globe size={20} />;
    }
  };

  return (
    <div className="space-y-12 animate-in slide-in-from-bottom-4">
      <div className="space-y-6">
        <div className="flex justify-between items-center bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Flag size={18} className="text-blue-600"/> الخطط التسويقية وتتبع الوصول</h3>
            <p className="text-xs text-slate-500 mt-1">إدارة ميزانيات الإعلانات وقياس مؤشرات الأداء (KPIs).</p>
          </div>
          <button 
            onClick={() => { setIsAddingCampaign(true); setEditingCampaignId(null); }}
            className="px-6 py-3 bg-blue-600 text-white rounded-2xl text-xs font-bold shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center gap-2"
          >
            <Plus size={18} /> إضافة خطة جديدة
          </button>
        </div>
        {isAddingCampaign && (
          <form onSubmit={handleSaveCampaign} className="p-8 bg-white border-2 border-blue-100 rounded-[2.5rem] space-y-6 shadow-2xl animate-in zoom-in-95">
             <div className="flex justify-between items-center border-b border-slate-50 pb-4">
               <h4 className="font-black text-slate-800 flex items-center gap-2">
                 <Palette size={20} className="text-blue-600" /> {editingCampaignId ? 'تعديل الخطة' : 'تعبئة خطة تسويقية جديدة'}
               </h4>
               <button type="button" onClick={() => setIsAddingCampaign(false)} className="text-slate-400 hover:text-rose-500"><X size={20}/></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                required
                className="w-full bg-slate-50 border border-slate-200 px-5 py-3 rounded-2xl text-sm font-bold outline-none"
                placeholder="اسم الحملة..."
                value={campaignForm.name}
                onChange={e => setCampaignForm({...campaignForm, name: e.target.value})}
              />
              <select 
                className="w-full bg-slate-50 border border-slate-200 px-5 py-3 rounded-2xl text-sm font-bold outline-none"
                value={campaignForm.platform}
                onChange={e => setCampaignForm({...campaignForm, platform: e.target.value as any})}
              >
                <option value="LinkedIn">LinkedIn</option>
                <option value="Twitter">Twitter (X)</option>
                <option value="Meta">Meta Ads</option>
                <option value="Google">Google Ads</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="flex-1 bg-blue-600 text-white font-black py-3 rounded-xl">حفظ الخطة</button>
              <button type="button" onClick={() => setIsAddingCampaign(false)} className="px-6 bg-slate-100 text-slate-500 rounded-xl">إلغاء</button>
            </div>
          </form>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {campaigns.map(c => {
            const progress = Math.min(100, Math.round((c.reach / c.target) * 100));
            return (
              <div key={c.id} className="p-6 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                      {getPlatformIcon(c.platform)}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-800">{c.name}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{c.platform} • {c.status}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditingCampaignId(c.id); setCampaignForm(c); setIsAddingCampaign(true); }} className="p-2 text-slate-400 hover:text-blue-600"><Edit3 size={16}/></button>
                    <button onClick={() => setCampaigns(campaigns.filter(item => item.id !== c.id))} className="p-2 text-slate-400 hover:text-rose-600"><Trash2 size={16}/></button>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black text-slate-400">
                    <span>تحقيق المستهدف</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8 border-t border-slate-100">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Paintbrush size={18} className="text-emerald-600"/> دليل ألوان العلامة (Brand Palette)</h3>
            <button onClick={() => {
              const hex = prompt('أدخل رمز اللون (Hex Code):', '#');
              const label = prompt('أدخل مسمى اللون:');
              if (hex && label) setColors([...colors, { id: Date.now().toString(), label, hex }]);
            }} className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors"><Plus size={18}/></button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {colors.map(color => (
              <div key={color.id} className="p-4 bg-white border border-slate-100 rounded-3xl shadow-sm flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl shadow-inner border border-slate-100" style={{ backgroundColor: color.hex }}></div>
                  <div>
                    <p className="text-[10px] font-black text-slate-800">{color.label}</p>
                    <p className="text-[10px] font-mono text-slate-400 uppercase">{color.hex}</p>
                  </div>
                </div>
                <button onClick={() => setColors(colors.filter(c => c.id !== color.id))} className="p-2 text-slate-200 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 size={14}/>
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><FileImage size={18} className="text-indigo-600"/> مكتبة الشعارات (Logo Assets)</h3>
            <button onClick={() => {
              const name = prompt('اسم الشعار:');
              const format = prompt('الصيغة (SVG, PNG, JPG):');
              if (name && format) setLogos([...logos, { id: Date.now().toString(), name, format, type: 'Light' }]);
            }} className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors"><Plus size={18}/></button>
          </div>
          <div className="space-y-3">
            {logos.map(logo => (
              <div key={logo.id} className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center">
                    <FileImage size={20}/>
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800">{logo.name}</h4>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{logo.format} • {logo.type}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                   <button className="p-2 text-slate-400 hover:text-blue-600"><Download size={14}/></button>
                   <button onClick={() => setLogos(logos.filter(l => l.id !== logo.id))} className="p-2 text-slate-200 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 size={14}/>
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const RisksTab = ({ risks, setRisks }: { risks: RiskItem[], setRisks: any }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newRisk, setNewRisk] = useState<Partial<RiskItem>>({ risk: '', impact: 'متوسط', mitigation: '', color: 'amber' });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRisk.risk) return;
    setRisks([...risks, { 
      ...newRisk, 
      id: Date.now().toString(),
      color: newRisk.impact === 'عالي' ? 'rose' : newRisk.impact === 'متوسط' ? 'amber' : 'blue'
    } as RiskItem]);
    setIsAdding(false);
    setNewRisk({ risk: '', impact: 'متوسط', mitigation: '', color: 'amber' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800">سجل المخاطر وتخفيفها</h3>
        <button onClick={() => setIsAdding(true)} className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold flex items-center gap-2">
          <Plus size={16} /> إضافة مخاطرة
        </button>
      </div>
      {isAdding && (
        <form onSubmit={handleAdd} className="bg-rose-50 p-6 rounded-2xl border border-rose-100 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none"
              placeholder="وصف المخاطرة..."
              value={newRisk.risk}
              onChange={e => setNewRisk({...newRisk, risk: e.target.value})}
            />
            <select 
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none"
              value={newRisk.impact}
              onChange={e => setNewRisk({...newRisk, impact: e.target.value as any})}
            >
              <option value="عالي">عالي</option>
              <option value="متوسط">متوسط</option>
              <option value="منخفض">منخفض</option>
            </select>
          </div>
          <textarea 
            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none"
            placeholder="خطة التخفيف..."
            value={newRisk.mitigation}
            onChange={e => setNewRisk({...newRisk, mitigation: e.target.value})}
          />
          <div className="flex justify-end gap-2">
             <button type="button" onClick={() => setIsAdding(false)} className="text-xs text-slate-500">إلغاء</button>
             <button type="submit" className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold">حفظ</button>
          </div>
        </form>
      )}
      <div className="grid grid-cols-1 gap-4">
        {risks.map(r => (
          <div key={r.id} className={`p-6 rounded-3xl border border-${r.color}-100 bg-${r.color}-50/30 flex justify-between items-start`}>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ShieldAlert size={18} className={`text-${r.color}-600`} />
                <h4 className="font-bold text-slate-800">{r.risk}</h4>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold bg-${r.color}-100 text-${r.color}-600`}>{r.impact}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed"><span className="font-bold">خطة التخفيف:</span> {r.mitigation}</p>
            </div>
            <button onClick={() => setRisks(risks.filter(item => item.id !== r.id))} className="text-slate-300 hover:text-rose-500"><Trash2 size={16}/></button>
          </div>
        ))}
      </div>
    </div>
  );
};

const AIPlannerTab = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePlan = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    const res = await chatWithAssistant(prompt, []);
    setResponse(res);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
        <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
          <BrainCircuit size={20} /> المخطط الاستراتيجي الذكي
        </h3>
        <p className="text-sm text-blue-800 mb-4">اكتب أهدافك المستقبلية أو التحديات التي تواجهها، وسيقوم المساعد الذكي باقتراح خطة عمل مفصلة.</p>
        <div className="flex gap-2">
          <input 
            className="flex-1 px-4 py-3 bg-white border border-blue-200 rounded-xl text-sm outline-none"
            placeholder="مثال: كيف يمكننا التوسع في سوق الخدمات اللوجستية خلال 6 أشهر؟"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
          />
          <button 
            onClick={handlePlan}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center gap-2"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            توليد الخطة
          </button>
        </div>
      </div>
      {response && (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm animate-in fade-in">
          <p className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed">{response}</p>
        </div>
      )}
    </div>
  );
};

export default Planning;
