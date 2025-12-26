
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
  Layout
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

// --- المكونات الفرعية ---

const StatCard = ({ title, value, icon: Icon, color, trend, trendValue, compact, index = 0 }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    className={`bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group ${compact ? 'p-4' : 'p-6'}`}
  >
    <div className="flex justify-between items-start mb-4">
      <motion.div 
        whileHover={{ scale: 1.15, rotate: 5 }}
        className={`p-2.5 rounded-xl bg-${color}-50 text-${color}-600 shadow-inner transition-colors duration-300 group-hover:bg-${color}-100`}
      >
        <Icon size={compact ? 20 : 24} />
      </motion.div>
      <div className={`flex items-center gap-1 text-[10px] font-black ${trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
        {trendValue}%
        {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
      </div>
    </div>
    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">{title}</p>
    <motion.h3 
      key={value}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`${compact ? 'text-lg' : 'text-2xl'} font-black text-slate-800 tracking-tighter`}
    >
      {value}
    </motion.h3>
  </motion.div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [isCustomizing, setIsCustomizing] = useState(false);
  
  const widgetLabels: Record<string, { label: string, icon: any, desc: string, cat: string }> = {
    summary: { label: 'مؤشرات الأداء المالي', icon: TrendingUp, desc: 'الأرباح، التكاليف، وكفاءة الإنجاز.', cat: 'بيانات رئيسية' },
    actions: { label: 'مركز الإجراءات السريعة', icon: Zap, desc: 'أزرار الاختصار للوظائف الحيوية.', cat: 'أدوات' },
    revenue_chart: { label: 'مخطط الإيرادات والمصروفات', icon: BarChart3, desc: 'تحليل التدفق النقدي الشهري.', cat: 'تحليل بصري' },
    profit_chart: { label: 'ربحية المشاريع النشطة', icon: DollarSign, desc: 'تحليل الربح والخسارة لكل مشروع.', cat: 'تحليل بصري' },
    team_efficiency: { label: 'كفاءة الفرق التقنية', icon: Target, desc: 'معدل إنجاز المهام للفرق التقنية.', cat: 'عمليات' },
    interventions: { label: 'تنبيهات التدخل المالي', icon: AlertCircle, desc: 'المشاريع المتعثرة والميزانيات الحرجة.', cat: 'عمليات' },
    integrations: { label: 'حالة التكامل السحابي (API)', icon: Layers, desc: 'مراقبة GitHub و AWS و Stripe.', cat: 'تقنية' },
    segments: { label: 'توزيع قطاعات العملاء (AI)', icon: PieChart, desc: 'تحليل حصة السوق حسب نوع العميل.', cat: 'تقنية' }
  };

  const defaultLayout = {
    summary: true,
    actions: true,
    revenue_chart: true,
    profit_chart: true,
    team_efficiency: true,
    interventions: true,
    integrations: true,
    segments: true,
    isCompact: false,
    order: Object.keys(widgetLabels)
  };

  const [config, setConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('tech_erp_dashboard_ordered_v3');
      return saved ? JSON.parse(saved) : defaultLayout;
    } catch {
      return defaultLayout;
    }
  });

  const [userPresets, setUserPresets] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('tech_erp_dashboard_presets');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const saveConfig = (newConfig: any) => {
    setConfig(newConfig);
    localStorage.setItem('tech_erp_dashboard_ordered_v3', JSON.stringify(newConfig));
  };

  const handleSavePreset = () => {
    const name = prompt('أدخل اسماً لهذا التخطيط الشخصي:');
    if (!name) return;
    const newPreset = { id: Date.now().toString(), name, layout: config };
    const updated = [...userPresets, newPreset];
    setUserPresets(updated);
    localStorage.setItem('tech_erp_dashboard_presets', JSON.stringify(updated));
  };

  const applyPreset = (layout: any) => {
    saveConfig(layout);
  };

  const deletePreset = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = userPresets.filter(p => p.id !== id);
    setUserPresets(updated);
    localStorage.setItem('tech_erp_dashboard_presets', JSON.stringify(updated));
  };

  const toggleWidget = (id: string) => {
    saveConfig({ ...config, [id]: !config[id] });
  };

  const moveWidget = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...config.order];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;
    
    [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];
    saveConfig({ ...config, order: newOrder });
  };

  const filteredTeamData = useMemo(() => {
    const hiddenDeptsRaw = localStorage.getItem('org_hidden_departments');
    const hiddenDepts: string[] = hiddenDeptsRaw ? JSON.parse(hiddenDeptsRaw) : [];
    return initialTeamData.filter(team => !hiddenDepts.includes(team.id));
  }, []);

  // --- دوال الرندر لكل Block ---
  const renderWidget = (id: string) => {
    if (!config[id]) return null;

    switch (id) {
      case 'summary':
        return (
          <div key={id} className={`grid gap-8 ${config.isCompact ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'}`}>
            <StatCard index={0} title="صافي الأرباح" value="124,500 ر.س" icon={TrendingUp} color="blue" trend="up" trendValue="15.2" compact={config.isCompact} />
            <StatCard index={1} title="متوسط ربحية المشروع" value="31,200 ر.س" icon={DollarSign} color="emerald" trend="up" trendValue="5.4" compact={config.isCompact} />
            <StatCard index={2} title="تكاليف السحابة" value="4,850 ر.س" icon={Cloud} color="indigo" trend="down" trendValue="2.1" compact={config.isCompact} />
            <StatCard index={3} title="كفاءة الإنجاز" value="88.5%" icon={Zap} color="orange" trend="up" trendValue="3.8" compact={config.isCompact} />
          </div>
        );
      case 'actions':
        return (
          <div key={id} className={`bg-slate-900 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group animate-in zoom-in-95 duration-500 ${config.isCompact ? 'p-6' : 'p-10'}`}>
            <div className="absolute top-0 right-0 p-8 opacity-10"><Zap size={140} /></div>
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-8 flex items-center gap-3">
                 <ShieldCheck size={28} className="text-blue-400" /> مركز الإجراءات التنفيذية
              </h3>
              <div className={`grid gap-4 ${config.isCompact ? 'grid-cols-4 md:grid-cols-8' : 'grid-cols-2 md:grid-cols-4'}`}>
                 {[
                   { label: 'عرض سعر', icon: FileText, to: '/customers', color: 'bg-blue-500' },
                   { label: 'إصدار فاتورة', icon: DollarSign, to: '/finance', color: 'bg-emerald-500' },
                   { label: 'مهمة تقنية', icon: Plus, to: '/todo', color: 'bg-indigo-500' },
                   { label: 'تحليل AI', icon: Bot, to: '/ai-assistant', color: 'bg-rose-500' },
                 ].map((action, i) => (
                   <button key={i} onClick={() => navigate(action.to)} className={`bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all flex items-center gap-3 group/btn ${config.isCompact ? 'p-3 flex-col text-center' : 'p-5'}`}>
                      <div className={`p-2.5 rounded-xl ${action.color} group-hover/btn:scale-110 transition-transform`}><action.icon size={20} /></div>
                      <span className="text-xs font-bold">{action.label}</span>
                   </button>
                 ))}
              </div>
            </div>
          </div>
        );
      case 'revenue_chart':
        return (
          <div key={id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-black text-slate-800 flex items-center gap-3">
                  <BarChart3 size={24} className="text-blue-600" /> الإيرادات والمصروفات
                </h3>
                <div className="flex gap-4 text-[10px] font-black uppercase tracking-widest">
                  <span className="flex items-center gap-1.5 text-blue-600"><div className="w-2 h-2 rounded-full bg-blue-600"></div> دخل</span>
                  <span className="flex items-center gap-1.5 text-rose-500"><div className="w-2 h-2 rounded-full bg-rose-500"></div> مصروفات</span>
                </div>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/><stop offset="95%" stopColor="#2563eb" stopOpacity={0}/></linearGradient>
                      <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/><stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/></linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 'bold'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <Tooltip />
                    <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                    <Area type="monotone" dataKey="costs" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorCost)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
          </div>
        );
      case 'profit_chart':
        return (
          <div key={id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-sm font-black text-slate-800 mb-8 border-r-4 border-blue-500 pr-4 uppercase tracking-tighter">ربحية المشاريع النشطة</h3>
            <div className="h-[250px]">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={profitData} layout="vertical">
                     <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                     <XAxis type="number" hide />
                     <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 'bold'}} width={80} />
                     <Tooltip />
                     <Bar dataKey="profit" radius={[0, 4, 4, 0]}>
                        {profitData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.profit > 0 ? '#10b981' : '#f43f5e'} />)}
                     </Bar>
                  </BarChart>
               </ResponsiveContainer>
            </div>
          </div>
        );
      case 'team_efficiency':
        return (
          <div key={id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-sm font-black text-slate-800 mb-8 border-r-4 border-indigo-500 pr-4 uppercase tracking-tighter">كفاءة الفرق التقنية</h3>
            <div className="space-y-6">
               {filteredTeamData.length > 0 ? filteredTeamData.map((team, i) => (
                  <div key={i} className="space-y-2">
                     <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-slate-500">
                        <span>{team.name}</span>
                        <span className="text-blue-600">{team.score}%</span>
                     </div>
                     <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden shadow-inner">
                        <div className="h-full bg-blue-600 transition-all duration-1000 shadow-sm" style={{ width: `${team.score}%` }}></div>
                     </div>
                  </div>
               )) : <p className="text-xs text-slate-400 font-bold italic text-center">لا توجد أقسام للعرض.</p>}
            </div>
          </div>
        );
      case 'interventions':
        return (
          <div key={id} className="bg-rose-50 border border-rose-100 p-8 rounded-[2.5rem] relative overflow-hidden group animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 group-hover:scale-110 transition-transform"><AlertCircle size={80} /></div>
            <div className="flex items-center gap-3 text-rose-600 mb-6">
              <AlertCircle size={24} className="animate-pulse" />
              <h3 className="font-black text-sm uppercase tracking-widest">تنبيهات التدخل المالي</h3>
            </div>
            <div className="p-5 bg-white rounded-2xl border border-rose-100 shadow-sm">
               <div className="flex justify-between items-start mb-2">
                  <p className="text-xs font-black text-slate-800">نظام المستودعات</p>
                  <span className="text-[10px] font-black text-rose-600">-12,000 ر.س</span>
               </div>
               <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500" style={{ width: '100%' }}></div>
               </div>
            </div>
          </div>
        );
      case 'integrations':
        return (
          <div key={id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm animate-in fade-in slide-in-from-left-4 duration-500">
            <h3 className="text-sm font-black text-slate-800 mb-8 flex items-center gap-3">
              <Layers size={22} className="text-indigo-600" /> الحالة السحابية (API)
            </h3>
            <div className="space-y-4">
              {[
                { name: 'GitHub Enterprise', icon: Github, color: 'text-slate-800' },
                { name: 'AWS Production', icon: Cloud, color: 'text-amber-500' }
              ].map((int, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group">
                   <div className="flex items-center gap-4">
                     <div className={`p-2.5 bg-white rounded-xl shadow-sm ${int.color}`}><int.icon size={18} /></div>
                     <span className="text-xs font-bold text-slate-700">{int.name}</span>
                   </div>
                   <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'segments':
        return (
          <div key={id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm animate-in fade-in slide-in-from-left-4 duration-500">
            <h3 className="text-sm font-black text-slate-800 mb-8 flex items-center gap-3 uppercase tracking-tighter">الحصة السوقية (AI)</h3>
            <div className="h-[200px]">
               <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                     <Pie data={customerSegmentData} innerRadius={60} outerRadius={85} paddingAngle={8} dataKey="value">
                        {customerSegmentData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                     </Pie>
                     <Tooltip />
                  </RePieChart>
               </ResponsiveContainer>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className={`space-y-8 animate-in fade-in duration-500 pb-12 relative ${config.isCompact ? 'max-w-[1600px] mx-auto' : ''}`}>
      
      {/* Drawer: Customization & Reordering */}
      <AnimatePresence>
        {isCustomizing && (
          <div className="fixed inset-0 z-[100] flex justify-start">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsCustomizing(false)} />
            <motion.div initial={{ x: 300 }} animate={{ x: 0 }} exit={{ x: 300 }} className="relative w-full max-w-md bg-white h-full shadow-2xl border-l flex flex-col" dir="rtl">
              <div className="p-8 border-b flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white"><Settings2 size={24} /></div>
                   <div><h3 className="text-xl font-black text-slate-800">تخصيص وترتيب اللوحة</h3><p className="text-xs text-slate-500 font-medium">اسحب العناصر أو استخدم الأسهم</p></div>
                </div>
                <button onClick={() => setIsCustomizing(false)} className="p-2 text-slate-400 hover:text-rose-500"><X size={24} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
                 {/* Presets Section */}
                 <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <LayoutTemplate size={14} /> التخطيطات المحفوظة
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                       <button 
                        onClick={() => saveConfig(defaultLayout)}
                        className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-blue-500 transition-all text-right"
                       >
                          <div className="flex items-center gap-3">
                             <RotateCcw size={16} className="text-slate-400" />
                             <span className="text-xs font-bold text-slate-700">التخطيط الافتراضي</span>
                          </div>
                          <span className="text-[9px] font-black text-slate-300 uppercase">System</span>
                       </button>
                       
                       {userPresets.map(preset => (
                         <button 
                          key={preset.id}
                          onClick={() => applyPreset(preset.layout)}
                          className="flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-2xl hover:border-blue-500 transition-all text-right group"
                         >
                            <div className="flex items-center gap-3">
                               <Bookmark size={16} className="text-blue-500" />
                               <span className="text-xs font-bold text-blue-900">{preset.name}</span>
                            </div>
                            <button 
                              onClick={(e) => deletePreset(preset.id, e)}
                              className="p-1 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                            >
                               <Trash2 size={14} />
                            </button>
                         </button>
                       ))}

                       <button 
                        onClick={handleSavePreset}
                        className="w-full py-3 border-2 border-dashed border-blue-200 text-blue-600 rounded-2xl text-[10px] font-black uppercase hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                       >
                          <Plus size={14} /> حفظ التخطيط الحالي كقالب
                       </button>
                    </div>
                 </div>

                 <div className="h-px bg-slate-100"></div>

                 {/* Widgets Selection */}
                 <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <Layers size={14} /> التحكم في العناصر
                    </h4>
                    <div className="space-y-3">
                       {config.order.map((id: string, index: number) => {
                         const info = widgetLabels[id];
                         return (
                           <div key={id} className={`p-4 rounded-2xl border flex items-center gap-4 transition-all ${config[id] ? 'bg-white border-blue-200 shadow-sm' : 'bg-slate-50 opacity-60'}`}>
                              <div className={`p-2 rounded-xl transition-colors ${config[id] ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-400'}`}><info.icon size={18} /></div>
                              <div className="flex-1 text-right">
                                 <p className="text-sm font-black text-slate-800 leading-none">{info.label}</p>
                                 <p className="text-[9px] text-slate-400 mt-1 font-bold">{info.cat}</p>
                              </div>
                              <div className="flex flex-col gap-1">
                                 <button onClick={() => moveWidget(index, 'up')} className="p-1 hover:bg-slate-100 rounded disabled:opacity-20 text-slate-400" disabled={index === 0}><ArrowUp size={14}/></button>
                                 <button onClick={() => moveWidget(index, 'down')} className="p-1 hover:bg-slate-100 rounded disabled:opacity-20 text-slate-400" disabled={index === config.order.length - 1}><ArrowDown size={14}/></button>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer mr-2">
                                 <input type="checkbox" checked={config[id]} onChange={() => toggleWidget(id)} className="sr-only peer" />
                                 <div className="w-10 h-5 bg-slate-200 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:-translate-x-5 shadow-inner"></div>
                              </label>
                           </div>
                         );
                       })}
                    </div>
                 </div>
              </div>
              <div className="p-8 border-t bg-slate-50 flex gap-3">
                 <button onClick={() => setIsCustomizing(false)} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2"><Save size={16} /> إغلاق وحفظ</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm border border-blue-100">
             <Layout size={24} />
           </div>
           <div>
             <h2 className={`font-black text-slate-800 tracking-tighter ${config.isCompact ? 'text-2xl' : 'text-3xl'}`}>ذكاء الأعمال والتحليلات</h2>
             <p className="text-slate-500 font-medium">لوحة معلومات مخصصة حسب تفضيلاتك الإدارية.</p>
           </div>
        </div>
        <div className="flex items-center gap-2">
           <div className="flex bg-slate-100 p-1 rounded-xl mr-2">
              <button 
                onClick={() => saveConfig({...config, isCompact: false})}
                className={`p-2 rounded-lg transition-all ${!config.isCompact ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
                title="عرض واسع"
              ><Maximize2 size={16} /></button>
              <button 
                onClick={() => saveConfig({...config, isCompact: true})}
                className={`p-2 rounded-lg transition-all ${config.isCompact ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
                title="عرض مدمج"
              ><Minimize2 size={16} /></button>
           </div>
           <button onClick={() => setIsCustomizing(true)} className="px-5 py-2.5 rounded-xl text-xs font-black shadow-lg bg-blue-600 text-white hover:bg-blue-700 transition-all flex items-center gap-2 active:scale-95">
             <Settings2 size={16} /> تخصيص وترتيب اللوحة
           </button>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {config.order.map((id: string) => (
          <div key={id} className="relative group">
             {isCustomizing && (
               <div className="absolute -top-4 left-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="px-3 py-1 bg-slate-800 text-white rounded-full text-[10px] font-black flex items-center gap-2 shadow-xl border border-slate-700"><GripVertical size={12}/> {widgetLabels[id].label}</span>
               </div>
             )}
             {renderWidget(id)}
          </div>
        ))}
      </div>

      {config.order.filter((id: string) => config[id]).length === 0 && (
        <div className="py-32 text-center bg-white rounded-[3rem] border border-slate-100 shadow-inner">
           <EyeOff size={48} className="text-blue-200 mx-auto mb-6" />
           <h4 className="text-xl font-black text-slate-800 mb-2 tracking-tight">لوحة معلومات فارغة</h4>
           <p className="text-slate-400 text-sm font-medium mb-8">لم يتم تفعيل أي عناصر للعرض حالياً.</p>
           <button onClick={() => setIsCustomizing(true)} className="px-12 py-4 bg-blue-600 text-white rounded-3xl font-black text-sm shadow-xl hover:bg-blue-700 active:scale-95 transition-all">تخصيص اللوحة الآن</button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
