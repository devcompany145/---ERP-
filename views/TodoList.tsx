
import React, { useState, useMemo, useEffect } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  AlertCircle,
  Tag,
  ChevronRight,
  ListTodo,
  Circle,
  Edit3,
  X,
  Save,
  AlignLeft,
  ChevronDown,
  LayoutList,
  CalendarDays,
  Flag,
  Sparkles,
  Play,
  Square,
  Timer
} from 'lucide-react';

interface TodoTask {
  id: string;
  title: string;
  description?: string;
  category: 'عام' | 'مشروع' | 'عميل' | 'شخصي';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  completed: boolean;
  trackedHours: number; // الساعات الإجمالية المسجلة
}

const initialTasks: TodoTask[] = [
  { id: '1', title: 'مراجعة عقد شركة المراعي', category: 'عميل', priority: 'high', dueDate: '2023-11-25', completed: false, description: 'تحتاج مراجعة دقيقة من القسم القانوني', trackedHours: 2.5 },
  { id: '2', title: 'تحديث سيرفرات قاعدة البيانات', category: 'مشروع', priority: 'medium', dueDate: '2023-11-26', completed: true, description: 'مزامنة النسخ الاحتياطية', trackedHours: 4.2 },
  { id: '3', title: 'اجتماع ربع سنوي مع الفريق', category: 'عام', priority: 'high', dueDate: '2023-11-27', completed: false, trackedHours: 0 },
  { id: '4', title: 'دفع فواتير AWS', category: 'عام', priority: 'low', dueDate: '2023-11-28', completed: false, trackedHours: 0.5 },
  { id: '5', title: 'تحسين أداء واجهة ERP', category: 'مشروع', priority: 'medium', dueDate: '2023-11-29', completed: false, trackedHours: 1.8 },
  { id: '6', title: 'مهمة متأخرة قديمة', category: 'عام', priority: 'high', dueDate: '2023-11-10', completed: false, trackedHours: 0 },
  { id: '7', title: 'تحضير عرض اليوم', category: 'عميل', priority: 'high', dueDate: new Date().toISOString().split('T')[0], completed: false, trackedHours: 0 },
];

type GroupMode = 'flat' | 'priority' | 'date';

