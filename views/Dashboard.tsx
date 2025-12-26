
import React, { useState, useMemo, useEffect } from 'react';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  Clock, 
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  AlertCircle,
  Calendar,
  DollarSign,
  BarChart3,
  Github,
  Cloud,
  Layers,
  Zap,
  ChevronRight,
  Plus,
  Send,
  ShieldCheck,
  Bot,
  Settings2,
  X,
  Eye,
  EyeOff,
  RotateCcw,
  Save,
  LayoutTemplate,
  Target,
  Search,
  PieChart,
  Maximize2,
  Minimize2,
  Sparkles,
  RefreshCw,
  Paintbrush,
  ArrowUp,
  ArrowDown,
  GripVertical,
  Bookmark,
  Trash2,
  Layout,
  Activity,
  ArrowRight,
  // Added missing icons
  Briefcase,
  Receipt,
  ArrowLeft
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart as RePieChart,
  Cell,
  Pie
} from 'recharts';
import { useNavigate } from 'react-router-dom';

// --- البيانات الافتراضية ---
const revenueData = [
  { name: 'يناير', revenue: 40000, costs: 25000 },
  { name: 'فبراير', revenue: 45000, costs: 28000 },
  { name: 'مارس', revenue: 38000, costs: 30000 },
  { name: 'أبريل', revenue: 52000, costs: 31000 },
  { name: 'مايو', revenue: 48000, costs: 35000 },
  { name: 'يونيو', revenue: 60000, costs: 38000 },
];

const profitData = [
  { name: 'التوصيل الذكي', profit: 42000, status: 'ربح' },
  { name: 'متجر الرياض', profit: 15000, status: 'ربح' },
  { name: 'المستودعات', profit: -12000, status: 'خسارة' },
  { name: 'بوابة الدفع', profit: 28000, status: 'ربح' },
];

const initialTeamData = [
  { id: 'dept-1', name: 'تطوير البرمجيات', score: 92 },
  { id: 'dept-2', name: 'التصميم وتجربة المستخدم', score: 85 },
  { id: 'dept-3', name: 'الاستشارات التقنية', score: 78 },
  { id: 'dept-4', name: 'المبيعات والتسويق', score: 88 },
];

const customerSegmentData = [
  { name: 'شركات حكومية', value: 45 },
  { name: 'شركات ناشئة', value: 30 },
  { name: 'مؤسسات متوسطة', value: 25 },
];

const COLORS = ['#2563eb', '#6366f1', '#8b5cf6', '#ec4899'];

