
import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Send, 
  MoreVertical, 
  Paperclip, 
  Smile, 
  Phone, 
  Video, 
  User, 
  CheckCheck,
  Circle,
  Hash,
  Image as ImageIcon,
  FileText,
  Info,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Contact {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'online' | 'offline' | 'busy' | 'away';
  lastMessage: string;
  time: string;
  unread?: number;
}

interface Message {
  id: string;
  senderId: string;
  text: string;
  time: string;
  isMe: boolean;
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'file';
  avatar?: string;
}

const mockContacts: Contact[] = [
  { id: '1', name: 'سارة خالد', role: 'مطور واجهات', avatar: 'https://picsum.photos/seed/sara/100/100', status: 'online', lastMessage: 'تم رفع التحديث الجديد للـ API', time: '10:30 ص' },
  { id: '2', name: 'محمد علي', role: 'مدير منتج', avatar: 'https://picsum.photos/seed/mo/100/100', status: 'busy', lastMessage: 'هل انتهيتم من تصاميم لوحة التحكم؟', time: 'أمس', unread: 2 },
  { id: '3', name: 'ليلى منصور', role: 'مصممة UX', avatar: 'https://picsum.photos/seed/layla/100/100', status: 'away', lastMessage: 'شكراً جزيلاً، الملفات واضحة', time: '09:15 ص' },
  { id: '4', name: 'عمر ياسين', role: 'مهندس سحابي', avatar: 'https://picsum.photos/seed/omar/100/100', status: 'online', lastMessage: 'سأقوم بمراجعة سيرفرات الاختبار الآن', time: '11:00 ص' },
];

const mockMessagesData: Record<string, Message[]> = {
  '1': [
    { id: 'm1', senderId: '1', text: 'صباح الخير أحمد، هل راجعت طلب الدمج الأخير؟', time: '09:00 ص', isMe: false, status: 'read', type: 'text', avatar: 'https://picsum.photos/seed/sara/100/100' },
    { id: 'm2', senderId: 'me', text: 'أهلاً سارة، نعم يبدو ممتازاً، سأقوم باعتماده بعد قليل.', time: '09:05 ص', isMe: true, status: 'read', type: 'text' },
    { id: 'm3', senderId: '1', text: 'رائع، سأبدأ العمل على ميزة الدردشة إذاً.', time: '09:10 ص', isMe: false, status: 'read', type: 'text', avatar: 'https://picsum.photos/seed/sara/100/100' },
    { id: 'm4', senderId: '1', text: 'تم رفع التحديث الجديد للـ API', time: '10:30 ص', isMe: false, status: 'read', type: 'text', avatar: 'https://picsum.photos/seed/sara/100/100' },
  ]
};

