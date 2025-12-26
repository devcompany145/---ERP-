
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  CreditCard, 
  Bot, 
  Settings, 
  Menu, 
  X,
  Bell,
  Search,
  ChevronDown,
  Building2,
  FileText,
  HeartHandshake,
  CalendarDays,
  Truck,
  CheckSquare,
  Package,
  Globe,
  PenTool,
  ShoppingBag,
  Calendar,
  Star,
  ChevronLeft,
  MessageCircle,
  Receipt,
  ShoppingCart,
  Wallet,
  Files,
  LifeBuoy,
  LogOut,
  Sparkles,
  Zap,
  FilePlus2,
  Command
} from 'lucide-react';

import Dashboard from './views/Dashboard';
import Projects from './views/Projects';
import Team from './views/Team';
import Finance from './views/Finance';
import AIAssistant from './views/AIAssistant';
import Organization from './views/Organization';
import Contracts from './views/Contracts';
import Customers from './views/Customers';
import Planning from './views/Planning';
import Suppliers from './views/Suppliers';
import TodoList from './views/TodoList';
import Assets from './views/Assets';
import LandingPageManager from './views/LandingPageManager';
import DocumentSigning from './views/DocumentSigning';
import Products from './views/Products';
import CalendarView from './views/CalendarView';
import Ratings from './views/Ratings';
import SettingsView from './views/Settings';
import InternalChat from './views/InternalChat';
import OfficialDocuments from './views/OfficialDocuments';
import Support from './views/Support';
import Login from './views/Login';
import Register from './views/Register';
import AIGenerator from './views/AIGenerator';
import LiveBackground from './components/LiveBackground';

