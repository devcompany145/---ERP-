
import React, { useState, useMemo } from 'react';
import { 
  Files, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Upload, 
  FileText, 
  Download, 
  MoreVertical, 
  X, 
  Save, 
  Trash2, 
  ExternalLink,
  ShieldCheck,
  FileSearch,
  Bell,
  // Fix: Added missing Edit3 import
  Edit3
} from 'lucide-react';
import { OfficialDocument } from '../types';

const initialDocs: OfficialDocument[] = [
  { id: 'd1', title: 'السجل التجاري الرئيسي', type: 'سجل تجاري', docNumber: '1010123456', issueDate: '2023-01-10', expiryDate: '2024-01-10', status: 'expiring_soon', fileName: 'cr_main.pdf' },
  { id: 'd2', title: 'شهادة تسجيل القيمة المضافة', type: 'شهادة ضريبية', docNumber: '312345678900003', issueDate: '2023-05-15', expiryDate: '2025-05-15', status: 'active', fileName: 'vat_cert.pdf' },
  { id: 'd3', title: 'ترخيص البلدية - فرع الرياض', type: 'ترخيص بلدي', docNumber: 'BLD-99001', issueDate: '2022-11-20', expiryDate: '2023-11-20', status: 'expired', fileName: 'baladiya_license.pdf' },
  { id: 'd4', title: 'عقد تأمين المقر', type: 'تأمين', docNumber: 'INS-TECH-001', issueDate: '2023-06-01', expiryDate: '2024-06-01', status: 'active', fileName: 'insurance_policy.pdf' },
];

