
import React, { useState } from 'react';
import { 
  Customer, 
  Communication, 
  Offer, 
  SupportTicket, 
  OfferItem,
  PricingModel
} from '../types';
import { 
  Search, 
  Filter, 
  Plus, 
  Phone, 
  Mail, 
  Building2, 
  ChevronLeft, 
  MoreVertical, 
  MessageSquare, 
  FileCheck, 
  AlertCircle, 
  Calendar, 
  History,
  TrendingUp,
  Target,
  Clock,
  Briefcase,
  CheckCircle2,
  XCircle,
  Users,
  Trash2,
  ExternalLink,
  ChevronRight,
  ArrowRightLeft,
  DollarSign,
  MessageCircle,
  Video,
  ArrowUpRight
} from 'lucide-react';

const mockCustomers: Customer[] = [
  { id: 'c1', name: 'فيصل بن عبدالله', company: 'شركة الأغذية المتحدة', email: 'faisal@unitedfood.sa', phone: '0551234567', status: 'نشط', totalRevenue: 120000, joinDate: '2023-01-15', industry: 'تجارة أغذية' },
  { id: 'c2', name: 'سارة المنصور', company: 'متجر الرياض', email: 'sara@riyadhstore.com', phone: '0567891234', status: 'نشط', totalRevenue: 85000, joinDate: '2023-05-20', industry: 'تجارة إلكترونية' },
  { id: 'c3', name: 'خالد السعيد', company: 'لوجستيك العرب', email: 'khaled@arablogistics.sa', phone: '0543219876', status: 'نشط', totalRevenue: 150000, joinDate: '2023-08-10', industry: 'خدمات لوجستية' },
  { id: 'c4', name: 'ماجد العتيبي', company: 'تقنية المستقبل', email: 'majed@futuretech.sa', phone: '0599988776', status: 'عميل محتمل', totalRevenue: 0, joinDate: '2023-11-01', industry: 'تقنية معلومات' },
];

const mockCommunications: Communication[] = [
  { id: 'com1', customerId: 'c1', date: '2023-11-15', type: 'اجتماع', notes: 'مناقشة توسعة تطبيق التوصيل وإضافة ميزات الخرائط الجديدة.', staffName: 'محمد علي' },
  { id: 'com2', customerId: 'c1', date: '2023-11-10', type: 'بريد إلكتروني', notes: 'إرسال التقرير المالي الشهري للمشروع.', staffName: 'سارة خالد' },
  { id: 'com3', customerId: 'c1', date: '2023-11-05', type: 'مكالمة هاتفية', notes: 'استفسار من العميل حول موعد إطلاق النسخة التجريبية.', staffName: 'محمد علي' },
  { id: 'com4', customerId: 'c2', date: '2023-11-20', type: 'مكالمة هاتفية', notes: 'متابعة بخصوص تفعيل بوابة الدفع والمزامنة البنكية.', staffName: 'أحمد محمد' },
  { id: 'com5', customerId: 'c3', date: '2023-11-18', type: 'اجتماع', notes: 'ورشة عمل فنية لتحديد متطلبات ربط مستشعرات الـ IoT في المستودع.', staffName: 'سارة خالد' },
];

const mockTickets: SupportTicket[] = [
  { id: 't1', customerId: 'c1', subject: 'بطء في لوحة تحكم الإدارة', priority: 'medium', status: 'in_progress', date: '2023-11-22', category: 'technical' },
  { id: 't2', customerId: 'c1', subject: 'فشل مزامنة بيانات المستودع', priority: 'high', status: 'open', date: '2023-11-23', category: 'technical' },
  { id: 't3', customerId: 'c1', subject: 'طلب استعادة كلمة مرور المدير', priority: 'high', status: 'closed', date: '2023-11-10', category: 'technical' },
];

const priorityLabels: Record<string, string> = {
  urgent: 'حرجة',
  high: 'عالية',
  medium: 'متوسطة',
  low: 'منخفضة'
};

const statusLabels: Record<string, string> = {
  open: 'مفتوحة',
  in_progress: 'قيد المعالجة',
  pending_customer: 'بانتظار العميل',
  resolved: 'محلولة',
  closed: 'مغلقة'
};

