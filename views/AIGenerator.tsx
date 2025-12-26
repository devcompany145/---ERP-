
import React, { useState } from 'react';
import { 
  Sparkles, 
  FileText, 
  Rocket, 
  ShieldCheck, 
  Zap, 
  ChevronRight, 
  Loader2, 
  Copy, 
  Download, 
  Save, 
  X,
  Type,
  AlignRight,
  Send,
  PenTool,
  RotateCcw,
  // Added missing CheckCircle2 import
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateDocumentContent } from '../services/geminiService';

const templates = [
  { id: 't1', title: 'عقد تطوير برمجيات', icon: FileText, category: 'قانوني', description: 'توليد عقد متكامل يشمل الملكية الفكرية، فترات التسليم، والشروط المالية.' },
  { id: 't2', title: 'مقترح تقني (Proposal)', icon: Rocket, category: 'مبيعات', description: 'صياغة عرض فني احترافي لعميل يشمل الحل التقني والجدول الزمني.' },
  { id: 't3', title: 'خطة استراتيجية (Quarterly)', icon: Zap, category: 'إدارة', description: 'بناء خطة ربع سنوية للشركة بناءً على الأهداف الحالية والنمو المستهدف.' },
  { id: 't4', title: 'سياسة خصوصية', icon: ShieldCheck, category: 'امتثال', description: 'توليد سياسة خصوصية للتطبيقات والواقع تتماشى مع القوانين المحلية.' },
];

const AIGenerator = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<typeof templates[0] | null>(null);
  const [userInput, setUserInput] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!selectedTemplate || !userInput.trim()) return;
    
    setIsGenerating(true);
    setGeneratedContent('');
    
    const details = `نوع القالب: ${selectedTemplate.title}\nالمعلومات المدخلة: ${userInput}`;
    const result = await generateDocumentContent(selectedTemplate.title, details);
    
    setGeneratedContent(result || 'عذراً، لم نتمكن من توليد المحتوى حالياً.');
    setIsGenerating(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tighter flex items-center gap-3">
             مركز الإنشاء الذكي <Sparkles className="text-indigo-600 animate-pulse" size={28} />
          </h2>
          <p className="text-slate-500 text-sm font-medium">استخدم قوة الذكاء الاصطناعي لصياغة وثائقك المهنية والتقنية في ثوانٍ.</p>
        </div>
      </div>

      {!selectedTemplate ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {templates.map((t) => (
            <motion.div
              key={t.id}
              whileHover={{ y: -5 }}
              onClick={() => setSelectedTemplate(t)}
              className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 cursor-pointer transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                <t.icon size={120} />
              </div>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg ${
                t.category === 'قانوني' ? 'bg-rose-50 text-rose-600 shadow-rose-100' :
                t.category === 'مبيعات' ? 'bg-blue-50 text-blue-600 shadow-blue-100' :
                t.category === 'إدارة' ? 'bg-amber-50 text-amber-600 shadow-amber-100' :
                'bg-emerald-50 text-emerald-600 shadow-emerald-100'
              }`}>
                <t.icon size={28} />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">{t.category}</span>
              <h3 className="text-lg font-black text-slate-800 mb-3">{t.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">{t.description}</p>
              <div className="mt-6 flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase group-hover:gap-4 transition-all">
                بدء الإنشاء <ChevronRight size={14} className="rotate-180" />
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Input Panel */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
               <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-50">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                        <selectedTemplate.icon size={20} />
                     </div>
                     <h3 className="font-black text-slate-800">{selectedTemplate.title}</h3>
                  </div>
                  <button onClick={() => { setSelectedTemplate(null); setGeneratedContent(''); }} className="text-slate-400 hover:text-rose-500"><X size={20}/></button>
               </div>

               <div className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <AlignRight size={14} /> تفاصيل المحتوى المطلوبة
                     </label>
                     <textarea 
                        rows={8}
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="اكتب هنا المعلومات الأساسية (مثل اسم العميل، مدة المشروع، التقنيات المستخدمة، أو أي تفاصيل ترغب in تضمينها)..."
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-500 transition-all resize-none"
                     />
                  </div>

                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-3">
                     <Zap size={18} className="text-amber-600 shrink-0 mt-0.5" />
                     <p className="text-[10px] text-amber-800 leading-relaxed font-bold">
                        كلما كانت التفاصيل التي تقدمها دقيقة، كلما كانت النتيجة التي يولدها الذكاء الاصطناعي احترافية ومطابقة لاحتياجك.
                     </p>
                  </div>

                  <button 
                    onClick={handleGenerate}
                    disabled={isGenerating || !userInput.trim()}
                    className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95"
                  >
                    {isGenerating ? <Loader2 size={22} className="animate-spin" /> : <Sparkles size={22} />}
                    توليد المستند بالذكاء الاصطناعي
                  </button>
               </div>
            </div>
          </div>

          {/* Result Panel */}
          <div className="lg:col-span-8 flex flex-col h-full">
             <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col h-full min-h-[600px] overflow-hidden">
                <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                   <h3 className="text-sm font-black text-slate-700 flex items-center gap-2">
                      <PenTool size={18} className="text-indigo-500" /> معاينة المستند المولد
                   </h3>
                   {generatedContent && (
                     <div className="flex gap-2">
                        <button 
                          onClick={copyToClipboard}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black transition-all ${
                            copied ? 'bg-emerald-500 text-white shadow-emerald-100' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                          {copied ? 'تم النسخ' : 'نسخ النص'}
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black shadow-lg hover:bg-slate-800 transition-all">
                           <Download size={14} /> تحميل PDF
                        </button>
                     </div>
                   )}
                </div>

                <div className="flex-1 p-10 bg-white relative overflow-y-auto no-scrollbar">
                   {isGenerating ? (
                     <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-20">
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                          className="text-indigo-600 mb-6"
                        >
                          <Sparkles size={64} />
                        </motion.div>
                        <h4 className="text-xl font-black text-slate-800 tracking-tight">جاري صياغة المستند...</h4>
                        <p className="text-slate-400 text-sm mt-2 font-medium">يقوم Gemini بتحليل طلبك الآن</p>
                     </div>
                   ) : generatedContent ? (
                     <motion.div 
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       className="prose prose-slate max-w-none prose-sm leading-relaxed text-slate-700 font-medium whitespace-pre-wrap"
                     >
                        {generatedContent}
                     </motion.div>
                   ) : (
                     <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                           <FileText size={48} className="text-slate-300" />
                        </div>
                        <h4 className="text-xl font-black text-slate-400">بانتظار المدخلات</h4>
                        <p className="text-slate-400 text-sm mt-1 max-w-xs">أدخل تفاصيل المستند في اللوحة الجانبية ثم اضغط على زر التوليد.</p>
                     </div>
                   )}
                </div>

                <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
                   <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <ShieldCheck size={14} className="text-emerald-500" /> تمت المعالجة سحابياً وبشكل مشفر
                   </div>
                   {generatedContent && (
                     <button 
                       onClick={() => setGeneratedContent('')}
                       className="text-slate-400 hover:text-indigo-600 flex items-center gap-1 text-[10px] font-black transition-colors"
                     >
                       <RotateCcw size={12} /> إعادة البدء
                     </button>
                   )}
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIGenerator;
