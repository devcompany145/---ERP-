
import React, { useState } from 'react';
// Fixed: Removed non-existent export 'ContractType' from '../types'
import { Contract, ContractStatus } from '../types';
import { 
  FileText, 
  Clock, 
  Calendar, 
  RefreshCw, 
  AlertTriangle, 
  Plus, 
  Search, 
  Filter, 
  ChevronRight,
  ArrowUpRight,
  BadgeDollarSign,
  Briefcase
} from 'lucide-react';

const mockContracts: Contract[] = [
  {
    id: 'c1',
    title: 'تطوير تطبيق الهوية الرقمية',
    client: 'وزارة الاتصالات',
    type: 'تطوير',
    status: 'نشط',
    startDate: '2023-01-01',
    endDate: '2024-01-01',
    value: 450000,
    billingCycle: 'مرة واحدة',
    autoRenew: false,
    projectId: '1'
  },
  {
    id: 'c2',
    title: 'اشتراك صيانة سنوي - متجر الرياض',
    client: 'متجر الرياض',
    type: 'اشتراك سنوي',
    status: 'قيد التجديد',
    startDate: '2023-11-01',
    endDate: '2023-12-01',
    value: 12000,
    billingCycle: 'سنوي',
    autoRenew: true,
    projectId: '2'
  },
  {
    id: 'c3',
    title: 'خدمات سحابية وإدارة سيرفرات',
    client: 'لوجستيك العرب',
    type: 'صيانة',
    status: 'نشط',
    startDate: '2023-06-15',
    endDate: '2024-06-15',
    value: 5000,
    billingCycle: 'شهري',
    autoRenew: true
  },
  {
    id: 'c4',
    title: 'رخصة استخدام منصة ERP',
    client: 'مجموعة المجدوعي',
    type: 'اشتراك شهري',
    status: 'نشط',
    startDate: '2023-10-01',
    endDate: '2023-11-01',
    value: 2500,
    billingCycle: 'شهري',
    autoRenew: true
  },
];

