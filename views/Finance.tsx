
import React, { useState, useRef, useMemo } from 'react';
import { 
  DollarSign, 
  ArrowUp, 
  ArrowDown, 
  FileText,
  Calendar,
  Filter,
  Sparkles,
  Loader2,
  TrendingUp,
  AlertCircle,
  Lightbulb,
  PieChart,
  Plus,
  Receipt,
  Download,
  Building,
  Printer,
  ChevronLeft,
  Search,
  Upload,
  FileSpreadsheet,
  Info,
  CheckCircle2 as CheckIcon,
  RefreshCw,
  ArrowUpRight,
  ShieldCheck,
  ShoppingCart,
  CreditCard,
  Tag,
  X,
  Save,
  Wallet,
  Briefcase,
  ArrowRightLeft
} from 'lucide-react';
import { getAIInsights } from '../services/geminiService';
import { Transaction, Invoice, IncomeCategory, ExpenseCategory } from '../types';

const INCOME_CATEGORIES: IncomeCategory[] = ['مشاريع برمجية', 'خدمات استشارية', 'اشتراكات SaaS', 'مبيعات أجهزة', 'أخرى'];
const EXPENSE_CATEGORIES: ExpenseCategory[] = ['رواتب وأجور', 'بنية تحتية وسحابة', 'إيجارات ومرافق', 'تسويق وإعلان', 'تراخيص برمجية', 'أخرى'];

const mockTransactions: Transaction[] = [
  { id: '1', date: '2023-11-20', description: 'عقد تطوير تطبيق التوصيل', amount: 25000, type: 'دخل', category: 'مشاريع برمجية', projectId: '1', isVatApplicable: true },
  { id: '2', date: '2023-11-18', description: 'اشتراك AWS سيرفرات', amount: -1200, type: 'مصروف', category: 'بنية تحتية وسحابة', isVatApplicable: true },
  { id: '3', date: '2023-11-15', description: 'رواتب الموظفين - شهر نوفمبر', amount: -65000, type: 'مصروف', category: 'رواتب وأجور', isVatApplicable: false },
  { id: '4', date: '2023-11-12', description: 'دفعة مشروع متجر الرياض', amount: 15000, type: 'دخل', category: 'مشاريع برمجية', projectId: '2', isVatApplicable: true },
  { id: '5', date: '2023-11-10', description: 'استشارة تقنية - حلول سحابية', amount: 5000, type: 'دخل', category: 'خدمات استشارية', isVatApplicable: true },
  { id: '6', date: '2023-11-05', description: 'إيجار المكتب - الربع الأخير', amount: -10000, type: 'مصروف', category: 'إيجارات ومرافق', isVatApplicable: true },
];

const initialInvoices: Invoice[] = [
  { id: 'inv1', number: 'INV-2023-001', client: 'شركة الأغذية المتحدة', projectId: '1', date: '2023-11-01', dueDate: '2023-11-15', subtotal: 21739, vatAmount: 3261, total: 25000, status: 'paid' },
  { id: 'inv2', number: 'INV-2023-002', client: 'متجر الرياض', projectId: '2', date: '2023-11-10', dueDate: '2023-11-24', subtotal: 13043, vatAmount: 1957, total: 15000, status: 'sent' },
  { id: 'inv3', number: 'INV-2023-003', client: 'لوجستيك العرب', projectId: '3', date: '2023-11-20', dueDate: '2023-12-04', subtotal: 43478, vatAmount: 6522, total: 50000, status: 'draft' },
];

type FinanceTab = 'overview' | 'expenses' | 'ledger' | 'invoices' | 'vat';

