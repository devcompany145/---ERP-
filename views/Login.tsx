
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, ShieldCheck, Sparkles, ArrowLeft } from 'lucide-react';
import LiveBackground from '../components/LiveBackground';

const Login = ({ onLogin }: { onLogin: () => void }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: 'admin@tech.sa', password: 'password123' });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // محاكاة عملية تسجيل الدخول
    setTimeout(() => {
      localStorage.setItem('isLoggedIn', 'true');
      onLogin();
      navigate('/');
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden font-cairo" dir="rtl">
      <LiveBackground />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="bg-white/80 backdrop-blur-2xl border border-white/50 rounded-[2.5rem] shadow-2xl overflow-hidden shadow-blue-900/10">
          <div className="p-8 md:p-12">
            <div className="flex flex-col items-center mb-10">
              <motion.div 
                whileHover={{ rotate: 15, scale: 1.1 }}
                className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-blue-200 mb-6"
              >
                T
              </motion.div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-2">مرحباً بك مجدداً</h1>
              <p className="text-slate-500 font-medium">نظام تكنولوجي ERP لإدارة منشأتك الذكية</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mr-1">البريد الإلكتروني</label>
                <div className="relative group">
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    <Mail size={18} />
                  </div>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="name@company.com"
                    className="w-full pr-12 pl-4 py-4 bg-slate-100/50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">كلمة المرور</label>
                  <button type="button" className="text-[10px] font-black text-blue-600 hover:underline">نسيت كلمة المرور؟</button>
                </div>
                <div className="relative group">
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="••••••••"
                    className="w-full pr-12 pl-12 py-4 bg-slate-100/50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 px-1">
                <input type="checkbox" id="remember" className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500" />
                <label htmlFor="remember" className="text-xs font-bold text-slate-500 cursor-pointer">تذكر هذا الجهاز</label>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70"
              >
                {isLoading ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Sparkles size={20} /></motion.div>
                ) : (
                  <>تسجيل الدخول <LogIn size={20} className="rotate-180" /></>
                )}
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-slate-100 text-center">
              <p className="text-sm text-slate-500 font-medium">ليس لديك حساب؟</p>
              <Link to="/register" className="mt-2 inline-flex items-center gap-2 px-6 py-2 border border-slate-200 rounded-xl text-sm font-black text-slate-700 hover:bg-slate-50 transition-all group">
                أنشئ حسابك المؤسسي <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-6">
          <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
            <ShieldCheck size={14} className="text-emerald-500" /> اتصال مشفر وآمن
          </div>
          <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
            <Sparkles size={14} className="text-blue-500" /> مدعوم بـ AI
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
