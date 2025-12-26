
import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, 
  Plus, 
  Search, 
  Filter, 
  Tag, 
  DollarSign, 
  Layers, 
  TrendingUp, 
  Sparkles,
  LayoutGrid,
  List as ListIcon,
  BadgePercent,
  Clock,
  X,
  Save,
  Loader2,
  Package,
  Wrench,
  AlertCircle,
  Edit3,
  BrainCircuit
} from 'lucide-react';
import { Product, ProductCategory, ProductType } from '../types';
import { getPricingRecommendation } from '../services/geminiService';

const initialProducts: Product[] = [
  {
    id: 'p1',
    name: 'منصة ERP سحابية للمؤسسات',
    description: 'نظام متكامل لإدارة الموارد، المالية، والموظفين مصمم خصيصاً للشركات التقنية.',
    category: 'برمجيات',
    type: 'service',
    basePrice: 15000,
    pricingModel: 'اشتراك سنوي',
    sku: 'SaaS-ERP-ENT',
    status: 'نشط',
    features: ['مستخدمين غير محدودين', 'دعم فني 24/7', 'تكامل مع ZATCA']
  },
  {
    id: 'p2',
    name: 'استشارات التحول الرقمي',
    description: 'جلسات استشارية مع خبراء تقنيين لوضع استراتيجية التحول الرقمي والأتمتة.',
    category: 'استشارات',
    type: 'service',
    basePrice: 1200,
    pricingModel: 'بالساعة',
    status: 'نشط',
    features: ['تحليل الثغرات', 'خارطة طريق تقنية']
  },
  {
    id: 'p5',
    name: 'خادم معالجة بيانات AI',
    description: 'وحدة معالجة مركزية قوية مخصصة لتدريب نماذج الذكاء الاصطناعي.',
    category: 'أجهزة',
    type: 'product',
    basePrice: 8500,
    pricingModel: 'بالمشروع',
    sku: 'HW-AI-SRV-X1',
    status: 'متوقف'
  }
];