const StatusBadge = ({ status }: { status: ContractStatus }) => {
  const colors: any = {
    'نشط': 'bg-emerald-100 text-emerald-600',
    'منتهي': 'bg-rose-100 text-rose-600',
    'قيد التجديد': 'bg-amber-100 text-amber-600',
    'مسودة': 'bg-slate-100 text-slate-500',
  };
  return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${colors[status]}`}>{status}</span>;
};

const Contracts = () => {
  const [filter, setFilter] = useState('');

  const expiringSoon = mockContracts.filter(c => c.status === 'قيد التجديد');
  const mrr = mockContracts
    .filter(c => c.status === 'نشط' && c.billingCycle === 'شهري')
    .reduce((acc, c) => acc + c.value, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">إدارة العقود والاشتراكات</h2>
          <p className="text-slate-500 text-sm">متابعة عقود التطوير، الصيانة، والاشتراكات الشهرية والسنوية.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold shadow-lg shadow-blue-100 flex items-center gap-2">
            <Plus size={18} /> عقد جديد
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500 opacity-[0.03] rounded-bl-full"></div>
          <p className="text-slate-500 text-xs font-bold uppercase mb-1">الدخل الشهري المتكرر (MRR)</p>
          <h3 className="text-3xl font-bold text-slate-800">{mrr.toLocaleString()} ر.س</h3>
          <p className="text-xs text-emerald-500 font-semibold mt-2 flex items-center gap-1">
             <ArrowUpRight size={12} /> +2,500 عن الشهر الماضي
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500 opacity-[0.03] rounded-bl-full"></div>
          <p className="text-slate-500 text-xs font-bold uppercase mb-1">عقود تنتهي قريباً</p>
          <h3 className="text-3xl font-bold text-amber-600">{expiringSoon.length} عقود</h3>
          <p className="text-xs text-slate-400 mt-2">تتطلب إجراء سريع للتجديد</p>
        </div>
        <div className="bg-slate-900 p-6 rounded-2xl text-white shadow-lg relative overflow-hidden">
          <p className="text-slate-400 text-xs font-bold uppercase mb-1">إجمالي قيمة العقود النشطة</p>
          <h3 className="text-3xl font-bold">1,250,000 ر.س</h3>
          <div className="mt-4 flex gap-2">
            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full font-bold">85% تم تحصيلها</span>
          </div>
        </div>
      </div>

      {/* Alert Section */}
      {expiringSoon.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-4 animate-pulse">
          <div className="p-2 bg-amber-100 text-amber-600 rounded-xl">
            <AlertTriangle size={24} />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-amber-800 text-sm">تنبيه: عقود تقترب من الانتهاء</h4>
            <p className="text-xs text-amber-700 mt-1">
              لديك {expiringSoon.length} عقود ستنتهي خلال الـ 30 يوماً القادمة. يرجى التواصل مع العملاء لتجنب انقطاع الخدمة.
            </p>
          </div>
          <button className="px-4 py-2 bg-amber-600 text-white rounded-lg text-xs font-bold shadow-sm">إدارة التجديدات</button>
        </div>
      )}

      {/* Contract Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-slate-800">قائمة العقود والاشتراكات</h3>
          <div className="flex gap-2">
            <div className="relative">
              <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="بحث عن عقد أو عميل..." 
                className="pr-10 pl-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs w-64"
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
            <button className="p-2 bg-slate-50 text-slate-600 rounded-lg border border-slate-200"><Filter size={16} /></button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-slate-50 text-slate-500 font-bold">
              <tr>
                <th className="px-6 py-4">العقد / العميل</th>
                <th className="px-6 py-4">النوع</th>
                <th className="px-6 py-4">الدورة المحاسبية</th>
                <th className="px-6 py-4">القيمة</th>
                <th className="px-6 py-4">تاريخ الانتهاء</th>
                <th className="px-6 py-4">الحالة</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockContracts.map((contract) => (
                <tr key={contract.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                        <FileText size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{contract.title}</p>
                        <p className="text-xs text-slate-500">{contract.client}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">{contract.type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <RefreshCw size={12} className={contract.autoRenew ? 'text-blue-500' : 'text-slate-300'} />
                      {contract.billingCycle}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-800">{contract.value.toLocaleString()} ر.س</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-slate-400" />
                      <span className={`text-xs ${contract.status === 'قيد التجديد' ? 'text-amber-600 font-bold' : 'text-slate-500'}`}>
                        {contract.endDate}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={contract.status} />
                  </td>
                  <td className="px-6 py-4 text-left">
                    <button className="p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all">
                      <ChevronRight size={18} className="rotate-180" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Integration Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
        <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <BadgeDollarSign size={24} />
            </div>
            <h4 className="font-bold text-indigo-900">ربط العقود بالمالية</h4>
          </div>
          <p className="text-sm text-indigo-800 mb-4 leading-relaxed">
            يتم إصدار الفواتير تلقائياً للعقود ذات الدورة المحاسبية "شهري" و "سنوي" في تاريخ الاستحقاق. يمكنك مراجعة الفواتير المصدرة في قسم المالية.
          </p>
          <div className="flex gap-2">
             <button className="text-xs font-bold bg-indigo-600 text-white px-4 py-2 rounded-lg">إعدادات الفوترة التلقائية</button>
             <button className="text-xs font-bold text-indigo-600 px-4 py-2 border border-indigo-200 rounded-lg bg-white">سجل العمليات الآلية</button>
          </div>
        </div>

        <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <Briefcase size={24} />
            </div>
            <h4 className="font-bold text-emerald-900">ربط العقود بالمشاريع</h4>
          </div>
          <p className="text-sm text-emerald-800 mb-4 leading-relaxed">
            تأكد من ربط كل عقد تطوير بمشروع تقني لضمان تتبع التكاليف والأرباح بدقة. النظام يقوم باحتساب الربحية بناءً على قيمة العقد مقابل تكلفة ساعات العمل.
          </p>
          <button className="text-xs font-bold bg-emerald-600 text-white px-4 py-2 rounded-lg">تدقيق ربحية المشاريع</button>
        </div>
      </div>
    </div>
  );
};

export default Contracts;
