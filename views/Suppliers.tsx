
import React, { useState, useMemo } from 'react';
import { Supplier, Transaction } from '../types';
import { 
  Truck, 
  Search, 
  Filter, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  AlertCircle, 
  DollarSign, 
  History,
  Receipt,
  CheckCircle2,
  Download,
  ArrowUpDown,
  Tag,
  ToggleLeft,
  ToggleRight,
  BarChart3,
  Calendar,
  ArrowUpRight,
  Wallet,
  Briefcase,
  ShieldCheck
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

const mockSuppliersData: Supplier[] = [
  { id: 's1', name: 'خدمات أمازون السحابية', company: 'AWS', email: 'billing@aws.com', phone: '1-800-AWS-HELP', category: 'تقنية', status: 'نشط', totalPaid: 45000, balance: 1200, joinDate: '2021-02-10' },
  { id: 's2', name: 'مايكروسوفت الشرق الأوسط', company: 'Microsoft', email: 'sales@microsoft.com.sa', phone: '011-200-3000', category: 'تقنية', status: 'نشط', totalPaid: 120000, balance: 0, joinDate: '2020-05-15' },
  { id: 's3', name: 'مجموعة الموردين للأثاث', company: 'OfficeGroup', email: 'orders@officegroup.sa', phone: '0555444333', category: 'معدات', status: 'نشط', totalPaid: 15000, balance: 500, joinDate: '2022-01-20' },
  { id: 's4', name: 'أرامكس للحلول اللوجستية', company: 'Aramex', email: 'business@aramex.com', phone: '920027447', category: 'خدمات إدارية', status: 'غير نشط', totalPaid: 8500, balance: 0, joinDate: '2021-11-05' },
  { id: 's5', name: 'Cloud Provider X', company: 'CloudProvider Inc.', email: 'support@cloudprovider.com', phone: '123-456-7890', category: 'تقنية', status: 'نشط', totalPaid: 0, balance: 0, joinDate: '2023-11-23' },
];

const mockSupplierTransactions: Transaction[] = [
  { id: 'st1', date: '2023-11-20', description: 'فاتورة اشتراك سيرفرات EC2', amount: -1200, type: 'مصروف', category: 'بنية تحتية وسحابة', supplierId: 's1', isVatApplicable: true, projectId: '1' },
  { id: 'st2', date: '2023-11-15', description: 'تجديد تراخيص Office 365', amount: -25000, type: 'مصروف', category: 'تراخيص برمجية', supplierId: 's2', isVatApplicable: true },
  { id: 'st3', date: '2023-11-05', description: 'فاتورة توريد كراسي مكتبية', amount: -5000, type: 'مصروف', category: 'أخرى', supplierId: 's3', isVatApplicable: true },
];

const getSpendingHistory = (supplierId: string) => [
  { month: 'يوليو', amount: supplierId === 's1' ? 3000 : 5000 },
  { month: 'أغسطس', amount: supplierId === 's1' ? 4200 : 2000 },
  { month: 'سبتمبر', amount: supplierId === 's1' ? 1500 : 8000 },
  { month: 'أكتوبر', amount: supplierId === 's1' ? 3500 : 4500 },
  { month: 'نوفمبر', amount: supplierId === 's1' ? 1200 : 12000 },
];

const SupplierDetail = ({ supplier, onBack }: { supplier: Supplier, onBack: () => void }) => {
  const [activeTab, setActiveTab] = useState<'financial_log' | 'history' | 'info'>('financial_log');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const transactions = useMemo(() => {
    let list = mockSupplierTransactions.filter(t => t.supplierId === supplier.id);
    if (filterCategory !== 'all') list = list.filter(t => t.category === filterCategory);
    return list.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });
  }, [supplier.id, sortOrder, filterCategory]);

  const totalFilteredAmount = useMemo(() => Math.abs(transactions.reduce((acc, t) => acc + t.amount, 0)), [transactions]);

  return (
    <div className="space-y-8 animate-in slide-in-from-left-4 duration-500 pb-12">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-black group">
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> العودة لقائمة الموردين
        </button>
        <div className="flex gap-2">
           <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-50 shadow-sm flex items-center gap-2">
             <Download size={16} /> تصدير السجل
           </button>
           <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-black shadow-lg hover:bg-blue-700 transition-all">
             تعديل المورد
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full -mr-24 -mt-24"></div>
            <div className="w-32 h-32 bg-blue-50 rounded-[2.5rem] flex items-center justify-center text-blue-600 relative z-10 border-4 border-white shadow-xl shrink-0">
              <Truck size={64} />
            </div>
            <div className="flex-1 text-center md:text-right relative z-10 w-full">
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mb-2">
                <h1 className="text-3xl font-black text-slate-800 tracking-tighter">{supplier.name}</h1>
                <span className="px-3 py-1 rounded-full text-[10px] font-black bg-blue-100 text-blue-600 uppercase tracking-widest">
                  {supplier.category}
                </span>
              </div>
              <p className="text-lg font-bold text-slate-400 mb-6">{supplier.company}</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                  <p className="text-[9px] text-slate-400 font-black uppercase mb-1">الرصيد المستحق</p>
                  <p className={`text-sm font-black ${supplier.balance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>{supplier.balance.toLocaleString()} ر.س</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                  <p className="text-[9px] text-slate-400 font-black uppercase mb-1">إجمالي المشتريات</p>
                  <p className="text-sm font-black text-slate-800">{supplier.totalPaid.toLocaleString()} ر.س</p>
                </div>
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
                  <p className="text-[9px] text-emerald-400 font-black uppercase mb-1">حالة الحساب</p>
                  <p className="text-sm font-black text-emerald-700">{supplier.status}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
            <div className="flex border-b border-slate-100 overflow-x-auto no-scrollbar bg-slate-50/50">
              {[
                { id: 'financial_log', label: 'سجل المعاملات والإنفاق', icon: Receipt },
                { id: 'history', label: 'سجل التواصل', icon: History },
                { id: 'info', label: 'العقود والوثائق', icon: DollarSign },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-3 px-8 py-5 text-sm font-black whitespace-nowrap transition-all border-b-4 ${
                    activeTab === tab.id ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-slate-400 hover:text-slate-700'
                  }`}
                >
                  <tab.icon size={18} />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-8">
              {activeTab === 'financial_log' && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="overflow-hidden border border-slate-100 rounded-3xl bg-white">
                    <table className="w-full text-right text-sm">
                      <thead className="bg-slate-50 text-slate-500 font-black uppercase text-[10px] tracking-widest border-b border-slate-100">
                        <tr>
                          <th className="px-8 py-5">المصروف / البند</th>
                          <th className="px-8 py-5">التصنيف</th>
                          <th className="px-8 py-5">التاريخ</th>
                          <th className="px-8 py-5">المبلغ</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {transactions.map((tx) => (
                          <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-8 py-6">
                              <p className="font-black text-slate-700 group-hover:text-blue-600 transition-colors">{tx.description}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-0.5">REF: {tx.id}</p>
                            </td>
                            <td className="px-8 py-6">
                              <span className="flex items-center gap-1.5 text-xs text-slate-600 font-bold">
                                <Tag size={12} className="text-slate-300" /> {tx.category}
                              </span>
                            </td>
                            <td className="px-8 py-6 text-slate-500 text-xs font-bold font-mono">{tx.date}</td>
                            <td className="px-8 py-6 font-black text-base text-slate-700">
                              {Math.abs(tx.amount).toLocaleString()} <span className="text-[10px] opacity-40">ر.س</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {transactions.length === 0 && (
                      <div className="p-20 text-center text-slate-400 font-bold">لا توجد معاملات حالياً لهذا المورد.</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
           <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12 group-hover:scale-110 transition-transform duration-500"><CheckCircle2 size={80} /></div>
              <h4 className="text-sm font-bold text-slate-400 mb-6 uppercase tracking-widest relative z-10 flex items-center gap-2">
                 <ShieldCheck size={18} className="text-emerald-400" /> معلومات الاتصال
              </h4>
              <div className="space-y-4 relative z-10">
                 <div className="p-5 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-2">البريد الإلكتروني</p>
                    <p className="text-sm font-bold truncate">{supplier.email}</p>
                 </div>
                 <div className="p-5 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-2">رقم الهاتف</p>
                    <p className="text-lg font-bold">{supplier.phone}</p>
                 </div>
                 <button className="w-full py-4 bg-blue-600 rounded-2xl text-xs font-black shadow-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 active:scale-95">
                   <Mail size={18} /> مراسلة المورد
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const Suppliers = () => {
  const [suppliersList, setSuppliersList] = useState<Supplier[]>(mockSuppliersData);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleStatus = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); 
    setSuppliersList(prev => prev.map(s => {
      if (s.id === id) return { ...s, status: s.status === 'نشط' ? 'غير نشط' : 'نشط' };
      return s;
    }));
  };

  if (selectedSupplier) return <SupplierDetail supplier={selectedSupplier} onBack={() => setSelectedSupplier(null)} />;

  const filteredSuppliers = suppliersList.filter(s => 
    s.name.includes(searchTerm) || s.company.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tighter flex items-center gap-3">
             إدارة الموردين <span className="text-blue-600 px-3 py-1 bg-blue-50 rounded-xl text-xs font-black">{suppliersList.length}</span>
          </h2>
          <p className="text-slate-500 text-sm font-medium">إدارة المشتريات التقنية، البنية التحتية، والموردين الخارجيين.</p>
        </div>
        <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-sm font-black shadow-lg flex items-center gap-2 transition-all">
          <Plus size={18} /> مورد جديد
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/30">
          <h3 className="text-lg font-black text-slate-800">قائمة الموردين المعتمدين</h3>
          <div className="relative">
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="بحث باسم المورد..." 
              className="pr-10 pl-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs w-64 outline-none focus:ring-2 focus:ring-blue-500 font-bold"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
              <tr>
                <th className="px-8 py-5 uppercase text-[10px] tracking-widest">المورد / الفئة</th>
                <th className="px-8 py-5 uppercase text-[10px] tracking-widest">الشركة</th>
                <th className="px-8 py-5 uppercase text-[10px] tracking-widest">إجمالي المشتريات</th>
                <th className="px-8 py-5 uppercase text-[10px] tracking-widest">الرصيد</th>
                <th className="px-8 py-5 uppercase text-[10px] tracking-widest text-center">الحالة</th>
                <th className="px-8 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSuppliers.map((supplier) => (
                <tr key={supplier.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer" onClick={() => setSelectedSupplier(supplier)}>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black transition-all">
                        <Truck size={20} />
                      </div>
                      <div>
                        <p className="font-black text-slate-800 group-hover:text-blue-600">{supplier.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{supplier.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 font-bold text-slate-700">{supplier.company}</td>
                  <td className="px-8 py-5 font-black text-slate-800">{supplier.totalPaid.toLocaleString()} ر.س</td>
                  <td className="px-8 py-5">
                    <p className={`font-black ${supplier.balance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>{supplier.balance.toLocaleString()} ر.س</p>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col items-center gap-1">
                      <button 
                        onClick={(e) => toggleStatus(supplier.id, e)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${supplier.status === 'نشط' ? 'bg-emerald-500' : 'bg-slate-200'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${supplier.status === 'نشط' ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                      <span className="text-[8px] font-black uppercase text-slate-400">{supplier.status === 'نشط' ? 'Active' : 'Inactive'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-left">
                    <ChevronRight size={20} className="rotate-180 text-slate-300 group-hover:text-blue-600 transition-all" />
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

export default Suppliers;
