
import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Building, 
  History, 
  Users, 
  Plus, 
  Search, 
  ShieldCheck, 
  Lock, 
  Check, 
  X,
  Building2,
  GitBranch,
  ShieldAlert,
  Settings,
  Layers,
  Github,
  Cloud,
  CreditCard,
  MessageSquare,
  ExternalLink,
  RefreshCw,
  Trello,
  Loader2,
  Link as LinkIcon,
  Trash2,
  Edit3,
  MapPin,
  Save,
  Briefcase,
  DollarSign,
  UserCog,
  TrendingUp,
  User,
  PieChart,
  BarChart3,
  ArrowUpRight,
  TrendingDown,
  AlertCircle,
  Eye,
  EyeOff,
  Settings2,
  LayoutDashboard,
  Key,
  Globe
} from 'lucide-react';

type Tab = 'departments' | 'roles' | 'subsidiaries' | 'integrations' | 'audit';

interface Subsidiary {
  id: string;
  name: string;
  location: string;
  taxId: string;
  status: 'رئيسي' | 'تابعة';
}

const departmentsList = [
  { id: 'dept-1', name: 'تطوير البرمجيات', head: 'م. أحمد علي', staff: 12, budget: 350000, actualSpending: 312000, color: 'blue' },
  { id: 'dept-2', name: 'التصميم وتجربة المستخدم', head: 'ليلى منصور', staff: 5, budget: 120000, actualSpending: 125000, color: 'indigo' },
  { id: 'dept-3', name: 'الاستشارات التقنية', head: 'د. خالد سعيد', staff: 4, budget: 200000, actualSpending: 145000, color: 'emerald' },
  { id: 'dept-4', name: 'المبيعات والتسويق', head: 'سارة جاسم', staff: 3, budget: 150000, actualSpending: 110000, color: 'orange' },
];

