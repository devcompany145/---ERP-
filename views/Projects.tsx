
import React, { useState, useMemo, useEffect } from 'react';
import { ProjectStatus, Project, Milestone, Task, ProjectResource, TimeLog, CostHistoryItem } from '../types';
import { 
  Briefcase, 
  Search, 
  Filter, 
  Plus, 
  Clock, 
  CheckCircle2, 
  Github, 
  Cloud, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar, 
  ChevronLeft, 
  MoreVertical, 
  AlertCircle, 
  LayoutGrid, 
  List as ListIcon, 
  ChevronRight, 
  Target, 
  Layers, 
  FileText, 
  X, 
  Save, 
  Check, 
  Edit3, 
  Trash2, 
  Play, 
  Square, 
  Timer, 
  Cpu, 
  UserPlus, 
  Zap, 
  BarChart3, 
  ArrowUpRight, 
  PieChart as PieChartIcon, 
  Download, 
  ShieldCheck, 
  Award, 
  AlertTriangle, 
  UserCog, 
  ShieldAlert, 
  Bug, 
  Sparkles, 
  Loader2, 
  RefreshCw, 
  FileBarChart, 
  Link as LinkIcon, 
  Trello, 
  Maximize2,
  History,
  Activity,
  Wallet,
  ArrowRightLeft,
  Server,
  LineChart as LineChartIcon
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { getProjectFinancialAnalysis, fetchExternalTasks } from '../services/geminiService';
import { storageService } from '../services/storageService';
import { motion, AnimatePresence } from 'framer-motion';

const initialMockProjects: Project[] = [
  {
    id: '1',
    name: 'تطبيق التوصيل الذكي',
    client: 'شركة الأغذية المتحدة',
    clientId: 'c1',
    deadline: '2024-03-15',
    status: ProjectStatus.IN_PROGRESS,
    progress: 65,
    budget: 250000,
    actualCost: 165000,
    profit: 85000,
    team: ['1', '4'],
    projectManager: 'محمد علي',
    technicalLead: 'سارة خالد',
    qaEngineer: 'فهد الأحمد',
    contractId: 'c1',
    repoUrl: 'https://github.com/tech-corp/delivery-app',
    cloudCost: 1200,
    totalHours: 420,
    costHistory: [
      { date: '2023-01', budget: 40000, actual: 35000 },
      { date: '2023-02', budget: 40000, actual: 38000 },
      { date: '2023-03', budget: 40000, actual: 42000 },
      { date: '2023-04', budget: 45000, actual: 48000 },
      { date: '2023-05', budget: 45000, actual: 43000 },
      { date: '2023-06', budget: 45000, actual: 50000 },
      { date: '2023-07', budget: 50000, actual: 55000 },
      { date: '2023-08', budget: 50000, actual: 48000 },
      { date: '2023-09', budget: 50000, actual: 52000 },
    ],
    milestones: [
      { id: 'm1', name: 'تصميم الهوية وتجربة المستخدم', dueDate: '2023-10-01', completed: true, cost: 20000 },
      { id: 'm2', name: 'إطلاق النسخة التجريبية (MVP)', dueDate: '2023-12-15', completed: false, cost: 80000 }
    ],
    tasks: [
      { id: 't1', title: 'مزامنة الخرائط الحية', assignedTo: 'سارة خالد', status: 'completed', hours: 45, dueDate: '2023-11-20', timeLogs: [] },
      { id: 't2', title: 'تحسين أداء الواجهة الأمامية', assignedTo: 'سارة خالد', status: 'in_progress', hours: 20, dueDate: '2023-11-25', timeLogs: [] },
      { id: 't3', title: 'ربط بوابة الدفع Stripe', assignedTo: 'محمد علي', status: 'on_hold', hours: 10, dueDate: '2023-12-01', timeLogs: [] },
      { id: 't4', title: 'اختبارات الاختراق الأمنية', assignedTo: 'فهد الأحمد', status: 'pending', hours: 0, dueDate: '2023-12-10', timeLogs: [] }
    ],
    resources: [
      { id: 'r1', role: 'مطور واجهات أمامية (Senior)', allocatedMember: 'سارة خالد', allocationPercentage: 80, status: 'مكتمل', requiredSkills: ['React', 'TypeScript', 'Tailwind'] },
      { id: 'r2', role: 'مهندس بنية تحتية (DevOps)', allocatedMember: 'عمر ياسين', allocationPercentage: 40, status: 'مكتمل', requiredSkills: ['AWS', 'Docker', 'CI/CD'] },
      { id: 'r3', role: 'مصمم تجربة مستخدم (Senior UI/UX)', status: 'قيد البحث', allocationPercentage: 0, requiredSkills: ['Figma', 'Prototyping'] }
    ],
    connectedTool: 'Jira'
  },
  {
    id: '2',
    name: 'نظام إدارة المستودعات (WMS)',
    client: 'لوجستيك العرب',
    clientId: 'c3',
    deadline: '2023-12-30',
    status: ProjectStatus.TESTING,
    progress: 90,
    budget: 150000,
    actualCost: 145000,
    profit: 5000,
    team: ['4', '2'],
    projectManager: 'سلطان القحطاني',
    technicalLead: 'عمر ياسين',
    qaEngineer: 'هند خالد',
    contractId: 'c3',
    repoUrl: 'https://github.com/tech-corp/wms-system',
    cloudCost: 2500,
    totalHours: 580,
    milestones: [],
    tasks: [
      { id: 't5', title: 'تجهيز خوادم الإنتاج', assignedTo: 'عمر ياسين', status: 'completed', hours: 40, timeLogs: [] },
      { id: 't6', title: 'فحص جودة الأكواد', assignedTo: 'هند خالد', status: 'in_progress', hours: 15, timeLogs: [] }
    ],
    resources: [],
    costHistory: [
      { date: '2023-01', budget: 20000, actual: 18000 },
      { date: '2023-02', budget: 20000, actual: 19000 },
      { date: '2023-03', budget: 20000, actual: 21000 },
      { date: '2023-04', budget: 25000, actual: 28000 },
    ],
    connectedTool: 'Asana'
  }
];

const TaskStatusChart = ({ tasks }: { tasks: Task[] }) => {
  const data = useMemo(() => {
    const counts = {
      completed: tasks.filter(t => t.status === 'completed').length,
      in_progress: tasks.filter(t => t.status === 'in_progress').length,
      on_hold: tasks.filter(t => t.status === 'on_hold').length,
      pending: tasks.filter(t => t.status === 'pending').length,
    };
    
    return [
      { name: 'مكتملة', value: counts.completed, color: '#10b981' },
      { name: 'قيد التنفيذ', value: counts.in_progress, color: '#3b82f6' },
      { name: 'متوقفة', value: counts.on_hold, color: '#f43f5e' },
      { name: 'بانتظار البدء', value: counts.pending, color: '#94a3b8' }
    ].filter(d => d.value > 0);
  }, [tasks]);

  if (data.length === 0) return null;

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm animate-in fade-in slide-in-from-bottom-4">
      <h3 className="text-sm font-black text-slate-800 mb-6 flex items-center gap-2 border-r-4 border-emerald-500 pr-4">
        <PieChartIcon size={18} className="text-emerald-600" /> تحليل حالة المهام (بصري)
      </h3>
      <div className="h-[250px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{fontSize: '10px', fontWeight: 'bold'}} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
           <span className="text-2xl font-black text-slate-800">{tasks.length}</span>
           <span className="text-[10px] text-slate-400 font-bold uppercase">إجمالي المهام</span>
        </div>
      </div>
    </div>
  );
};

