import React, { useState, useMemo } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  Bell, 
  Layers, 
  Download, 
  ShieldAlert, 
  Briefcase, 
  Terminal, 
  ShieldCheck, 
  Target,
  Filter,
  CheckCircle2,
  X,
  Save,
  Type,
  AlertCircle,
  FileCheck,
  ArrowUpDown,
  FileDown,
  Timer
} from 'lucide-react';

type EventCategory = 'client' | 'compliance' | 'strategic' | 'operational';
type ViewMode = 'calendar' | 'compliance';

interface Department {
  id: string;
  name: string;
  color: string;
}

interface UnifiedEvent {
  id: string;
  title: string;
  category: EventCategory;
  departmentId: string;
  time: string;
  date: number; 
  fullDate: string;
  priority: 'low' | 'medium' | 'high';
  attendees?: number;
  description?: string;
}

const mockDepartments: Department[] = [
  { id: 'd1', name: 'تطوير البرمجيات', color: 'blue' },
  { id: 'd2', name: 'التصميم (UX/UI)', color: 'indigo' },
  { id: 'd3', name: 'الاستشارات والمبيعات', color: 'emerald' },
  { id: 'd4', name: 'الإدارة والامتثال', color: 'rose' },
];

const initialEvents: UnifiedEvent[] = [
  { id: 'e1', title: 'عرض فني - مشروع نيوم', category: 'client', departmentId: 'd3', time: '10:00 AM', date: 23, fullDate: '2023-11-23', priority: 'high', attendees: 4 },
  { id: 'e2', title: 'مراجعة الكود - بوابة الدفع', category: 'operational', departmentId: 'd1', time: '02:00 PM', date: 23, fullDate: '2023-11-23', priority: 'medium', attendees: 2 },
  { id: 'e3', title: 'تجديد السجل التجاري', category: 'compliance', departmentId: 'd4', time: 'All Day', date: 25, fullDate: '2023-11-25', priority: 'high', description: 'تجديد العضوية في الغرفة التجارية بالرياض' },
  { id: 'e4', title: 'تجديد رخصة الاستثمار (MISA)', category: 'compliance', departmentId: 'd4', time: 'All Day', date: 28, fullDate: '2023-11-28', priority: 'high' },
  { id: 'e5', title: 'جلسة التخطيط السنوي 2024', category: 'strategic', departmentId: 'd4', time: '09:00 AM', date: 26, fullDate: '2023-11-26', priority: 'high', attendees: 8 },
  { id: 'e6', title: 'تسليم تصميمات الموبايل', category: 'client', departmentId: 'd2', time: '11:00 AM', date: 22, fullDate: '2023-11-22', priority: 'medium', attendees: 3 },
  { id: 'e7', title: 'تحديث سيرفرات AWS', category: 'operational', departmentId: 'd1', time: '01:00 AM', date: 24, fullDate: '2023-11-24', priority: 'medium' },
  { id: 'e8', title: 'تأمين الموظفين الطبي', category: 'compliance', departmentId: 'd4', time: 'All Day', date: 15, fullDate: '2023-11-15', priority: 'medium' },
];

