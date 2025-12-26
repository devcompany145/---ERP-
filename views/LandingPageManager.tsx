
import React, { useState } from 'react';
import { 
  Globe, 
  Layout, 
  Smartphone, 
  Eye, 
  Save, 
  CheckCircle2, 
  RefreshCw, 
  Plus, 
  Trash2, 
  Monitor, 
  Smartphone as MobileIcon,
  ChevronRight,
  Sparkles,
  Image as ImageIcon,
  MousePointer2,
  Settings2,
  ArrowUpRight
} from 'lucide-react';
import { LandingPageConfig, LandingFeature } from '../types';

const initialConfig: LandingPageConfig = {
  heroTitle: 'نقود التحول الرقمي لمستقبل ذكي',
  heroSubtitle: 'نحن نساعد الشركات التقنية والناشئة على بناء حلول برمجية قوية وقابلة للتوسع باستخدام أحدث التقنيات العالمية.',
  heroCta: 'ابدأ مشروعك الآن',
  isPublished: true,
  lastUpdate: '2023-11-20',
  features: [
    { id: 'f1', title: 'تطوير الأنظمة السحابية', description: 'بناء بنية تحتية مرنة وقابلة للتوسع على AWS و Azure.', icon: 'Cloud' },
    { id: 'f2', title: 'تطبيقات الجيل القادم', description: 'تطوير تطبيقات موبايل وويب بأعلى معايير الأداء والأمان.', icon: 'Cpu' },
    { id: 'f3', title: 'تحليلات الذكاء الاصطناعي', description: 'دمج تقنيات تعلم الآلة لتحسين اتخاذ القرار في شركتك.', icon: 'Zap' },
  ],
  stats: [
    { id: 's1', label: 'مشروع ناجح', value: '150+' },
    { id: 's2', label: 'عميل سعيد', value: '45+' },
    { id: 's3', label: 'سنة خبرة', value: '8+' },
  ]
};