const Projects = () => {
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  // Time Tracking State
  const [activeTimers, setActiveTimers] = useState<Record<string, number>>({}); 
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const data = storageService.initIfEmpty(initialMockProjects);
    setAllProjects(data);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    let interval: any;
    if (Object.keys(activeTimers).length > 0) {
      interval = setInterval(() => {
        setCurrentTime(Date.now());
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTimers]);

  const handleStartTimer = (taskId: string) => {
    // التحقق من عدم وجود مؤقت نشط آخر
    if (Object.keys(activeTimers).length > 0) {
      alert('لديك مؤقت نشط بالفعل لمهمة أخرى. يرجى إيقافه أولاً.');
      return;
    }
    setActiveTimers(prev => ({ ...prev, [taskId]: Date.now() }));
  };

  const handleStopTimer = (taskId: string) => {
    const startTime = activeTimers[taskId];
    if (!startTime || !selectedProject) return;

    const endNow = Date.now();
    const elapsedMs = endNow - startTime;
    const elapsedHours = elapsedMs / (1000 * 60 * 60);

    const newLog: TimeLog = {
      id: 'log-' + Date.now(),
      startTime: new Date(startTime).toLocaleTimeString('ar-SA'),
      endTime: new Date(endNow).toLocaleTimeString('ar-SA'),
      duration: Number(elapsedHours.toFixed(2)),
      note: 'جلسة عمل مسجلة عبر النظام'
    };

    const updatedTasks = selectedProject.tasks.map(t => 
      t.id === taskId ? { 
        ...t, 
        hours: Number((t.hours + elapsedHours).toFixed(2)),
        timeLogs: [...(t.timeLogs || []), newLog],
        status: (t.status === 'pending' ? 'in_progress' : t.status) as any
      } : t
    );

    const updatedProject = { 
      ...selectedProject, 
      tasks: updatedTasks,
      totalHours: Number(((selectedProject.totalHours || 0) + elapsedHours).toFixed(2))
    };
    
    storageService.saveProject(updatedProject);
    setSelectedProject(updatedProject);
    setAllProjects(prev => prev.map(p => p.id === selectedProject.id ? updatedProject : p));
    
    const newTimers = { ...activeTimers };
    delete newTimers[taskId];
    setActiveTimers(newTimers);
  };

  const formatDuration = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSyncTasks = async () => {
    if (!selectedProject || !selectedProject.connectedTool) return;
    
    setIsSyncing(true);
    setSyncFeedback(null);
    
    try {
      const externalTasks = await fetchExternalTasks(selectedProject.name, selectedProject.connectedTool);
      
      if (externalTasks && externalTasks.length > 0) {
        const existingExternalIds = new Set(selectedProject.tasks.filter(t => t.externalId).map(t => t.externalId));
        const newTasksToLink: Task[] = externalTasks
          .filter((et: any) => !existingExternalIds.has(et.externalId))
          .map((et: any) => ({
            id: 'ext-' + Math.random().toString(36).substr(2, 9),
            title: et.title,
            assignedTo: et.assignedTo,
            status: (et.status === 'completed' ? 'completed' : 'pending') as any,
            hours: et.hours,
            dueDate: et.dueDate,
            externalId: et.externalId,
            externalSource: selectedProject.connectedTool,
            timeLogs: []
          }));

        const updatedProject = {
          ...selectedProject,
          tasks: [...selectedProject.tasks, ...newTasksToLink]
        };

        storageService.saveProject(updatedProject);
        setSelectedProject(updatedProject);
        setAllProjects(prev => prev.map(p => p.id === selectedProject.id ? updatedProject : p));
        setSyncFeedback(`تم مزامنة ${newTasksToLink.length} مهام بنجاح.`);
      }
    } catch (err) {
      setSyncFeedback('فشلت المزامنة، يرجى المحاولة لاحقاً.');
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncFeedback(null), 5000);
    }
  };

  const activeTaskId = Object.keys(activeTimers)[0];
  const activeTask = selectedProject?.tasks.find(t => t.id === activeTaskId);

  if (!isLoaded) return <div className="flex items-center justify-center h-full py-20"><Loader2 className="animate-spin text-blue-600" /></div>;

  if (selectedProject) {
    return (
      <div className="space-y-8 animate-in slide-in-from-left-4 duration-500 pb-32">
        <div className="flex items-center justify-between">
          <button onClick={() => setSelectedProject(null)} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-bold group">
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> العودة للمشاريع
          </button>
          <div className="flex gap-3">
             {selectedProject.connectedTool && (
               <button 
                onClick={handleSyncTasks}
                disabled={isSyncing}
                className="px-5 py-2.5 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-black shadow-sm border border-indigo-100 flex items-center gap-2 hover:bg-indigo-100 disabled:opacity-50"
               >
                 {isSyncing ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                 مزامنة {selectedProject.connectedTool}
               </button>
             )}
             <button className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black shadow-lg flex items-center gap-2">
               <Edit3 size={16} /> تعديل المشروع
             </button>
          </div>
        </div>

        <AnimatePresence>
          {syncFeedback && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-bold"
            >
              <CheckCircle2 size={18} className="text-emerald-500" />
              {syncFeedback}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           <div className="lg:col-span-8 p-8 rounded-[3rem] border border-slate-100 bg-white shadow-sm flex flex-col md:flex-row gap-10 items-center">
              <div className="w-28 h-28 rounded-[2.5rem] bg-blue-50 text-blue-600 flex items-center justify-center shadow-blue-100 shrink-0">
                 <Briefcase size={56} />
              </div>
              <div className="flex-1 text-center md:text-right relative z-10">
                 <div className="flex items-center justify-center md:justify-start gap-3 mb-2 flex-wrap">
                    <h1 className="text-3xl font-black text-slate-800 tracking-tighter">{selectedProject.name}</h1>
                    <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-100 text-blue-600">{selectedProject.status}</span>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 text-white rounded-xl text-[10px] font-black uppercase shadow-sm">
                       <History size={12} /> {selectedProject.totalHours || 0} ساعة مسجلة
                    </div>
                 </div>
                 <p className="text-slate-500 font-bold text-lg">{selectedProject.client} • التسليم: {selectedProject.deadline}</p>
              </div>
           </div>

           <div className="lg:col-span-4 rounded-[3rem] p-8 text-white bg-emerald-600 shadow-2xl flex flex-col justify-between group overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500"><DollarSign size={100}/></div>
              <div className="relative z-10">
                 <p className="text-xs font-bold opacity-80 uppercase tracking-widest mb-1">الربحية الحالية</p>
                 <h3 className="text-4xl font-black tracking-tighter">
                   {selectedProject.profit.toLocaleString()} <span className="text-sm font-bold opacity-60">ر.س</span>
                 </h3>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10 relative z-10">
                 <div className="flex items-center gap-2 text-emerald-100 font-bold text-xs">
                    <TrendingUp size={14}/> تدفق مالي إيجابي
                 </div>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
               <div className="p-8 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center">
                  <h3 className="font-black text-slate-800 flex items-center gap-2">المهام التنفيذية وتتبع الوقت</h3>
                  <button className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl hover:bg-blue-100 transition-all">+ مهمة جديدة</button>
               </div>
               <div className="p-8 space-y-4">
                     {selectedProject.tasks.map(task => {
                       const isTimerRunning = !!activeTimers[task.id];
                       return (
                        <div key={task.id} className={`p-5 rounded-3xl border transition-all duration-300 ${
                          isTimerRunning ? 'bg-blue-50 border-blue-300 ring-4 ring-blue-500/5' : 'bg-white border-slate-100 shadow-sm'
                        } flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
                           <div className="flex items-center gap-4 flex-1">
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                                task.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 
                                task.status === 'on_hold' ? 'bg-rose-100 text-rose-600' :
                                isTimerRunning ? 'bg-blue-600 text-white animate-pulse' : 'bg-blue-50 text-blue-500'
                              }`}>
                                 {task.status === 'completed' ? <CheckCircle2 size={24}/> : 
                                  task.status === 'on_hold' ? <AlertCircle size={24}/> : <Timer size={24}/>}
                              </div>
                              <div className="flex-1 min-w-0">
                                 <div className="flex items-center gap-2">
                                    <p className={`text-sm font-black truncate ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{task.title}</p>
                                    <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase ${
                                      task.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                                      task.status === 'in_progress' || isTimerRunning ? 'bg-blue-50 text-blue-600' :
                                      'bg-slate-100 text-slate-400'
                                    }`}>
                                      {task.status === 'completed' ? 'مكتمل' : 
                                       task.status === 'in_progress' || isTimerRunning ? 'قيد التنفيذ' : 'بانتظار البدء'}
                                    </span>
                                 </div>
                                 <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold mt-1">
                                   <span className="flex items-center gap-1"><Users size={12}/> {task.assignedTo}</span>
                                   <span className="flex items-center gap-1"><Clock size={12}/> {task.hours} ساعة</span>
                                 </div>
                              </div>
                           </div>
                           
                           <div className="flex items-center gap-3 justify-end bg-slate-50 p-2 rounded-2xl border border-slate-100">
                              {isTimerRunning && (
                                <div className="text-xs font-black text-blue-600 font-mono px-3 py-1 bg-white rounded-lg shadow-sm">
                                  {formatDuration(currentTime - activeTimers[task.id])}
                                </div>
                              )}
                              <button 
                                onClick={() => isTimerRunning ? handleStopTimer(task.id) : handleStartTimer(task.id)}
                                disabled={task.status === 'completed'}
                                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-[10px] font-black transition-all shadow-md active:scale-95 disabled:opacity-30 ${
                                  isTimerRunning ? 'bg-rose-600 text-white' : 'bg-blue-600 text-white'
                                }`}
                              >
                                {isTimerRunning ? <><Square size={14} fill="currentColor" /> إيقاف</> : <><Play size={14} fill="currentColor" /> بدء العمل</>}
                              </button>
                           </div>
                        </div>
                       );
                     })}
               </div>
            </div>
          </div>
          
          <div className="space-y-6">
             <TaskStatusChart tasks={selectedProject.tasks} />
             <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <h3 className="text-sm font-black text-slate-800 mb-6 border-r-4 border-blue-500 pr-4">فريق العمل المخصص</h3>
                <div className="space-y-4">
                   {selectedProject.resources.map(res => (
                      <div key={res.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                         <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase">{res.role}</span>
                            <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase ${res.status === 'مكتمل' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                               {res.status}
                            </span>
                         </div>
                         <p className="text-xs font-bold text-slate-700">{res.allocatedMember || 'قيد البحث...'}</p>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        </div>

        {/* Floating Timer UI */}
        {activeTaskId && activeTask && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[150] w-full max-w-2xl px-4 animate-in slide-in-from-bottom-10 duration-500">
             <div className="bg-slate-900 text-white p-4 rounded-[2rem] shadow-2xl border border-blue-500/30 flex items-center justify-between gap-6 ring-8 ring-blue-500/5">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                   <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center animate-pulse shadow-lg shadow-blue-500/20">
                      <Activity size={24} />
                   </div>
                   <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest mb-0.5">جاري تتبع الوقت:</p>
                      <h4 className="text-sm font-black truncate">{activeTask.title}</h4>
                   </div>
                </div>
                <div className="flex items-center gap-6">
                   <div className="text-center bg-white/5 px-4 py-2 rounded-2xl border border-white/10">
                      <p className="text-xl font-black text-blue-400 font-mono tracking-tighter leading-none pr-1">
                         {formatDuration(currentTime - activeTimers[activeTaskId])}
                      </p>
                   </div>
                   <button onClick={() => handleStopTimer(activeTaskId)} className="p-4 bg-rose-600 text-white rounded-2xl hover:bg-rose-700 transition-all shadow-xl active:scale-95">
                      <Square size={24} fill="currentColor" />
                   </button>
                </div>
             </div>
          </div>
        )}
      </div>
    );
  }

  const filteredProjects = allProjects.filter(p => p.name.includes(searchTerm) || p.client.includes(searchTerm));

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tighter">إدارة العمليات والمشاريع</h2>
          <p className="text-slate-500 font-medium">متابعة التنفيذ، مزامنة المهام الخارجية، وتتبع ساعات العمل الحية.</p>
        </div>
        <button className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-black shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2">
          <Plus size={20} /> مشروع جديد
        </button>
      </div>

      <div className="bg-white p-4 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="بحث..." 
            className="w-full pr-12 pl-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProjects.map(project => (
          <div 
            key={project.id}
            onClick={() => setSelectedProject(project)}
            className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col h-full"
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">
              <Briefcase size={28} />
            </div>
            <h3 className="text-lg font-black text-slate-800 mb-1 truncate">{project.name}</h3>
            <p className="text-[11px] text-slate-400 font-black uppercase tracking-widest mb-6">{project.client}</p>
            
            <div className="space-y-6 mt-auto">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase">
                  <span className="text-slate-400">الإنجاز</span>
                  <span className="text-blue-600">{project.progress}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 shadow-inner">
                  <div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{ width: `${project.progress}%` }}></div>
                </div>
              </div>
              
              <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
                 <div>
                    <p className="text-[9px] text-slate-400 font-black uppercase mb-0.5">الميزانية</p>
                    <p className="text-sm font-black text-slate-700">{project.budget.toLocaleString()} ر.س</p>
                 </div>
                 <div className="flex -space-x-2 rtl:space-x-reverse">
                    {project.team.slice(0, 3).map((id, i) => (
                       <img key={id} src={`https://picsum.photos/seed/${id}/32/32`} className="w-8 h-8 rounded-full border-2 border-white shadow-sm" alt="team" />
                    ))}
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