const Products = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | ProductType>('all');
  
  // Per-product AI suggestion state
  const [aiSuggestions, setAiSuggestions] = useState<Record<string, string>>({});
  const [loadingAiIds, setLoadingAiIds] = useState<Set<string>>(new Set());

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.includes(searchTerm) || p.description.includes(searchTerm);
      const matchesType = typeFilter === 'all' || p.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [products, searchTerm, typeFilter]);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setAiSuggestion(null);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setAiSuggestion(null);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا العنصر؟')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const productData: Partial<Product> = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as ProductCategory,
      type: formData.get('type') as ProductType,
      basePrice: Number(formData.get('basePrice')),
      pricingModel: formData.get('pricingModel') as string,
      sku: formData.get('sku') as string,
      status: formData.get('status') as any,
    };

    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...productData } : p));
    } else {
      const newProduct: Product = {
        ...productData as Product,
        id: 'p' + Date.now(),
        features: []
      };
      setProducts([newProduct, ...products]);
    }
    setIsModalOpen(false);
  };

  const fetchAiPricingForProduct = async (product: Product) => {
    setLoadingAiIds(prev => new Set(prev).add(product.id));
    const suggestion = await getPricingRecommendation(product.name, product.description, product.basePrice);
    setAiSuggestions(prev => ({ ...prev, [product.id]: suggestion }));
    setLoadingAiIds(prev => {
      const next = new Set(prev);
      next.delete(product.id);
      return next;
    });
  };

  const runAiPricing = async (name: string, desc: string, price: number) => {
    setIsAiLoading(true);
    const suggestion = await getPricingRecommendation(name, desc, price);
    setAiSuggestion(suggestion);
    setIsAiLoading(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <ShoppingBag className="text-blue-600" /> إدارة المنتجات والخدمات
          </h2>
          <p className="text-slate-500 text-sm">إدارة المحفظة التقنية، تسعير SaaS، وعروض الخدمات الاستشارية.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleAdd}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 flex items-center gap-2 transition-all active:scale-95"
          >
            <Plus size={18} /> إضافة منتج/خدمة
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><Package size={20}/></div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase">إجمالي المنتجات</p>
            <p className="text-lg font-bold text-slate-800">{products.filter(p => p.type === 'product').length}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center"><Wrench size={20}/></div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase">إجمالي الخدمات</p>
            <p className="text-lg font-bold text-slate-800">{products.filter(p => p.type === 'service').length}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center"><TrendingUp size={20}/></div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase">متوسط الربحية</p>
            <p className="text-lg font-bold text-emerald-600">42%</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center"><BadgePercent size={20}/></div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase">عروض نشطة</p>
            <p className="text-lg font-bold text-amber-600">5</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="بحث في المنتجات..." 
            className="w-full pr-10 pl-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <div className="flex bg-slate-100 p-1 rounded-xl">
             <button onClick={() => setView('grid')} className={`p-1.5 rounded-lg ${view === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}><LayoutGrid size={18} /></button>
             <button onClick={() => setView('list')} className={`p-1.5 rounded-lg ${view === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}><ListIcon size={18} /></button>
          </div>
          <select 
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 outline-none"
            onChange={(e) => setTypeFilter(e.target.value as any)}
          >
            <option value="all">كل الأنواع</option>
            <option value="product">منتجات (Hardware)</option>
            <option value="service">خدمات (SaaS/Pro)</option>
          </select>
        </div>
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${product.type === 'service' ? 'bg-blue-50 text-blue-600' : 'bg-indigo-50 text-indigo-600'}`}>
                  {product.type === 'service' ? <Wrench size={24} /> : <Package size={24} />}
                </div>
                <div className="flex gap-1">
                   <button 
                     onClick={() => fetchAiPricingForProduct(product)}
                     disabled={loadingAiIds.has(product.id)}
                     className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-all disabled:opacity-50"
                     title="اقتراح سعر AI"
                   >
                     {loadingAiIds.has(product.id) ? <Loader2 size={16} className="animate-spin" /> : <BrainCircuit size={16} />}
                   </button>
                   <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${product.status === 'نشط' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                     {product.status}
                   </span>
                </div>
              </div>
              <h3 className="text-md font-bold text-slate-800 mb-1">{product.name}</h3>
              <p className="text-xs text-slate-500 mb-4 line-clamp-2 flex-1">{product.description}</p>
              
              <div className="space-y-3 pt-4 border-t border-slate-50">
                 {aiSuggestions[product.id] && (
                   <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-[10px] text-blue-700 leading-relaxed mb-2 animate-in slide-in-from-top-1">
                      <div className="flex items-center gap-1 font-black mb-1">
                         <Sparkles size={12} /> اقتراح AI:
                      </div>
                      {aiSuggestions[product.id]}
                   </div>
                 )}
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{product.pricingModel}</span>
                    <span className="text-lg font-black text-blue-600">{product.basePrice.toLocaleString()} ر.س</span>
                 </div>
                 <div className="flex gap-2">
                    <button 
                      onClick={() => handleEdit(product)}
                      className="flex-1 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                    >
                      <Edit3 size={14} /> تعديل المنتج
                    </button>
                 </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm overflow-x-auto">
           <table className="w-full text-right text-sm">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
                 <tr>
                    <th className="px-6 py-4">المنتج / الخدمة</th>
                    <th className="px-6 py-4">التصنيف</th>
                    <th className="px-6 py-4">النوع</th>
                    <th className="px-6 py-4">السعر الأساسي</th>
                    <th className="px-6 py-4">اقتراح AI</th>
                    <th className="px-6 py-4">الحالة</th>
                    <th className="px-6 py-4"></th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                 {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                       <td className="px-6 py-4">
                          <p className="font-bold text-slate-700">{p.name}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{p.pricingModel}</p>
                       </td>
                       <td className="px-6 py-4 text-xs">{p.category}</td>
                       <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${p.type === 'service' ? 'bg-blue-50 text-blue-600' : 'bg-indigo-50 text-indigo-600'}`}>
                            {p.type === 'service' ? 'خدمة' : 'منتج'}
                          </span>
                       </td>
                       <td className="px-6 py-4 font-black">{p.basePrice.toLocaleString()} ر.س</td>
                       <td className="px-6 py-4 max-w-xs">
                          {aiSuggestions[p.id] ? (
                            <p className="text-[10px] text-blue-600 leading-tight line-clamp-2">{aiSuggestions[p.id]}</p>
                          ) : (
                            <button 
                              onClick={() => fetchAiPricingForProduct(p)}
                              disabled={loadingAiIds.has(p.id)}
                              className="text-[10px] font-bold text-indigo-600 flex items-center gap-1 hover:underline disabled:opacity-50"
                            >
                              {loadingAiIds.has(p.id) ? <Loader2 size={12} className="animate-spin" /> : <BrainCircuit size={12} />}
                              طلب اقتراح سعر
                            </button>
                          )}
                       </td>
                       <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${p.status === 'نشط' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                            {p.status}
                          </span>
                       </td>
                       <td className="px-6 py-4 text-left">
                          <button onClick={() => handleEdit(p)} className="p-2 text-slate-400 hover:text-blue-600"><Edit3 size={18} /></button>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
      )}

      {/* Product Management Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-100">
                   {editingProduct ? <Edit3 size={24} /> : <Plus size={24} />}
                 </div>
                 <div>
                   <h3 className="text-xl font-black text-slate-800">{editingProduct ? 'تعديل البيانات' : 'إضافة منتج/خدمة جديد'}</h3>
                   <p className="text-xs text-slate-500 font-medium mt-1">تأكد من دقة التسعير والمواصفات التقنية</p>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">اسم العنصر</label>
                  <input 
                    required
                    name="name"
                    defaultValue={editingProduct?.name}
                    type="text" 
                    placeholder="مثال: منصة إدارة المستودعات"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    id="prod-name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">نوع الأصل</label>
                  <select 
                    name="type"
                    defaultValue={editingProduct?.type || 'product'}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    <option value="product">منتج (Hardware/Licensing)</option>
                    <option value="service">خدمة (SaaS/Consulting)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">الوصف التقني</label>
                <textarea 
                  name="description"
                  defaultValue={editingProduct?.description}
                  rows={3}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none"
                  placeholder="اشرح مميزات العنصر وقيمته المضافة..."
                  id="prod-desc"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">السعر الأساسي</label>
                  <div className="relative">
                    <input 
                      required
                      name="basePrice"
                      defaultValue={editingProduct?.basePrice}
                      type="number" 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                      id="prod-price"
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">ر.س</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">موديل التسعير</label>
                  <select 
                    name="pricingModel"
                    defaultValue={editingProduct?.pricingModel || 'بالمشروع'}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    <option value="بالمشروع">بالمشروع</option>
                    <option value="بالساعة">بالساعة</option>
                    <option value="اشتراك شهري">اشتراك شهري</option>
                    <option value="اشتراك سنوي">اشتراك سنوي</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">حالة التوفر</label>
                  <select 
                    name="status"
                    defaultValue={editingProduct?.status || 'نشط'}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    <option value="نشط">نشط (متاح)</option>
                    <option value="متوقف">متوقف (غير متاح)</option>
                  </select>
                </div>
              </div>

              {/* AI Pricing Recommender Widget */}
              <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 space-y-4">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <Sparkles size={18} className="text-blue-600" />
                       <h4 className="text-sm font-black text-blue-900">محسن التسعير الذكي (AI Pricing)</h4>
                    </div>
                    <button 
                      type="button"
                      onClick={() => {
                        const name = (document.getElementById('prod-name') as HTMLInputElement).value;
                        const desc = (document.getElementById('prod-desc') as HTMLTextAreaElement).value;
                        const price = Number((document.getElementById('prod-price') as HTMLInputElement).value);
                        runAiPricing(name, desc, price);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black shadow-lg shadow-blue-100 hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
                      disabled={isAiLoading}
                    >
                      {isAiLoading ? <Loader2 size={14} className="animate-spin" /> : <TrendingUp size={14} />}
                      تحليل السعر المثالي
                    </button>
                 </div>
                 {aiSuggestion ? (
                   <div className="bg-white/60 p-4 rounded-2xl border border-white text-xs text-blue-800 leading-relaxed animate-in slide-in-from-top-2">
                      <p className="whitespace-pre-wrap">{aiSuggestion}</p>
                   </div>
                 ) : (
                   <p className="text-[10px] text-blue-400 font-medium">يقوم الذكاء الاصطناعي بمقارنة منتجك بالمعايير العالمية والسوق المحلي لاقتراح السعر الأكثر تنافسية.</p>
                 )}
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
                  className="flex-[2] py-4 bg-slate-900 text-white font-black rounded-2xl shadow-2xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                  <Save size={20} /> {editingProduct ? 'حفظ التعديلات' : 'إضافة إلى المحفظة'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
