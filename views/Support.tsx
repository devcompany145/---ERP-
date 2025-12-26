
import React, { useState, useMemo } from 'react';
import { 
  LifeBuoy, 
  MessageSquare, 
  Search, 
  Filter, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  BookOpen, 
  BarChart3, 
  Sparkles, 
  History,
  MoreVertical,
  X,
  Save,
  Tag,
  Users,
  Send,
  Loader2,
  BrainCircuit,
  MessageCircle,
  TrendingUp,
  Mail,
  ShieldCheck,
  FileText,
  FileType,
  FileSearch,
  User,
  Info,
  ChevronLeft
} from 'lucide-react';
import { SupportTicket, KBArticle } from '../types';

const mockTickets: SupportTicket[] = [
  { id: 't1', customerId: 'c1', customerName: 'شركة الأغذية المتحدة', subject: 'فشل مزامنة بيانات المستودع', priority: 'urgent', status: 'open', date: '2023-11-23', category: 'technical', description: 'توقف الربط التلقائي بين نظام ERP وأجهزة المسح الضوئي في المستودع الرئيسي، مما أدى لتراكم الشحنات غير المسجلة.' },
  { id: 't2', customerId: 'c2', customerName: 'متجر الرياض', subject: 'استفسار حول بوابة الدفع', priority: 'medium', status: 'in_progress', date: '2023-11-22', category: 'billing', description: 'العميل يطلب توضيحاً حول عمولات البنك المسحوبة في العمليات الدولية.' },
  { id: 't3', customerId: 'c3', customerName: 'لوجستيك العرب', subject: 'طلب إضافة ميزة التتبع المباشر', priority: 'low', status: 'pending_customer', date: '2023-11-20', category: 'feature_request', description: 'رغبة العميل في رؤية مسار الشاحنة حياً على الخريطة ضمن لوحة تحكم العملاء.' },
  { id: 't4', customerId: 'c4', customerName: 'تقنية المستقبل', subject: 'بطء في لوحة تحكم الإدارة', priority: 'high', status: 'resolved', date: '2023-11-15', category: 'technical', description: 'تأخر في تحميل التقارير المالية الضخمة عند اختيار فترة زمنية تزيد عن 6 أشهر.' },
];

const mockArticlesInitial: KBArticle[] = [
  { id: 'a1', title: 'كيفية إعداد بوابة الدفع Stripe', category: 'المالية', views: 1250, lastUpdated: '2023-10-10', content: 'خطوات ربط الحساب البنكي وإعداد Webhooks وتفعيل المزامنة البنكية في السعودية.' },
  { id: 'a2', title: 'دليل إضافة الموظفين الجدد', category: 'الموارد البشرية', views: 840, lastUpdated: '2023-11-01', content: 'شرح مفصل لكيفية تعبئة بيانات الموظف والوثائق الرسمية المطلوبة للامتثال للقانون السعودي.' },
  { id: 'a3', title: 'حل مشكلة تسجيل الدخول الموحد', category: 'تقني', views: 2100, lastUpdated: '2023-11-20', content: 'إذا واجهت مشكلة في SSO، يرجى التأكد من إعدادات Azure AD ومطابقة عنوان الـ IP المسجل في النظام.' },
];

const KB_TEMPLATES = {
  troubleshooting: {
    name: 'دليل استكشاف الأخطاء',
    content: `## وصف المشكلة\n[اكتب هنا وصفاً مختصراً للمشكلة]\n\n## الأعراض\n- العرض الأول\n- العرض الثاني\n\n## الحل المقترح\n1. الخطوة الأولى\n2. الخطوة الثانية\n\n## ملاحظات إضافية\n[أي معلومات تقنية أخرى]`
  },
  onboarding: {
    name: 'دليل إعداد مستخدم جديد',
    content: `## المتطلبات الأساسية\n- بريد إلكتروني رسمي\n- صلاحيات الدخول\n\n## خطوات الإعداد\n1. قم بفتح الرابط...\n2. أدخل بياناتك...\n\n## الدعم\nفي حال التعثر، تواصل مع قسم [الاسم]`
  },
  release_notes: {
    name: 'سجل تحديثات النظام',
    content: `## الميزات الجديدة\n- ميزة رقم 1\n- ميزة رقم 2\n\n## إصلاحات الأخطاء\n- تم حل مشكلة...\n\n## تحسينات الأداء\n- تحسين سرعة استجابة الـ API`
  }
};

