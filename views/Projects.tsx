
import React, { useState, useMemo, useEffect } from 'react';
import { ProjectStatus, Project, Milestone, Task, ProjectResource, TimeLog } from '../types';
import { 
  Briefcase, 
  Search, 
  Filter, 
  Plus, 
  Clock, 
  CheckCircle2, 
  Github, 
  DollarSign, 
  TrendingUp, 
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
  X, 
  Save, 
  Edit3, 
  Play, 
  Square, 
  Timer, 
  Sparkles, 
  Loader2, 
  RefreshCw, 
  History,
  Activity,
  Trello,
  GanttChartSquare,
  UserPlus,
  ArrowRightLeft,
  FilePieChart,
  BrainCircuit,
  Lightbulb,
  CalendarDays,
  Flag,
  Check,
  RotateCcw
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
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { fetchExternalTasks, getProjectFinancialAnalysis } from '../services/geminiService';
import { storageService } from '../services/storageService';
import { motion, AnimatePresence, Reorder } from 'framer-motion';

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
    ],
    milestones: [
      { id: 'm1', name: 'تصميم تجربة المستخدم', dueDate: '2023-10-01', completed: true, cost: 20000 },
      { id: 'm2', name: 'تطوير الـ Backend', dueDate: '2023-11-15', completed: true, cost: 45000 },
      { id: 'm3', name: 'النسخة التجريبية (MVP)', dueDate: '2023-12-15', completed: false, cost: 80000 },
      { id: 'm4', name: 'الإطلاق الرسمي', dueDate: '2024-03-15', completed: false, cost: 50000 }
    ],
    tasks: [
      { id: 't1', title: 'مزامنة الخرائط الحية', assignedTo: 'سارة خالد', status: 'completed', hours: 45, estimatedHours: 50, dueDate: '2023-11-20', timeLogs: [] },
      { id: 't2', title: 'تحسين أداء الواجهة', assignedTo: 'سارة خالد', status: 'in_progress', hours: 20, estimatedHours: 40, dueDate: '2023-11-25', timeLogs: [] },
      { id: 't3', title: 'ربط بوابة الدفع', assignedTo: 'محمد علي', status: 'on_hold', hours: 10, estimatedHours: 15, dueDate: '2023-12-01', timeLogs: [] },
      { id: 't4', title: 'اختبارات الأمان', assignedTo: 'فهد الأحمد', status: 'pending', hours: 0, estimatedHours: 20, dueDate: '2023-12-10', timeLogs: [] }
    ],
    resources: [
      { id: 'r1', role: 'Frontend Senior', allocatedMember: 'سارة خالد', allocationPercentage: 80, status: 'مكتمل', requiredSkills: ['React'] },
      { id: 'r2', role: 'DevOps', allocatedMember: 'عمر ياسين', allocationPercentage: 40, status: 'مكتمل', requiredSkills: ['AWS'] },
    ],
    connectedTool: 'Jira'
  }
];

