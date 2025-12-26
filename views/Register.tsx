
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Building, Phone, ArrowRight, ShieldCheck, Check, Sparkles, Layout } from 'lucide-react';
import LiveBackground from '../components/LiveBackground';

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) setStep(step + 1);
    else {
      setIsLoading(true);
      setTimeout(() => {
        alert('تم إنشاء حسابك بنجاح! يرجى تسجيل الدخول.');
        navigate('/login');
        setIsLoading(false);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden font-cairo" dir="rtl">
      <LiveBackground />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl relative z-10"
      >
        <div className="bg-white/80 backdrop-blur-2xl border border-white/50 rounded-[3rem] shadow-2xl overflow-hidden shadow-blue-900/10">
          <div className="flex flex-col md:flex-row h-full">
            {/* Sidebar for info */}
            <div className="md:w-64 bg-slate-900 p-8 text-white hidden md:flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5"><Layout size={180} /></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-xl font-black mb-8 shadow-lg shadow-blue-500/20">T</div>
                <h2 className="text-xl font-black mb-4 leading-tight">ابدأ رحلة التحول الرقمي</h2>
                <div className="space-y-6">
                   <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 mt-1"><Check size={14} className="text-blue-400" /></div>
                      <p className="text-xs font-medium text-slate-300">تحليلات مالية متقدمة مدعومة بالذكاء الاصطناعي.</p>
                   </div>
                   <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 mt-1"><Check size={14} className="text-blue-400" /></div>
                      <p className="text-xs font-medium text-slate-300">إدارة متكاملة للموظفين والمشاريع والعملاء.</p>
                   </div>
                </div>
              </div>
              <div className="relative z-10 pt-10 border-t border-white/10">
                <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">منصة موثوقة</p>
                <div className="flex items-center gap-3 mt-2">
                   <ShieldCheck size={20} className="text-emerald-500" />
                   <span className="text-xs font-bold text-slate-300">تشفير كامل للبيانات</span>
                </div>
              </div>
            </div>

            {/* Main Form */}
            <div className="flex-1 p-8 md:p-12">
              <div className="flex justify-between items-center mb-8">
                <div>
                   <h1 className="text-2xl font-black text-slate-800">إنشاء حساب جديد</h1>
                   <p className="text-xs text-slate-500 font-bold mt-1">سجل منشأتك وابدأ في إدارة مواردك بذكاء</p>
                </div>
                <div className="flex gap-1">
                   <div className={`h-1.5 w-6 rounded-full transition-all ${step === 1 ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
                   <div className={`h-1.5 w-6 rounded-full transition-all ${step === 2 ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
                </div>
              </div>

              <form onSubmit={handleNext} className="space-y-6">
                {step === 1 ? (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">اسم المنشأة / الشركة</label>
                      <div className="relative">
                        <Building size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input required placeholder="مثال: شركة تكنولوجي للحلول البرمجية" className="w-full pr-12 pl-4 py-4 bg-slate-100/50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">نوع النشاط التقني</label>
                      <select className="w-full px-5 py-4 bg-slate-100/50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500">
                        <option>تطوير برمجيات</option>
                        <option>استشارات تقنية</option>
                        <option>خدمات سحابية</option>
                        <option>أمن سيبراني</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">رقم التواصل</label>
                      <div className="relative">
                        <Phone size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="tel" required placeholder="05XXXXXXXX" className="w-full pr-12 pl-4 py-4 bg-slate-100/50 border border-slate-200 rounded-2xl text-sm font-bold outline-none" />
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">اسم المسؤول</label>
                      <div className="relative">
                        <User size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input required placeholder="الاسم الكامل" className="w-full pr-12 pl-4 py-4 bg-slate-100/50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">البريد الإلكتروني المهني</label>
                      <div className="relative">
                        <Mail size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="email" required placeholder="name@company.sa" className="w-full pr-12 pl-4 py-4 bg-slate-100/50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">كلمة المرور</label>
                      <div className="relative">
                        <Lock size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="password" required placeholder="••••••••" className="w-full pr-12 pl-4 py-4 bg-slate-100/50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="flex gap-4 pt-4">
                  {step > 1 && (
                    <button 
                      type="button" 
                      onClick={() => setStep(step - 1)}
                      className="p-4 border border-slate-200 text-slate-500 rounded-2xl hover:bg-slate-50 transition-all"
                    >
                      <ArrowRight size={20} className="rotate-180" />
                    </button>
                  )}
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-70"
                  >
                    {isLoading ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Sparkles size={20} /></motion.div>
                    ) : (
                      <>{step === 1 ? 'متابعة الخطوات' : 'إتمام التسجيل'} <ArrowRight size={20} className="rotate-180" /></>
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-8 text-center">
                 <p className="text-xs font-bold text-slate-500">
                    لديك حساب بالفعل؟ <Link to="/login" className="text-blue-600 hover:underline">سجل دخولك هنا</Link>
                 </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