const CalendarView = () => {
  const [events, setEvents] = useState<UnifiedEvent[]>(initialEvents);
  const [activeCategory, setActiveCategory] = useState<EventCategory | 'all'>('all');
  const [selectedDept, setSelectedDept] = useState<string | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewMode>('calendar');
  const [sortField, setSortField] = useState<'date' | 'title'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentMonth] = useState('نوفمبر 2023');

  // Form State
  const [newEvent, setNewEvent] = useState<Partial<UnifiedEvent>>({
    title: '',
    category: 'operational',
    departmentId: 'd1',
    time: '09:00 AM',
    date: 23,
    priority: 'medium'
  });
  
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const weekDays = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      const catMatch = activeCategory === 'all' || e.category === activeCategory;
      const deptMatch = selectedDept === 'all' || e.departmentId === selectedDept;
      return catMatch && deptMatch;
    });
  }, [events, activeCategory, selectedDept]);

  const complianceEvents = useMemo(() => {
    const list = events.filter(e => e.category === 'compliance');
    return list.sort((a, b) => {
      if (sortField === 'date') {
        return sortOrder === 'asc' ? a.date - b.date : b.date - a.date;
      }
      return sortOrder === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
    });
  }, [events, sortField, sortOrder]);

  const getEventsForDay = (day: number) => filteredEvents.filter(e => e.date === day);

  const getDeptColor = (deptId: string) => {
    return mockDepartments.find(d => d.id === deptId)?.color || 'slate';
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title) return;

    const eventToAdd: UnifiedEvent = {
      id: 'e' + Date.now(),
      title: newEvent.title!,
      category: newEvent.category as EventCategory,
      departmentId: newEvent.departmentId!,
      time: newEvent.time!,
      date: Number(newEvent.date),
      fullDate: `2023-11-${newEvent.date}`,
      priority: newEvent.priority as any,
      attendees: 0
    };

    setEvents([...events, eventToAdd]);
    setIsModalOpen(false);
    setNewEvent({ title: '', category: 'operational', departmentId: 'd1', time: '09:00 AM', date: 23, priority: 'medium' });
  };

  const exportComplianceReport = () => {
    const headers = ["الوثيقة الرسمية", "تاريخ الانتهاء", "الأولوية", "الحالة"];
    const rows = complianceEvents.map(e => {
      const today = 23; // Simulated today
      const status = e.date < today ? "منتهي" : e.date - today < 7 ? "حرج" : "نشط";
      return [e.title, e.fullDate, e.priority, status];
    });
    const csvContent = "\uFEFF" + [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `تقرير_تجديد_الوثائق_${new Date().toLocaleDateString('ar-SA')}.csv`;
    link.click();
  };

  const exportEventsReport = () => {
    const headers = ["الموعد", "القسم", "التصنيف", "الوقت", "التاريخ"];
    const rows = filteredEvents.map(e => {
      const deptName = mockDepartments.find(d => d.id === e.departmentId)?.name || 'عام';
      return [e.title, deptName, e.category, e.time, e.fullDate];
    });
    const csvContent = "\uFEFF" + [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `جدول_عمليات_الاقسام_${new Date().toLocaleDateString('ar-SA')}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <CalendarIcon className="text-blue-600" /> تقويم العمليات والأقسام
          </h2>
          <p className="text-slate-500 text-sm">مزامنة مهام الفرق التقنية، مواعيد العملاء، والتزامات الامتثال.</p>
        </div>
        <div className="flex gap-2">
           <div className="bg-white p-1 rounded-xl border border-slate-200 flex shadow-sm">
              <button 
                onClick={() => setCurrentView('calendar')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${currentView === 'calendar' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <CalendarIcon size={14} /> التقويم العام
              </button>
              <button 
                onClick={() => setCurrentView('compliance')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${currentView === 'compliance' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <FileCheck size={14} /> التراخيص والامتثال
              </button>
           </div>
        </div>
      </div>

      {currentView === 'calendar' ? (
        <>
          <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col lg:flex-row gap-6 items-center">
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">الفئة:</span>
              {[
                { id: 'all', label: 'الكل', icon: Layers },
                { id: 'client', label: 'عملاء', icon: Briefcase },
                { id: 'compliance', label: 'رخص', icon: ShieldCheck },
                { id: 'strategic', label: 'أهداف', icon: Target },
                { id: 'operational', label: 'تشغيل', icon: Terminal },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold transition-all ${
                    activeCategory === tab.id ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  <tab.icon size={14} /> {tab.label}
                </button>
              ))}
            </div>

            <div className="h-8 w-px bg-slate-100 hidden lg:block"></div>

            <div className="flex items-center gap-2 flex-wrap justify-center">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">القسم:</span>
              <button 
                onClick={() => setSelectedDept('all')}
                className={`px-4 py-2 rounded-xl text-[10px] font-bold transition-all ${
                  selectedDept === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                كل الأقسام
              </button>
              {mockDepartments.map((dept) => (
                <button
                  key={dept.id}
                  onClick={() => setSelectedDept(dept.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold transition-all border ${
                    selectedDept === dept.id 
                      ? `bg-${dept.color}-50 border-${dept.color}-200 text-${dept.color}-700 shadow-sm` 
                      : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full bg-${dept.color}-500`}></div>
                  {dept.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                  <div className="flex items-center gap-6">
                      <h3 className="text-xl font-black text-slate-800">{currentMonth}</h3>
                      <div className="flex bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
                        <button className="p-1.5 hover:bg-slate-50 rounded-lg transition-colors"><ChevronRight size={18} /></button>
                        <div className="w-px h-6 bg-slate-100 mx-1"></div>
                        <button className="p-1.5 hover:bg-slate-50 rounded-lg transition-colors"><ChevronLeft size={18} /></button>
                      </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={exportEventsReport} className="p-2 text-slate-400 hover:text-blue-600 transition-colors bg-white border border-slate-100 rounded-xl shadow-sm"><Download size={18} /></button>
                    <button onClick={() => setIsModalOpen(true)} className="p-2 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition-all"><Plus size={18} /></button>
                  </div>
                </div>

                <div className="grid grid-cols-7 bg-slate-50/50 border-b border-slate-100">
                  {weekDays.map(day => (
                    <div key={day} className="py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">{day}</div>
                  ))}
                </div>

                <div className="grid grid-cols-7">
                  {days.map(day => {
                    const dayEvents = getEventsForDay(day);
                    const isToday = day === 23;
                    
                    return (
                      <div key={day} className={`min-h-[160px] p-2 border-r border-b border-slate-100 transition-all hover:bg-slate-50/50 group relative ${isToday ? 'bg-blue-50/20' : ''}`}>
                          <div className="flex justify-between items-start mb-2">
                            <span className={`text-xs font-black ${isToday ? 'w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-200' : 'text-slate-300'}`}>
                              {day}
                            </span>
                          </div>
                          
                          <div className="space-y-1.5">
                            {dayEvents.map(event => {
                              const color = getDeptColor(event.departmentId);
                              return (
                                <div 
                                  key={event.id} 
                                  className={`p-1.5 rounded-lg text-[9px] font-black truncate border transition-all hover:scale-[1.02] cursor-pointer bg-${color}-50 border-${color}-100 text-${color}-700 shadow-sm`}
                                  title={`${event.title}`}
                                >
                                  {event.title}
                                </div>
                              );
                            })}
                          </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-900 p-8 rounded-[2rem] text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5"><Layers size={140} /></div>
                <h3 className="text-sm font-black text-slate-400 mb-6 uppercase tracking-widest flex items-center gap-2">
                  <Bell size={18} className="text-blue-500" /> فعاليات اليوم
                </h3>
                <div className="space-y-4 relative z-10">
                    {events.filter(e => e.date === 23).map(event => {
                      const dept = mockDepartments.find(d => d.id === event.departmentId);
                      return (
                        <div key={event.id} className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all group cursor-pointer">
                          <div className="flex justify-between items-start mb-2">
                              <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase bg-${dept?.color}-500/20 text-${dept?.color}-300 border border-${dept?.color}-500/30`}>
                                {dept?.name}
                              </span>
                              {event.priority === 'high' && <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]"></div>}
                          </div>
                          <h4 className="font-bold text-white text-xs mb-3">{event.title}</h4>
                          <div className="flex items-center justify-between text-[10px] text-slate-400">
                              <span className="flex items-center gap-1"><Clock size={12} /> {event.time}</span>
                              {event.attendees && <span className="flex items-center gap-1"><Users size={12} /> {event.attendees}</span>}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="animate-in slide-in-from-left-4 duration-500 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                   <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
                      <ShieldCheck className="text-emerald-600" /> سجل الامتثال والتراخيص الرسمية
                   </h3>
                   <p className="text-slate-500 text-sm font-medium mt-1">تتبع مواعيد انتهاء السجلات التجارية، الرخص الاستثمارية، وعقود التأمين.</p>
                </div>
                <div className="flex gap-3">
                   <button 
                     onClick={exportComplianceReport}
                     className="px-6 py-2.5 bg-slate-50 text-slate-600 border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-100 transition-all flex items-center gap-2"
                   >
                     <FileDown size={18} /> تصدير السجل (CSV)
                   </button>
                   <button 
                     onClick={() => setIsModalOpen(true)}
                     className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-lg hover:bg-blue-700 flex items-center gap-2"
                   >
                     <Plus size={18} /> إضافة رخصة/وثيقة
                   </button>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-rose-50 p-5 rounded-3xl border border-rose-100 flex items-center gap-5">
                   <div className="w-12 h-12 bg-rose-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-rose-200"><AlertCircle size={24} /></div>
                   <div>
                      <p className="text-[10px] text-rose-500 font-bold uppercase">وثائق قاربت على الانتهاء</p>
                      <p className="text-lg font-black text-rose-800">2 وثيقة</p>
                   </div>
                </div>
                <div className="bg-emerald-50 p-5 rounded-3xl border border-emerald-100 flex items-center gap-5">
                   <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200"><CheckCircle2 size={24} /></div>
                   <div>
                      <p className="text-[10px] text-emerald-500 font-bold uppercase">وثائق نشطة (محدّثة)</p>
                      <p className="text-lg font-black text-emerald-800">12 وثيقة</p>
                   </div>
                </div>
                <div className="bg-indigo-50 p-5 rounded-3xl border border-indigo-100 flex items-center gap-5">
                   <div className="w-12 h-12 bg-indigo-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200"><Timer size={24} /></div>
                   <div>
                      <p className="text-[10px] text-indigo-500 font-bold uppercase">متوسط دورة التجديد</p>
                      <p className="text-lg font-black text-indigo-800">سنوي</p>
                   </div>
                </div>
             </div>

             <div className="overflow-hidden border border-slate-100 rounded-3xl bg-white shadow-inner">
                <table className="w-full text-right text-sm">
                   <thead className="bg-slate-50/50 text-slate-500 font-bold border-b border-slate-100">
                      <tr>
                         <th className="px-8 py-5">
                            <button 
                              onClick={() => { setSortField('title'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}
                              className="flex items-center gap-2 hover:text-blue-600 transition-colors uppercase text-[10px] tracking-widest"
                            >
                               الوثيقة الرسمية <ArrowUpDown size={12} />
                            </button>
                         </th>
                         <th className="px-8 py-5 uppercase text-[10px] tracking-widest">الوصف</th>
                         <th className="px-8 py-5">
                            <button 
                              onClick={() => { setSortField('date'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}
                              className="flex items-center gap-2 hover:text-blue-600 transition-colors uppercase text-[10px] tracking-widest"
                            >
                               تاريخ الانتهاء <ArrowUpDown size={12} />
                            </button>
                         </th>
                         <th className="px-8 py-5 uppercase text-[10px] tracking-widest text-center">الأولوية</th>
                         <th className="px-8 py-5 uppercase text-[10px] tracking-widest text-center">الحالة</th>
                         <th className="px-8 py-5"></th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                      {complianceEvents.map(e => {
                        const today = 23; // Simulated today
                        const daysLeft = e.date - today;
                        const isExpired = daysLeft < 0;
                        const isUrgent = daysLeft >= 0 && daysLeft <= 7;
                        
                        return (
                          <tr key={e.id} className="hover:bg-slate-50/50 transition-colors group">
                             <td className="px-8 py-6">
                                <div className="flex items-center gap-4">
                                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isExpired ? 'bg-rose-50 text-rose-600' : isUrgent ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                      <ShieldCheck size={20} />
                                   </div>
                                   <p className="font-bold text-slate-800">{e.title}</p>
                                </div>
                             </td>
                             <td className="px-8 py-6 text-xs text-slate-500 max-w-xs truncate">{e.description || 'لا يوجد وصف متاح'}</td>
                             <td className="px-8 py-6">
                                <div className="flex items-center gap-2">
                                   <CalendarIcon size={14} className="text-slate-300" />
                                   <span className={`font-mono text-xs font-bold ${isExpired ? 'text-rose-600' : isUrgent ? 'text-amber-600' : 'text-slate-600'}`}>
                                      {e.fullDate}
                                   </span>
                                </div>
                             </td>
                             <td className="px-8 py-6 text-center">
                                <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase ${
                                  e.priority === 'high' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'
                                }`}>
                                   {e.priority}
                                </span>
                             </td>
                             <td className="px-8 py-6 text-center">
                                {isExpired ? (
                                   <span className="flex items-center justify-center gap-1.5 text-rose-600 text-[10px] font-black uppercase tracking-tighter">
                                      <ShieldAlert size={14} /> منتهي
                                   </span>
                                ) : isUrgent ? (
                                   <span className="flex items-center justify-center gap-1.5 text-amber-600 text-[10px] font-black uppercase tracking-tighter">
                                      <Timer size={14} className="animate-spin-slow" /> يجدد قريباً
                                   </span>
                                ) : (
                                   <span className="flex items-center justify-center gap-1.5 text-emerald-600 text-[10px] font-black uppercase tracking-tighter">
                                      <CheckCircle2 size={14} /> فعّال
                                   </span>
                                )}
                             </td>
                             <td className="px-8 py-6 text-left">
                                <button className="p-2 text-slate-300 hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100"><Plus size={18}/></button>
                             </td>
                          </tr>
                        );
                      })}
                   </tbody>
                </table>
             </div>
          </div>
        </div>
      )}

      {/* Add Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-100">
                   <Plus size={24} />
                 </div>
                 <div>
                   <h3 className="text-xl font-black text-slate-800">إضافة حدث جديد</h3>
                   <p className="text-xs text-slate-500 font-medium mt-1">قم بجدولة المواعيد وتوزيعها على الأقسام</p>
                 </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Type size={14} /> عنوان الحدث أو المهمة
                </label>
                <input 
                  required
                  type="text" 
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  placeholder="مثال: تجديد رخصة الاستثمار"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Users size={14} /> القسم المسؤول
                  </label>
                  <select 
                    value={newEvent.departmentId}
                    onChange={(e) => setNewEvent({...newEvent, departmentId: e.target.value})}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    {mockDepartments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Layers size={14} /> تصنيف الحدث
                  </label>
                  <select 
                    value={newEvent.category}
                    onChange={(e) => setNewEvent({...newEvent, category: e.target.value as any})}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    <option value="client">عملاء والمبيعات</option>
                    <option value="operational">تشغيل وتقنية</option>
                    <option value="compliance">رخص وامتثال</option>
                    <option value="strategic">أهداف استراتيجية</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <CalendarIcon size={14} /> اليوم
                  </label>
                  <input 
                    type="number" 
                    min="1" 
                    max="30"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({...newEvent, date: Number(e.target.value)})}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 text-center outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Clock size={14} /> الوقت
                  </label>
                  <input 
                    type="text" 
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                    placeholder="10:00 AM"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 text-center outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <AlertCircle size={14} /> الأولوية
                  </label>
                  <select 
                    value={newEvent.priority}
                    onChange={(e) => setNewEvent({...newEvent, priority: e.target.value as any})}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">منخفضة</option>
                    <option value="medium">متوسطة</option>
                    <option value="high">عالية جداً</option>
                  </select>
                </div>
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
                  className="flex-[2] py-4 bg-blue-600 text-white font-black rounded-2xl shadow-2xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                  <Save size={20} /> حفظ الحدث في التقويم
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;