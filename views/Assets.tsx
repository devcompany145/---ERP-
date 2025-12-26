import React, { useState } from 'react';
import { Asset, AssetCategory, AssetStatus } from '../types';
import { 
  Package, 
  Search, 
  Filter, 
  Plus, 
  Monitor, 
  Armchair, 
  FileCode, 
  Truck, 
  Wallet,
  Calendar,
  User,
  MapPin,
  TrendingDown,
  AlertCircle,
  MoreVertical,
  ChevronRight,
  ShieldCheck,
  History,
  Wrench,
  Globe,
  Cloud,
  Server
} from 'lucide-react';

const mockAssets: Asset[] = [
  { id: 'a1', name: 'MacBook Pro M2 14"', code: 'AST-TEC-001', category: 'أجهزة تقنية', purchaseDate: '2023-01-10', purchaseValue: 9500, currentValue: 8200, assignedTo: '1', location: 'المكتب الرئيسي', status: 'نشط', specifications: '16GB RAM, 512GB SSD' },
  { id: 'a2', name: 'سيرفر تخزين داخلي', code: 'AST-SRV-001', category: 'أجهزة تقنية', purchaseDate: '2022-05-15', purchaseValue: 15000, currentValue: 11000, location: 'غرفة السيرفرات', status: 'تحت الصيانة', specifications: 'Dell PowerEdge, 32TB RAID', lastMaintenance: '2023-10-01' },
  { id: 'a3', name: 'مجموعة كراسي إرجونوميك', code: 'AST-FUR-012', category: 'أثاث مكتبي', purchaseDate: '2023-03-20', purchaseValue: 4500, currentValue: 4000, location: 'صالة الموظفين', status: 'نشط' },
  { id: 'a4', name: 'ترخيص JetBrains (فريق)', code: 'AST-LIC-005', category: 'تراخيص برمجية', purchaseDate: '2023-11-01', purchaseValue: 12000, currentValue: 12000, location: 'السحابة', status: 'نشط', specifications: 'تجديد سنوي لـ 10 مقاعد' },
  { id: 'a5', name: 'سيارة الخدمات - تويوتا', code: 'AST-VEH-001', category: 'مركبات', purchaseDate: '2021-08-10', purchaseValue: 85000, currentValue: 62000, assignedTo: '4', location: 'المستودع', status: 'نشط' },
  { id: 'a6', name: 'نطاق tech-corp.sa', code: 'AST-DOM-001', category: 'أصول غير ملموسة', purchaseDate: '2023-05-12', purchaseValue: 350, currentValue: 350, location: 'السجل الوطني (SaudiNIC)', status: 'نشط', specifications: 'تجديد سنوي - الدومين الرئيسي' },
  { id: 'a7', name: 'خادم AWS EC2 (Production)', code: 'AST-CLD-001', category: 'أصول غير ملموسة', purchaseDate: '2022-01-01', purchaseValue: 0, currentValue: 0, location: 'منطقة أيرلندا (eu-west-1)', status: 'نشط', specifications: 'Instance: m5.xlarge, 100GB EBS' },
];

const CategoryIcon = ({ category, size = 20 }: { category: AssetCategory, size?: number }) => {
  switch (category) {
    case 'أجهزة تقنية': return <Monitor size={size} />;
    case 'أثاث مكتبي': return <Armchair size={size} />;
    case 'تراخيص برمجية': return <FileCode size={size} />;
    case 'مركبات': return <Truck size={size} />;
    case 'أصول نقدية': return <Wallet size={size} />;
    case 'أصول غير ملموسة': return <Globe size={size} />;
  }
};