const Finance = () => {
  const [activeTab, setActiveTab] = useState<FinanceTab>('overview');
  const [insights, setInsights] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'دخل' | 'مصروف'>('مصروف');

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    const context = {
      transactions: transactions,
      invoices: invoices,
      vatSummary: {
        vatCollected: invoices.filter(i => i.status === 'paid').reduce((acc, i) => acc + i.vatAmount, 0),
        vatPaid: Math.abs(transactions.filter(t => t.type === 'مصروف' && t.isVatApplicable).reduce((acc, t) => acc + (t.amount * 0.15), 0)),
      }
    };
    
    const result = await getAIInsights(context);
    setInsights(result || "تعذر الحصول على التحليلات حالياً.");
    setIsAnalyzing(false);
  };

  const handleAddTransaction = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const rawAmount = Number(formData.get('amount'));
    const amount = modalType === 'دخل' ? Math.abs(rawAmount) : -Math.abs(rawAmount);
    
    const newTx: Transaction = {
      id: Date.now().toString(),
      date: formData.get('date') as string,
      description: formData.get('description') as string,
      amount: amount,
      type: modalType,
      category: formData.get('category') as any,
      projectId: formData.get('projectId') as string || undefined,
      isVatApplicable: formData.get('vat') === 'on',
    };
    setTransactions([newTx, ...transactions]);
    setIsTransactionModalOpen(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab insights={insights} isAnalyzing={isAnalyzing} onAnalyze={handleAnalyze} />;
      case 'expenses': return <ExpensesTab transactions={transactions} openModal={() => { setModalType('مصروف'); setIsTransactionModalOpen(true); }} />;
      case 'ledger': return <LedgerTab transactions={transactions} />;
      case 'invoices': return <InvoicesTab invoices={invoices} setInvoices={setInvoices} />;
      case 'vat': return <VatTab transactions={transactions} invoices={invoices} />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tighter">المحاسبة والمالية الذكية</h2>
          <p className="text-slate-500 text-sm font-medium">إدارة المشتريات، الفواتير، والتحليل المالي المدعوم بالذكاء الاصطناعي.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => { setModalType('دخل'); setIsTransactionModalOpen(true); }}
            className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 text-sm font-black shadow-lg shadow-emerald-100 transition-all active:scale-95"
          >
            تسجيل دخل +
          </button>
          <button 
            onClick={() => { setModalType('مصروف'); setIsTransactionModalOpen(true); }}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-sm font-black shadow-lg shadow-blue-100 transition-all active:scale-95"
          >
            تسجيل مصروف +
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[650px]">
        <div className="flex border-b border-slate-100 overflow-x-auto no-scrollbar bg-slate-50/50">
          {[
            { id: 'overview', label: 'نظرة عامة', icon: PieChart },
            { id: 'expenses', label: 'المصروفات والمشتريات', icon: ShoppingCart },
            { id: 'invoices', label: 'الفواتير والتحصيل', icon: Receipt },
            { id: 'ledger', label: 'دفتر الأستاذ', icon: FileText },
            { id: 'vat', label: 'الزكاة والضريبة', icon: Building },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as FinanceTab)}
              className={`flex items-center gap-3 px-8 py-5 text-sm font-black whitespace-nowrap transition-all border-b-4 ${
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
          {renderTabContent()}
        </div>
      </div>

      {/* Unified Transaction Modal */}
      {isTransactionModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
           <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                 <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xl ${modalType === 'دخل' ? 'bg-emerald-500 shadow-emerald-200' : 'bg-rose-500 shadow-rose-200'}`}>
                       {modalType === 'دخل' ? <TrendingUp size={24} /> : <ShoppingCart size={24} />}
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-slate-800">تسجيل {modalType}</h3>
                       <p className="text-xs text-slate-500 font-medium mt-1">أدخل تفاصيل العملية المالية بدقة</p>
                    </div>
                 </div>
                 <button onClick={() => setIsTransactionModalOpen(false)} className="p-2 text-slate-400 hover:text-rose-500 rounded-xl transition-all"><X size={24} /></button>
              </div>
              <form onSubmit={handleAddTransaction} className="p-8 space-y-6">
                 {/* Type Switcher in modal */}
                 <div className="flex bg-slate-100 p-1 rounded-2xl">
                    <button 
                      type="button"
                      onClick={() => setModalType('دخل')}
                      className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${modalType === 'دخل' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}
                    >دخل</button>
                    <button 
                      type="button"
                      onClick={() => setModalType('مصروف')}
                      className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${modalType === 'مصروف' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500'}`}
                    >مصروف</button>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">الوصف / التفاصيل</label>
                    <input name="description" required placeholder="وصف المعاملة..." className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">المبلغ (ر.س)</label>
                       <input name="amount" type="number" required placeholder="0.00" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">التاريخ</label>
                       <input name="date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none" />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">التصنيف</label>
                       <select name="category" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none">
                          {modalType === 'دخل' 
                            ? INCOME_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)
                            : EXPENSE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)
                          }
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">المشروع المرتبط</label>
                       <select name="projectId" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none">
                          <option value="">لا يوجد (معاملة عامة)</option>
                          <option value="1">تطبيق التوصيل الذكي</option>
                          <option value="2">متجر الرياض</option>
                       </select>
                    </div>
                 </div>

                 <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <input type="checkbox" name="vat" id="vat-check" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
                    <label htmlFor="vat-check" className="text-xs font-bold text-slate-600">المعاملة تخضع لضريبة القيمة المضافة (15%)</label>
                 </div>

                 <div className="flex gap-4 pt-4">
                    <button type="button" onClick={() => setIsTransactionModalOpen(false)} className="flex-1 py-4 text-slate-600 font-black bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all">إلغاء</button>
                    <button type="submit" className={`flex-[2] py-4 text-white font-black rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 ${modalType === 'دخل' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'}`}>
                       <Save size={20} /> حفظ {modalType}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