const OfficialDocuments = () => {
  const [docs, setDocs] = useState<OfficialDocument[]>(initialDocs);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<OfficialDocument | null>(null);

  const stats = useMemo(() => {
    return {
      total: docs.length,
      active: docs.filter(d => d.status === 'active').length,
      expiring: docs.filter(d => d.status === 'expiring_soon').length,
      expired: docs.filter(d => d.status === 'expired').length,
    };
  }, [docs]);

  const filteredDocs = useMemo(() => {
    return docs.filter(d => 
      d.title.includes(searchTerm) || 
      d.docNumber.includes(searchTerm) || 
      d.type.includes(searchTerm)
    );
  }, [docs, searchTerm]);

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newDoc: OfficialDocument = {
      id: selectedDoc?.id || Date.now().toString(),
      title: formData.get('title') as string,
      type: formData.get('type') as any,
      docNumber: formData.get('docNumber') as string,
      issueDate: formData.get('issueDate') as string,
      expiryDate: formData.get('expiryDate') as string,
      notes: formData.get('notes') as string,
      status: 'active', // مبدئياً
      fileName: 'uploaded_doc.pdf'
    };

    if (selectedDoc) {
      setDocs(docs.map(d => d.id === selectedDoc.id ? newDoc : d));
    } else {
      setDocs([newDoc, ...docs]);
    }
    setIsModalOpen(false);
    setSelectedDoc(null);
  };

  const deleteDoc = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الوثيقة نهائياً؟')) {
      setDocs(docs.filter(d => d.id !== id));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tighter flex items-center gap-3">
             إدارة الوثائق الرسمية <span className="px-4 py-1 bg-blue-100 text-blue-600 rounded-2xl text-sm font-black">{stats.total}</span>
          </h2>
          <p className="text-slate-500 text-sm font-medium">تتبع التراخيص، الشهادات، والمستندات القانونية لضمان الامتثال.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => { setSelectedDoc(null); setIsModalOpen(true); }}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-sm font-black shadow-2xl shadow-blue-100 flex items-center gap-2 transition-all active:scale-95"
          >
            <Plus size={18} /> إضافة وثيقة جديدة
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
           <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner"><Files size={28}/></div>
           <div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">إجمالي الوثائق</p>
              <p className="text-xl font-black text-slate-800">{stats.total}</p>
           </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
           <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner"><ShieldCheck size={28}/></div>
           <div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">وثائق سارية</p>
              <p className="text-xl font-black text-slate-800">{stats.active}</p>
           </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
           <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shadow-inner"><Clock size={28}/></div>
           <div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">قاربت على الانتهاء</p>
              <p className="text-xl font-black text-amber-600">{stats.expiring}</p>
           </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
           <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center shadow-inner"><AlertCircle size={28}/></div>
           <div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">وثائق منتهية</p>
              <p className="text-xl font-black text-slate-800">{stats.expired}</p>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/30">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="البحث بالاسم، الرقم، أو النوع..." 
              className="w-full pr-12 pl-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
             <button className="flex items-center gap-2 px-5 py-3 border border-slate-200 rounded-2xl text-xs font-black text-slate-600 hover:bg-white transition-all bg-slate-100/50">
               <Filter size={16} /> تصفية متقدمة
             </button>
             <button className="flex items-center gap-2 px-5 py-3 border border-slate-200 rounded-2xl text-xs font-black text-blue-600 hover:bg-blue-50 transition-all bg-white">
               <Bell size={16} /> إعدادات التنبيهات
             </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-slate-50 text-slate-500 font-black text-[10px] uppercase tracking-widest border-b border-slate-100">
              <tr>
                <th className="px-8 py-6">الوثيقة / الرقم المرجعي</th>
                <th className="px-8 py-6">نوع الوثيقة</th>
                <th className="px-8 py-6">تاريخ الإصدار</th>
                <th className="px-8 py-6">تاريخ الانتهاء</th>
                <th className="px-8 py-6">الحالة</th>
                <th className="px-8 py-6">الملف</th>
                <th className="px-8 py-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black ${
                        doc.status === 'expired' ? 'bg-rose-50 text-rose-500' : 
                        doc.status === 'expiring_soon' ? 'bg-amber-50 text-amber-500' : 'bg-blue-50 text-blue-600'
                      }`}>
                        <FileText size={20} />
                      </div>
                      <div>
                        <p className="font-black text-slate-700 group-hover:text-blue-600 transition-colors">{doc.title}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter"># {doc.docNumber}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-3 py-1 rounded-lg uppercase tracking-widest">{doc.type}</span>
                  </td>
                  <td className="px-8 py-6 text-slate-400 font-bold font-mono text-xs">{doc.issueDate}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                       <Calendar size={14} className="text-slate-300" />
                       <span className={`font-mono text-xs font-black ${
                         doc.status === 'expired' ? 'text-rose-600' : 
                         doc.status === 'expiring_soon' ? 'text-amber-600' : 'text-slate-700'
                       }`}>
                         {doc.expiryDate}
                       </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase flex items-center gap-1.5 w-fit ${
                      doc.status === 'active' ? 'bg-emerald-100 text-emerald-600' : 
                      doc.status === 'expiring_soon' ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600'
                    }`}>
                      {doc.status === 'active' ? <CheckCircle2 size={12}/> : doc.status === 'expiring_soon' ? <Clock size={12}/> : <AlertCircle size={12}/>}
                      {doc.status === 'active' ? 'ساري' : doc.status === 'expiring_soon' ? 'ينتهي قريباً' : 'منتهي'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <button className="flex items-center gap-2 text-blue-600 hover:underline font-bold text-xs">
                       <Download size={16} /> {doc.fileName}
                    </button>
                  </td>
                  <td className="px-8 py-6 text-left">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                       <button 
                        onClick={() => { setSelectedDoc(doc); setIsModalOpen(true); }}
                        className="p-2 text-slate-300 hover:text-blue-600 transition-all hover:bg-white rounded-lg"
                       >
                         <Edit3 size={18} />
                       </button>
                       <button 
                        onClick={() => deleteDoc(doc.id)}
                        className="p-2 text-slate-300 hover:text-rose-600 transition-all hover:bg-white rounded-lg"
                       >
                         <Trash2 size={18} />
                       </button>
                       <button className="p-2 text-slate-300 hover:text-slate-600 transition-all hover:bg-white rounded-lg">
                         <MoreVertical size={18} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredDocs.length === 0 && (
            <div className="py-32 text-center">
               <FileSearch size={64} className="text-slate-100 mx-auto mb-4" />
               <h4 className="text-xl font-black text-slate-400">لم يتم العثور على وثائق</h4>
               <p className="text-slate-400 text-sm font-medium mt-2">جرب تغيير معايير البحث أو أضف وثيقة جديدة.</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-indigo-600 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700"><ShieldCheck size={160} /></div>
         <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
               <h3 className="text-3xl font-black tracking-tight">أرشفة ذكية وآمنة</h3>
               <p className="text-indigo-100 text-lg leading-relaxed font-medium">
                 نظام تكنولوجي ERP يضمن لك عدم ضياع أي وثيقة رسمية، مع نظام تنبيهات استباقي يرسل إشعارات قبل 30 يوماً من انتهاء أي وثيقة عبر البريد والرسائل النصية.
               </p>
               <div className="flex gap-4">
                  <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl border border-white/20">
                     <CheckCircle2 size={16} className="text-emerald-400" />
                     <span className="text-xs font-bold uppercase tracking-wider">سحابة سعودية موثقة</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl border border-white/20">
                     <CheckCircle2 size={16} className="text-emerald-400" />
                     <span className="text-xs font-bold uppercase tracking-wider">تشفير AES-256</span>
                  </div>
               </div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/20 shadow-inner">
               <h4 className="text-sm font-black mb-6 border-b border-white/10 pb-4">الإجراءات المقترحة (AI)</h4>
               <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                     <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center shrink-0 mt-0.5"><Clock size={14} /></div>
                     <p className="text-xs leading-relaxed font-medium">تجديد "ترخيص البلدية" متأخر بـ 5 أيام. الرسوم المتوقعة: 500 ر.س + غرامة تأخير.</p>
                  </li>
                  <li className="flex items-start gap-3">
                     <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shrink-0 mt-0.5"><Bell size={14} /></div>
                     <p className="text-xs leading-relaxed font-medium">تم اكتشاف اقتراب موعد انتهاء "السجل التجاري". هل تريد حجز موعد للتجديد؟</p>
                  </li>
               </ul>
               <button className="w-full mt-8 py-4 bg-white text-indigo-600 rounded-2xl font-black text-xs hover:bg-blue-50 transition-all flex items-center justify-center gap-2">
                 مساعد الامتثال الذكي <ExternalLink size={14} />
               </button>
            </div>
         </div>
      </div>

      {/* Modal Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
           <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                 <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-100">
                       <Upload size={28} />
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-slate-800">{selectedDoc ? 'تعديل وثيقة' : 'إضافة وثيقة رسمية'}</h3>
                       <p className="text-xs text-slate-500 font-medium mt-1">تأكد من مطابقة التواريخ للمستند الأصلي</p>
                    </div>
                 </div>
                 <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"><X size={24} /></button>
              </div>
              <form onSubmit={handleSave} className="p-8 space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">مسمى الوثيقة</label>
                       <input name="title" required defaultValue={selectedDoc?.title} placeholder="مثال: السجل التجاري الرئيسي" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">نوع الوثيقة</label>
                       <select name="type" defaultValue={selectedDoc?.type} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500">
                          <option value="سجل تجاري">سجل تجاري</option>
                          <option value="شهادة ضريبية">شهادة ضريبية (ZATCA)</option>
                          <option value="ترخيص بلدي">ترخيص بلدي</option>
                          <option value="تأمين">عقد تأمين</option>
                          <option value="عضوية">عضوية (غرفة تجارية)</option>
                          <option value="أخرى">أخرى</option>
                       </select>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">الرقم المرجعي / المستند</label>
                       <input name="docNumber" required defaultValue={selectedDoc?.docNumber} placeholder="1234567890" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">تاريخ الإصدار</label>
                       <input name="issueDate" type="date" required defaultValue={selectedDoc?.issueDate || new Date().toISOString().split('T')[0]} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">تاريخ الانتهاء</label>
                       <input name="expiryDate" type="date" required defaultValue={selectedDoc?.expiryDate} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none border-blue-200 focus:ring-rose-500" />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ملف الوثيقة (PDF/Image)</label>
                    <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-10 bg-slate-50/50 text-center group hover:border-blue-500 transition-all cursor-pointer">
                       <Upload size={32} className="text-slate-300 mx-auto mb-4 group-hover:text-blue-500 transition-colors" />
                       <p className="text-sm font-bold text-slate-500 group-hover:text-slate-700">اسحب الملف هنا أو اضغط للاختيار</p>
                       <p className="text-[10px] text-slate-400 mt-2">الحد الأقصى 10MB (PDF, PNG, JPG)</p>
                    </div>
                 </div>

                 <div className="flex gap-4 pt-4">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-slate-600 font-black bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all">إلغاء</button>
                    <button type="submit" className="flex-[2] py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3">
                       <Save size={20} /> {selectedDoc ? 'حفظ التعديلات' : 'إضافة الوثيقة'}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default OfficialDocuments;