const Projects = () => {
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [taskViewMode, setTaskViewMode] = useState<'list' | 'board'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  
  // AI Financial Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  // Editing Resource State
  const [editingResourceId, setEditingResourceId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<number>(0);

  // Time Tracking State
  const [activeTimers, setActiveTimers] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('active_project_timers');
    return saved ? JSON.parse(saved) : {};
  }); 
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const data = storageService.initIfEmpty(initialMockProjects);
    setAllProjects(data);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    let interval: any;
    if (Object.keys(activeTimers).length > 0) {
      interval = setInterval(() => setCurrentTime(Date.now()), 1000);
    }
    localStorage.setItem('active_project_timers', JSON.stringify(activeTimers));
    return () => clearInterval(interval);
  }, [activeTimers]);

  const handleStartTimer = (taskId: string) => {
    if (Object.keys(activeTimers).length > 0) {
      alert('يرجى إيقاف المؤقت الحالي قبل بدء مهمة جديدة.');
      return;
    }
    setActiveTimers({ [taskId]: Date.now() });
  };

  const handleStopTimer = (taskId: string) => {
    const startTime = activeTimers[taskId];
    if (!startTime || !selectedProject) return;

    const elapsedHours = (Date.now() - startTime) / (1000 * 60 * 60);
    const updatedTasks = selectedProject.tasks.map(t => 
      t.id === taskId ? { 
        ...t, 
        hours: Number((t.hours + elapsedHours).toFixed(2)),
        status: (t.status === 'pending' ? 'in_progress' : t.status) as any
      } : t
    );

    const updatedProject = { ...selectedProject, tasks: updatedTasks };
    storageService.saveProject(updatedProject);
    setSelectedProject(updatedProject);
    setAllProjects(prev => prev.map(p => p.id === selectedProject.id ? updatedProject : p));
    setActiveTimers({});
  };

  const handleRunFinancialAnalysis = async () => {
    setIsAnalyzing(true);
    const result = await getProjectFinancialAnalysis(allProjects);
    setAnalysisResult(result);
    setIsAnalyzing(false);
  };

  const handleUpdateResource = (resId: string) => {
    if (!selectedProject) return;
    const updatedResources = selectedProject.resources.map(r => 
      r.id === resId ? { ...r, allocationPercentage: editingValue } : r
    );
    const updatedProject = { ...selectedProject, resources: updatedResources };
    
    storageService.saveProject(updatedProject);
    setSelectedProject(updatedProject);
    setAllProjects(prev => prev.map(p => p.id === selectedProject.id ? updatedProject : p));
    setEditingResourceId(null);
  };

  if (!isLoaded) return <div className="flex items-center justify-center h-full py-20"><Loader2 className="animate-spin text-blue-600" /></div>;

  if (selectedProject) {
    return (
      <div className="space-y-8 animate-in slide-in-from-left-4 duration-500 pb-32">
        {/* Navigation & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <button onClick={() => setSelectedProject(null)} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold group">
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> قائمة المشاريع
          </button>
          <div className="flex gap-2">
            <div className="flex bg-slate-100 p-1 rounded-xl shadow-inner">
               <button onClick={() => setTaskViewMode('list')} className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${taskViewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>
                 <ListIcon size={14} className="inline ml-1" /> القائمة
               </button>
               <button onClick={() => setTaskViewMode('board')} className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${taskViewMode === 'board' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>
                 <Trello size={14} className="inline ml-1" /> اللوحة
               </button>
            </div>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-xl text-xs font-black shadow-lg flex items-center gap-2 hover:bg-blue-700 transition-all">
              <Edit3 size={16} /> تعديل المشروع
            </button>
          </div>
        </div>

        {/* Enhanced Project Hero Card */}
        <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden relative group">
          {/* Background decorative element */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-l from-blue-600 via-indigo-500 to-emerald-500"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Primary Content Area */}
            <div className="lg:col-span-8 p-12 relative">
              <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/5 rounded-full -mr-40 -mt-40 blur-[100px]"></div>
              
              <div className="relative z-10 space-y-12">
                {/* Identity Header */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-blue-500/30 animate-soft-float">
                      <Briefcase size={40} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-tight">{selectedProject.name}</h1>
                        <span className={`px-4 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                          selectedProject.status === ProjectStatus.IN_PROGRESS ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                          selectedProject.status === ProjectStatus.COMPLETED ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                          'bg-slate-50 text-slate-500 border-slate-100'
                        }`}>
                          {selectedProject.status}
                        </span>
                      </div>
                      <p className="text-slate-400 font-bold flex items-center gap-2">
                         <span className="w-2 h-2 rounded-full bg-blue-400"></span> {selectedProject.client} • عميل بلاتيني
                      </p>
                    </div>
                  </div>
                </div>

                {/* Key Metrics Tiles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Delivery Timeline Tile */}
                  <div className="bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100 flex items-center gap-6 group/tile hover:bg-white hover:shadow-lg transition-all duration-500">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-100 group-hover/tile:scale-110 group-hover/tile:bg-blue-600 group-hover/tile:text-white transition-all">
                      <CalendarDays size={32} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1.5">تاريخ التسليم النهائي</p>
                      <p className="text-2xl font-black text-slate-800 tracking-tight">{selectedProject.deadline}</p>
                      <div className="flex items-center gap-2 mt-1">
                         <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                         <p className="text-[10px] text-blue-600 font-bold">باقي 45 يوماً على الموعد</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Matrix Tile */}
                  <div className="bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100 flex flex-col justify-center group/tile hover:bg-white hover:shadow-lg transition-all duration-500">
                    <div className="flex justify-between items-end mb-5">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm border border-slate-100 group-hover/tile:scale-110 group-hover/tile:bg-emerald-600 group-hover/tile:text-white transition-all">
                          <Target size={24} />
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-0.5">نسبة الإنجاز الفعلية</p>
                          <p className="text-2xl font-black text-emerald-600">{selectedProject.progress}%</p>
                        </div>
                      </div>
                    </div>
                    <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden shadow-inner p-0.5 relative">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${selectedProject.progress}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-gradient-to-l from-emerald-500 to-teal-400 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Stats Area */}
            <div className="lg:col-span-4 bg-slate-900 p-12 text-white relative overflow-hidden flex flex-col justify-between border-r border-white/5">
              <div className="absolute top-0 right-0 p-8 opacity-5"><TrendingUp size={240} /></div>
              <div className="relative z-10">
                <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest mb-3 opacity-60">الأرباح التشغيلية المتوقعة</p>
                <h3 className="text-5xl font-black tracking-tighter">{selectedProject.profit.toLocaleString()} <span className="text-lg font-bold opacity-30 mr-2">ر.س</span></h3>
              </div>

              <div className="relative z-10 mt-12 space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">الميزانية المستهلكة</p>
                    <p className="text-sm font-black text-blue-400">{selectedProject.actualCost.toLocaleString()} ر.س</p>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden p-[1px]">
                    <div className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)] rounded-full" style={{ width: `${Math.min((selectedProject.actualCost / selectedProject.budget) * 100, 100)}%` }}></div>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                    <span>الإجمالي المعتمد: {selectedProject.budget.toLocaleString()} ر.س</span>
                    <span className="text-slate-300">{Math.round((selectedProject.actualCost / selectedProject.budget) * 100)}%</span>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
                   <div>
                      <p className="text-[9px] text-slate-500 font-black uppercase mb-1">فريق العمل</p>
                      <p className="text-sm font-black">{selectedProject.team.length} أعضاء</p>
                   </div>
                   <div className="text-left">
                      <p className="text-[9px] text-slate-500 font-black uppercase mb-1">ساعات العمل</p>
                      <p className="text-sm font-black text-emerald-400">{selectedProject.totalHours || 0} h</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Milestone Timeline */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
           <h3 className="text-sm font-black text-slate-800 mb-8 flex items-center gap-2 uppercase tracking-tighter">
              <GanttChartSquare size={20} className="text-indigo-600" /> خارطة المعالم الزمنية (Milestones)
           </h3>
           <div className="relative pt-12 pb-8">
              <div className="absolute top-[60px] left-0 right-0 h-1 bg-slate-100 rounded-full"></div>
              <div className="flex justify-between relative z-10">
                 {selectedProject.milestones.map((ms, i) => (
                    <div key={ms.id} className="flex flex-col items-center group">
                       <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg ${
                         ms.completed ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-white border-2 border-slate-200 text-slate-400 group-hover:border-blue-400'
                       }`}>
                          {ms.completed ? <CheckCircle2 size={20} /> : <span className="text-xs font-black">{i+1}</span>}
                       </div>
                       <div className="mt-4 text-center">
                          <p className={`text-[10px] font-black uppercase mb-1 ${ms.completed ? 'text-emerald-600' : 'text-slate-400'}`}>{ms.name}</p>
                          <p className="text-[9px] text-slate-300 font-bold">{ms.dueDate}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Main Content Area: Board or List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
             {taskViewMode === 'list' ? (
                <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                   <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                      <h3 className="font-black text-slate-800 flex items-center gap-2"><Layers size={20} className="text-blue-600" /> قائمة المهام التفصيلية</h3>
                      <button className="text-[10px] font-black text-blue-600 bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-all shadow-sm">+ مهمة تقنية</button>
                   </div>
                   <div className="p-4 space-y-2">
                      {selectedProject.tasks.map(task => {
                        const isTimerRunning = !!activeTimers[task.id];
                        return (
                          <div key={task.id} className={`p-5 rounded-[2rem] border transition-all flex items-center justify-between group ${
                            isTimerRunning ? 'bg-blue-50 border-blue-200 ring-4 ring-blue-500/5' : 'bg-white border-slate-50 hover:border-slate-200'
                          }`}>
                             <div className="flex items-center gap-4 flex-1">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                                  task.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 
                                  isTimerRunning ? 'bg-blue-600 text-white animate-pulse' : 'bg-slate-50 text-slate-400'
                                }`}>
                                  {task.status === 'completed' ? <CheckCircle2 size={24} /> : <Timer size={24} />}
                                </div>
                                <div>
                                   <p className={`text-sm font-black ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{task.title}</p>
                                   <div className="flex items-center gap-3 mt-1">
                                      <span className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1"><Users size={10} /> {task.assignedTo}</span>
                                      <span className="text-[9px] font-black text-blue-600 uppercase flex items-center gap-1"><Clock size={10} /> {task.hours} ساعة</span>
                                   </div>
                                </div>
                             </div>
                             <div className="flex items-center gap-3">
                                {isTimerRunning && (
                                   <div className="text-[11px] font-mono font-black text-blue-600 bg-white px-3 py-1 rounded-lg border border-blue-100">
                                      {new Date(currentTime - (activeTimers[task.id] as number)).toISOString().substr(11, 8)}
                                   </div>
                                )}
                                <button 
                                  onClick={() => isTimerRunning ? handleStopTimer(task.id) : handleStartTimer(task.id)}
                                  disabled={task.status === 'completed'}
                                  className={`p-3 rounded-xl transition-all shadow-sm ${
                                    isTimerRunning ? 'bg-rose-600 text-white hover:bg-rose-700' : 'bg-blue-600 text-white hover:bg-blue-700'
                                  }`}
                                >
                                   {isTimerRunning ? <Square size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                                </button>
                             </div>
                          </div>
                        );
                      })}
                   </div>
                </div>
             ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   {['pending', 'in_progress', 'completed'].map((status) => (
                      <div key={status} className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 flex flex-col h-full min-h-[400px]">
                         <div className="flex items-center justify-between mb-6 px-2">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                               {status === 'pending' ? 'بانتظار البدء' : status === 'in_progress' ? 'قيد التنفيذ' : 'منجز نهائياً'}
                            </h4>
                            <span className="text-[10px] font-black bg-white px-2 py-0.5 rounded-lg border border-slate-100">{selectedProject.tasks.filter(t => t.status === status).length}</span>
                         </div>
                         <div className="space-y-4">
                            {selectedProject.tasks.filter(t => t.status === status).map(task => (
                               <motion.div layoutId={task.id} key={task.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                                  <p className="text-xs font-black text-slate-800 mb-4">{task.title}</p>
                                  <div className="flex items-center justify-between">
                                     <div className="flex -space-x-2 rtl:space-x-reverse">
                                        <img src={`https://picsum.photos/seed/${task.assignedTo}/32/32`} className="w-7 h-7 rounded-full border-2 border-white shadow-sm" />
                                     </div>
                                     <div className="flex items-center gap-2">
                                        <button 
                                          onClick={() => activeTimers[task.id] ? handleStopTimer(task.id) : handleStartTimer(task.id)}
                                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeTimers[task.id] ? 'bg-rose-500 text-white' : 'bg-blue-50 text-blue-600'}`}
                                        >
                                           {activeTimers[task.id] ? <Square size={14} fill="currentColor"/> : <Play size={14} fill="currentColor"/>}
                                        </button>
                                     </div>
                                  </div>
                               </motion.div>
                            ))}
                         </div>
                      </div>
                   ))}
                </div>
             )}
          </div>

          <div className="lg:col-span-4 space-y-8">
             <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
                <h3 className="text-sm font-black text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-tighter">
                   <Users size={20} className="text-blue-600" /> الموارد والفرق (Resources)
                </h3>
                <div className="space-y-4">
                   {selectedProject.resources.map(res => {
                     const isEditing = editingResourceId === res.id;
                     return (
                        <div key={res.id} className={`p-5 rounded-3xl border transition-all group ${isEditing ? 'bg-blue-50 border-blue-300 ring-4 ring-blue-500/5' : 'bg-slate-50 border-slate-100 hover:bg-white hover:border-slate-200'}`}>
                           <div className="flex justify-between items-start mb-3">
                              <div>
                                 <p className="text-xs font-black text-slate-800">{res.role}</p>
                                 <p className="text-[10px] text-blue-600 font-bold">{res.allocatedMember || 'بانتظار التعيين'}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                {isEditing ? (
                                   <div className="flex gap-1">
                                      <button onClick={() => handleUpdateResource(res.id)} className="p-1.5 bg-emerald-500 text-white rounded-lg shadow-sm hover:bg-emerald-600 transition-all"><Check size={14}/></button>
                                      <button onClick={() => setEditingResourceId(null)} className="p-1.5 bg-slate-200 text-slate-600 rounded-lg shadow-sm hover:bg-slate-300 transition-all"><X size={14}/></button>
                                   </div>
                                ) : (
                                   <div className="flex items-center gap-2">
                                      <span className="text-[10px] font-black text-slate-400">{res.allocationPercentage}%</span>
                                      <button 
                                        onClick={() => { setEditingResourceId(res.id); setEditingValue(res.allocationPercentage); }}
                                        className="p-1.5 text-slate-300 hover:text-blue-600 hover:bg-white rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                      >
                                        <Edit3 size={12}/>
                                      </button>
                                   </div>
                                )}
                              </div>
                           </div>
                           
                           {isEditing ? (
                              <div className="space-y-2 py-2">
                                 <input 
                                   type="range" 
                                   min="0" 
                                   max="100" 
                                   step="5"
                                   value={editingValue}
                                   onChange={(e) => setEditingValue(Number(e.target.value))}
                                   className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                 />
                                 <div className="flex justify-between text-[9px] font-black text-blue-600 px-1">
                                    <span>0%</span>
                                    <span className="bg-white px-2 py-0.5 rounded border border-blue-200 shadow-sm">{editingValue}%</span>
                                    <span>100%</span>
                                 </div>
                              </div>
                           ) : (
                              <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                                 <div className="h-full bg-blue-600" style={{ width: `${res.allocationPercentage}%` }}></div>
                              </div>
                           )}
                        </div>
                     );
                   })}
                   <button className="w-full py-4 border-2 border-dashed border-slate-200 text-slate-400 rounded-3xl text-[10px] font-black uppercase hover:bg-blue-50 hover:text-blue-600 transition-all flex items-center justify-center gap-2">
                      <UserPlus size={16} /> طلب تعيين موارد إضافية
                   </button>
                </div>
             </div>

             <div className="bg-blue-600 p-8 rounded-[3rem] text-white shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-700"><Sparkles size={120} /></div>
                <h4 className="font-black text-sm mb-3 flex items-center gap-2 relative z-10"><Sparkles size={18} className="text-blue-200" /> تحليل الجودة (AI)</h4>
                <p className="text-xs text-blue-100 leading-relaxed relative z-10 font-medium mb-6">
                   المشروع يتقدم بنسبة 15% أسرع من المخطط. ننصح بإعادة جدولة مرحلة "اختبارات الأمان" لتبدأ الأسبوع القادم لتجنب التكدس البرمجي.
                </p>
                <button className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-[10px] font-black uppercase transition-all relative z-10">تطبيق التوصيات</button>
             </div>
          </div>
        </div>

        {/* Floating Active Timer Global */}
        {Object.keys(activeTimers).length > 0 && (
           <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-lg px-4">
              <div className="bg-slate-900 text-white p-5 rounded-[2.5rem] shadow-2xl flex items-center justify-between border border-blue-500/30 ring-8 ring-blue-500/5">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center animate-pulse shadow-lg shadow-blue-500/20">
                       <Activity size={24} />
                    </div>
                    <div>
                       <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest">تتبع الوقت نشط</p>
                       <h4 className="text-sm font-black truncate max-w-[150px]">
                          {selectedProject.tasks.find(t => activeTimers[t.id])?.title || 'مهمة تقنية'}
                       </h4>
                    </div>
                 </div>
                 <div className="flex items-center gap-6">
                    <p className="text-xl font-black text-blue-400 font-mono tracking-tighter">
                       {new Date(currentTime - (Object.values(activeTimers)[0] as number)).toISOString().substr(11, 8)}
                    </p>
                    <button 
                      onClick={() => handleStopTimer(Object.keys(activeTimers)[0])}
                      className="p-4 bg-rose-600 text-white rounded-2xl hover:bg-rose-700 transition-all active:scale-95"
                    >
                       <Square size={20} fill="currentColor" />
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
          <p className="text-slate-500 text-sm font-medium">متابعة التنفيذ، تخصيص الموارد، وتتبع مؤشرات الأداء التقنية.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleRunFinancialAnalysis}
            disabled={isAnalyzing}
            className="px-6 py-3 bg-indigo-50 text-indigo-600 rounded-[1.25rem] text-sm font-black shadow-sm hover:bg-indigo-100 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {isAnalyzing ? <Loader2 size={18} className="animate-spin" /> : <BrainCircuit size={18} />}
            تحليل مالي ذكي
          </button>
          <button className="px-8 py-3 bg-blue-600 text-white rounded-[1.25rem] text-sm font-black shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-2 active:scale-95">
            <Plus size={20} /> مشروع تقني جديد
          </button>
        </div>
      </div>

      {/* AI Analysis Section */}
      <AnimatePresence>
        {analysisResult && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-br from-indigo-600 to-blue-700 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700"><FilePieChart size={160} /></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                    <Lightbulb size={24} className="text-amber-300" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black tracking-tight">نتائج التحليل المالي الذكي</h3>
                    <p className="text-blue-100 text-xs font-medium">تم التوليد بواسطة Gemini AI بناءً على بيانات المشاريع الحالية</p>
                  </div>
                </div>
                <button 
                  onClick={() => setAnalysisResult(null)}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="bg-white/10 backdrop-blur-xl rounded-[2rem] p-8 border border-white/10 shadow-inner">
                <div className="prose prose-invert prose-sm max-w-none">
                  <p className="whitespace-pre-wrap font-medium leading-relaxed">{analysisResult}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white p-4 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="بحث عن مشروع أو عميل..." 
            className="w-full pr-12 pl-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
           <button className="p-3.5 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl border border-slate-100 transition-all"><Filter size={20}/></button>
           <button className="p-3.5 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl border border-slate-100 transition-all"><History size={20}/></button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProjects.map(project => (
          <div 
            key={project.id}
            onClick={() => setSelectedProject(project)}
            className="bg-white rounded-[3rem] border border-slate-100 p-8 shadow-sm hover:shadow-2xl transition-all cursor-pointer group flex flex-col h-full relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-2 h-full ${
              project.status === ProjectStatus.IN_PROGRESS ? 'bg-blue-500' : 'bg-emerald-500'
            } opacity-20 group-hover:opacity-40 transition-opacity`}></div>
            
            <div className="w-16 h-16 rounded-[1.75rem] bg-slate-50 text-slate-400 flex items-center justify-center mb-6 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all shadow-inner">
              <Briefcase size={32} />
            </div>
            
            <h3 className="text-xl font-black text-slate-800 mb-1 truncate group-hover:text-blue-600 transition-colors">{project.name}</h3>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-8">{project.client}</p>
            
            <div className="space-y-6 mt-auto">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-slate-400">نسبة الإنجاز</span>
                  <span className="text-blue-600">{project.progress}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 shadow-inner">
                  <div className="h-full bg-blue-600 rounded-full transition-all duration-1000 shadow-sm" style={{ width: `${project.progress}%` }}></div>
                </div>
              </div>
              
              <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
                 <div className="flex items-center gap-1.5 text-slate-400 font-bold text-xs">
                    <Users size={16} className="text-slate-300" />
                    {project.team.length} أعضاء
                 </div>
                 <div className="flex items-center gap-1 text-[10px] font-black text-emerald-600 uppercase">
                    {project.budget.toLocaleString()} ر.س
                 </div>
              </div>
            </div>
          </div>
        ))}

        {/* Empty State / Add Card */}
        <div className="border-4 border-dashed border-slate-100 rounded-[3rem] p-8 flex flex-col items-center justify-center text-center group hover:border-blue-100 hover:bg-blue-50/20 transition-all cursor-pointer">
           <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 group-hover:bg-blue-500 group-hover:text-white transition-all">
              <Plus size={32} />
           </div>
           <p className="text-sm font-black text-slate-400 group-hover:text-blue-600">بدء مشروع جديد</p>
        </div>
      </div>
    </div>
  );
};

export default Projects;