const StatusBadge = ({ status }: { status: AssetStatus }) => {
  const styles: any = {
    'نشط': 'bg-emerald-100 text-emerald-600',
    'تحت الصيانة': 'bg-amber-100 text-amber-600',
    'مستهلك': 'bg-slate-100 text-slate-500',
    'مفقود': 'bg-rose-100 text-rose-600',
  };
  return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${styles[status]}`}>{status}</span>;
};

const Assets = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory | 'all'>('all');

  const filteredAssets = mockAssets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) || asset.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || asset.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalValue = mockAssets.reduce((acc, curr) => acc + curr.currentValue, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Package className="text-blue-600" /> إدارة أصول الشركة
          </h2>
          <p className="text-slate-500 text-sm">تتبع الممتلكات، العهد الشخصية، والإهلاك المالي للأصول التقنية، الدومينات، والسيرفرات.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold shadow-lg shadow-blue-100 flex items-center gap-2">
            <Plus size={18} /> إضافة أصل جديد
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><Package size={20}/></div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase">إجمالي الأصول</p>
            <p className="text-lg font-bold text-slate-800">{mockAssets.length} قطع</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center"><ShieldCheck size={20}/></div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase">القيمة الدفترية</p>
            <p className="text-lg font-bold text-emerald-600">{totalValue.toLocaleString()} ر.س</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center"><Globe size={20}/></div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase">أصول غير ملموسة</p>
            <p className="text-lg font-bold text-indigo-600">{mockAssets.filter(a => a.category === 'أصول غير ملموسة').length} بنود</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center"><TrendingDown size={20}/></div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase">معدل الإهلاك السنوي</p>
            <p className="text-lg font-bold text-rose-600">12%</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="بحث بالاسم، الكود، أو الدومين..." 
            className="w-full pr-10 pl-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0">
          {['all', 'أجهزة تقنية', 'أصول غير ملموسة', 'تراخيص برمجية', 'أثاث مكتبي', 'مركبات'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat as any)}
              className={`px-4 py-2 rounded-xl text-[10px] font-bold whitespace-nowrap transition-all border ${
                selectedCategory === cat 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100' 
                  : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat === 'all' ? 'الكل' : cat === 'أصول غير ملموسة' ? 'دومينات وسيرفرات' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Asset Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-right text-sm">
          <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
            <tr>
              <th className="px-6 py-4">الأصل / الكود</th>
              <th className="px-6 py-4">التصنيف</th>
              <th className="px-6 py-4">الموقع / العهدة</th>
              <th className="px-6 py-4">القيمة الحالية</th>
              <th className="px-6 py-4">الحالة</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredAssets.map((asset) => (
              <tr key={asset.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 bg-slate-100 text-slate-500 rounded-xl flex items-center justify-center ${asset.category === 'أصول غير ملموسة' ? 'bg-indigo-50 text-indigo-600' : ''}`}>
                      <CategoryIcon category={asset.category} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{asset.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono uppercase">{asset.code}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs text-slate-600 font-medium">
                    {asset.category === 'أصول غير ملموسة' ? 'أصول غير ملموسة (رقمية)' : asset.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      {asset.category === 'أصول غير ملموسة' ? <Cloud size={12} className="text-blue-400" /> : <MapPin size={12} className="text-slate-400" />}
                      {asset.location}
                    </div>
                    {asset.assignedTo && (
                      <div className="flex items-center gap-1.5 text-[10px] text-blue-600 font-bold">
                        <User size={12} /> بعهدة الموظف #{asset.assignedTo}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-slate-700">
                  {asset.purchaseValue === 0 ? 'تكلفة تشغيلية' : `${asset.currentValue.toLocaleString()} ر.س`}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={asset.status} />
                </td>
                <td className="px-6 py-4 text-left">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-slate-300 hover:text-blue-600 transition-colors"><History size={18} /></button>
                    <button className="p-2 text-slate-300 hover:text-blue-600 transition-colors"><MoreVertical size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredAssets.length === 0 && (
          <div className="p-20 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
               <AlertCircle size={32} className="text-slate-300" />
            </div>
            <p className="text-slate-500 font-bold">لم يتم العثور على أصول مطابقة</p>
            <p className="text-xs text-slate-400">حاول تغيير فلاتر البحث أو إضافة أصل جديد.</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">
         <div className="bg-indigo-50 p-8 rounded-3xl border border-indigo-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10"><Globe size={120} /></div>
            <h3 className="text-lg font-bold text-indigo-900 mb-4 flex items-center gap-2 relative z-10"><Globe size={20} /> إدارة الدومينات والسيرفرات</h3>
            <p className="text-sm text-indigo-800 leading-relaxed mb-6 relative z-10">
              يمكنك هنا تسجيل جميع أصولك الرقمية بما في ذلك عناوين الـ IP، النطاقات (Domains)، ومواقع استضافة الكود (Repositories) لضمان حصر ممتلكات الشركة غير الملموسة.
            </p>
            <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg hover:bg-indigo-700 transition-all flex items-center gap-2 relative z-10">
              إضافة أصل رقمي جديد <ChevronRight size={14} className="rotate-180" />
            </button>
         </div>

         <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2"><Wrench size={20} className="text-amber-500" /> صيانة وتجديد الأصول</h3>
            <div className="space-y-4">
               <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-amber-500 shadow-sm"><Monitor size={20} /></div>
                     <div>
                        <p className="text-xs font-bold text-slate-800">سيرفر تخزين داخلي</p>
                        <p className="text-[10px] text-slate-500">تحديث نظام التبريد - متوقع الانتهاء: غداً</p>
                     </div>
                  </div>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-600 rounded-full text-[9px] font-bold">قيد العمل</span>
               </div>
               <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl border border-blue-100">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-500 shadow-sm"><Globe size={20} /></div>
                     <div>
                        <p className="text-xs font-bold text-slate-800">tech-corp.sa</p>
                        <p className="text-[10px] text-slate-500">تذكير: التجديد السنوي خلال 15 يوم</p>
                     </div>
                  </div>
                  <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-[9px] font-bold">تجديد الآن</button>
               </div>
               <button className="w-full py-3 border-2 border-dashed border-slate-100 text-slate-400 rounded-2xl text-[10px] font-bold hover:bg-slate-50 transition-all">فتح تذكرة صيانة/تجديد</button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Assets;