const Organization = () => {
  const [activeTab, setActiveTab] = useState<Tab>('departments');

  const tabs = [
    { id: 'departments', label: 'الأقسام والميزانيات', icon: GitBranch },
    { id: 'roles', label: 'الأدوار والصلاحيات', icon: ShieldCheck },
    { id: 'integrations', label: 'التكاملات التقنية', icon: Layers },
    { id: 'subsidiaries', label: 'الشركات التابعة', icon: Building2 },
    { id: 'audit', label: 'سجل العمليات', icon: History },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'departments': return <DepartmentsTab />;
      case 'roles': return <RolesTab />;
      case 'subsidiaries': return <SubsidiariesTab />;
      case 'integrations': return <IntegrationsTab />;
      case 'audit': return <AuditTab />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tighter">إدارة الهيكل التنظيمي</h2>
          <p className="text-slate-500 text-sm font-medium">تحكم في الأقسام، الصلاحيات، والتكاملات مع الأنظمة الخارجية.</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[600px]">
        <div className="flex border-b border-slate-100 overflow-x-auto no-scrollbar bg-slate-50/50">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex items-center gap-2 px-8 py-5 text-sm font-black whitespace-nowrap transition-all border-b-4 ${
                activeTab === tab.id 
                  ? 'border-blue-600 text-blue-600 bg-white shadow-[0_4px_20px_-10px_rgba(37,99,235,0.2)]' 
                  : 'border-transparent text-slate-400 hover:text-slate-700 hover:bg-white/50'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

const DepartmentsTab = () => {
  const [hiddenDepts, setHiddenDepts] = useState<string[]>(() => {
    const saved = localStorage.getItem('org_hidden_departments');
    return saved ? JSON.parse(saved) : [];
  });

  const [isConfiguring, setIsConfiguring] = useState(false);

  const toggleDeptVisibility = (id: string) => {
    const newHidden = hiddenDepts.includes(id) 
      ? hiddenDepts.filter(item => item !== id)
      : [...hiddenDepts, id];
    
    setHiddenDepts(newHidden);
    localStorage.setItem('org_hidden_departments', JSON.stringify(newHidden));
  };

  const totalBudget = departmentsList.reduce((acc, d) => acc + d.budget, 0);
  const totalActual = departmentsList.reduce((acc, d) => acc + d.actualSpending, 0);
  const totalStaff = departmentsList.reduce((acc, d) => acc + d.staff, 0);

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-400">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-1">
          <div className="space-y-1">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">الميزانية السنوية</p>
            <h3 className="text-xl font-black text-slate-800">{totalBudget.toLocaleString()} <span className="text-xs font-bold text-slate-400">ر.س</span></h3>
          </div>
          <div className="space-y-1 border-r border-slate-200 pr-8">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">الإنفاق الفعلي</p>
            <h3 className={`text-xl font-black ${totalActual > totalBudget ? 'text-rose-600' : 'text-blue-600'}`}>{totalActual.toLocaleString()} <span className="text-xs font-bold text-slate-400">ر.س</span></h3>
          </div>
          <div className="space-y-1 border-r border-slate-200 pr-8">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">إجمالي الموظفين</p>
            <h3 className="text-xl font-black text-slate-800">{totalStaff} <span className="text-xs font-bold text-slate-400">موظف</span></h3>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsConfiguring(!isConfiguring)}
            className={`px-6 py-3 rounded-2xl text-xs font-black transition-all flex items-center gap-2 ${
              isConfiguring ? 'bg-slate-800 text-white shadow-xl' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <LayoutDashboard size={18} /> تخصيص الظهور في Dashboard
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl text-sm font-black shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">
            <Plus size={20} /> إضافة قسم
          </button>
        </div>
      </div>

      {isConfiguring && (
        <div className="bg-blue-600 p-8 rounded-[2.5rem] shadow-2xl shadow-blue-100 text-white animate-in zoom-in-95 duration-300 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-10"><LayoutDashboard size={120} /></div>
           <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-lg font-black flex items-center gap-3"><Eye size={22} /> التحكم في ظهور الأقسام</h4>
                  <p className="text-xs text-blue-100 mt-1 font-medium">سيتم إخفاء الأقسام غير المحددة من لوحة التحكم الرئيسية والتقارير المالية والتشغيلية فوراً.</p>
                </div>
                <button onClick={() => { setHiddenDepts([]); localStorage.setItem('org_hidden_departments', '[]'); }} className="text-[10px] font-black bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl border border-white/10">إظهار كافة الأقسام</button>
              </div>
              <div className="flex flex-wrap gap-3">
                  {departmentsList.map(d => (
                    <button 
                      key={d.id}
                      onClick={() => toggleDeptVisibility(d.id)}
                      className={`flex items-center gap-3 px-5 py-3 rounded-2xl text-xs font-black transition-all border ${
                        !hiddenDepts.includes(d.id) 
                          ? 'bg-white text-blue-700 shadow-lg border-white' 
                          : 'bg-blue-700 border-blue-500 text-blue-200'
                      }`}
                    >
                      {!hiddenDepts.includes(d.id) ? <Check size={16} className="text-emerald-500" /> : <X size={16} />}
                      {d.name}
                    </button>
                  ))}
              </div>
              <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-100">
                <RefreshCw size={12} className="animate-spin-slow" /> يتم المزامنة حياً مع localStorage
              </div>
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {departmentsList.map((dept) => {
          const isHidden = hiddenDepts.includes(dept.id);
          const budgetPercentage = ((dept.budget / totalBudget) * 100).toFixed(1);
          const utilizationPercentage = Math.round((dept.actualSpending / dept.budget) * 100);
          const isOverBudget = dept.actualSpending > dept.budget;

          return (
            <div 
              key={dept.id} 
              className={`bg-white p-8 border rounded-[3rem] transition-all group shadow-sm relative overflow-hidden flex flex-col ${
                isHidden ? 'opacity-50 border-slate-100 grayscale-[0.5]' : 'hover:border-blue-200 border-slate-100'
              }`}
            >
              <div className={`absolute top-0 right-0 w-2 h-full bg-${dept.color}-500 opacity-20`}></div>
              
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-5">
                  <div className={`w-16 h-16 bg-${dept.color}-50 text-${dept.color}-600 rounded-3xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                    <GitBranch size={32} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-xl font-black text-slate-800 group-hover:text-blue-600 transition-colors">{dept.name}</h4>
                      {isHidden && <EyeOff size={14} className="text-slate-400" title="مخفي من لوحة التحكم" />}
                    </div>
                    <div className="flex items-center gap-2">
                       <div className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
                          <img src={`https://picsum.photos/seed/${dept.head}/32/32`} alt={dept.head} className="w-full h-full object-cover" />
                       </div>
                       <p className="text-sm font-bold text-slate-600">{dept.head} <span className="text-[10px] text-slate-400 font-normal mr-1">(رئيس القسم)</span></p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                   <button 
                     onClick={() => toggleDeptVisibility(dept.id)}
                     className={`p-3 rounded-2xl transition-all shadow-sm ${isHidden ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50'}`}
                   >
                     {isHidden ? <Eye size={18} /> : <EyeOff size={18} />}
                   </button>
                   <button className="p-3 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all shadow-sm"><Edit3 size={18} /></button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-8">
                <div className="space-y-1">
                   <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">الميزانية المخصصة</p>
                   <p className="text-xl font-black text-slate-800">{dept.budget.toLocaleString()} <span className="text-xs font-normal opacity-50">ر.س</span></p>
                </div>
                <div className="space-y-1 text-left">
                   <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">الإنفاق الفعلي</p>
                   <p className={`text-xl font-black ${isOverBudget ? 'text-rose-600' : 'text-emerald-600'}`}>
                     {dept.actualSpending.toLocaleString()} <span className="text-xs font-normal opacity-50">ر.س</span>
                   </p>
                </div>
              </div>

              <div className="space-y-6 mt-auto">
                 <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                       <span className="text-slate-500">استهلاك الميزانية المخصصة</span>
                       <span className={isOverBudget ? 'text-rose-600' : 'text-blue-600'}>{utilizationPercentage}%</span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner p-0.5">
                       <div 
                         className={`h-full rounded-full transition-all duration-1000 ${isOverBudget ? 'bg-rose-500' : `bg-${dept.color}-500`}`} 
                         style={{ width: `${Math.min(utilizationPercentage, 100)}%` }}
                       ></div>
                    </div>
                    {isOverBudget && (
                      <div className="flex items-center gap-1.5 text-[9px] text-rose-600 font-black animate-pulse">
                         <AlertCircle size={12} /> تنبيه: تجاوز الميزانية المخصصة للقسم
                      </div>
                    )}
                 </div>

                 <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                       <Users size={16} className="text-slate-300" />
                       {dept.staff} موظف نشط
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-black text-blue-600 uppercase tracking-widest">
                       <PieChart size={14} /> حصة المجموعة: {budgetPercentage}%
                    </div>
                 </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700"><BarChart3 size={160} /></div>
         <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
               <h4 className="text-2xl font-black mb-3 flex items-center gap-3"><PieChart size={32} className="text-blue-400" /> تحليل الكفاءة المالية للأقسام</h4>
               <p className="text-slate-400 text-lg leading-relaxed font-medium">
                  يظهر التحليل أن قسم <span className="text-blue-400 font-bold">تطوير البرمجيات</span> يحافظ على استهلاك مثالي للموارد بنسبة 89%، بينما يحتاج قسم <span className="text-rose-400 font-bold">التصميم</span> لمراجعة تكاليف الأدوات السحابية لتجاوزه الميزانية الحالية بنسبة 4%.
               </p>
            </div>
            <div className="lg:col-span-4 flex justify-end">
               <button className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center gap-2 active:scale-95">
                  <TrendingUp size={20} /> عرض تقارير الربحية
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

const IntegrationsTab = () => {
  const [integrations, setIntegrations] = useState([
    { id: 'git', name: 'GitHub Enterprise', icon: Github, desc: 'مزامنة الكود، التقييمات، ومعدل الالتزام (Commits).', status: 'connected', lastSync: 'منذ 10 دقائق' },
    { id: 'cloud', name: 'AWS Cloud Services', icon: Cloud, desc: 'تتبع تكاليف الحوسبة والاستهلاك السحابي لكل مشروع.', status: 'connected', lastSync: 'منذ ساعة' },
    { id: 'pay', name: 'Stripe Payments', icon: CreditCard, desc: 'بوابة الدفع للفواتير والاشتراكات الشهرية.', status: 'connected', lastSync: 'منذ يومين' },
    { id: 'jira', name: 'Jira Software', icon: Trello, desc: 'مزامنة تذاكر العمل والمهام التقنية بجدول المشروع الزمني.', status: 'disconnected', lastSync: 'أبداً' },
    { id: 'asana', name: 'Asana Work Management', icon: LayoutDashboard, desc: 'تتبع تقدم المشاريع ومهام الفريق التشغيلية.', status: 'disconnected', lastSync: 'أبداً' },
  ]);

  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeInt, setActiveInt] = useState<any>(null);

  const handleConnectRequest = (int: any) => {
    setActiveInt(int);
    setIsModalOpen(true);
  };

  const handleVerifyConnection = (e: React.FormEvent) => {
    e.preventDefault();
    setConnectingId(activeInt.id);
    setIsModalOpen(false);
    
    setTimeout(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
      setIntegrations(prev => prev.map(int => 
        int.id === activeInt.id ? { ...int, status: 'connected', lastSync: `متصل في ${timeStr}` } : int
      ));
      setConnectingId(null);
      alert(`تم ربط ${activeInt.name} بنجاح مع تكنولوجي ERP!`);
    }, 2500);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-400">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-slate-800">إدارة التكاملات (Integrations Hub)</h3>
          <p className="text-xs text-slate-500 mt-1">اربط نظام ERP بأدوات فريقك التقني لتجربة متكاملة.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg">
          <Plus size={18} /> إضافة تكامل جديد
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((int) => (
          <div key={int.id} className={`p-6 bg-white border rounded-[2rem] transition-all duration-500 group ${int.status === 'connected' ? 'border-emerald-100 bg-emerald-50/10' : 'border-slate-100 shadow-sm hover:shadow-md'}`}>
            <div className="flex justify-between items-start mb-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300 ${
                int.status === 'connected' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'
              }`}>
                <int.icon size={28} />
              </div>
              <div className="flex flex-col items-end">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black mb-2 transition-colors ${
                  int.status === 'connected' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'
                }`}>
                  {int.status === 'connected' ? 'مفعل' : 'غير متصل'}
                </span>
                <p className="text-[9px] text-slate-400 font-bold tracking-tighter">{int.lastSync !== 'أبداً' ? `آخر مزامنة: ${int.lastSync}` : 'بانتظار الإعداد'}</p>
              </div>
            </div>
            <h4 className="font-bold text-slate-800 mb-2">{int.name}</h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-6 h-10 overflow-hidden">{int.desc}</p>
            <div className="flex gap-3">
              <button 
                onClick={() => int.status === 'disconnected' ? handleConnectRequest(int) : null}
                disabled={connectingId === int.id}
                className={`flex-1 py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  int.status === 'connected' 
                    ? 'bg-white border border-emerald-200 text-emerald-600 hover:bg-emerald-50 shadow-sm' 
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-100 disabled:bg-blue-300'
                }`}
              >
                {connectingId === int.id ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    جاري التحقق...
                  </>
                ) : (
                  int.status === 'connected' ? (
                    <>إدارة الإعدادات</>
                  ) : (
                    <>
                      <LinkIcon size={16} /> ربط الخدمة (Connect)
                    </>
                  )
                )}
              </button>
              {int.status === 'connected' && (
                <button className="p-3 border border-slate-100 rounded-2xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors shadow-sm bg-white">
                  <RefreshCw size={18} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && activeInt && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
           <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
                       <activeInt.icon size={24} />
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-slate-800">ربط {activeInt.name}</h3>
                       <p className="text-xs text-slate-500 font-medium mt-1">أدخل مفاتيح الربط لمزامنة البيانات</p>
                    </div>
                 </div>
                 <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-rose-500 rounded-xl transition-all"><X size={24} /></button>
              </div>
              <form onSubmit={handleVerifyConnection} className="p-8 space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <Globe size={12} /> رابط مساحة العمل (Workspace URL)
                    </label>
                    <input required placeholder={`https://yourcompany.${activeInt.id}.com`} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <Key size={12} /> مفتاح الوصول (API Token)
                    </label>
                    <input type="password" required placeholder="Bearer ...." className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" />
                 </div>
                 
                 <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                    <p className="text-[10px] text-blue-700 leading-relaxed font-bold">
                       سيتم مزامنة المهام، وحالات المشاريع، والتعليقات تلقائياً كل ساعة بمجرد تفعيل الربط.
                    </p>
                 </div>

                 <div className="flex gap-4 pt-4">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-slate-600 font-black bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all">إلغاء</button>
                    <button type="submit" className="flex-[2] py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3">
                       <LinkIcon size={20} /> تفعيل المزامنة
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}

      <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <ExternalLink size={120} />
        </div>
        <div className="relative z-10 max-w-2xl">
          <h3 className="text-xl font-bold mb-4">Webhooks API للمطورين</h3>
          <p className="text-indigo-100 text-sm leading-relaxed mb-6">
            هل تستخدم أدوات مخصصة؟ يمكنك استخدام نظام Webhooks الخاص بنا لاستلام تنبيهات حية من أي نظام خارجي إلى ERP. يدعم JSON Payload بالكامل مع توثيق تقني مفصل.
          </p>
          <button className="px-8 py-3 bg-white text-indigo-600 rounded-2xl text-xs font-bold shadow-xl hover:bg-indigo-50 transition-all flex items-center gap-2">
            <ExternalLink size={16} /> عرض توثيق المطورين
          </button>
        </div>
      </div>
    </div>
  );
};

const RolesTab = () => {
  const roles = [
    { id: 1, name: 'مدير نظام (Admin)', color: 'blue' },
    { id: 2, name: 'مدير مشروع (Manager)', color: 'emerald' },
    { id: 3, name: 'مطور (Developer)', color: 'indigo' },
    { id: 4, name: 'مدقق مالي (Auditor)', color: 'amber' },
  ];

  const permissionCategories = [
    {
      name: 'إدارة العمليات والمشاريع',
      color: 'blue',
      icon: Briefcase,
      items: [
        { id: 'p1', label: 'إدارة المشاريع', description: 'إنشاء وحذف وتعديل المشاريع والمهام المرتبطة' },
        { id: 'p6', label: 'تخطيط المبادرات', description: 'إضافة وتعديل خارطة الطريق الاستراتيجية' },
      ]
    },
    {
      name: 'التحكم المالي والفوترة',
      color: 'emerald',
      icon: DollarSign,
      items: [
        { id: 'p2', label: 'الوصول المالي الكامل', description: 'عرض التقارير، التدفقات النقدية، وإدارة المحفظة' },
        { id: 'p7', label: 'إصدار الفواتير الضريبية', description: 'إنشاء وتحويل عروض الأسعار إلى فواتير رسمية' },
      ]
    },
    {
      name: 'إدارة النظام والموارد البشرية',
      color: 'indigo',
      icon: UserCog,
      items: [
        { id: 'p3', label: 'إدارة الموارد البشرية', description: 'إدارة بيانات الموظفين، الرواتب، وطلبات الإجازات' },
        { id: 'p4', label: 'تعديل الهيكل التنظيمي', description: 'إضافة فروع، أقسام، وتوزيع الصلاحيات' },
        { id: 'p5', label: 'سجلات المراجعة (Audit Log)', description: 'متابعة كافة العمليات الحساسة في النظام' },
      ]
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-bottom-2 duration-400">
      {/* Sidebar: Roles List */}
      <div className="lg:col-span-4 space-y-4">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Shield className="text-blue-600" size={20} /> الأدوار الوظيفية
        </h3>
        {roles.map((role) => (
          <button
            key={role.id}
            className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all text-right ${
              role.id === 1 ? 'border-blue-600 bg-blue-50/50 shadow-sm' : 'border-slate-100 hover:border-slate-200 bg-white shadow-sm'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-3 h-3 rounded-full bg-${role.color}-500 shadow-[0_0_10px_rgba(var(--tw-color-${role.color}-500),0.3)]`}></div>
              <div>
                <p className="text-sm font-bold text-slate-800">{role.name}</p>
                <p className="text-[10px] text-slate-400 font-medium">مخصص لـ {role.id === 3 ? '12 موظف' : '1 موظف'}</p>
              </div>
            </div>
            {role.id === 1 && <Check size={18} className="text-blue-600" />}
          </button>
        ))}
        <button className="w-full py-4 border-2 border-dashed border-slate-200 text-slate-400 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 transition-all flex items-center justify-center gap-2">
          <Plus size={16} /> إضافة دور وظيفي جديد
        </button>
      </div>

      {/* Main Area: Permissions Matrix */}
      <div className="lg:col-span-8 bg-slate-50/30 rounded-[2.5rem] p-8 border border-slate-100 flex flex-col">
        <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-6">
          <div>
            <h3 className="text-xl font-black text-slate-800">مصفوفة الصلاحيات (Permissions)</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">تحديد مستوى الوصول المسموح به للدور: <span className="text-blue-600 font-bold">مدير نظام</span></p>
          </div>
          <button className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-2">
            <Save size={16} /> حفظ التعديلات
          </button>
        </div>

        <div className="space-y-8 flex-1">
          {permissionCategories.map((category, idx) => (
            <div key={idx} className={`p-6 rounded-[2rem] border border-${category.color}-100 bg-${category.color}-50/40 space-y-4 animate-in fade-in slide-in-from-top-2`} style={{ animationDelay: `${idx * 100}ms` }}>
              <div className="flex items-center gap-3 mb-2 px-2">
                <div className={`p-2 rounded-xl bg-white shadow-sm text-${category.color}-600`}>
                  <category.icon size={18} />
                </div>
                <h4 className={`text-sm font-black text-${category.color}-900`}>{category.name}</h4>
              </div>
              
              <div className="space-y-3">
                {category.items.map((perm) => (
                  <div key={perm.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-white shadow-sm hover:shadow-md transition-all group">
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{perm.label}</p>
                      <p className="text-[10px] text-slate-500 font-medium">{perm.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-12 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full rtl:peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600 shadow-inner"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-5 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-4">
           <ShieldAlert className="text-rose-500 shrink-0" size={20} />
           <div>
              <p className="text-xs font-bold text-rose-900">تحذير أمني</p>
              <p className="text-[10px] text-rose-700 leading-relaxed mt-1">أي تعديل في صلاحيات "الوصول المالي" سيؤثر فوراً على قدرة الموظفين على رؤية كشوفات الرواتب والتحويلات البنكية. يرجى المراجعة بدقة قبل الحفظ.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

const SubsidiariesTab = () => {
  const [companies, setCompanies] = useState<Subsidiary[]>([
    { id: '1', name: 'تكنولوجي القابضة (المقر الرئيسي)', location: 'الرياض، السعودية', taxId: '123-456-789', status: 'رئيسي' },
    { id: '2', name: 'سمارت سوفت للحلول', location: 'دبي، الإمارات', taxId: '987-654-321', status: 'تابعة' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Subsidiary | null>(null);

  const handleAdd = () => {
    setEditingCompany(null);
    setIsModalOpen(true);
  };

  const handleEdit = (company: Subsidiary) => {
    setEditingCompany(company);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الكيان؟ سيتم حذف جميع البيانات المرتبطة به.')) {
      setCompanies(companies.filter(c => c.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const companyData = {
      name: formData.get('name') as string,
      location: formData.get('location') as string,
      taxId: formData.get('taxId') as string,
      status: formData.get('status') as 'رئيسي' | 'تابعة',
    };

    if (editingCompany) {
      setCompanies(companies.map(c => c.id === editingCompany.id ? { ...editingCompany, ...companyData } : c));
    } else {
      const newCompany: Subsidiary = {
        ...companyData,
        id: Math.random().toString(36).substr(2, 9),
      };
      setCompanies([...companies, newCompany]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-400">
      <div className="flex justify-between items-center bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
        <div>
          <h3 className="text-lg font-bold text-slate-800">إدارة الكيانات والشركات</h3>
          <p className="text-xs text-slate-500 mt-1">تتبع الفروع والشركات التابعة للمجموعة في مكان واحد.</p>
        </div>
        <button 
          onClick={handleAdd}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
        >
          <Plus size={18} /> إضافة كيان جديد
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {companies.map((co) => (
          <div key={co.id} className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all group relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
              co.status === 'رئيسي' ? 'bg-indigo-600 text-white shadow-indigo-100' : 'bg-slate-100 text-slate-400'
            }`}>
              <Building2 size={32} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-bold text-slate-800 text-lg">{co.name}</h4>
                <span className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  co.status === 'رئيسي' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'
                }`}>
                  {co.status}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mt-1">
                <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                  <MapPin size={14} className="text-slate-400" /> {co.location}
                </p>
                <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                  <Shield size={14} className="text-slate-400" /> الرقم الضريبي: <span className="font-mono">{co.taxId}</span>
                </p>
              </div>
            </div>
            <div className="flex gap-2 self-end sm:self-center opacity-0 group-hover:opacity-100 transition-all">
              <button 
                onClick={() => handleEdit(co)}
                className="p-3 bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600 rounded-2xl transition-all shadow-sm"
              >
                <Edit3 size={18} />
              </button>
              {co.status !== 'رئيسي' && (
                <button 
                  onClick={() => handleDelete(co.id)}
                  className="p-3 bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-600 rounded-2xl transition-all shadow-sm"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-100">
                   {editingCompany ? <Edit3 size={24} /> : <Plus size={24} />}
                 </div>
                 <div>
                   <h3 className="text-xl font-black text-slate-800">{editingCompany ? 'تعديل بيانات الكيان' : 'إضافة كيان جديد'}</h3>
                   <p className="text-xs text-slate-500 font-medium mt-1">تأكد من مطابقة البيانات للسجل التجاري الرسمي</p>
                 </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">اسم الكيان / الشركة</label>
                <input 
                  required
                  name="name"
                  defaultValue={editingCompany?.name}
                  placeholder="مثال: شركة تكنولوجي للبرمجيات"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">الموقع (المدينة والبلد)</label>
                  <input 
                    required
                    name="location"
                    defaultValue={editingCompany?.location}
                    placeholder="مثال: الرياض، السعودية"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">الرقم الضريبي</label>
                  <input 
                    required
                    name="taxId"
                    defaultValue={editingCompany?.taxId}
                    placeholder="123-456-789"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">نوع الكيان</label>
                <select 
                  name="status"
                  defaultValue={editingCompany?.status || 'تابعة'}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  <option value="رئيسي">المقر الرئيسي / الشركة القابضة</option>
                  <option value="تابعة">شركة تابعة / فرع</option>
                </select>
              </div>

              <div className="flex gap-4 pt-6">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 text-slate-600 font-black bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all active:scale-95"
                >
                  إلغاء
                </button>
                <button 
                  type="submit"
                  className="flex-[2] py-4 bg-blue-600 text-white font-black rounded-2xl shadow-2xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                  <Save size={20} /> {editingCompany ? 'حفظ التعديلات' : 'تأكيد الإضافة'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const AuditTab = () => {
  const logs = [
    { id: '1', user: 'أحمد محمد', action: 'تعديل صلاحيات', entity: 'مدير مشروع', time: 'منذ 5 دقائق', status: 'success' },
    { id: '2', user: 'سارة خالد', action: 'حذف معاملة مالية', entity: 'اشتراك AWS', time: 'منذ 15 دقيقة', status: 'warning' },
    { id: '3', user: 'النظام', action: 'فشل دخول', entity: 'IP: 192.168.1.1', time: 'منذ ساعة', status: 'error' },
    { id: '4', user: 'محمد علي', action: 'إضافة موظف جديد', entity: 'عمر ياسين', time: 'منذ ساعتين', status: 'success' },
  ];

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-400">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-800">سجل النشاطات (Audit Log)</h3>
        <div className="flex gap-2">
           <div className="relative">
             <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
             <input type="text" placeholder="بحث في السجل..." className="pr-9 pl-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs" />
           </div>
           <button className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600">تصدير CSV</button>
        </div>
      </div>

      <div className="overflow-hidden border border-slate-100 rounded-xl bg-white shadow-sm">
        <table className="w-full text-right text-sm">
          <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold">
            <tr>
              <th className="px-6 py-4">المستخدم</th>
              <th className="px-6 py-4">العملية</th>
              <th className="px-6 py-4">الكيان المتأثر</th>
              <th className="px-6 py-4">الوقت</th>
              <th className="px-6 py-4">الحالة</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-700">{log.user}</td>
                <td className="px-6 py-4 text-slate-600">{log.action}</td>
                <td className="px-6 py-4 text-slate-500">{log.entity}</td>
                <td className="px-6 py-4 text-xs text-slate-400">{log.time}</td>
                <td className="px-6 py-4">
                  <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${
                    log.status === 'success' ? 'text-emerald-500' : log.status === 'warning' ? 'text-amber-500' : 'text-rose-500'
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      log.status === 'success' ? 'bg-emerald-500' : log.status === 'warning' ? 'bg-amber-500' : 'bg-rose-500'
                    }`}></div>
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center">
        <button className="text-xs font-bold text-blue-600 hover:underline">عرض المزيد من السجلات</button>
      </div>
    </div>
  );
};

export default Organization;