const Support = () => {
  const [activeTab, setActiveTab] = useState<'tickets' | 'kb' | 'analytics'>('tickets');
  const [searchTerm, setSearchTerm] = useState('');
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isKBModalOpen, setIsKBModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [articles, setArticles] = useState<KBArticle[]>(mockArticlesInitial);

  // KB Form State
  const [newArticle, setNewArticle] = useState({ title: '', category: 'تقني', content: '' });

  const stats = useMemo(() => ({
    total: mockTickets.length,
    open: mockTickets.filter(t => t.status === 'open' || t.status === 'in_progress').length,
    resolvedToday: 5,
    avgResolutionTime: '4.2 ساعة'
  }), []);

  const filteredTickets = useMemo(() => {
    return mockTickets.filter(t => 
      t.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
      t.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const filteredArticles = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return articles.filter(a => 
      a.title.toLowerCase().includes(term) || 
      a.category.toLowerCase().includes(term) || 
      a.content.toLowerCase().includes(term)
    );
  }, [articles, searchTerm]);

  const applyTemplate = (templateKey: keyof typeof KB_TEMPLATES) => {
    setNewArticle({
      ...newArticle,
      content: KB_TEMPLATES[templateKey].content
    });
  };

  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    const article: KBArticle = {
      id: 'a' + Date.now(),
      ...newArticle,
      views: 0,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    setArticles([article, ...articles]);
    setIsKBModalOpen(false);
    setNewArticle({ title: '', category: 'تقني', content: '' });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tighter flex items-center gap-3">
             مركز الدعم والعمليات <span className="px-4 py-1 bg-blue-100 text-blue-600 rounded-2xl text-sm font-black">{stats.open} تذكرة نشطة</span>
          </h2>
          <p className="text-slate-500 text-sm font-medium">إدارة تذاكر العملاء، قاعدة المعرفة، وتحسين تجربة الخدمة.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => { setIsTicketModalOpen(true); }}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-sm font-black shadow-2xl shadow-blue-100 flex items-center gap-2 transition-all active:scale-95"
          >
            <Plus size={18} /> فتح تذكرة جديدة
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="التذاكر المفتوحة" value={stats.open} sub="بانتظار الإجراء" icon={MessageSquare} color="blue" />
        <StatCard label="تم حلها اليوم" value={stats.resolvedToday} sub="بزيادة 12% عن أمس" icon={CheckCircle2} color="emerald" />
        <StatCard label="متوسط وقت الحل" value={stats.avgResolutionTime} sub="ضمن نطاق الـ SLA" icon={Clock} color="indigo" />
        <StatCard label="معدل رضا العملاء" value="94%" sub="بناءً على 120 تقييم" icon={Sparkles} color="amber" />
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-100 overflow-x-auto no-scrollbar bg-slate-50/50">
          {[
            { id: 'tickets', label: 'تذاكر الدعم', icon: MessageCircle },
            { id: 'kb', label: 'قاعدة المعرفة (KB)', icon: BookOpen },
            { id: 'analytics', label: 'تحليلات الخدمة', icon: BarChart3 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-3 px-10 py-6 text-sm font-black whitespace-nowrap transition-all border-b-4 ${
                activeTab === tab.id 
                  ? 'border-blue-600 text-blue-600 bg-white shadow-sm' 
                  : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-white/50'
              }`}
            >
              <tab.icon size={20} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-8">
          {activeTab === 'tickets' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-4">
                <div className="relative flex-1 max-w-md w-full">
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="بحث في التذاكر..." 
                    className="w-full pr-12 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                   <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 border border-slate-200 rounded-2xl text-xs font-black text-slate-600 hover:bg-slate-50 transition-all">
                     <Filter size={16} /> تصفية
                   </button>
                </div>
              </div>

              <div className="overflow-hidden border border-slate-100 rounded-3xl bg-white shadow-sm">
                <table className="w-full text-right text-sm">
                  <thead className="bg-slate-50 text-slate-500 font-bold text-[10px] uppercase tracking-widest border-b border-slate-100">
                    <tr>
                      <th className="px-8 py-6">الموضوع / العميل</th>
                      <th className="px-8 py-6 text-center">الأولوية</th>
                      <th className="px-8 py-6 text-center">التصنيف</th>
                      <th className="px-8 py-6">تاريخ الفتح</th>
                      <th className="px-8 py-6 text-center">الحالة</th>
                      <th className="px-8 py-6"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredTickets.map((ticket) => (
                      <tr key={ticket.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer" onClick={() => setSelectedTicket(ticket)}>
                        <td className="px-8 py-6">
                          <div>
                            <p className="font-black text-slate-700 group-hover:text-blue-600 transition-colors">{ticket.subject}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{ticket.customerName}</p>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <PriorityBadge priority={ticket.priority} />
                        </td>
                        <td className="px-8 py-6 text-center">
                          <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-3 py-1 rounded-lg uppercase">{ticket.category}</span>
                        </td>
                        <td className="px-8 py-6 text-slate-400 font-bold text-xs">{ticket.date}</td>
                        <td className="px-8 py-6">
                           <StatusBadge status={ticket.status} />
                        </td>
                        <td className="px-8 py-6 text-left">
                          <button className="p-2 text-slate-300 hover:text-blue-600 transition-colors">
                            <ChevronRight size={18} className="rotate-180" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'kb' && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4">
              <div className="flex flex-col md:flex-row justify-between items-center bg-indigo-50 p-6 rounded-[2rem] border border-indigo-100 gap-6">
                <div className="flex-1">
                   <h3 className="text-xl font-black text-indigo-900 flex items-center gap-3">
                      <BookOpen size={24} /> قاعدة المعرفة التقنية
                   </h3>
                   <p className="text-indigo-700/70 text-sm font-medium mt-1">مقالات ودروس لمساعدة العملاء والموظفين على الخدمة الذاتية.</p>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                   <div className="relative flex-1 md:w-64">
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-300" size={16} />
                      <input 
                        type="text" 
                        placeholder="ابحث في العنوان أو المحتوى..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pr-10 pl-4 py-2.5 bg-white border border-indigo-100 rounded-xl text-xs font-bold text-indigo-900 outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                   </div>
                   <button 
                     onClick={() => setIsKBModalOpen(true)}
                     className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-black shadow-lg hover:bg-indigo-700 transition-all active:scale-95 flex items-center gap-2 shrink-0"
                   >
                     <Plus size={16} /> إضافة مقال
                   </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {filteredArticles.map(article => (
                   <div key={article.id} className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-xl transition-all group cursor-pointer flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-4">
                           <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[9px] font-black uppercase">{article.category}</span>
                           <span className="text-[10px] text-slate-400 flex items-center gap-1"><Clock size={12}/> {article.lastUpdated}</span>
                        </div>
                        <h4 className="text-base font-black text-slate-800 mb-3 group-hover:text-blue-600 transition-colors leading-relaxed">{article.title}</h4>
                        <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">{article.content}</p>
                      </div>
                      <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center">
                         <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1 uppercase"><TrendingUp size={12}/> {article.views} مشاهدة</span>
                         <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-600 transition-all rotate-180" />
                      </div>
                   </div>
                 ))}

                 {filteredArticles.length === 0 && (
                   <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-100 rounded-[2.5rem]">
                      <FileSearch size={48} className="text-slate-200 mx-auto mb-4" />
                      <h4 className="text-lg font-black text-slate-800 tracking-tight">لم يتم العثور على نتائج للبحث</h4>
                      <p className="text-slate-400 text-sm mt-2 font-medium">جرب الكلمات المفتاحية مثل "Stripe" أو "SSO" أو "موظفين".</p>
                      <button 
                        onClick={() => setSearchTerm('')}
                        className="mt-6 text-xs font-black text-blue-600 hover:underline"
                      >
                        عرض كافة المقالات
                      </button>
                   </div>
                 )}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4">
               <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700"><BrainCircuit size={160} /></div>
                  <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                     <div className="space-y-6">
                        <h3 className="text-3xl font-black tracking-tight">الرؤى التحليلية المدعومة بالذكاء الاصطناعي</h3>
                        <p className="text-slate-400 text-lg leading-relaxed font-medium">
                          يقوم المساعد الذكي بتحليل تكرار الكلمات المفتاحية في تذاكر الدعم لاكتشاف المشكلات البرمجية المتكررة قبل تفاقمها.
                        </p>
                        <div className="flex gap-4">
                           <button className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-black text-xs shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center gap-2">
                             <Sparkles size={16} /> توليد تقرير الجودة
                           </button>
                        </div>
                     </div>
                     <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/10 shadow-inner">
                        <h4 className="text-sm font-black mb-6 border-b border-white/10 pb-4 flex items-center gap-2 text-blue-400"><TrendingUp size={18}/> ملخص الأداء الأسبوعي</h4>
                        <div className="space-y-5">
                           {[
                             { label: 'نسبة حل التذاكر من اللمسة الأولى', value: '68%', color: 'blue' },
                             { label: 'وقت الاستجابة الأول (متوسط)', value: '18 دقيقة', color: 'emerald' },
                             { label: 'معدل التذاكر المعاد فتحها', value: '4%', color: 'rose' },
                           ].map((item, i) => (
                             <div key={i} className="flex justify-between items-center">
                                <span className="text-xs text-slate-300 font-medium">{item.label}</span>
                                <span className={`text-sm font-black text-${item.color}-400`}>{item.value}</span>
                             </div>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* Ticket Details Modal - Dynamic Color Sections */}
      {selectedTicket && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
           <div className={`bg-white rounded-[3.5rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100 flex flex-col`}>
              <div className={`p-10 flex justify-between items-center text-white relative overflow-hidden transition-colors duration-500 ${
                selectedTicket.status === 'resolved' ? 'bg-emerald-600' : 
                (selectedTicket.priority === 'urgent' || selectedTicket.priority === 'high') ? 'bg-rose-600' : 'bg-amber-500'
              }`}>
                 <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 transition-transform hover:scale-110 duration-700">
                    <LifeBuoy size={160} />
                 </div>
                 <div className="flex items-center gap-5 relative z-10">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/30 shadow-xl">
                       <LifeBuoy size={32} />
                    </div>
                    <div>
                       <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-2xl font-black tracking-tight">{selectedTicket.subject}</h3>
                       </div>
                       <p className="text-white/80 text-sm font-medium">تذكرة رقم: {selectedTicket.id.toUpperCase()} • {selectedTicket.date}</p>
                    </div>
                 </div>
                 <button onClick={() => setSelectedTicket(null)} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all relative z-10"><X size={24} /></button>
              </div>

              <div className="p-10 space-y-10 bg-slate-50/30 overflow-y-auto max-h-[70vh]">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 group hover:border-blue-200 transition-all">
                       <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"><User size={24} /></div>
                       <div>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">العميل</p>
                          <p className="text-sm font-black text-slate-800">{selectedTicket.customerName}</p>
                       </div>
                    </div>
                    <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 group hover:border-blue-200 transition-all">
                       <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"><Tag size={24} /></div>
                       <div>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">التصنيف</p>
                          <p className="text-sm font-black text-slate-800 uppercase tracking-tighter">{selectedTicket.category}</p>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <Info size={14} /> تفاصيل المشكلة المذكورة
                    </h4>
                    <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm leading-relaxed text-slate-600 text-sm font-medium">
                       {selectedTicket.description || 'لا يوجد وصف تفصيلي لهذه التذكرة، يرجى التواصل مع العميل لمزيد من الإيضاح.'}
                    </div>
                 </div>

                 {/* Dynamic Status Section */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`p-6 rounded-3xl border transition-all shadow-sm ${
                      selectedTicket.status === 'resolved' ? 'bg-emerald-50 border-emerald-100' : 
                      (selectedTicket.priority === 'urgent' || selectedTicket.priority === 'high') ? 'bg-rose-50 border-rose-100' : 'bg-amber-50 border-amber-100'
                    }`}>
                       <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${
                         selectedTicket.status === 'resolved' ? 'text-emerald-600' : 
                         (selectedTicket.priority === 'urgent' || selectedTicket.priority === 'high') ? 'text-rose-600' : 'text-amber-600'
                       }`}>الحالة التنفيذية</p>
                       <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full animate-pulse ${
                            selectedTicket.status === 'resolved' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 
                            (selectedTicket.priority === 'urgent' || selectedTicket.priority === 'high') ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]' : 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                          }`}></div>
                          <span className={`text-base font-black ${
                            selectedTicket.status === 'resolved' ? 'text-emerald-800' : 
                            (selectedTicket.priority === 'urgent' || selectedTicket.priority === 'high') ? 'text-rose-800' : 'text-amber-800'
                          }`}>
                            {statusLabels[selectedTicket.status]}
                          </span>
                       </div>
                    </div>
                    <div className={`p-6 rounded-3xl border transition-all shadow-sm ${
                      selectedTicket.priority === 'urgent' ? 'bg-rose-600 text-white border-rose-700 shadow-rose-200' : 'bg-white border-slate-100'
                    }`}>
                       <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${
                         selectedTicket.priority === 'urgent' ? 'text-rose-100' : 'text-slate-400'
                       }`}>مستوى الأهمية</p>
                       <div className="flex items-center gap-2">
                          <PriorityBadge priority={selectedTicket.priority} />
                       </div>
                    </div>
                 </div>
              </div>

              <div className="p-10 border-t border-slate-100 bg-white flex flex-col sm:flex-row gap-4">
                 <div className="flex-1 flex gap-3">
                    <button className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                       <Send size={18} className="rotate-180" /> الرد على العميل
                    </button>
                    <button className="p-4 border border-slate-200 text-slate-400 rounded-2xl hover:bg-slate-50 transition-all">
                       <MoreVertical size={20} />
                    </button>
                 </div>
                 <button onClick={() => setSelectedTicket(null)} className="py-4 px-10 bg-slate-100 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-200 transition-all">
                   إغلاق
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Ticket Creation Modal */}
      {isTicketModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
           <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                 <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-100">
                       <Plus size={28} />
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-slate-800">فتح تذكرة دعم فني</h3>
                       <p className="text-xs text-slate-500 font-medium mt-1">يرجى تقديم تفاصيل واضحة لضمان سرعة الحل</p>
                    </div>
                 </div>
                 <button onClick={() => setIsTicketModalOpen(false)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"><X size={24} /></button>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); setIsTicketModalOpen(false); }} className="p-8 space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">الموضوع الرئيسي</label>
                    <input name="subject" required placeholder="مثال: مشكلة في استلام رسائل التفعيل" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" />
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">العميل</label>
                       <select className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none">
                          <option>شركة الأغذية المتحدة</option>
                          <option>متجر الرياض</option>
                          <option>لوجستيك العرب</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">الأولوية</label>
                       <select className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none">
                          <option value="low">منخفضة</option>
                          <option value="medium">متوسطة</option>
                          <option value="high">عالية</option>
                          <option value="urgent">حرجة جداً</option>
                       </select>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">الوصف المفصل</label>
                    <textarea rows={4} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none resize-none focus:ring-2 focus:ring-blue-500" placeholder="اشرح المشكلة بالتفصيل والخطوات المطلوبة لإعادة إنتاجها..." />
                 </div>

                 <div className="flex gap-4 pt-4">
                    <button type="button" onClick={() => setIsTicketModalOpen(false)} className="flex-1 py-4 text-slate-600 font-black bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all">إلغاء</button>
                    <button type="submit" className="flex-[2] py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3">
                       <Send size={20} className="rotate-180" /> فتح التذكرة الآن
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* KB Article Creation Modal */}
      {isKBModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
           <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100 flex flex-col h-[90vh]">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                 <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100">
                       <BookOpen size={28} />
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-slate-800">إضافة مقال لقاعدة المعرفة</h3>
                       <p className="text-xs text-slate-500 font-medium mt-1">وثّق الحلول والدروس المستفادة لخدمة عملائك بشكل أفضل</p>
                    </div>
                 </div>
                 <button onClick={() => setIsKBModalOpen(false)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"><X size={24} /></button>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar">
                <div className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-8 space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">عنوان المقال</label>
                       <input 
                         required 
                         value={newArticle.title}
                         onChange={(e) => setNewArticle({...newArticle, title: e.target.value})}
                         placeholder="مثال: كيفية تخصيص واجهة الإشعارات" 
                         className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" 
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">المحتوى (يدعم التنسيق البسيط)</label>
                       <textarea 
                         rows={12} 
                         value={newArticle.content}
                         onChange={(e) => setNewArticle({...newArticle, content: e.target.value})}
                         className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none resize-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-mono" 
                         placeholder="ابدأ بالكتابة أو اختر قالباً من القائمة الجانبية..." 
                       />
                    </div>
                  </div>

                  <div className="lg:col-span-4 space-y-6">
                    <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 space-y-6">
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">قوالب جاهزة</label>
                        <div className="space-y-2">
                          {Object.entries(KB_TEMPLATES).map(([key, template]) => (
                            <button
                              key={key}
                              type="button"
                              onClick={() => applyTemplate(key as any)}
                              className="w-full text-right p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-500 hover:shadow-md transition-all group"
                            >
                              <div className="flex items-center gap-3">
                                <FileType className="text-slate-300 group-hover:text-indigo-600" size={18} />
                                <span className="text-xs font-black text-slate-700 group-hover:text-indigo-700">{template.name}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">التصنيف</label>
                         <select 
                           value={newArticle.category}
                           onChange={(e) => setNewArticle({...newArticle, category: e.target.value})}
                           className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
                         >
                            <option value="تقني">تقني</option>
                            <option value="المالية">المالية</option>
                            <option value="الموارد البشرية">الموارد البشرية</option>
                            <option value="عام">إرشادات عامة</option>
                         </select>
                      </div>

                      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                        <p className="text-[10px] text-amber-700 leading-relaxed font-bold">
                          تأكد من مراجعة المعلومات التقنية قبل النشر للعملاء. المقالات المنشورة تظهر تلقائياً في بوابة العميل.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex gap-4">
                 <button type="button" onClick={() => setIsKBModalOpen(false)} className="px-8 py-4 text-slate-600 font-black bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all">إلغاء</button>
                 <button 
                  onClick={handleSaveArticle}
                  className="flex-1 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 active:scale-95"
                 >
                    <Save size={20} /> حفظ ونشر المقال
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, value, sub, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm group hover:border-blue-100 transition-all">
    <div className={`w-12 h-12 rounded-2xl bg-${color}-50 text-${color}-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
      <Icon size={24} />
    </div>
    <p className="text-[10px] text-slate-400 font-black uppercase mb-1 tracking-widest">{label}</p>
    <h3 className="text-2xl font-black text-slate-800">{value}</h3>
    <p className="text-[10px] text-slate-500 mt-1 font-bold">{sub}</p>
  </div>
);

const PriorityBadge = ({ priority }: { priority: string }) => {
  const colors: any = {
    urgent: 'bg-rose-100 text-rose-600 border-rose-200 shadow-sm shadow-rose-100',
    high: 'bg-orange-100 text-orange-600 border-orange-200',
    medium: 'bg-blue-100 text-blue-600 border-blue-200',
    low: 'bg-slate-100 text-slate-600 border-slate-200',
  };
  const labels: any = { urgent: 'حرجة جداً', high: 'عالية الأولوية', medium: 'متوسطة', low: 'منخفضة' };
  return <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border ${colors[priority]}`}>{labels[priority]}</span>;
};

const statusLabels: Record<string, string> = {
  open: 'مفتوحة',
  in_progress: 'قيد المعالجة',
  pending_customer: 'بانتظار العميل',
  resolved: 'محلولة بنجاح',
  closed: 'مغلقة نهائياً'
};

const StatusBadge = ({ status }: { status: string }) => {
  const styles: any = {
    open: { label: 'مفتوحة', class: 'text-rose-500 bg-rose-50' },
    in_progress: { label: 'قيد المعالجة', class: 'text-blue-500 bg-blue-50' },
    pending_customer: { label: 'بانتظار العميل', class: 'text-amber-500 bg-amber-50' },
    resolved: { label: 'محلولة', class: 'text-emerald-500 bg-emerald-50' },
    closed: { label: 'مغلقة', class: 'text-slate-400 bg-slate-50' },
  };
  const s = styles[status] || styles.open;
  return (
    <span className={`flex items-center justify-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${s.class}`}>
       <div className={`w-1.5 h-1.5 rounded-full ${s.class.split(' ')[0].replace('text', 'bg')}`}></div>
       {s.label}
    </span>
  );
};

export default Support;