const ExpensesTab = ({ transactions, openModal }: { transactions: Transaction[], openModal: () => void }) => {
  const expenseList = transactions.filter(tx => tx.type === 'مصروف');
  const totalExpenses = Math.abs(expenseList.reduce((acc, tx) => acc + tx.amount, 0));

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-400">
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm border-r-8 border-r-rose-500">
             <p className="text-slate-400 text-[10px] font-black uppercase mb-1 tracking-widest">إجمالي المصروفات (هذا الشهر)</p>
             <h3 className="text-3xl font-black text-slate-800 tracking-tighter">{totalExpenses.toLocaleString()} <span className="text-sm font-bold text-slate-300">ر.س</span></h3>
             <div className="mt-4 flex gap-2">
                <span className="px-2 py-0.5 bg-rose-50 text-rose-600 rounded text-[9px] font-black">+4% عن الشهر السابق</span>
             </div>
          </div>
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm border-r-8 border-r-blue-500">
             <p className="text-slate-400 text-[10px] font-black uppercase mb-1 tracking-widest">المصروفات التقنية (Cloud/SaaS)</p>
             <h3 className="text-3xl font-black text-slate-800 tracking-tighter">
                {Math.abs(expenseList.filter(e => e.category === 'بنية تحتية وسحابة').reduce((acc, e) => acc + e.amount, 0)).toLocaleString()} 
                <span className="text-sm font-bold text-slate-300">ر.س</span>
             </h3>
             <p className="text-[10px] text-slate-400 mt-2 font-medium">تشكل 32% من إجمالي المصاريف</p>
          </div>
          <div className="bg-slate-900 p-8 rounded-[2rem] text-white shadow-xl relative overflow-hidden flex items-center justify-between">
             <div className="relative z-10">
                <p className="text-slate-400 text-[10px] font-black uppercase mb-2 tracking-widest">تحكم سريع</p>
                <button 
                  onClick={openModal}
                  className="px-6 py-3 bg-white text-slate-900 rounded-xl font-black text-xs hover:bg-slate-100 transition-all flex items-center gap-2 shadow-lg"
                >
                   <Plus size={16} /> إضافة مشتريات
                </button>
             </div>
             <ShoppingCart className="absolute right-[-20px] bottom-[-20px] w-40 h-40 opacity-5 rotate-12" />
          </div>
       </div>

       <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
             <h3 className="font-black text-slate-800 flex items-center gap-2"><CreditCard size={20} className="text-blue-600" /> سجل المشتريات والمصروفات</h3>
             <div className="flex gap-2">
                <div className="relative">
                   <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                   <input type="text" placeholder="بحث..." className="pr-10 pl-4 py-2 bg-white border border-slate-200 rounded-xl text-xs w-48 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <button className="p-2 bg-white border border-slate-200 text-slate-500 rounded-xl"><Filter size={16}/></button>
             </div>
          </div>
          <div className="overflow-x-auto">
             <table className="w-full text-right text-sm">
                <thead className="bg-slate-50 text-slate-500 font-bold text-[10px] uppercase border-b border-slate-100">
                   <tr>
                      <th className="px-8 py-5">المصروف / المورد</th>
                      <th className="px-8 py-5">التصنيف</th>
                      <th className="px-8 py-5 text-center">مشروع مرتبط</th>
                      <th className="px-8 py-5">التاريخ</th>
                      <th className="px-8 py-5">المبلغ</th>
                      <th className="px-8 py-5 text-center">VAT</th>
                      <th className="px-8 py-5"></th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {expenseList.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors group">
                         <td className="px-8 py-5">
                            <div className="flex items-center gap-3">
                               <div className="w-9 h-9 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center shadow-sm">
                                  <Wallet size={18} />
                               </div>
                               <div>
                                  <p className="font-bold text-slate-800">{tx.description}</p>
                                  <p className="text-[10px] text-slate-400 font-medium">الرقم المرجعي: #{tx.id}</p>
                               </div>
                            </div>
                         </td>
                         <td className="px-8 py-5">
                            <span className="flex items-center gap-1.5 text-xs text-slate-600 font-bold">
                               <Tag size={12} className="text-slate-300" /> {tx.category}
                            </span>
                         </td>
                         <td className="px-8 py-5 text-center">
                            {tx.projectId ? (
                               <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black border border-blue-100">مشروع #{tx.projectId}</span>
                            ) : (
                               <span className="text-slate-300 text-[10px] font-bold">مصروف إداري</span>
                            )}
                         </td>
                         <td className="px-8 py-5 text-xs text-slate-500 font-bold font-mono">{tx.date}</td>
                         <td className="px-8 py-5">
                            <p className="font-black text-slate-700 text-base">{Math.abs(tx.amount).toLocaleString()} <span className="text-[10px] opacity-40">ر.س</span></p>
                         </td>
                         <td className="px-8 py-5 text-center">
                            {tx.isVatApplicable ? (
                               <span className="text-emerald-500 flex items-center justify-center gap-1 text-[10px] font-black"><CheckIcon size={14}/> 15%</span>
                            ) : (
                               <span className="text-slate-300 text-[10px] font-bold">0%</span>
                            )}
                         </td>
                         <td className="px-8 py-5 text-left">
                            <button className="p-2 text-slate-300 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all"><ArrowUpRight size={18}/></button>
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

const OverviewTab = ({ insights, isAnalyzing, onAnalyze }: any) => (
  <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-400">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-slate-900 p-8 rounded-[2rem] text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><DollarSign size={120} /></div>
        <p className="text-slate-400 text-xs font-black uppercase mb-1 tracking-widest relative z-10">إجمالي السيولة النقدية</p>
        <h3 className="text-4xl font-black relative z-10 tracking-tighter">184,500.00 <span className="text-sm font-bold opacity-50">ر.س</span></h3>
        <p className="text-xs text-emerald-400 mt-6 font-bold flex items-center gap-1 relative z-10">
          <TrendingUp size={14} /> +12% نمو مقارنة بالشهر السابق
        </p>
      </div>
      <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm border-r-8 border-r-emerald-500 group hover:shadow-md transition-shadow">
        <p className="text-slate-400 text-xs font-black uppercase mb-1 tracking-widest">المستحقات غير المحصلة</p>
        <h3 className="text-3xl font-black text-slate-800 tracking-tighter">65,000.00 <span className="text-sm font-bold text-slate-300">ر.س</span></h3>
        <p className="text-xs text-slate-400 mt-6 font-medium">3 فواتير نشطة بانتظار السداد</p>
      </div>
      <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm border-r-8 border-r-rose-500 group hover:shadow-md transition-shadow">
        <p className="text-slate-400 text-xs font-black uppercase mb-1 tracking-widest">ضريبة القيمة المضافة (المقدرة)</p>
        <h3 className="text-3xl font-black text-slate-800 tracking-tighter">8,450.00 <span className="text-sm font-bold text-slate-300">ر.س</span></h3>
        <p className="text-xs text-rose-500 font-black mt-6 uppercase tracking-tighter">مستحقة للدفع في 31 ديسمبر</p>
      </div>
    </div>

    <div className="bg-blue-600 p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-10"><Sparkles size={160} /></div>
      <div className="relative z-10">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-xl">
                <Sparkles size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-black tracking-tight">رؤى مالية ذكية (AI Finance)</h3>
                <p className="text-blue-100 text-sm font-medium mt-1">يقوم نظام Gemini بتحليل تدفقاتك النقدية لتقديم توصيات استباقية.</p>
              </div>
            </div>
            <button 
              onClick={onAnalyze}
              disabled={isAnalyzing}
              className="px-8 py-3 bg-white text-blue-600 rounded-2xl font-black text-sm shadow-2xl shadow-blue-900/20 hover:bg-blue-50 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
            >
              {isAnalyzing ? <Loader2 size={20} className="animate-spin" /> : <RefreshCw size={20} />}
              تحديث التحليل الحالي
            </button>
         </div>

         {insights ? (
           <div className="bg-white/10 backdrop-blur-xl rounded-[2rem] p-8 border border-white/10 text-white/90 leading-relaxed shadow-inner animate-in fade-in zoom-in-95">
              <div className="prose prose-invert prose-sm max-w-none">
                 <p className="whitespace-pre-wrap font-medium">{insights}</p>
              </div>
           </div>
         ) : (
           <div className="text-center py-20 border-2 border-dashed border-white/20 rounded-[2rem] bg-white/5">
              <p className="text-blue-100 font-bold text-lg mb-2">مستعد لتحليل بياناتك المالية</p>
              <p className="text-blue-200/60 text-sm">اضغط على الزر أعلاه للحصول على توقعات التدفق النقدي وفرص خفض التكاليف.</p>
           </div>
         )}
      </div>
    </div>
  </div>
);

const LedgerTab = ({ transactions }: { transactions: Transaction[] }) => {
  const [filterType, setFilterType] = useState<'الكل' | 'دخل' | 'مصروف'>('الكل');
  
  const filtered = useMemo(() => {
    return filterType === 'الكل' ? transactions : transactions.filter(t => t.type === filterType);
  }, [transactions, filterType]);

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-2">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 className="text-xl font-black text-slate-800">سجل كافة المعاملات (دفتر الأستاذ)</h3>
        <div className="flex gap-3">
          <div className="flex bg-slate-100 p-1 rounded-xl">
             {['الكل', 'دخل', 'مصروف'].map(type => (
               <button 
                key={type}
                onClick={() => setFilterType(type as any)}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${filterType === type ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
               >{type}</button>
             ))}
          </div>
          <div className="relative">
            <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="بحث في السجل..." 
              className="pr-12 pl-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs w-64 outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
            />
          </div>
          <button className="p-2.5 bg-white border border-slate-200 text-slate-500 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"><Filter size={18} /></button>
        </div>
      </div>

      <div className="overflow-hidden border border-slate-100 rounded-3xl bg-white shadow-inner">
        <table className="w-full text-right text-sm">
          <thead className="bg-slate-50/50 text-slate-500 font-black uppercase text-[10px] tracking-widest border-b border-slate-100">
            <tr>
              <th className="px-8 py-5">تفاصيل المعاملة</th>
              <th className="px-8 py-5">التصنيف</th>
              <th className="px-8 py-5">المشروع</th>
              <th className="px-8 py-5">التاريخ</th>
              <th className="px-8 py-5">النوع</th>
              <th className="px-8 py-5">المبلغ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((tx) => (
              <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                <td className="px-8 py-6">
                  <p className="font-black text-slate-700 group-hover:text-blue-600 transition-colors">{tx.description}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-0.5">ID: #{tx.id}</p>
                </td>
                <td className="px-8 py-6">
                  <span className="flex items-center gap-1.5 text-xs text-slate-600 font-bold">
                     <Tag size={12} className="text-slate-300" /> {tx.category}
                  </span>
                </td>
                <td className="px-8 py-6">
                  {tx.projectId ? (
                    <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">مشروع #{tx.projectId}</span>
                  ) : (
                    <span className="text-slate-300 font-bold text-xs">معاملة عامة</span>
                  )}
                </td>
                <td className="px-8 py-6 text-slate-500 text-xs font-bold font-mono">{tx.date}</td>
                <td className="px-8 py-6">
                  <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase ${tx.type === 'دخل' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    {tx.type}
                  </span>
                </td>
                <td className={`px-8 py-6 font-black text-base ${tx.type === 'دخل' ? 'text-emerald-600' : 'text-slate-700'}`}>
                  {tx.amount.toLocaleString()} <span className="text-[10px] font-bold opacity-60">ر.س</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const InvoicesTab = ({ invoices, setInvoices }: { invoices: Invoice[], setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>> }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);

  const parseCSVLine = (line: string) => {
    const result = [];
    let cur = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(cur.trim());
        cur = "";
      } else {
        cur += char;
      }
    }
    result.push(cur.trim());
    return result;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const rows = text.split(/\r?\n/).filter(row => row.trim() !== '');
        const dataRows = rows.slice(1);

        const importedInvoices: Invoice[] = dataRows.map((row, index) => {
          const columns = parseCSVLine(row);
          const [number, client, totalStr, dueDate] = columns;
          const total = parseFloat(totalStr?.replace(/[^\d.-]/g, '')) || 0;
          const subtotal = Math.round(total / 1.15);
          const vatAmount = total - subtotal;

          return {
            id: `imp-${Date.now()}-${index}`,
            number: number || `INV-IMP-${index + 1}`,
            client: client || 'عميل غير معرف',
            projectId: 'internal',
            date: new Date().toISOString().split('T')[0],
            dueDate: dueDate || new Date().toISOString().split('T')[0],
            subtotal,
            vatAmount,
            total,
            status: 'draft'
          };
        });

        if (importedInvoices.length > 0) {
          setInvoices(prev => [...importedInvoices, ...prev]);
          alert(`تم بنجاح استيراد عدد (${importedInvoices.length}) فواتير.`);
        }
      } catch (error) {
        alert('حدث خطأ أثناء معالجة الملف.');
      } finally {
        setIsImporting(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-400">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 shadow-inner">
        <div>
           <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
              <Receipt size={24} className="text-blue-600" /> إدارة وتحصيل الفواتير الصادرة
           </h3>
           <p className="text-slate-500 text-xs font-bold mt-2 leading-relaxed">
             إصدار فواتير ضريبية لعملائك ومتابعة التحصيل.
           </p>
        </div>
        <div className="flex gap-3">
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".csv" className="hidden" />
          <button onClick={() => fileInputRef.current?.click()} disabled={isImporting} className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl text-xs font-black hover:bg-slate-100 transition-all shadow-sm active:scale-95 disabled:opacity-50">
            {isImporting ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />} استيراد فواتير
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl text-xs font-black shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95">
            <Plus size={18} /> إصدار فاتورة جديدة
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {invoices.map((inv) => (
          <div key={inv.id} className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:border-blue-200 transition-all group relative overflow-hidden flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-lg font-black text-slate-800 tracking-tighter">{inv.number}</span>
                  <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black border ${
                    inv.status === 'paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                    inv.status === 'sent' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-50 text-slate-500 border-slate-100'
                  }`}>
                    {inv.status === 'paid' ? 'تم التحصيل' : inv.status === 'sent' ? 'تم الإرسال' : 'مسودة'}
                  </span>
                </div>
                <p className="text-sm font-bold text-slate-500 flex items-center gap-1.5"><Building size={14} className="text-slate-300"/> {inv.client}</p>
              </div>
              <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all shadow-sm bg-white border border-slate-100"><Printer size={18} /></button>
                <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all shadow-sm bg-white border border-slate-100"><Download size={18} /></button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 py-6 border-y border-slate-50 mb-6 bg-slate-50/30 -mx-8 px-8">
              <div>
                <p className="text-[10px] text-slate-400 font-black text-center uppercase mb-1.5 tracking-tighter">الأساسي</p>
                <p className="text-sm font-black text-slate-700 text-center">{inv.subtotal.toLocaleString()} ر.س</p>
              </div>
              <div>
                <p className="text-[10px] text-indigo-400 font-black text-center uppercase mb-1.5 tracking-tighter">الضريبة</p>
                <p className="text-sm font-black text-indigo-600 text-center">{inv.vatAmount.toLocaleString()} ر.س</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-black text-center uppercase mb-1.5 tracking-tighter">الإجمالي</p>
                <p className="text-lg font-black text-slate-800 text-center tracking-tighter">{inv.total.toLocaleString()} ر.س</p>
              </div>
            </div>

            <div className="flex justify-between items-center mt-auto">
              <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                <Calendar size={14} className="text-slate-300" /> موعد السداد: <span className="font-mono text-slate-700">{inv.dueDate}</span>
              </div>
              <button className="text-blue-600 text-[11px] font-black hover:underline flex items-center gap-1">
                 مراجعة <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const VatTab = ({ transactions, invoices }: { transactions: Transaction[], invoices: Invoice[] }) => {
  const vatCollected = invoices.filter(i => i.status === 'paid').reduce((acc, i) => acc + i.vatAmount, 0);
  const vatPaid = Math.abs(transactions.filter(t => t.type === 'مصروف' && t.isVatApplicable).reduce((acc, t) => acc + (t.amount * 0.15), 0));

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-400">
      <div className="bg-slate-900 text-white p-10 rounded-[3rem] relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-5"><Building size={160} /></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="text-emerald-500" size={24} />
            <h3 className="text-2xl font-black tracking-tighter">إقرار ضريبة القيمة المضافة (ZATCA)</h3>
          </div>
          <p className="text-slate-400 text-sm font-medium mb-10">الربع الرابع 2023 | حالة الربط: نشط</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-2">
              <p className="text-slate-500 text-xs font-black uppercase mb-1 tracking-widest">ضريبة المخرجات (المحصلة)</p>
              <p className="text-3xl font-black text-emerald-400 tracking-tighter">{vatCollected.toLocaleString()} <span className="text-xs font-bold opacity-50">ر.س</span></p>
            </div>
            <div className="space-y-2">
              <p className="text-slate-500 text-xs font-black uppercase mb-1 tracking-widest">ضريبة المدخلات (المدفوعة)</p>
              <p className="text-3xl font-black text-rose-400 tracking-tighter">{vatPaid.toLocaleString()} <span className="text-xs font-bold opacity-50">ر.س</span></p>
            </div>
            <div className="pt-6 md:pt-0 border-t md:border-t-0 md:border-r border-slate-800 pr-0 md:pr-12">
              <p className="text-slate-500 text-xs font-black uppercase mb-1">صافي الضريبة المستحقة</p>
              <p className="text-5xl font-black text-white tracking-tighter">{(vatCollected - vatPaid).toLocaleString()} <span className="text-base font-bold opacity-40">ر.س</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Finance;
