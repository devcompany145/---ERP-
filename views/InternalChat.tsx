
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
  FileText
} from 'lucide-react';

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
}

const mockContacts: Contact[] = [
  { id: '1', name: 'سارة خالد', role: 'مطور واجهات', avatar: 'https://picsum.photos/seed/sara/100/100', status: 'online', lastMessage: 'تم رفع التحديث الجديد للـ API', time: '10:30 ص' },
  { id: '2', name: 'محمد علي', role: 'مدير منتج', avatar: 'https://picsum.photos/seed/mo/100/100', status: 'busy', lastMessage: 'هل انتهيتم من تصاميم لوحة التحكم؟', time: 'أمس', unread: 2 },
  { id: '3', name: 'ليلى منصور', role: 'مصممة UX', avatar: 'https://picsum.photos/seed/layla/100/100', status: 'away', lastMessage: 'شكراً جزيلاً، الملفات واضحة', time: '09:15 ص' },
  { id: '4', name: 'عمر ياسين', role: 'مهندس سحابي', avatar: 'https://picsum.photos/seed/omar/100/100', status: 'online', lastMessage: 'سأقوم بمراجعة سيرفرات الاختبار الآن', time: '11:00 ص' },
];

const mockMessages: Record<string, Message[]> = {
  '1': [
    { id: 'm1', senderId: '1', text: 'صباح الخير أحمد، هل راجعت طلب الدمج الأخير؟', time: '09:00 ص', isMe: false, status: 'read', type: 'text' },
    { id: 'm2', senderId: 'me', text: 'أهلاً سارة، نعم يبدو ممتازاً، سأقوم باعتماده بعد قليل.', time: '09:05 ص', isMe: true, status: 'read', type: 'text' },
    { id: 'm3', senderId: '1', text: 'رائع، سأبدأ العمل على ميزة الدردشة إذاً.', time: '09:10 ص', isMe: false, status: 'read', type: 'text' },
    { id: 'm4', senderId: '1', text: 'تم رفع التحديث الجديد للـ API', time: '10:30 ص', isMe: false, status: 'read', type: 'text' },
  ]
};