const LandingPageManager = () => {
  const [config, setConfig] = useState<LandingPageConfig>(initialConfig);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('تم حفظ ونشر التعديلات بنجاح على الموقع العام!');
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Globe className="text-blue-600" /> إدارة محتوى الموقع
          </h2>
          <p className="text-slate-500 text-sm">تحكم في هوية شركتك العامة وما يراه العملاء في صفحة الهبوط.</p>
        </div>
        <div className="flex gap-2">
          <div className="flex bg-white p-1 rounded-xl border border-slate-200">
            <button 
              onClick={() => setActiveTab('editor')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'editor' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500'
              }`}
            >
              <Settings2 size={16} /> المحرر
            </button>
            <button 
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'preview' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500'
              }`}
            >
              <Eye size={16} /> المعاينة الحية
            </button>
          </div>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
          >
            {isSaving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
            نشر التعديلات
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-12rem)]">
        {/* Editor Sidebar (Left/Right depending on direction) */}
        <div className={`lg:col-span-4 space-y-6 overflow-y-auto no-scrollbar pr-1 ${activeTab === 'preview' ? 'hidden lg:block opacity-50 pointer-events-none' : ''}`}>
          
          {/* Hero Section Control */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b pb-3">
              <Layout size={18} className="text-blue-600" /> القسم الرئيسي (Hero)
            </h3>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">العنوان الرئيسي</label>
                <input 
                  type="text" 
                  value={config.heroTitle}
                  onChange={(e) => setConfig({...config, heroTitle: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">العنوان الفرعي</label>
                <textarea 
                  rows={3}
                  value={config.heroSubtitle}
                  onChange={(e) => setConfig({...config, heroSubtitle: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">نص زر الاتصال</label>
                <input 
                  type="text" 
                  value={config.heroCta}
                  onChange={(e) => setConfig({...config, heroCta: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Features Section Control */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Sparkles size={18} className="text-blue-600" /> المميزات والخدمات
              </h3>
              <button className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><Plus size={14} /></button>
            </div>
            <div className="space-y-3">
              {config.features.map((feature) => (
                <div key={feature.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 group">
                  <div className="flex justify-between items-center">
                    <input 
                      type="text" 
                      value={feature.title}
                      className="bg-transparent font-bold text-xs text-slate-800 outline-none"
                    />
                    <button className="p-1 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={14} /></button>
                  </div>
                  <textarea 
                    value={feature.description}
                    className="w-full bg-transparent text-[10px] text-slate-500 outline-none resize-none"
                    rows={2}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Stats Control */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b pb-3">
              <ArrowUpRight size={18} className="text-blue-600" /> إحصائيات النجاح
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {config.stats.map((stat) => (
                <div key={stat.id} className="p-2 bg-slate-50 rounded-xl border border-slate-100 text-center">
                  <input type="text" value={stat.value} className="w-full bg-transparent font-black text-blue-600 text-center text-xs outline-none" />
                  <input type="text" value={stat.label} className="w-full bg-transparent text-[8px] font-bold text-slate-400 text-center outline-none" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Preview Area */}
        <div className={`lg:col-span-8 bg-slate-200 rounded-3xl overflow-hidden relative flex flex-col ${activeTab === 'editor' ? 'hidden lg:flex' : 'flex'}`}>
          <div className="bg-white border-b border-slate-300 p-3 flex justify-between items-center">
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-rose-400 rounded-full"></div>
              <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
              <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex bg-slate-100 p-1 rounded-lg">
                <button 
                  onClick={() => setPreviewMode('desktop')}
                  className={`p-1.5 rounded ${previewMode === 'desktop' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
                >
                  <Monitor size={16} />
                </button>
                <button 
                  onClick={() => setPreviewMode('mobile')}
                  className={`p-1.5 rounded ${previewMode === 'mobile' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
                >
                  <MobileIcon size={16} />
                </button>
              </div>
              <div className="h-6 w-px bg-slate-300"></div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Live Preview</span>
            </div>
          </div>

          <div className="flex-1 bg-white overflow-y-auto overflow-x-hidden flex justify-center p-8">
            <div className={`transition-all duration-500 bg-white border border-slate-100 shadow-2xl rounded-3xl overflow-hidden ${
              previewMode === 'desktop' ? 'w-full' : 'w-[375px] h-[667px]'
            }`}>
              
              {/* Simulated Landing Page Content */}
              <div className="min-h-full font-sans text-right" dir="rtl">
                {/* Header */}
                <nav className="p-6 flex justify-between items-center border-b border-slate-50">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">T</div>
                    <span className="font-bold text-slate-800">تكنولوجي</span>
                  </div>
                  <div className="hidden sm:flex gap-6 text-[10px] font-bold text-slate-500">
                    <span>الرئيسية</span>
                    <span>خدماتنا</span>
                    <span>أعمالنا</span>
                    <span>تواصل معنا</span>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-[10px] font-bold">ابدأ الآن</button>
                </nav>

                {/* Hero Section */}
                <section className="py-20 px-10 text-center space-y-6 bg-gradient-to-b from-blue-50/30 to-white">
                  <h1 className="text-4xl font-black text-slate-900 leading-tight max-w-2xl mx-auto">{config.heroTitle}</h1>
                  <p className="text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">{config.heroSubtitle}</p>
                  <div className="flex justify-center gap-4 pt-4">
                    <button className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-blue-100 flex items-center gap-2">
                      {config.heroCta} <ChevronRight size={18} className="rotate-180" />
                    </button>
                    <button className="px-8 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm">شاهد أعمالنا</button>
                  </div>
                </section>

                {/* Stats Section */}
                <section className="py-12 bg-slate-900 text-white">
                  <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 px-6">
                    {config.stats.map(s => (
                      <div key={s.id} className="text-center">
                        <p className="text-2xl font-black text-blue-400">{s.value}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Features Section */}
                <section className="py-20 px-10 space-y-12">
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold text-slate-800">خدماتنا المتميزة</h2>
                    <p className="text-xs text-slate-500">نقدم حلولاً تقنية متكاملة تضمن تفوقك في السوق الرقمي.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {config.features.map(f => (
                      <div key={f.id} className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl transition-all space-y-4">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                          <Sparkles size={24} />
                        </div>
                        <h3 className="font-bold text-slate-800">{f.title}</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">{f.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-md p-3 border-t border-slate-300 flex justify-between items-center">
            <span className="text-[10px] text-slate-500 font-bold">آخر نشر: {config.lastUpdate}</span>
            <div className="flex gap-4">
               <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600">
                  <CheckCircle2 size={12} /> النسخة الحالية منشورة
               </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPageManager;