const StatCard = ({ title, value, icon: Icon, color, trend, trendValue, index = 0 }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="glass-card rounded-[2.5rem] p-8 group overflow-hidden relative border border-white bg-white/80"
  >
    <div className="flex justify-between items-start mb-6">
      <div className={`p-4 rounded-2xl bg-${color}-50 text-${color}-600 group-hover:bg-${color}-600 group-hover:text-white transition-all duration-500 shadow-sm`}>
        <Icon size={24} />
      </div>
      <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-black ${trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
        {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {trendValue}%
      </div>
    </div>
    
    <div className="relative z-10">
      <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1.5">{title}</p>
      <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{value}</h3>
    </div>

    {/* Subtle Decorative Gradient */}
    <div className={`absolute -bottom-10 -left-10 w-32 h-32 bg-${color}-500/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000`}></div>
  </motion.div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [isCustomizing, setIsCustomizing] = useState(false);
  
  const widgetLabels: Record<string, { label: string, icon: any, desc: string, cat: string }> = {
    summary: { label: 'مؤشرات الأداء المالي', icon: TrendingUp, desc: 'الأرباح، التكاليف، وكفاءة الإنجاز.', cat: 'بيانات رئيسية' },
    actions: { label: 'مركز الإجراءات السريعة', icon: Zap, desc: 'أزرار الاختصار للوظائف الحيوية.', cat: 'أدوات' },
    revenue_chart: { label: 'مخطط الإيرادات والمصروفات', icon: BarChart3, desc: 'تحليل التدفق النقدي الشهري.', cat: 'تحليل بصري' },
    team_efficiency: { label: 'كفاءة الفرق التقنية', icon: Target, desc: 'معدل إنجاز المهام للفرق التقنية.', cat: 'عمليات' },
    interventions: { label: 'تنبيهات التدخل المالي', icon: AlertCircle, desc: 'المشاريع المتعثرة والميزانيات الحرجة.', cat: 'عمليات' },
    segments: { label: 'توزيع قطاعات العملاء (AI)', icon: PieChart, desc: 'تحليل حصة السوق حسب نوع العميل.', cat: 'تقنية' }
  };

  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem('tech_erp_dashboard_v4');
    return saved ? JSON.parse(saved) : {
      summary: true,
      actions: true,
      revenue_chart: true,
      team_efficiency: true,
      interventions: true,
      segments: true,
      order: Object.keys(widgetLabels)
    };
  });

  const saveConfig = (newConfig: any) => {
    setConfig(newConfig);
    localStorage.setItem('tech_erp_dashboard_v4', JSON.stringify(newConfig));
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
           <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-blue-500/20 animate-soft-float">
             <Layout size={30} />
           </div>
           <div>
             <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-tight mb-1">الرؤية الاستراتيجية</h2>
             <p className="text-slate-500 font-bold text-sm">أهلاً بك مجدداً، إليك ملخص لأداء شركتك التقنية اليوم.</p>
           </div>
        </div>
        <div className="flex items-center gap-3">
           <button 
             onClick={() => setIsCustomizing(true)}
             className="px-6 py-3.5 rounded-2xl text-xs font-black shadow-lg bg-white border border-slate-100 text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2 active:scale-95"
           >
             <Settings2 size={18} /> تخصيص العرض
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-10">
        {config.order.map((id: string, idx: number) => {
          if (!config[id]) return null;

          if (id === 'summary') return (
            <div key={id} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <StatCard index={0} title="صافي الأرباح" value="124,500 ر.س" icon={TrendingUp} color="blue" trend="up" trendValue="15.2" />
              <StatCard index={1} title="المشاريع النشطة" value="12 مشروع" icon={Briefcase} color="emerald" trend="up" trendValue="5.4" />
              <StatCard index={2} title="تكاليف السحابة" value="4,850 ر.س" icon={Cloud} color="indigo" trend="down" trendValue="2.1" />
              <StatCard index={3} title="كفاءة التشغيل" value="91.2%" icon={Zap} color="orange" trend="up" trendValue="3.8" />
            </div>
          );

          if (id === 'actions') return (
            <div key={id} className="bg-slate-900 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group p-12">
              <div className="absolute top-0 right-0 p-12 opacity-[0.04] group-hover:scale-110 transition-all duration-1000"><Zap size={320} /></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                     <Activity size={24} />
                  </div>
                  <h3 className="text-3xl font-black tracking-tight">مركز العمليات التنفيذية</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-8">
                   {[
                     { label: 'عرض سعر جديد', icon: FileText, to: '/customers', color: 'blue', desc: 'توليد عرض ذكي' },
                     { label: 'إصدار فاتورة', icon: Receipt, to: '/finance', color: 'emerald', desc: 'تحصيل دفعات' },
                     { label: 'إضافة مهمة تقنية', icon: Plus, to: '/todo', color: 'indigo', desc: 'توزيع العمل' },
                     { label: 'تحليل مالي AI', icon: Bot, to: '/ai-assistant', color: 'rose', desc: 'رؤى استراتيجية' },
                   ].map((action, i) => (
                     <button key={i} onClick={() => navigate(action.to)} className="bg-white/5 border border-white/10 rounded-[2.5rem] hover:bg-white/10 transition-all p-8 text-right group/btn active:scale-95">
                        <div className={`w-14 h-14 bg-${action.color}-500/20 text-${action.color}-400 rounded-2xl flex items-center justify-center mb-6 group-hover/btn:scale-110 transition-transform`}>
                          <action.icon size={26} />
                        </div>
                        <h4 className="text-base font-black mb-1">{action.label}</h4>
                        <p className="text-xs text-slate-500 font-bold">{action.desc}</p>
                     </button>
                   ))}
                </div>
              </div>
            </div>
          );

          if (id === 'revenue_chart') return (
            <div key={id} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                  <div className="flex justify-between items-center mb-12">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">التدفقات النقدية السنوية</h3>
                      <p className="text-xs font-bold text-slate-400 mt-1">مقارنة الإيرادات مقابل التكاليف التشغيلية</p>
                    </div>
                    <div className="flex gap-4 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="flex items-center gap-2 text-xs font-black text-blue-600"><div className="w-2 h-2 rounded-full bg-blue-600"></div> إيرادات</span>
                      <span className="flex items-center gap-2 text-xs font-black text-rose-500"><div className="w-2 h-2 rounded-full bg-rose-500"></div> تكاليف</span>
                    </div>
                  </div>
                  <div className="h-[360px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={revenueData}>
                        <defs>
                          <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/><stop offset="95%" stopColor="#2563eb" stopOpacity={0}/></linearGradient>
                          <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/><stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/></linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 'bold'}} dy={15} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dx={-10} />
                        <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)' }} />
                        <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                        <Area type="monotone" dataKey="costs" stroke="#f43f5e" strokeWidth={4} fillOpacity={1} fill="url(#colorCost)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
              </div>

              <div className="space-y-10">
                <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm h-full flex flex-col justify-between">
                   <h3 className="text-sm font-black text-slate-900 mb-8 flex items-center gap-3 uppercase tracking-widest"><Target size={20} className="text-indigo-600"/> كفاءة الفريق التقني</h3>
                   <div className="space-y-8">
                      {initialTeamData.map((team, i) => (
                        <div key={i} className="space-y-3">
                           <div className="flex justify-between text-xs font-black text-slate-700">
                              <span>{team.name}</span>
                              <span className="text-blue-600">{team.score}%</span>
                           </div>
                           <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 shadow-inner">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${team.score}%` }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="h-full bg-gradient-to-l from-blue-600 to-indigo-500 rounded-full shadow-sm"
                              />
                           </div>
                        </div>
                      ))}
                   </div>
                   <button className="mt-8 text-xs font-black text-blue-600 flex items-center gap-1 hover:gap-3 transition-all">تحليل الإنتاجية الكامل <ArrowLeft size={16} className="rotate-180" /></button>
                </div>
              </div>
            </div>
          );

          if (id === 'interventions' || id === 'segments') return (
            <div key={id} className="grid grid-cols-1 md:grid-cols-2 gap-10">
               <div className="bg-rose-50 border border-rose-100 p-10 rounded-[3rem] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12"><AlertCircle size={140} /></div>
                  <div className="flex items-center gap-4 text-rose-600 mb-8 relative z-10">
                    <AlertCircle size={28} className="animate-pulse" />
                    <h3 className="font-black text-lg tracking-tight">تنبيهات التدخل المالي</h3>
                  </div>
                  <div className="bg-white p-8 rounded-[2.5rem] border border-rose-100 shadow-xl shadow-rose-900/5 relative z-10">
                     <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-base font-black text-slate-900">نظام المستودعات الذكي</p>
                          <p className="text-xs text-slate-500 font-bold mt-1">تجاوز ميزانية السحابة (AWS)</p>
                        </div>
                        <span className="text-sm font-black text-rose-600 bg-rose-50 px-3 py-1 rounded-xl">-12,400 ر.س</span>
                     </div>
                     <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-6">
                        <div className="h-full bg-rose-500" style={{ width: '100%' }}></div>
                     </div>
                     <button className="w-full py-4 bg-slate-900 text-white rounded-2xl text-xs font-black hover:bg-slate-800 transition-all">إعادة جدولة الموارد</button>
                  </div>
               </div>

               <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden">
                  <h3 className="text-sm font-black text-slate-900 mb-8 flex items-center gap-3 uppercase tracking-widest"><Sparkles size={20} className="text-blue-600"/> الحصة السوقية (AI Analytics)</h3>
                  <div className="h-[260px] relative">
                     <ResponsiveContainer width="100%" height="100%">
                        <RePieChart>
                           <Pie data={customerSegmentData} innerRadius={80} outerRadius={110} paddingAngle={8} dataKey="value" stroke="none">
                              {customerSegmentData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                           </Pie>
                           <Tooltip />
                        </RePieChart>
                     </ResponsiveContainer>
                     <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-4">
                        <span className="text-3xl font-black text-slate-900 tracking-tighter">100%</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">إجمالي العملاء</span>
                     </div>
                  </div>
               </div>
            </div>
          );

          return null;
        })}
      </div>

      <AnimatePresence>
        {isCustomizing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex justify-end"
          >
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setIsCustomizing(false)} />
            <motion.div 
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              className="relative w-full max-w-md bg-white h-full shadow-2xl border-l flex flex-col p-10"
            >
                <div className="flex items-center justify-between mb-12">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tighter">تخصيص لوحة القيادة</h3>
                    <button onClick={() => setIsCustomizing(false)} className="p-3 bg-slate-100 rounded-2xl text-slate-400 hover:text-rose-500 transition-all"><X size={24}/></button>
                </div>
                
                <div className="space-y-6 overflow-y-auto no-scrollbar pb-10 flex-1">
                    {config.order.map((id: string) => (
                        <div key={id} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-white transition-all">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white rounded-2xl shadow-sm text-blue-600 border border-slate-100">
                                    {React.createElement(widgetLabels[id].icon, { size: 20 })}
                                </div>
                                <div>
                                  <span className="text-sm font-black text-slate-800 block">{widgetLabels[id].label}</span>
                                  <span className="text-[10px] text-slate-400 font-bold">{widgetLabels[id].cat}</span>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={config[id]} onChange={() => saveConfig({ ...config, [id]: !config[id] })} className="sr-only peer" />
                                <div className="w-12 h-7 bg-slate-200 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:after:-translate-x-5 shadow-inner"></div>
                            </label>
                        </div>
                    ))}
                </div>
                
                <button onClick={() => setIsCustomizing(false)} className="mt-8 w-full py-5 bg-slate-900 text-white rounded-3xl font-black shadow-xl hover:bg-slate-800 transition-all">حفظ التغييرات</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