const InternalChat = () => {
  const [selectedContact, setSelectedContact] = useState<Contact>(mockContacts[0]);
  const [messages, setMessages] = useState<Message[]>(mockMessages[mockContacts[0].id] || []);
  const [inputText, setInputText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
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

    setMessages([...messages, newMessage]);
    setInputText('');

    // Simulate automatic reply
    setTimeout(() => {
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        senderId: selectedContact.id,
        text: 'وصلت رسالتك، سأقوم بالرد عليك قريباً 👍',
        time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
        isMe: false,
        status: 'read',
        type: 'text'
      };
      setMessages(prev => [...prev, reply]);
    }, 1500);
  };

  const filteredContacts = mockContacts.filter(c => c.name.includes(searchTerm));

  return (
    <div className="h-[calc(100vh-8rem)] bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex animate-in fade-in duration-500">
      
      {/* Contacts Sidebar */}
      <aside className="w-80 border-l border-slate-100 flex flex-col bg-slate-50/50">
        <div className="p-6 border-b border-slate-100 bg-white">
          <h2 className="text-xl font-black text-slate-800 mb-4">ملتقى تكنولوجي</h2>
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="البحث عن زميل..."
              className="w-full pr-10 pl-4 py-2.5 bg-slate-100 border-none rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar py-4 px-2 space-y-1">
          {filteredContacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => {
                setSelectedContact(contact);
                setMessages(mockMessages[contact.id] || []);
              }}
              className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all ${
                selectedContact.id === contact.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'hover:bg-white text-slate-700'
              }`}
            >
              <div className="relative">
                <img src={contact.avatar} className="w-12 h-12 rounded-xl object-cover shadow-sm" />
                <div className={`absolute -bottom-1 -left-1 w-4 h-4 rounded-full border-4 border-white ${
                  contact.status === 'online' ? 'bg-emerald-500' : contact.status === 'busy' ? 'bg-rose-500' : 'bg-slate-300'
                }`}></div>
              </div>
              <div className="flex-1 text-right min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <h4 className="font-bold text-sm truncate">{contact.name}</h4>
                  <span className={`text-[9px] ${selectedContact.id === contact.id ? 'text-blue-100' : 'text-slate-400'}`}>{contact.time}</span>
                </div>
                <p className={`text-[10px] truncate ${selectedContact.id === contact.id ? 'text-blue-50' : 'text-slate-500'}`}>{contact.lastMessage}</p>
              </div>
              {contact.unread && selectedContact.id !== contact.id && (
                <div className="w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center text-[9px] font-black">
                  {contact.unread}
                </div>
              )}
            </button>
          ))}
        </div>
      </aside>

      {/* Main Chat Window */}
      <section className="flex-1 flex flex-col bg-white">
        {/* Chat Header */}
        <header className="px-8 py-4 border-b border-slate-100 flex items-center justify-between bg-white/70 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
             <div className="relative">
                <img src={selectedContact.avatar} className="w-11 h-11 rounded-xl object-cover" />
                {selectedContact.status === 'online' && (
                  <div className="absolute top-0 left-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></div>
                )}
             </div>
             <div>
                <h3 className="font-black text-slate-800">{selectedContact.name}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{selectedContact.role} • {selectedContact.status === 'online' ? 'نشط الآن' : 'غير متصل'}</p>
             </div>
          </div>
          <div className="flex items-center gap-2">
             <button className="p-2.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all"><Phone size={20}/></button>
             <button className="p-2.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all"><Video size={20}/></button>
             <div className="w-px h-6 bg-slate-100 mx-2"></div>
             <button className="p-2.5 text-slate-400 hover:bg-slate-50 rounded-xl transition-all"><MoreVertical size={20}/></button>
          </div>
        </header>

        {/* Message Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/30"
        >
          {messages.map((msg, idx) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}
            >
              <div className={`flex gap-3 max-w-[70%] ${msg.isMe ? 'flex-row-reverse' : ''}`}>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed relative ${
                  msg.isMe 
                    ? 'bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-100' 
                    : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none shadow-sm'
                }`}>
                  {msg.text}
                  <div className={`flex items-center gap-1.5 mt-2 justify-end ${msg.isMe ? 'text-blue-100' : 'text-slate-400'}`}>
                    <span className="text-[9px] font-bold uppercase tracking-tighter">{msg.time}</span>
                    {msg.isMe && <CheckCheck size={12} className={msg.status === 'read' ? 'text-white' : ''} />}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white border-t border-slate-100">
          <form onSubmit={handleSendMessage} className="flex items-center gap-4">
             <div className="flex gap-2">
                <button type="button" className="p-2.5 text-slate-400 hover:bg-slate-100 rounded-xl transition-all"><Paperclip size={20}/></button>
                <button type="button" className="p-2.5 text-slate-400 hover:bg-slate-100 rounded-xl transition-all"><Smile size={20}/></button>
             </div>
             <div className="flex-1 relative">
                <input 
                  type="text" 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="اكتب رسالتك هنا..."
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
             </div>
             <button 
               type="submit"
               disabled={!inputText.trim()}
               className="p-3.5 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all active:scale-95 disabled:opacity-50 disabled:scale-100"
             >
                <Send size={20} className="rotate-180" />
             </button>
          </form>
          <div className="flex gap-4 mt-3 mr-14">
             <button className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 hover:text-blue-600 transition-colors uppercase">
                <ImageIcon size={14}/> صور
             </button>
             <button className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 hover:text-blue-600 transition-colors uppercase">
                <FileText size={14}/> ملفات
             </button>
             <button className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 hover:text-blue-600 transition-colors uppercase">
                <Hash size={14}/> إشارة للزميل
             </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InternalChat;
