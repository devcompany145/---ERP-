
import React, { useState } from 'react';
import { 
  Settings, 
  User, 
  Shield, 
  Bell, 
  Cloud, 
  Globe, 
  CreditCard, 
  Database, 
  Save, 
  CheckCircle2, 
  Key,
  Smartphone,
  Lock,
  Mail,
  Building,
  RefreshCw,
  Cpu
} from 'lucide-react';

const SettingsView = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'company' | 'security' | 'cloud' | 'notifications'>('profile');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('تم حفظ الإعدادات بنجاح!');
    }, 1000);
  };

  const tabs = [
    { id: 'profile', label: 'حسابي الشخصي', icon: User },
    { id: 'company', label: 'بيانات الشركة', icon: Building },
    { id: 'security', label: 'الأمان والخصوصية', icon: Shield },
    { id: 'cloud', label: 'التكامل السحابي', icon: Cloud },
    { id: 'notifications', label: 'التنبيهات', icon: Bell },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tighter">إعدادات النظام</h2>
          <p className="text-slate-500 font-medium">تحكم في هويتك الرقمية، صلاحيات الفريق، وتكاملات الـ Cloud.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-3 disabled:opacity-50"
        >
          {isSaving ? <RefreshCw size={20} className="animate-spin" /> : <Save size={20} />}
          حفظ كافة التغييرات
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col lg:flex-row min-h-[600px]">
        {/* Sidebar Tabs */}
        <aside className="lg:w-64 bg-slate-50/50 border-l border-slate-100 p-6 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${
                activeTab === tab.id 
                  ? 'bg-white text-blue-600 shadow-md ring-1 ring-slate-100' 
                  : 'text-slate-500 hover:bg-white hover:text-slate-800'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </aside>

        {/* Content Area */}
        <div className="flex-1 p-8 md:p-12 overflow-y-auto no-scrollbar">
          {activeTab === 'profile' && (
            <div className="space-y-8 animate-in slide-in-from-bottom-2">
              <div className="flex items-center gap-6 pb-8 border-b border-slate-50">
                <div className="relative group">
                   <img src="https://picsum.photos/seed/admin/120/120" className="w-24 h-24 rounded-3xl object-cover ring-4 ring-slate-50 group-hover:opacity-80 transition-all" />
                   <button className="absolute bottom-[-8px] right-[-8px] p-2 bg-white rounded-xl shadow-lg border border-slate-100 text-blue-600 hover:scale-110 transition-transform">
                      <RefreshCw size={16} />
                   </button>
                </div>
                <div>
                   <h3 className="text-xl font-bold text-slate-800">أحمد محمد</h3>
                   <p className="text-sm text-slate-500">المدير التنفيذي • ahmed@tech-sa.com</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">الاسم الكامل</label>
                  <input defaultValue="أحمد محمد" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">المسمى الوظيفي</label>
                  <input defaultValue="المدير التنفيذي" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">البريد الإلكتروني</label>
                  <div className="relative">
                     <Mail size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" />
                     <input defaultValue="ahmed@tech-sa.com" className="w-full pr-12 pl-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">رقم الجوال</label>
                  <div className="relative">
                     <Smartphone size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" />
                     <input defaultValue="05XXXXXXXX" dir="ltr" className="w-full pr-12 pl-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-right" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'company' && (
            <div className="space-y-8 animate-in slide-in-from-bottom-2">
               <h3 className="text-lg font-bold text-slate-800 mb-6">المعلومات القانونية والمقر</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">اسم الشركة الرسمي</label>
                    <input defaultValue="تكنولوجي للحلول البرمجية" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">الرقم الضريبي (VAT)</label>
                    <input defaultValue="300XXXXXXXXXXXX" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                 </div>
                 <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">عنوان المقر الرئيسي</label>
                    <input defaultValue="طريق الملك فهد، برج الفيصلية، الرياض، المملكة العربية السعودية" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                 </div>
               </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-8 animate-in slide-in-from-bottom-2">
               <div className="p-6 bg-rose-50 border border-rose-100 rounded-[2rem] flex items-center gap-6">
                  <div className="w-14 h-14 bg-rose-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-rose-200"><Lock size={28} /></div>
                  <div>
                     <h4 className="font-bold text-rose-900">المصادقة الثنائية (2FA)</h4>
                     <p className="text-xs text-rose-700 mt-1">قم بزيادة أمان حسابك من خلال تفعيل رمز التحقق عبر تطبيق الهاتف.</p>
                  </div>
                  <button className="mr-auto px-6 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-rose-700 transition-all">تفعيل الآن</button>
               </div>

               <div className="space-y-4 pt-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">تغيير كلمة المرور</h3>
                  <div className="grid grid-cols-1 gap-6 max-w-md">
                     <input type="password" placeholder="كلمة المرور الحالية" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                     <input type="password" placeholder="كلمة المرور الجديدة" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                     <input type="password" placeholder="تأكيد كلمة المرور" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'cloud' && (
            <div className="space-y-8 animate-in slide-in-from-bottom-2">
               <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-10"><Cpu size={120} /></div>
                  <div className="relative z-10">
                     <h3 className="text-xl font-bold mb-4">API Keys & Cloud Connect</h3>
                     <p className="text-slate-400 text-sm leading-relaxed max-w-xl mb-8">اربط نظام الـ ERP بمزودي الخدمة السحابية لتتبع التكاليف والأداء بشكل مباشر في لوحة التحكم.</p>
                     
                     <div className="space-y-4">
                        {[
                          { name: 'Amazon Web Services (AWS)', status: 'connected', id: 'aws' },
                          { name: 'Google Cloud Platform (GCP)', status: 'disconnected', id: 'gcp' },
                          { name: 'GitHub Enterprise API', status: 'connected', id: 'git' },
                        ].map((srv) => (
                           <div key={srv.id} className="p-5 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between hover:bg-white/10 transition-all group/srv">
                              <div className="flex items-center gap-4">
                                 <div className={`w-2.5 h-2.5 rounded-full ${srv.status === 'connected' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-600'}`}></div>
                                 <span className="text-sm font-bold">{srv.name}</span>
                              </div>
                              <button className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${
                                 srv.status === 'connected' ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
                              }`}>
                                 {srv.status === 'connected' ? 'إدارة الاتصال' : 'ربط الخدمة +'}
                              </button>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-8 animate-in slide-in-from-bottom-2">
               <h3 className="text-lg font-bold text-slate-800 mb-6">تفضيلات التنبيهات</h3>
               <div className="space-y-4">
                  {[
                    { title: 'تنبيهات المالية', desc: 'استلام إشعارات عند إصدار الفواتير أو وصول مدفوعات جديدة.', default: true },
                    { title: 'تنبيهات المشاريع', desc: 'إشعار عند اكتمال مرحلة (Milestone) أو اقتراب موعد تسليم.', default: true },
                    { title: 'تنبيهات الموارد البشرية', desc: 'تذكير بانتهاء وثائق الموظفين (إقامات، تأمين).', default: true },
                    { title: 'تقارير أسبوعية', desc: 'استلام ملخص أداء الشركة عبر البريد كل صباح أحد.', default: false },
                  ].map((notif, i) => (
                    <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100 hover:bg-white hover:shadow-md transition-all group">
                       <div className="flex-1">
                          <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{notif.title}</h4>
                          <p className="text-xs text-slate-500 mt-1">{notif.desc}</p>
                       </div>
                       <label className="relative inline-flex items-center cursor-pointer">
                         <input type="checkbox" defaultChecked={notif.default} className="sr-only peer" />
                         <div className="w-12 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full rtl:peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600 shadow-inner"></div>
                       </label>
                    </div>
                  ))}
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
