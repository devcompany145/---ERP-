
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
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
  LifeBuoy
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
import LiveBackground from './components/LiveBackground';

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
    <div className="space-y-1">
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${
          isAnyActive ? `bg-${colorClass}-50 text-${colorClass}-700` : 'text-slate-600 hover:bg-slate-100'
        }`}
      >
        <div className="flex items-center gap-3">
          <Icon size={20} className={isAnyActive ? `text-${colorClass}-600` : 'text-slate-400'} />
          <span className="font-bold text-sm">{label}</span>
        </div>
        <ChevronDown 
          size={16} 
          className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen ? 'max-h-[500px] opacity-100 mt-1' : 'max-h-0 opacity-0'
      }`}>
        <div className={`mr-6 border-r-2 border-slate-100 space-y-1 pr-2`}>
          {items.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                activePath === item.to 
                  ? `bg-${colorClass}-600 text-white shadow-md shadow-${colorClass}-100` 
                  : `text-slate-500 hover:text-${colorClass}-600 hover:bg-${colorClass}-50`
              }`}
            >
              <item.icon size={16} />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

const AppLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const contentRef = useRef<HTMLDivElement>(null);

  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    admin: true,
    sales: true,
    spending: true,
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
      label: 'المصاريف والمشتريات',
      icon: ShoppingCart,
      color: 'orange',
      items: [
        { to: '/suppliers', icon: Truck, label: 'إدارة الموردين' },
        { to: '/finance', icon: Wallet, label: 'المصروفات والمالية' },
        { to: '/planning', icon: CalendarDays, label: 'التخطيط والميزانية' },
      ]
    },
    {
      id: 'operations',
      label: 'العمليات والتنفيذ',
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

  return (
    <div className="min-h-screen flex bg-transparent font-cairo text-right relative" dir="rtl">
      <LiveBackground />
      
      <aside 
        className={`fixed inset-y-0 right-0 z-50 w-72 bg-white/90 backdrop-blur-xl border-l border-slate-200 transition-transform duration-500 ease-in-out lg:static lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col p-4">
          <div className="flex items-center justify-between px-2 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-100">T</div>
              <h1 className="text-xl font-black text-slate-800 tracking-tighter">تكنولوجي ERP</h1>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 text-slate-400"><X size={20}/></button>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar pb-6">
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
          </nav>

          <div className="mt-auto pt-4 border-t border-slate-100">
            <Link
              to="/settings"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                location.pathname === '/settings' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              <Settings size={20} />
              <span className="font-bold text-sm">إعدادات النظام</span>
            </Link>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white/70 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>
            <div className="relative hidden md:block w-64">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="بحث في النظام..."
                className="w-full pr-10 pl-4 py-2 bg-slate-100/50 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-full relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200 mx-2"></div>
            <div className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-1 rounded-lg transition-colors">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800">أحمد محمد</p>
                <p className="text-xs text-slate-500">المدير التنفيذي</p>
              </div>
              <img src="https://picsum.photos/seed/admin/40/40" alt="Profile" className="w-9 h-9 rounded-full ring-2 ring-blue-100 shadow-sm" />
            </div>
          </div>
        </header>

        <div ref={contentRef} className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
              <Routes location={location}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/official-documents" element={<OfficialDocuments />} />
                <Route path="/chat" element={<InternalChat />} />
                <Route path="/calendar" element={<CalendarView />} />
                <Route path="/planning" element={<Planning />} />
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
  );
};

const App = () => (
  <HashRouter>
    <AppLayout />
  </HashRouter>
);

export default App;