const ProtectedRoute = ({ children, isAuthenticated }: React.PropsWithChildren<{ isAuthenticated: boolean }>) => {
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

interface NavItem {
  to: string;
  icon: any;
  label: string;
}

interface CategoryProps {
  label: string;
  icon: any;
  items: NavItem[];
  isOpen: boolean;
  onToggle: () => void;
  activePath: string;
  colorClass?: string;
}

const SidebarCategory: React.FC<CategoryProps> = ({ label, icon: Icon, items, isOpen, onToggle, activePath, colorClass = "blue" }) => {
  const isAnyActive = items.some(item => activePath === item.to);
  
  return (
    <div className="px-3 mb-1">
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 ${
          isAnyActive ? `bg-${colorClass}-50 text-${colorClass}-700` : 'text-slate-600 hover:bg-slate-100/60'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`p-1.5 rounded-lg ${isAnyActive ? `bg-white shadow-sm text-${colorClass}-600` : 'text-slate-400'}`}>
            <Icon size={18} />
          </div>
          <span className="font-bold text-sm tracking-tight">{label}</span>
        </div>
        <ChevronDown 
          size={14} 
          className={`transition-transform duration-500 opacity-40 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden mr-5 border-r border-slate-100 mt-1 pr-3 space-y-1"
          >
            {items.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all group ${
                  activePath === item.to 
                    ? `bg-${colorClass}-600 text-white shadow-lg shadow-${colorClass}-200/50` 
                    : `text-slate-500 hover:text-${colorClass}-600 hover:bg-${colorClass}-50/50`
                }`}
              >
                <item.icon size={16} className={activePath === item.to ? 'text-white' : 'text-slate-400 group-hover:text-current'} />
                <span>{item.label}</span>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AppLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => localStorage.getItem('isLoggedIn') === 'true');
  const location = useLocation();
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);

  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    admin: true,
    creation: true,
    sales: false,
    spending: false,
    operations: false
  });

  const toggleCategory = (cat: string) => {
    setOpenCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsAuthenticated(false);
    navigate('/login');
  };

  const categories = [
    {
      id: 'admin',
      label: 'الإدارة العامة',
      icon: Building2,
      color: 'blue',
      items: [
        { to: '/', icon: LayoutDashboard, label: 'لوحة التحكم' },
        { to: '/official-documents', icon: Files, label: 'الوثائق الرسمية' },
        { to: '/chat', icon: MessageCircle, label: 'الدردشة الداخلية' },
        { to: '/team', icon: Users, label: 'فريق العمل' },
        { to: '/ai-assistant', icon: Bot, label: 'المساعد الذكي' },
        { to: '/organization', icon: Building2, label: 'الهيكل التنظيمي' },
        { to: '/assets', icon: Package, label: 'أصول الشركة' },
        { to: '/landing-manager', icon: Globe, label: 'إدارة الموقع' },
      ]
    },
    {
      id: 'creation',
      label: 'الإنشاء الذكي',
      icon: Sparkles,
      color: 'indigo',
      items: [
        { to: '/ai-generator', icon: FilePlus2, label: 'مولد المستندات (AI)' },
        { to: '/planning', icon: Zap, label: 'الخطط الاستراتيجية' },
      ]
    },
    {
      id: 'sales',
      label: 'المبيعات والعملاء',
      icon: HeartHandshake,
      color: 'emerald',
      items: [
        { to: '/customers', icon: HeartHandshake, label: 'إدارة العملاء (CRM)' },
        { to: '/support', icon: LifeBuoy, label: 'مركز الدعم الفني' },
        { to: '/products', icon: ShoppingBag, label: 'المنتجات والخدمات' },
        { to: '/contracts', icon: FileText, label: 'العقود والاشتراكات' },
        { to: '/doc-signing', icon: PenTool, label: 'توقيع المستندات' },
      ]
    },
    {
      id: 'spending',
      label: 'المالية والمشتريات',
      icon: ShoppingCart,
      color: 'orange',
      items: [
        { to: '/suppliers', icon: Truck, label: 'إدارة الموردين' },
        { to: '/finance', icon: Wallet, label: 'المصروفات والمالية' },
      ]
    },
    {
      id: 'operations',
      label: 'التنفيذ والعمليات',
      icon: Briefcase,
      color: 'indigo',
      items: [
        { to: '/projects', icon: Briefcase, label: 'إدارة المشاريع' },
        { to: '/calendar', icon: Calendar, label: 'تقويم العمليات' },
        { to: '/todo', icon: CheckSquare, label: 'المهام والإنتاجية' },
        { to: '/ratings', icon: Star, label: 'تقييمات الجودة' },
      ]
    }
  ];

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    );
  }

  return (
    <ProtectedRoute isAuthenticated={isAuthenticated}>
      <div className="min-h-screen flex font-cairo text-right relative bg-[#f8fafc]" dir="rtl">
        <LiveBackground />
        
        <aside 
          className={`fixed inset-y-0 right-0 z-50 w-72 bg-white/70 backdrop-blur-3xl border-l border-slate-200/50 transition-all duration-500 ease-in-out lg:static lg:translate-x-0 ${
            isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="h-full flex flex-col pt-8">
            <div className="flex items-center justify-between px-7 mb-12">
              <Link to="/" className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-blue-200 group-hover:scale-105 transition-transform">T</div>
                <div>
                  <h1 className="text-xl font-black text-slate-900 tracking-tighter leading-none mb-1">تكنولوجي</h1>
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest opacity-80">Enterprise ERP</p>
                </div>
              </Link>
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-all"><X size={20}/></button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar pb-8 px-2">
              {categories.map((cat) => (
                <SidebarCategory 
                  key={cat.id}
                  label={cat.label}
                  icon={cat.icon}
                  items={cat.items}
                  isOpen={openCategories[cat.id]}
                  onToggle={() => toggleCategory(cat.id)}
                  activePath={location.pathname}
                  colorClass={cat.color}
                />
              ))}
            </div>

            <div className="p-6 bg-white/40 border-t border-slate-100">
              <div className="space-y-2">
                <Link
                  to="/settings"
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold text-sm ${
                    location.pathname === '/settings' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-500 hover:bg-white'
                  }`}
                >
                  <Settings size={18} />
                  <span>إعدادات النظام</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-rose-500 hover:bg-rose-50/50 transition-all font-bold text-sm"
                >
                  <LogOut size={18} />
                  <span>تسجيل الخروج</span>
                </button>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          <header className="h-20 bg-white/40 backdrop-blur-2xl border-b border-slate-200/40 flex items-center justify-between px-8 sticky top-0 z-40">
            <div className="flex items-center gap-6">
              <button 
                onClick={() => setSidebarOpen(!isSidebarOpen)}
                className="p-2.5 text-slate-600 bg-white hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all shadow-sm border border-slate-100"
              >
                <Menu size={20} />
              </button>
              
              <div className="relative hidden xl:block w-96">
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Command size={16} />
                </div>
                <input 
                  type="text" 
                  placeholder="ابحث عن مشروع، عميل، أو معلومة..."
                  className="w-full pr-12 pl-4 py-2.5 bg-slate-100/40 border border-transparent rounded-2xl text-xs font-bold focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-5">
              <button className="p-2.5 text-slate-600 bg-white hover:bg-blue-50 hover:text-blue-600 rounded-xl relative transition-all shadow-sm border border-slate-100">
                <Bell size={20} />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white ring-2 ring-rose-500/20"></span>
              </button>
              
              <div className="h-8 w-px bg-slate-200/60 mx-1"></div>
              
              <div className="flex items-center gap-4 cursor-pointer hover:bg-white p-1.5 rounded-2xl transition-all border border-transparent hover:border-slate-100 shadow-sm shadow-transparent hover:shadow-slate-200/50">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-black text-slate-900 leading-none mb-1">أحمد محمد</p>
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest opacity-70">Administrator</p>
                </div>
                <div className="relative">
                  <img src="https://picsum.photos/seed/admin/120/120" alt="Profile" className="w-10 h-10 rounded-xl object-cover ring-2 ring-blue-100 shadow-md" />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white ring-2 ring-emerald-500/20"></div>
                </div>
              </div>
            </div>
          </header>

          <div ref={contentRef} className="flex-1 overflow-y-auto p-4 md:p-10 scroll-smooth no-scrollbar">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-[1600px] mx-auto page-transition"
              >
                <Routes location={location}>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/official-documents" element={<OfficialDocuments />} />
                  <Route path="/chat" element={<InternalChat />} />
                  <Route path="/calendar" element={<CalendarView />} />
                  <Route path="/planning" element={<Planning />} />
                  <Route path="/ai-generator" element={<AIGenerator />} />
                  <Route path="/todo" element={<TodoList />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/ratings" element={<Ratings />} />
                  <Route path="/contracts" element={<Contracts />} />
                  <Route path="/doc-signing" element={<DocumentSigning />} />
                  <Route path="/customers" element={<Customers />} />
                  <Route path="/support" element={<Support />} />
                  <Route path="/suppliers" element={<Suppliers />} />
                  <Route path="/assets" element={<Assets />} />
                  <Route path="/landing-manager" element={<LandingPageManager />} />
                  <Route path="/team" element={<Team />} />
                  <Route path="/finance" element={<Finance />} />
                  <Route path="/organization" element={<Organization />} />
                  <Route path="/ai-assistant" element={<AIAssistant />} />
                  <Route path="/settings" element={<SettingsView />} />
                </Routes>
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

const App = () => (
  <HashRouter>
    <AppLayout />
  </HashRouter>
);

export default App;