const InternalChat = () => {
  const [selectedContact, setSelectedContact] = useState<Contact>(mockContacts[0]);
  const [messages, setMessages] = useState<Message[]>(mockMessagesData[mockContacts[0].id] || []);
  const [inputText, setInputText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      text: inputText,
      time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
      status: 'sent',
      type: 'text'
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');

    // Simulate reply
    setTimeout(() => {
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        senderId: selectedContact.id,
        text: 'رسالة مستلمة! سأقوم بالرد فور تفرغي.',
        time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
        isMe: false,
        status: 'read',
        type: 'text',
        avatar: selectedContact.avatar
      };
      setMessages(prev => [...prev, reply]);
    }, 2000);
  };

  const filteredContacts = mockContacts.filter(c => c.name.includes(searchTerm));

  return (
    <div className="h-[calc(100vh-8rem)] flex bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden animate-in fade-in duration-500">
      
      {/* Sidebar - Contacts List */}
      <aside className="w-80 border-l border-slate-100 flex flex-col bg-slate-50/30">
        <div className="p-6 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-3 mb-6">
             <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-blue-200">C</div>
             <h2 className="text-xl font-black text-slate-800 tracking-tighter">الدردشة الداخلية</h2>
          </div>
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="البحث عن زميل..."
              className="w-full pr-10 pl-4 py-3 bg-slate-100 border-none rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-1">
          {filteredContacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => {
                setSelectedContact(contact);
                setMessages(mockMessagesData[contact.id] || []);
              }}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all relative group ${
                selectedContact.id === contact.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' : 'hover:bg-white text-slate-700'
              }`}
            >
              <div className="relative shrink-0">
                <img src={contact.avatar} className="w-12 h-12 rounded-2xl object-cover shadow-sm" />
                <div className={`absolute -bottom-1 -left-1 w-4 h-4 rounded-full border-4 border-white ${
                  contact.status === 'online' ? 'bg-emerald-500' : contact.status === 'busy' ? 'bg-rose-500' : 'bg-slate-300'
                }`}></div>
              </div>
              <div className="flex-1 text-right min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <h4 className="font-bold text-sm truncate">{contact.name}</h4>
                  <span className={`text-[9px] font-medium ${selectedContact.id === contact.id ? 'text-blue-100' : 'text-slate-400'}`}>{contact.time}</span>
                </div>
                <p className={`text-[10px] truncate font-medium ${selectedContact.id === contact.id ? 'text-blue-50' : 'text-slate-500'}`}>{contact.lastMessage}</p>
              </div>
              {contact.unread && selectedContact.id !== contact.id && (
                <div className="w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center text-[9px] font-black shadow-lg shadow-rose-200">
                  {contact.unread}
                </div>
              )}
            </button>
          ))}
        </div>
      </aside>

      {/* Main Chat View */}
      <section className="flex-1 flex flex-col bg-white">
        
        {/* Header */}
        <header className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md z-20">
          <div className="flex items-center gap-4">
             <div className="relative">
                <img src={selectedContact.avatar} className="w-12 h-12 rounded-2xl object-cover ring-4 ring-slate-50" />
                {selectedContact.status === 'online' && (
                  <div className="absolute top-0 left-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></div>
                )}
             </div>
             <div>
                <h3 className="font-black text-slate-800 tracking-tight">{selectedContact.name}</h3>
                <div className="flex items-center gap-2">
                   <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg uppercase tracking-widest">{selectedContact.role}</span>
                   <span className="text-[9px] text-slate-400 font-bold">• {selectedContact.status === 'online' ? 'نشط الآن' : 'غير متصل'}</span>
                </div>
             </div>
          </div>
          <div className="flex items-center gap-2">
             <button title="اتصال صوتي" className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all"><Phone size={20}/></button>
             <button title="اتصال مرئي" className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all"><Video size={20}/></button>
             <div className="w-px h-8 bg-slate-100 mx-2"></div>
             <button className="p-3 text-slate-400 hover:bg-slate-50 rounded-2xl transition-all"><MoreVertical size={20}/></button>
          </div>
        </header>

        {/* Message History - Scrollable */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 bg-slate-50/40 no-scrollbar relative"
        >
          {/* Subtle pattern background effect */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#2563eb 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
          
          <div className="max-w-4xl mx-auto space-y-8 relative z-10">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div 
                  key={msg.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex w-full ${msg.isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-4 max-w-[80%] md:max-w-[70%] ${msg.isMe ? 'flex-row-reverse' : ''}`}>
                    
                    {/* Avatar for receiver */}
                    {!msg.isMe && (
                      <div className="w-10 h-10 rounded-xl bg-slate-200 shrink-0 overflow-hidden shadow-sm self-end">
                        <img src={msg.avatar || 'https://picsum.photos/seed/default/40/40'} className="w-full h-full object-cover" />
                      </div>
                    )}
                    
                    {/* Message Bubble Container */}
                    <div className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                      <div className={`p-4 rounded-[2rem] text-sm leading-relaxed shadow-sm transition-all hover:shadow-md ${
                        msg.isMe 
                          ? 'bg-blue-600 text-white rounded-br-none shadow-blue-900/10' 
                          : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none'
                      }`}>
                        <p className="font-medium whitespace-pre-wrap">{msg.text}</p>
                      </div>
                      
                      {/* Metadata: Time and Status */}
                      <div className={`flex items-center gap-2 mt-2 px-1 text-[9px] font-black tracking-tighter uppercase ${
                        msg.isMe ? 'text-slate-400' : 'text-slate-400'
                      }`}>
                        <span>{msg.time}</span>
                        {msg.isMe && <CheckCheck size={12} className={msg.status === 'read' ? 'text-blue-500' : 'text-slate-300'} />}
                      </div>
                    </div>

                    {/* Simple placeholder for My Avatar when needed (optional design choice) */}
                    {msg.isMe && (
                      <div className="w-10 h-10 rounded-xl bg-slate-800 shrink-0 flex items-center justify-center text-white self-end shadow-sm">
                        <User size={20} />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Chat Input Area */}
        <div className="p-6 md:p-8 bg-white border-t border-slate-100">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSendMessage} className="flex items-center gap-4">
               <div className="flex gap-2">
                  <button type="button" title="إرفاق ملف" className="p-3.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all border border-transparent hover:border-blue-100"><Paperclip size={22}/></button>
                  <button type="button" title="رموز تعبيرية" className="p-3.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all border border-transparent hover:border-blue-100"><Smile size={22}/></button>
               </div>
               <div className="flex-1 relative group">
                  <div className="absolute inset-0 bg-blue-600/5 blur-xl rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                  <input 
                    type="text" 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="اكتب رسالتك لزميلك هنا..."
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-[1.5rem] text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-500 transition-all placeholder:text-slate-400 shadow-inner relative z-10"
                  />
               </div>
               <button 
                 type="submit"
                 disabled={!inputText.trim()}
                 className="p-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:scale-100 relative z-10"
               >
                  <Send size={22} className="rotate-180" />
               </button>
            </form>
            <div className="flex gap-6 mt-4 mr-20">
               <button className="flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest">
                  <ImageIcon size={14} className="text-blue-400" /> صور
               </button>
               <button className="flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest">
                  <FileText size={14} className="text-indigo-400" /> ملفات
               </button>
               <button className="flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest">
                  <ShieldCheck size={14} className="text-emerald-400" /> مشفر
               </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Helper components
const StatCard = ({ label, value, sub, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm group hover:border-blue-100 transition-all">
    <div className={`w-12 h-12 rounded-2xl bg-${color}-50 text-${color}-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
      <Icon size={24} />
    </div>
    <p className="text-[10px] text-slate-400 font-black uppercase mb-1 tracking-widest">{label}</p>
    <h3 className="text-2xl font-black text-slate-800">{value}</h3>
    <p className="text-[10px] text-slate-500 mt-1 font-bold">{sub}</p>
  </div>
);

export default InternalChat;
