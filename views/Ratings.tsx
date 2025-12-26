
import React, { useState } from 'react';
import { 
  Star, 
  Plus, 
  Copy, 
  CheckCircle2, 
  Send, 
  MessageSquare, 
  TrendingUp, 
  Users, 
  Clock, 
  ExternalLink,
  ShieldCheck,
  Search,
  Filter,
  ArrowUpRight,
  MoreVertical,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  Link as LinkIcon,
  X // Added missing icon
} from 'lucide-react';

interface RatingLink {
  id: string;
  projectName: string;
  customerName: string;
  link: string;
  status: 'active' | 'completed' | 'expired';
  createdAt: string;
  responses: number;
  averageScore: number;
}

const mockRatings: RatingLink[] = [
  { id: '1', projectName: 'تطبيق التوصيل الذكي', customerName: 'شركة الأغذية المتحدة', link: 'https://erp.tech.sa/eval/d1f2', status: 'active', createdAt: '2023-11-20', responses: 4, averageScore: 4.8 },
  { id: '2', projectName: 'نظام المستودعات', customerName: 'لوجستيك العرب', link: 'https://erp.tech.sa/eval/x9z3', status: 'completed', createdAt: '2023-11-15', responses: 1, averageScore: 5.0 },
  { id: '3', projectName: 'بوابة الدفع', customerName: 'متجر الرياض', link: 'https://erp.tech.sa/eval/k7m1', status: 'active', createdAt: '2023-11-18', responses: 0, averageScore: 0 },
];

