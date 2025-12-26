
import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles, Loader2, Trash2, Download, Info, MessageSquarePlus, Lightbulb, TrendingUp, ShieldAlert } from 'lucide-react';
import { chatWithAssistant } from '../services/geminiService';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  role: 'assistant' | 'user';
  text: string;
  timestamp: Date;
}

const AIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      text: 'مرحباً بك في مركز القيادة الذكي! أنا مساعدك التقني، كيف يمكنني مساعدتك اليوم؟ يمكنني مراجعة أداء المشاريع، تحليل التدفقات النقدية، أو حتى صياغة تقارير تقنية.',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    { text: 'حلل أداء مشاريعي الحالية', icon: TrendingUp, color: 'blue' },
    { text: 'ما هي مخاطر الامتثال القادمة؟', icon: ShieldAlert, color: 'rose' },
    { text: 'اقترح خطة نمو للربع القادم', icon: Lightbulb, color: 'amber' }
  ];

  // Auto-scroll to bottom when messages change or loading state changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  const handleSend = async (textOverride?: string) => {
    const messageText = textOverride || input;
    if (!messageText.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await chatWithAssistant(messageText, messages);
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: responseText || 'عذراً، واجهت مشكلة في معالجة طلبك حالياً.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error("AI Chat Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
  };

  const clearChat = () => {
    if (window.confirm('هل أنت متأكد من مسح كافة المحادثات؟')) {
      setMessages([messages[0]]);
    }
  };

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden animate-in fade-in duration-500">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-blue-50/50 to-white flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200">
              <Bot size={32} />
            </div>
            <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-emerald-500 rounded-full border-4 border-white animate-pulse"></div>
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">المساعد الاستراتيجي (AI)</h3>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-blue-600 bg-blue-100 px-2 py-0.5 rounded-lg uppercase tracking-widest">v3.5 Enterprise</span>
              <span className="text-[9px] text-slate-400 font-bold">• متصل بـ Gemini Advanced</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={clearChat}
             title="مسح السجل"
             className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
           >
             <Trash2 size={20} />
           </button>
           <button 
             title="تصدير المحادثة"
             className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all"
           >
             <Download size={20} />
           </button>
        </div>
      </div>

      {/* Chat History - Scrollable */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 no-scrollbar bg-slate-50/20 relative"
      >
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#2563eb 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>
        
        <div className="max-w-4xl mx-auto w-full space-y-8 relative z-10">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4 }}
                className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-4 max-w-[85%] md:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center shadow-sm ${
                    msg.role === 'user' ? 'bg-slate-800 text-white' : 'bg-blue-600 text-white'
                  }`}>
                    {msg.role === 'user' ? <User size={20} /> : <Sparkles size={20} />}
                  </div>

                  {/* Message Bubble Container */}
                  <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`p-5 rounded-3xl text-sm leading-relaxed shadow-sm transition-all hover:shadow-md ${
                      msg.role === 'user' 
                        ? 'bg-slate-800 text-white rounded-tr-none' 
                        : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                    }`}>
                      <p className="whitespace-pre-wrap font-medium">{msg.text}</p>
                    </div>
                    
                    {/* Timestamp */}
                    <div className="flex items-center gap-2 mt-2 px-2 text-[10px] font-bold text-slate-400">
                      <span>{formatTime(msg.timestamp)}</span>
                      {msg.role === 'assistant' && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                          <span>مدعوم بالذكاء الاصطناعي</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Thinking State */}
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex justify-start"
            >
              <div className="flex gap-4 items-center">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center animate-pulse">
                  <Bot size={20} />
                </div>
                <div className="bg-white border border-slate-100 p-5 rounded-3xl rounded-tl-none shadow-sm flex items-center gap-4">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-bounce"></span>
                  </div>
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">جاري التحليل...</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Input Form & Controls */}
      <div className="p-6 md:p-8 bg-white border-t border-slate-100 relative shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)]">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Quick Suggestions Bar */}
          {!isLoading && messages.length < 5 && (
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(s.text)}
                  className={`flex items-center gap-2 px-4 py-2 bg-${s.color}-50 text-${s.color}-600 rounded-2xl text-[10px] font-black whitespace-nowrap border border-${s.color}-100 hover:bg-${s.color}-100 transition-all active:scale-95`}
                >
                  <s.icon size={14} />
                  {s.text}
                </button>
              ))}
            </div>
          )}

          {/* Main Input Field */}
          <div className="relative group">
            <div className="absolute inset-0 bg-blue-600/5 blur-2xl rounded-[2.5rem] opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
            <div className="relative bg-white border border-slate-200 rounded-[2.5rem] p-2 flex items-center shadow-sm group-focus-within:border-blue-400 group-focus-within:ring-4 group-focus-within:ring-blue-500/5 transition-all">
              <div className="p-3.5 text-slate-300">
                <MessageSquarePlus size={24} />
              </div>
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="اطلب تحليلاً مالياً، مراجعة للمشاريع، أو صياغة عقد..."
                className="flex-1 py-3 bg-transparent text-sm font-bold text-slate-700 outline-none placeholder:text-slate-400"
              />
              <button 
                onClick={() => handleSend()}
                disabled={isLoading || !input.trim()}
                className="ml-1 p-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-30 disabled:grayscale transition-all shadow-xl shadow-blue-500/20 active:scale-95 group/btn"
              >
                {isLoading ? (
                  <Loader2 size={24} className="animate-spin" />
                ) : (
                  <Send size={24} className="rotate-180 group-hover/btn:-translate-x-1 group-hover/btn:translate-y-[-1px] transition-transform" />
                )}
              </button>
            </div>
          </div>

          {/* Footer Info */}
          <div className="flex items-center justify-between px-6">
             <div className="flex items-center gap-4">
                <button className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 hover:text-blue-600 transition-colors uppercase">
                   <Lightbulb size={14} className="text-amber-500" /> تحليل مالي
                </button>
                <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                <button className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 hover:text-blue-600 transition-colors uppercase">
                   <Info size={14} /> حالة المشاريع
                </button>
             </div>
             <p className="text-[9px] text-slate-400 font-bold">
               المساعد الذكي قد يرتكب أخطاء في البيانات الدقيقة. يرجى المراجعة البشرية دائماً.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
