
import React, { useState, useRef } from 'react';
import { 
  PenTool, 
  FileText, 
  Send, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Download, 
  Eye, 
  Search, 
  ChevronLeft, 
  ShieldCheck, 
  Eraser, 
  X, 
  Clock,
  History,
  FileDown,
  Sparkles
} from 'lucide-react';
import { SignedDocument, DocStatus } from '../types';

const mockDocs: SignedDocument[] = [
  { id: 'd1', title: 'عقد تطوير منصة تجارة إلكترونية', clientId: 'c1', clientName: 'شركة الأغذية المتحدة', status: 'signed', createdAt: '2023-11-01', signedAt: '2023-11-05', content: 'يتم بموجب هذا الاتفاق قيام الطرف الأول بتطوير نظام متكامل للتجارة الإلكترونية...', version: 1 },
  { id: 'd2', title: 'اتفاقية عدم الإفصاح (NDA)', clientId: 'c4', clientName: 'تقنية المستقبل', status: 'pending_signature', createdAt: '2023-11-20', content: 'يلتزم الطرفان بالحفاظ على سرية المعلومات التقنية المتبادلة طوال فترة التعاون...', version: 1 },
];

const DocumentSigning = () => {
  const [docs, setDocs] = useState<SignedDocument[]>(mockDocs);
  const [view, setView] = useState<'list' | 'editor' | 'viewer'>('list');
  const [selectedDoc, setSelectedDoc] = useState<SignedDocument | null>(null);
  const [activeTab, setActiveTab] = useState<DocStatus | 'all'>('all');

  const handleCreateNew = () => {
    const newDoc: SignedDocument = {
      id: 'd' + Date.now(),
      title: 'مستند جديد غير معنون',
      clientId: '',
      clientName: '',
      status: 'draft',
      createdAt: new Date().toISOString().split('T')[0],
      content: '',
      version: 1
    };
    setSelectedDoc(newDoc);
    setView('editor');
  };

  const handleOpenDoc = (doc: SignedDocument) => {
    setSelectedDoc(doc);
    setView('viewer');
  };

  const filteredDocs = docs.filter(doc => activeTab === 'all' || doc.status === activeTab);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {view === 'list' && (
        <>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <PenTool className="text-blue-600" /> توقيع العقود والمستندات
              </h2>
              <p className="text-slate-500 text-sm">إدارة كاملة للعقود: اكتبها، وقعها رقمياً، وأرسلها لعملائك في ثوانٍ.</p>
            </div>
            <button 
              onClick={handleCreateNew}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 flex items-center gap-2 transition-all"
            >
              <Plus size={18} /> إنشاء عقد جديد
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">بانتظار توقيعك</p>
              <p className="text-xl font-black text-amber-600">3</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">موقعة نهائياً</p>
              <p className="text-xl font-black text-emerald-600">14</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">مرسلة للعملاء</p>
              <p className="text-xl font-black text-blue-600">5</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">مسودات</p>
              <p className="text-xl font-black text-slate-400">2</p>
            </div>
          </div>

          <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm w-fit overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'الكل' },
              { id: 'draft', label: 'مسودات' },
              { id: 'pending_signature', label: 'بانتظار التوقيع' },
              { id: 'signed', label: 'موقعة' },
              { id: 'sent', label: 'مرسلة' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-sm">
                <thead className="bg-slate-50 text-slate-500 font-bold text-[10px] uppercase">
                  <tr>
                    <th className="px-6 py-4">العقد / المستند</th>
                    <th className="px-6 py-4">الطرف الثاني</th>
                    <th className="px-6 py-4">تاريخ الإنشاء</th>
                    <th className="px-6 py-4">الحالة</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDocs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                            <FileText size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">{doc.title}</p>
                            <p className="text-[10px] text-slate-400">إصدار v{doc.version}.0</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs font-bold text-slate-700">{doc.clientName || 'غير محدد'}</p>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">{doc.createdAt}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                          doc.status === 'signed' ? 'bg-emerald-100 text-emerald-600' :
                          doc.status === 'pending_signature' ? 'bg-amber-100 text-amber-600' :
                          doc.status === 'sent' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {doc.status === 'signed' ? 'موقع' : 
                           doc.status === 'pending_signature' ? 'بانتظار توقيعك' :
                           doc.status === 'sent' ? 'مرسل للعميل' : 'مسودة'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-left">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleOpenDoc(doc)} className="p-2 text-slate-300 hover:text-blue-600 transition-all">
                            <Eye size={18} />
                          </button>
                          <button className="p-2 text-slate-300 hover:text-blue-600 transition-all">
                            <FileDown size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {view === 'editor' && selectedDoc && (
        <div className="space-y-6 animate-in slide-in-from-left-4 duration-500">
          <div className="flex items-center justify-between">
            <button onClick={() => setView('list')} className="flex items-center gap-2 text-slate-500 font-bold hover:text-blue-600">
              <ChevronLeft size={20} /> إلغاء المحرر
            </button>
            <button 
              onClick={() => {
                setDocs([selectedDoc, ...docs.filter(d => d.id !== selectedDoc.id)]);
                setView('list');
                alert('تم حفظ العقد بنجاح كمسودة.');
              }}
              className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg"
            >
              حفظ وتجهيز للتوقيع
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-15rem)]">
            <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col overflow-hidden">
               <div className="p-4 border-b border-slate-50 bg-slate-50/30">
                  <input 
                    type="text" 
                    value={selectedDoc.title}
                    onChange={(e) => setSelectedDoc({...selectedDoc, title: e.target.value})}
                    placeholder="عنوان العقد أو المستند..."
                    className="w-full text-xl font-bold text-slate-800 outline-none bg-transparent"
                  />
               </div>
               <textarea 
                 className="flex-1 p-8 text-slate-700 outline-none resize-none leading-relaxed text-sm"
                 placeholder="ابدأ بكتابة بنود العقد هنا... يمكنك استخدام المساعد الذكي لصياغة قانونية."
                 value={selectedDoc.content}
                 onChange={(e) => setSelectedDoc({...selectedDoc, content: e.target.value})}
               />
               <div className="p-4 bg-indigo-50 border-t border-indigo-100 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold">
                    <Sparkles size={16} /> المساعد الذكي جاهز لصياغة البنود
                  </div>
                  <button className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-[10px] font-bold">صياغة احترافية</button>
               </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
               <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2 border-b pb-3">
                     <ShieldCheck size={18} className="text-blue-600" /> إعدادات المستند
                  </h3>
                  <div className="space-y-4">
                     <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold uppercase">العميل المرتبط</label>
                        <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none">
                           <option>اختر عميلاً من النظام...</option>
                           <option>شركة الأغذية المتحدة</option>
                           <option>متجر الرياض</option>
                        </select>
                     </div>
                     <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold uppercase">نوع العقد</label>
                        <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none">
                           <option>عقد تطوير برمجيات</option>
                           <option>اتفاقية صيانة</option>
                           <option>عقد استشارة تقنية</option>
                        </select>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {view === 'viewer' && selectedDoc && (
        <DocumentViewer 
          doc={selectedDoc} 
          onBack={() => setView('list')}
          onSign={(sig) => {
             setDocs(docs.map(d => d.id === selectedDoc.id ? {...d, status: 'signed', signatureData: sig, signedAt: new Date().toISOString().split('T')[0]} : d));
             setView('list');
          }}
          onSend={() => {
             setDocs(docs.map(d => d.id === selectedDoc.id ? {...d, status: 'sent', sentAt: new Date().toISOString().split('T')[0]} : d));
             setView('list');
             alert('تم إرسال العقد للعميل بنجاح.');
          }}
        />
      )}
    </div>
  );
};

const DocumentViewer = ({ doc, onBack, onSign, onSend }: { doc: SignedDocument, onBack: () => void, onSign: (s: string) => void, onSend: () => void }) => {
  const [isSignPadOpen, setIsSignPadOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const startDrawing = (e: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: any) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    ctx.lineTo(x, y);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const handleSaveSignature = () => {
    if (canvasRef.current) {
      onSign(canvasRef.current.toDataURL());
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-left-4 duration-500">
       <div className="flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-500 font-bold hover:text-blue-600 transition-colors">
            <ChevronLeft size={20} /> العودة للقائمة
          </button>
          <div className="flex gap-2">
             {doc.status === 'pending_signature' && (
               <button 
                 onClick={() => setIsSignPadOpen(true)}
                 className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg flex items-center gap-2"
               >
                 <PenTool size={18} /> توقيع الآن
               </button>
             )}
             {doc.status === 'signed' && (
               <button 
                 onClick={onSend}
                 className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-lg flex items-center gap-2"
               >
                 <Send size={18} /> إرسال للعميل
               </button>
             )}
          </div>
       </div>

       <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
          <div className="bg-slate-900 p-10 text-white text-center">
             <h3 className="text-2xl font-bold mb-2">{doc.title}</h3>
             <p className="text-slate-400 text-xs uppercase tracking-widest">مستند رقمي موثق - REF: {doc.id.toUpperCase()}</p>
          </div>

          <div className="p-16 space-y-12 font-serif leading-relaxed text-slate-800 text-lg">
             <div className="flex justify-between items-start border-b pb-8 border-slate-50">
                <div>
                   <p className="font-black mb-1">الطرف الأول (الشركة):</p>
                   <p className="text-sm">تكنولوجي ERP للحلول البرمجية</p>
                </div>
                <div className="text-left">
                   <p className="font-black mb-1">الطرف الثاني (العميل):</p>
                   <p className="text-sm">{doc.clientName}</p>
                </div>
             </div>

             <div className="min-h-[300px] whitespace-pre-wrap">
                {doc.content || "لا يوجد محتوى مسجل حالياً."}
             </div>

             <div className="pt-20 grid grid-cols-2 gap-20">
                <div className="border-t pt-6 border-slate-100">
                   <p className="text-[10px] font-black text-slate-400 mb-6 uppercase">توقيع الطرف الأول</p>
                   {doc.signatureData ? (
                     <img src={doc.signatureData} alt="توقيع المدير" className="h-20 object-contain mx-auto" />
                   ) : (
                     <div className="h-20 flex items-center justify-center text-slate-300 italic text-xs">بانتظار التوقيع...</div>
                   )}
                   <p className="text-xs font-bold mt-4 text-center">أحمد محمد - المدير التنفيذي</p>
                </div>
                <div className="border-t pt-6 border-slate-100">
                   <p className="text-[10px] font-black text-slate-400 mb-6 uppercase">توقيع الطرف الثاني</p>
                   <div className="h-20 flex items-center justify-center text-slate-200 italic text-xs">
                     {doc.status === 'sent' ? 'تم الإرسال للعميل للتوقيع...' : 'بانتظار اكتمال توقيع الطرف الأول'}
                   </div>
                </div>
             </div>
          </div>
       </div>

       {isSignPadOpen && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
               <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h4 className="font-bold text-slate-800 flex items-center gap-2"><PenTool size={20} className="text-blue-600" /> التوقيع الحي</h4>
                  <button onClick={() => setIsSignPadOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
               </div>
               <div className="p-8 space-y-6">
                  <p className="text-xs text-slate-500 leading-relaxed">يرجى رسم توقيعك داخل الإطار أدناه باستخدام الماوس أو القلم الرقمي. سيتم دمج هذا التوقيع في العقد بشكل دائم.</p>
                  
                  <div className="border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 relative overflow-hidden">
                     <canvas 
                       ref={canvasRef}
                       width={450}
                       height={220}
                       onMouseDown={startDrawing}
                       onMouseMove={draw}
                       onMouseUp={() => setIsDrawing(false)}
                       onTouchStart={startDrawing}
                       onTouchMove={draw}
                       onTouchEnd={() => setIsDrawing(false)}
                       className="cursor-crosshair w-full"
                     />
                     <button 
                       onClick={() => {
                          const ctx = canvasRef.current?.getContext('2d');
                          if (ctx) ctx.clearRect(0, 0, 450, 220);
                       }}
                       className="absolute bottom-3 left-3 p-2 bg-white text-rose-500 rounded-lg shadow-sm border border-slate-100 hover:bg-rose-50 transition-colors"
                     >
                       <Eraser size={16} />
                     </button>
                  </div>

                  <div className="flex gap-3 pt-4">
                     <button 
                       onClick={() => setIsSignPadOpen(false)}
                       className="flex-1 py-3 text-slate-600 font-bold bg-slate-100 rounded-xl"
                     >
                       إلغاء
                     </button>
                     <button 
                       onClick={handleSaveSignature}
                       className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-100"
                     >
                       اعتماد التوقيع
                     </button>
                  </div>
               </div>
            </div>
         </div>
       )}
    </div>
  );
};

export default DocumentSigning;