const CustomerDetail = ({ customer, onBack }: { customer: Customer, onBack: () => void }) => {
  // الافتراضي هو 'timeline' لعرض سجل التواصل مباشرة
  const [activeTab, setActiveTab] = useState<'timeline' | 'offers' | 'support' | 'projects'>('timeline');

  const customerComm = mockCommunications.filter(c => c.customerId === customer.id);
  const customerTickets = mockTickets.filter(t => t.customerId === customer.id);

  return (
    <div className="space-y-8 animate-in slide-in-from-left-4 duration-500 pb-12">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold group transition-all">
        <ChevronLeft size={20} className="group-hover:-translate-x-1" /> العودة لقائمة العملاء
      </button>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full -mr-24 -mt-24"></div>
            <div className="w-32 h-32 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600 relative z-10 border-4 border-white shadow-xl">
              <Building2 size={64} />
            </div>
            <div className="flex-1 text-center md:text-right relative z-10">
              <h1 className="text-3xl font-black text-slate-800 mb-2">{customer.name}</h1>
              <p className="text-lg font-bold text-slate-500 mb-4">{customer.company} | {customer.industry}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-slate-500 text-sm mb-6">
                <span className="flex items-center gap-1"><Mail size={16} /> {customer.email}</span>
                <span className="flex items-center gap-1"><Phone size={16} /> {customer.phone}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
            <div className="flex border-b border-slate-100 overflow-x-auto no-scrollbar bg-slate-50/50">
              {[
                { id: 'timeline', label: 'سجل التواصل', icon: History },
                { id: 'offers', label: 'العروض والمبيعات', icon: FileCheck },
                { id: 'support', label: 'الدعم والشكاوى', icon: MessageSquare },
                { id: 'projects', label: 'المشاريع المنفذة', icon: Briefcase },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-8 py-5 text-sm font-bold whitespace-nowrap transition-all border-b-4 ${
                    activeTab === tab.id ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <tab.icon size={18} />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-8">
              {activeTab === 'timeline' && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-black text-slate-800">سجل التفاعلات التاريخي</h3>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-lg flex items-center gap-2">
                       <Plus size={16} /> إضافة تواصل جديد
                    </button>
                  </div>
                  
                  {customerComm.length > 0 ? (
                    <div className="relative border-r-2 border-slate-100 mr-4 space-y-8 pr-8">
                       {customerComm.map((comm) => (
                         <div key={comm.id} className="relative group">
                            {/* Timeline Dot */}
                            <div className="absolute top-0 -right-[41px] w-5 h-5 rounded-full bg-white border-4 border-blue-500 shadow-sm group-hover:scale-125 transition-transform z-10"></div>
                            
                            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 group-hover:bg-white group-hover:shadow-md transition-all">
                               <div className="flex justify-between items-start mb-2">
                                  <div className="flex items-center gap-2">
                                     <span className={`p-2 rounded-lg ${
                                       comm.type === 'اجتماع' ? 'bg-indigo-100 text-indigo-600' :
                                       comm.type === 'بريد إلكتروني' ? 'bg-blue-100 text-blue-600' :
                                       'bg-emerald-100 text-emerald-600'
                                     }`}>
                                        {comm.type === 'اجتماع' ? <Users size={14}/> : 
                                         comm.type === 'بريد إلكتروني' ? <Mail size={14}/> : 
                                         <Phone size={14}/>}
                                     </span>
                                     <span className="text-xs font-black text-slate-700">{comm.type}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold">
                                     <Calendar size={12} /> {comm.date}
                                  </div>
                               </div>
                               <p className="text-sm text-slate-600 leading-relaxed mb-4">{comm.notes}</p>
                               <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                                  <div className="flex items-center gap-2">
                                     <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-bold border border-blue-100">
                                        {comm.staffName[0]}
                                     </div>
                                     <span className="text-[11px] font-bold text-slate-500">بواسطة: {comm.staffName}</span>
                                  </div>
                               </div>
                            </div>
                         </div>
                       ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                       <History size={48} className="mx-auto text-slate-300 mb-4" />
                       <p className="text-slate-500 font-bold">لا يوجد سجل تواصل لهذا العميل بعد.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'support' && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-lg font-black text-slate-800">تذاكر الدعم المفتوحة</h3>
                      <p className="text-xs text-slate-400 mt-1">متابعة المشكلات البرمجية وطلبات الدعم.</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-lg">
                      <Plus size={16} /> تذكرة جديدة
                    </button>
                  </div>

                  <div className="overflow-hidden border border-slate-100 rounded-2xl bg-white shadow-sm">
                    <table className="w-full text-right text-sm">
                      <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold">
                        <tr>
                          <th className="px-6 py-4">الموضوع</th>
                          <th className="px-6 py-4 text-center">الأولوية</th>
                          <th className="px-6 py-4 text-center">الحالة</th>
                          <th className="px-6 py-4">تاريخ الفتح</th>
                          <th className="px-6 py-4"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {customerTickets.map((ticket) => (
                          <tr key={ticket.id} className="hover:bg-slate-50 transition-colors group">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                  ticket.status === 'open' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                                }`}>
                                  <AlertCircle size={20} />
                                </div>
                                <p className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{ticket.subject}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${
                                ticket.priority === 'high' || ticket.priority === 'urgent' ? 'bg-rose-100 text-rose-600 border border-rose-200' : 
                                ticket.priority === 'medium' ? 'bg-amber-100 text-amber-600 border border-amber-200' : 
                                'bg-slate-100 text-slate-600 border border-slate-200'
                              }`}>
                                {priorityLabels[ticket.priority] || ticket.priority}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className={`flex items-center justify-center gap-1.5 text-[11px] font-bold ${
                                ticket.status === 'open' ? 'text-amber-500' : 
                                ticket.status === 'in_progress' ? 'text-blue-500' : 'text-emerald-500'
                              }`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${
                                  ticket.status === 'open' ? 'bg-amber-500' : 
                                  ticket.status === 'in_progress' ? 'bg-blue-500' : 'bg-emerald-500'
                                }`}></div>
                                {statusLabels[ticket.status] || ticket.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-xs text-slate-500 font-medium">{ticket.date}</td>
                            <td className="px-6 py-4 text-left">
                              <button className="p-2 text-slate-300 hover:text-blue-600 transition-colors">
                                <ChevronRight size={20} className="rotate-180" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Customers = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  if (selectedCustomer) return <CustomerDetail customer={selectedCustomer} onBack={() => setSelectedCustomer(null)} />;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tighter flex items-center gap-3">
             إدارة علاقات العملاء (CRM) <span className="text-blue-600 px-3 py-1 bg-blue-50 rounded-xl text-xs font-black">{mockCustomers.length} عملاء</span>
          </h2>
          <p className="text-slate-500 text-sm font-medium">تتبع التواصل، العروض المالية، وسجل التفاعلات التاريخي.</p>
        </div>
        <button className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-sm font-black shadow-lg shadow-blue-100 flex items-center gap-2 transition-all">
          <Plus size={18} /> عميل جديد
        </button>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-lg font-black text-slate-800">قائمة العملاء النشطة</h3>
          <div className="flex gap-2">
            <div className="relative">
              <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="بحث باسم العميل أو الشركة..." 
                className="pr-10 pl-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs w-64 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 transition-colors"><Filter size={18} /></button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">العميل / سجل التواصل</th>
                <th className="px-6 py-4">الشركة</th>
                <th className="px-6 py-4">إجمالي الإيرادات</th>
                <th className="px-6 py-4">الحالة</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockCustomers.filter(c => c.name.includes(searchTerm) || c.company.includes(searchTerm)).map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => setSelectedCustomer(customer)}
                      className="flex items-center gap-4 text-right hover:text-blue-600 transition-all group/name text-slate-700 w-full"
                      title="عرض سجل التواصل"
                    >
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black group-hover/name:bg-blue-600 group-hover/name:text-white transition-all shadow-sm border border-blue-100">
                        <History size={20} className="group-hover/name:scale-110 transition-transform" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-slate-800 group-hover/name:text-blue-600 underline-offset-4 decoration-2 decoration-blue-100 group-hover/name:underline truncate">{customer.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1.5 mt-0.5 whitespace-nowrap">
                           عرض سجل التواصل التاريخي <ArrowUpRight size={10} className="opacity-0 group-hover/name:opacity-100 transition-opacity" />
                        </p>
                      </div>
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-700">{customer.company}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{customer.industry}</p>
                  </td>
                  <td className="px-6 py-4 font-black text-slate-800">{customer.totalRevenue.toLocaleString()} <span className="text-[10px] opacity-40">ر.س</span></td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      customer.status === 'نشط' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
                    }`}>{customer.status}</span>
                  </td>
                  <td className="px-6 py-4 text-left">
                    <button 
                      onClick={() => setSelectedCustomer(customer)}
                      className="p-2 text-slate-300 hover:text-blue-600 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <ChevronRight size={20} className="rotate-180" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Customers;