const Ratings = () => {
  const [links, setLinks] = useState<RatingLink[]>(mockRatings);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const generateNewLink = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const newLink: RatingLink = {
      id: Date.now().toString(),
      projectName: formData.get('project') as string,
      customerName: formData.get('customer') as string,
      link: `https://erp.tech.sa/eval/${Math.random().toString(36).substr(2, 4)}`,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      responses: 0,
      averageScore: 0
    };
    setLinks([newLink, ...links]);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Star className="text-blue-600 fill-blue-600/20" /> إدارة تقييمات العملاء
          </h2>
          <p className="text-slate-500 text-sm">أنشئ روابط قياس الرضا، وتتبع جودة الخدمات المقدمة لعملائك.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 flex items-center gap-2 transition-all active:scale-95"
        >
          <Plus size={18} /> توليد رابط تقييم
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black text-xl">84</div>
           <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">NPS (الولاء)</p>
              <p className="text-sm font-black text-slate-800">ممتاز جداً</p>
           </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center"><Star size={24} className="fill-emerald-600" /></div>
           <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">متوسط التقييم</p>
              <p className="text-xl font-black text-slate-800">4.9 / 5</p>
           </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center"><MessageSquare size={24} /></div>
           <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">نسبة الاستجابة</p>
              <p className="text-xl font-black text-slate-800">72%</p>
           </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center"><TrendingUp size={24} /></div>
           <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">رضا العملاء (CSAT)</p>
              <p className="text-xl font-black text-slate-800">96%</p>
           </div>
        </div>
      </div>

      {/* Main List */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/30">
          <h3 className="font-bold text-slate-800">روابط التقييم النشطة</h3>
          <div className="flex gap-2">
             <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input type="text" placeholder="بحث باسم المشروع..." className="pr-10 pl-4 py-2 bg-white border border-slate-200 rounded-xl text-xs w-64 outline-none focus:ring-2 focus:ring-blue-500" />
             </div>
             <button className="p-2 bg-white border border-slate-200 text-slate-500 rounded-xl"><Filter size={16} /></button>
          </div>
        </div>
        <div className="divide-y divide-slate-100">
           {links.map((item) => (
             <div key={item.id} className="p-6 hover:bg-slate-50/50 transition-colors group flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex gap-4">
                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                     item.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                   }`}>
                      <Star size={24} className={item.averageScore > 0 ? 'fill-current' : ''} />
                   </div>
                   <div>
                      <h4 className="font-bold text-slate-800 flex items-center gap-2">
                        {item.projectName}
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                          item.status === 'active' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {item.status === 'active' ? 'نشط' : 'مكتمل'}
                        </span>
                      </h4>
                      <p className="text-xs text-slate-500 font-medium mb-2">{item.customerName}</p>
                      <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400">
                         <span className="flex items-center gap-1"><Clock size={12} /> أرسل في: {item.createdAt}</span>
                         <span className="flex items-center gap-1"><Users size={12} /> {item.responses} استجابات</span>
                      </div>
                   </div>
                </div>
                <div className="flex-1 lg:max-w-md bg-slate-50 rounded-2xl p-3 border border-slate-100 flex items-center justify-between">
                   <code className="text-[10px] text-blue-600 font-mono truncate ml-4">{item.link}</code>
                   <button 
                    onClick={() => copyToClipboard(item.link, item.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black transition-all ${
                      copiedId === item.id ? 'bg-emerald-500 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                    }`}
                   >
                     {copiedId === item.id ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                     {copiedId === item.id ? 'تم النسخ' : 'نسخ الرابط'}
                   </button>
                </div>
                <div className="flex items-center gap-6">
                   <div className="text-left min-w-[80px]">
                      <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">التقييم</p>
                      <div className="flex items-center gap-1 font-black text-slate-800">
                        {item.averageScore > 0 ? item.averageScore.toFixed(1) : '--'}
                        <Star size={14} className="text-amber-400 fill-amber-400" />
                      </div>
                   </div>
                   <button className="p-2 text-slate-300 hover:text-blue-600 rounded-lg"><MoreVertical size={20}/></button>
                </div>
             </div>
           ))}
        </div>
      </div>

      {/* AI Sentiment Analysis Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10"><Sparkles size={120} /></div>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
           <div className="lg:col-span-8 space-y-4">
              <h3 className="text-xl font-black flex items-center gap-3">
                 <Sparkles className="text-blue-400" /> تحليل مشاعر العملاء (AI)
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
                 يقوم نظامنا بتحليل النصوص في تعليقات العملاء آلياً. الملاحظات الأخيرة تشير إلى **رضا عالٍ جداً عن سرعة التنفيذ**، ولكن هناك ملاحظات متكررة حول **صعوبة استخدام لوحة تحكم التقارير المباشرة**.
              </p>
              <div className="flex gap-4 pt-2">
                 <button className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-xl hover:bg-blue-700 transition-all flex items-center gap-2">
                    عرض تقرير المشاعر <ArrowUpRight size={14} />
                 </button>
              </div>
           </div>
           <div className="lg:col-span-4 grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 p-5 rounded-3xl text-center">
                 <ThumbsUp size={24} className="text-emerald-400 mx-auto mb-2" />
                 <p className="text-xl font-black">92%</p>
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">إيجابي</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-5 rounded-3xl text-center">
                 <ThumbsDown size={24} className="text-rose-400 mx-auto mb-2" />
                 <p className="text-xl font-black">3%</p>
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">سلبي</p>
              </div>
           </div>
        </div>
      </div>

      {/* Generation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
           <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
                       <LinkIcon size={24} />
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-slate-800">توليد رابط تقييم</h3>
                       <p className="text-xs text-slate-500 font-medium mt-1">اختر المشروع والعميل لبدء القياس</p>
                    </div>
                 </div>
                 <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"><X size={24} /></button>
              </div>
              <form onSubmit={generateNewLink} className="p-8 space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">اسم المشروع</label>
                    <input name="project" required type="text" placeholder="مثال: تطوير متجر الرياض" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">اسم العميل</label>
                    <input name="customer" required type="text" placeholder="اسم جهة التواصل..." className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" />
                 </div>
                 <div className="flex gap-4 pt-4">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-slate-600 font-black bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all">إلغاء</button>
                    <button type="submit" className="flex-[2] py-4 bg-blue-600 text-white font-black rounded-2xl shadow-2xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-3">
                       توليد الرابط الآن <Send size={18} className="rotate-180" />
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default Ratings;