const TodoList = () => {
  const [tasks, setTasks] = useState<TodoTask[]>(initialTasks);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [groupMode, setGroupMode] = useState<GroupMode>('date');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDate, setNewTaskDate] = useState(new Date().toISOString().split('T')[0]);
  const [editingTask, setEditingTask] = useState<TodoTask | null>(null);

  // Time Tracking State
  const [activeTimers, setActiveTimers] = useState<Record<string, number>>({}); 
  const [currentTime, setCurrentTime] = useState(Date.now());

  // التحديث اللحظي للعدادات النشطة
  useEffect(() => {
    let interval: any;
    if (Object.keys(activeTimers).length > 0) {
      interval = setInterval(() => {
        setCurrentTime(Date.now());
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTimers]);

  const handleToggleTimer = (taskId: string) => {
    if (activeTimers[taskId]) {
      // إيقاف المؤقت وحساب الوقت
      const startTime = activeTimers[taskId];
      const elapsedMs = Date.now() - startTime;
      const elapsedHours = elapsedMs / (1000 * 60 * 60);

      setTasks(prev => prev.map(t => 
        t.id === taskId ? { ...t, trackedHours: Number((t.trackedHours + elapsedHours).toFixed(2)) } : t
      ));

      const newTimers = { ...activeTimers };
      delete newTimers[taskId];
      setActiveTimers(newTimers);
    } else {
      // بدء مؤقت جديد
      setActiveTimers(prev => ({ ...prev, [taskId]: Date.now() }));
    }
  };

  const formatDuration = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const toggleTask = (id: string) => {
    // إيقاف المؤقت إذا تم إكمال المهمة
    if (activeTimers[id]) handleToggleTimer(id);
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const newTask: TodoTask = {
      id: Date.now().toString(),
      title: newTaskTitle,
      category: 'عام',
      priority: 'medium',
      dueDate: newTaskDate,
      completed: false,
      trackedHours: 0
    };
    setTasks([newTask, ...tasks]);
    setNewTaskTitle('');
    setNewTaskDate(new Date().toISOString().split('T')[0]);
  };

  const deleteTask = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذه المهمة؟')) {
      if (activeTimers[id]) {
         const newTimers = { ...activeTimers };
         delete newTimers[id];
         setActiveTimers(newTimers);
      }
      setTasks(tasks.filter(t => t.id !== id));
    }
  };

  const updateTask = (updatedTask: TodoTask) => {
    setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
    setEditingTask(null);
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = activeFilter === 'all' ? true : activeFilter === 'completed' ? t.completed : !t.completed;
      return matchesSearch && matchesStatus;
    });
  }, [tasks, searchTerm, activeFilter]);

  const groupedTasks: Record<string, TodoTask[]> = useMemo(() => {
    if (groupMode === 'flat') return { 'كافة المهام': filteredTasks };

    if (groupMode === 'priority') {
      return {
        'أولوية عالية': filteredTasks.filter(t => t.priority === 'high'),
        'أولوية متوسطة': filteredTasks.filter(t => t.priority === 'medium'),
        'أولوية منخفضة': filteredTasks.filter(t => t.priority === 'low'),
      };
    }

    if (groupMode === 'date') {
      const today = new Date().toISOString().split('T')[0];
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      const nextWeekStr = nextWeek.toISOString().split('T')[0];

      return {
        'متأخرة': filteredTasks.filter(t => t.dueDate < today && !t.completed),
        'اليوم': filteredTasks.filter(t => t.dueDate === today),
        'هذا الأسبوع': filteredTasks.filter(t => t.dueDate > today && t.dueDate <= nextWeekStr),
        'قادمة': filteredTasks.filter(t => t.dueDate > nextWeekStr),
        'مكتملة سابقاً': filteredTasks.filter(t => t.completed && t.dueDate < today),
      };
    }

    return { 'كافة المهام': filteredTasks };
  }, [filteredTasks, groupMode]);

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
    totalHours: tasks.reduce((acc, t) => acc + t.trackedHours, 0).toFixed(1)
  };

  const TaskItem = ({ task }: { task: TodoTask; key?: string }) => {
    const isTimerRunning = !!activeTimers[task.id];
    
    return (
      <div 
        className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between transition-all group border-b border-slate-50 last:border-b-0 ${
          task.completed ? 'bg-slate-50/80 opacity-80' : 'bg-white hover:bg-blue-50/30'
        } ${
          isTimerRunning ? 'bg-blue-50/50 ring-2 ring-blue-500/20' : ''
        } ${
          !task.completed && task.priority === 'high' ? 'border-r-4 border-r-rose-500' : ''
        }`}
      >
        <div className="flex items-center gap-4 flex-1 mb-3 sm:mb-0">
          <button 
            onClick={() => toggleTask(task.id)}
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
              task.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-200 text-transparent hover:border-blue-400'
            }`}
          >
            <CheckCircle2 size={16} />
          </button>
          <div className="flex-1 min-w-0">
             <p className={`text-sm font-bold truncate transition-all ${task.completed ? 'text-slate-400 line-through decoration-2' : 'text-slate-700'}`}>
               {task.title}
             </p>
             <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase flex items-center gap-1 shrink-0 ${
                  task.priority === 'high' ? 'bg-rose-100 text-rose-600' : task.priority === 'medium' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                }`}>
                  <AlertCircle size={10} /> {task.priority === 'high' ? 'عالية' : task.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
                </span>
                <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1 shrink-0">
                  <Tag size={10} /> {task.category}
                </span>
                <span className={`text-[10px] font-bold flex items-center gap-1 shrink-0 ${
                  !task.completed && task.dueDate < new Date().toISOString().split('T')[0] ? 'text-rose-500' : 'text-slate-400'
                }`}>
                  <Calendar size={10} /> {task.dueDate}
                </span>
             </div>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0">
          {/* Time Tracking Control */}
          <div className="flex items-center gap-3 bg-slate-100/50 p-1.5 rounded-xl border border-slate-200/50">
             <div className="text-right">
                <p className="text-[8px] text-slate-400 font-black uppercase tracking-tighter">وقت العمل</p>
                <p className={`text-[10px] font-mono font-black ${isTimerRunning ? 'text-blue-600 animate-pulse' : 'text-slate-600'}`}>
                   {isTimerRunning ? formatDuration(currentTime - activeTimers[task.id]) : `${task.trackedHours}h`}
                </p>
             </div>
             <button 
               onClick={() => handleToggleTimer(task.id)}
               disabled={task.completed}
               className={`p-2 rounded-lg transition-all shadow-sm disabled:opacity-30 ${
                 isTimerRunning ? 'bg-rose-500 text-white hover:bg-rose-600' : 'bg-blue-600 text-white hover:bg-blue-700'
               }`}
               title={isTimerRunning ? 'إيقاف المؤقت' : 'بدء تتبع الوقت'}
             >
               {isTimerRunning ? <Square size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
             </button>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => setEditingTask(task)}
              className="p-2 text-slate-300 hover:text-blue-600 hover:bg-white rounded-lg transition-all"
            >
              <Edit3 size={16} />
            </button>
            <button 
              onClick={() => deleteTask(task.id)}
              className="p-2 text-slate-300 hover:text-rose-500 hover:bg-white rounded-lg transition-all"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tighter flex items-center gap-3">
             الإنتاجية والمهام <span className="px-4 py-1 bg-blue-100 text-blue-600 rounded-2xl text-sm font-black">{stats.pending}</span>
          </h2>
          <p className="text-slate-500 text-sm font-medium">نظم جدولك الزمني، حدد أولوياتك، وتابع تقدمك التقني.</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-white px-5 py-2 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-6">
             <div className="text-center">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-0.5">ساعات العمل</p>
                <p className="text-lg font-black text-blue-600">{stats.totalHours}</p>
             </div>
             <div className="w-px h-8 bg-slate-100"></div>
             <div className="text-center">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-0.5">المنجزة</p>
                <p className="text-lg font-black text-emerald-600">{stats.completed}</p>
             </div>
             <div className="w-px h-8 bg-slate-100"></div>
             <div className="text-center">
                <p className="text-[10px] text-amber-500 font-black uppercase tracking-widest mb-0.5">المتبقية</p>
                <p className="text-lg font-black text-slate-700">{stats.pending}</p>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
            <form onSubmit={addTask} className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-[3]">
                <AlignLeft className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="text" 
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="أدخل مهمة جديدة..."
                  className="w-full pr-12 pl-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all shadow-inner"
                />
              </div>
              <div className="relative flex-1">
                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
                <input 
                  type="date"
                  value={newTaskDate}
                  onChange={(e) => setNewTaskDate(e.target.value)}
                  className="w-full pr-12 pl-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all shadow-inner text-slate-600"
                />
              </div>
              <button 
                type="submit"
                className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Plus size={20} /> إضافة
              </button>
            </form>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex gap-2">
              <div className="flex bg-slate-100 p-1 rounded-xl">
                 {[
                   { id: 'all', label: 'الكل' },
                   { id: 'pending', label: 'المتبقية' },
                   { id: 'completed', label: 'المكتملة' },
                 ].map((f) => (
                   <button 
                    key={f.id}
                    onClick={() => setActiveFilter(f.id as any)}
                    className={`px-6 py-2 rounded-lg text-xs font-black transition-all ${
                      activeFilter === f.id ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
                   >
                     {f.label}
                   </button>
                 ))}
              </div>
              
              <div className="h-8 w-px bg-slate-100 mx-1 hidden md:block"></div>

              <div className="flex bg-slate-100 p-1 rounded-xl">
                 <button 
                  onClick={() => setGroupMode('date')}
                  title="تجميع حسب التاريخ"
                  className={`p-2 rounded-lg transition-all ${groupMode === 'date' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
                 >
                   <CalendarDays size={18} />
                 </button>
                 <button 
                  onClick={() => setGroupMode('priority')}
                  title="تجميع حسب الأولوية"
                  className={`p-2 rounded-lg transition-all ${groupMode === 'priority' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
                 >
                   <Flag size={18} />
                 </button>
                 <button 
                  onClick={() => setGroupMode('flat')}
                  title="عرض مسطح"
                  className={`p-2 rounded-lg transition-all ${groupMode === 'flat' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
                 >
                   <LayoutList size={18} />
                 </button>
              </div>
            </div>

            <div className="relative">
              <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="بحث..." 
                className="pr-12 pl-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs w-full md:w-64 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-6">
            {Object.entries(groupedTasks).map(([groupName, groupTasks]) => (
              groupTasks.length > 0 && (
                <div key={groupName} className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-400">
                   <div className="flex items-center gap-3 px-2">
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{groupName}</h3>
                      <div className="h-px flex-1 bg-slate-100"></div>
                      <span className="text-[10px] font-black text-slate-300">{groupTasks.length}</span>
                   </div>
                   <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                      {groupTasks.map(task => (
                        <TaskItem key={task.id} task={task} />
                      ))}
                   </div>
                </div>
              )
            ))}

            {filteredTasks.length === 0 && (
              <div className="py-24 text-center bg-white rounded-[3rem] border border-slate-100 shadow-sm">
                 <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                   <ListTodo size={40} />
                 </div>
                 <h4 className="text-lg font-black text-slate-800">لا توجد مهام حالياً</h4>
                 <p className="text-slate-400 text-sm font-medium max-w-xs mx-auto mt-2">جرب تغيير فلاتر البحث أو ابدأ بإضافة مهمة جديدة لليوم.</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
               <h4 className="text-sm font-black text-slate-800 uppercase tracking-tighter">تقويم المهام</h4>
               <Calendar size={18} className="text-blue-600" />
            </div>
            <div className="p-6 bg-slate-900 rounded-[2rem] text-center shadow-xl shadow-slate-200 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12"><Calendar size={80} /></div>
               <p className="text-[10px] text-blue-300 font-black uppercase tracking-widest mb-1 relative z-10">اليوم</p>
               <p className="text-5xl font-black relative z-10 tracking-tighter">{new Date().getDate()}</p>
               <p className="text-sm text-blue-400 font-bold mt-1 relative z-10">
                 {new Date().toLocaleDateString('ar-SA', { month: 'long', year: 'numeric' })}
               </p>
            </div>
            <div className="mt-8 space-y-4">
               <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">أبرز المواعيد القادمة</p>
               {[
                 { time: '10:00 AM', label: 'اجتماع الفريق التقني' },
                 { time: '02:30 PM', label: 'عرض ديمو العميل' },
               ].map((e, i) => (
                 <div key={i} className="flex gap-4 items-start p-3 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer group">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 group-hover:scale-150 transition-transform"></div>
                    <div>
                       <p className="text-xs font-black text-slate-700">{e.label}</p>
                       <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{e.time}</p>
                    </div>
                 </div>
               ))}
            </div>
          </div>

          <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><Clock size={120} /></div>
             <h4 className="font-black text-sm mb-3 flex items-center gap-2 relative z-10"><Sparkles size={18} className="text-blue-200" /> اقتراح ذكي</h4>
             <p className="text-xs text-indigo-100 leading-relaxed relative z-10 font-medium">
               لديك **{stats.pending} مهام متبقية**. هل تريد مراجعة "معدل الحرق المالي" للمشاريع بناءً على ساعات العمل المسجلة؟
             </p>
             <button className="w-full mt-6 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-[10px] font-black uppercase transition-all relative z-10">إدارة الأداء</button>
          </div>
        </div>
      </div>

      {editingTask && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-100">
                  <Edit3 size={24} />
                </div>
                <div>
                   <h4 className="text-xl font-black text-slate-800">تعديل المهمة</h4>
                   <p className="text-xs text-slate-500 font-medium mt-1">تحديث تفاصيل المهمة والجدول الزمني</p>
                </div>
              </div>
              <button 
                onClick={() => setEditingTask(null)} 
                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">مسمى المهمة</label>
                <input 
                  type="text" 
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-bold text-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">التصنيف</label>
                  <select 
                    value={editingTask.category}
                    onChange={(e) => setEditingTask({...editingTask, category: e.target.value as any})}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-bold text-slate-700"
                  >
                    <option value="عام">عام</option>
                    <option value="مشروع">مشروع</option>
                    <option value="عميل">عميل</option>
                    <option value="شخصي">شخصي</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">الأولوية</label>
                  <select 
                    value={editingTask.priority}
                    onChange={(e) => setEditingTask({...editingTask, priority: e.target.value as any})}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-bold text-slate-700"
                  >
                    <option value="low">منخفضة</option>
                    <option value="medium">متوسطة</option>
                    <option value="high">عالية</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">الساعات المسجلة (يدوياً)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={editingTask.trackedHours}
                  onChange={(e) => setEditingTask({...editingTask, trackedHours: Number(e.target.value)})}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-slate-700"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setEditingTask(null)}
                  className="flex-1 py-4 text-slate-600 font-black bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all active:scale-95"
                >
                  إلغاء
                </button>
                <button 
                  onClick={() => updateTask(editingTask)}
                  className="flex-[2] py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 active:scale-95"
                >
                  <Save size={20} /> حفظ التعديلات
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoList;
