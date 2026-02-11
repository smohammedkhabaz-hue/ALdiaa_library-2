
import React, { useState, useEffect, useRef } from 'react';
import { Book } from '../types';
import { X, Save, BookPlus, CopyPlus, Plus, Minus, RotateCcw } from 'lucide-react';

interface BookFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (book: Omit<Book, 'id' | 'createdAt'>, stayOpen?: boolean) => void;
  initialData?: Book;
}

const BookFormModal: React.FC<BookFormModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const initialFormState = {
    title: '',
    author: '',
    editor: '',
    course: '',
    volumes: 1,
    publisher: '',
    printPlace: '',
    notes: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [shouldRender, setShouldRender] = useState(isOpen);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      if (initialData) {
        setFormData({
          title: initialData.title,
          author: initialData.author,
          editor: initialData.editor || '',
          course: initialData.course || '',
          volumes: initialData.volumes,
          publisher: initialData.publisher || '',
          printPlace: initialData.printPlace || '',
          notes: initialData.notes || ''
        });
      } else {
        setFormData(initialFormState);
      }
      
      setTimeout(() => titleInputRef.current?.focus(), 100);
    }
  }, [isOpen, initialData]);

  if (!shouldRender) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData, false);
  };

  const handleSaveAndAddAnother = () => {
    onSubmit(formData, true);
    setFormData(initialFormState);
    titleInputRef.current?.focus();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'volumes' ? Math.max(1, parseInt(value) || 1) : value
    }));
  };

  const incrementVolumes = () => {
    setFormData(prev => ({ ...prev, volumes: prev.volumes + 1 }));
  };

  const decrementVolumes = () => {
    setFormData(prev => ({ ...prev, volumes: Math.max(1, prev.volumes - 1) }));
  };

  const handleAnimationEnd = () => {
    if (!isOpen) setShouldRender(false);
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onTransitionEnd={handleAnimationEnd}
      dir="rtl"
    >
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      
      <div className={`relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden transition-all duration-500 ease-out transform ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-12'}`}>
        
        {/* Header */}
        <div className="relative overflow-hidden bg-slate-50 px-8 py-6 border-b border-slate-100">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#94B4BC]/10 rounded-full -mr-16 -mt-16 animate-pulse" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#94B4BC] rounded-xl flex items-center justify-center shadow-lg shadow-[#94B4BC]/20">
                {initialData ? <Save className="text-white w-5 h-5" /> : <BookPlus className="text-white w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">
                  {initialData ? 'تعديل بيانات الكتاب' : 'تسجيل كتاب جديد'}
                </h3>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white hover:shadow-sm rounded-full text-slate-400 hover:text-slate-600 transition-all border border-transparent hover:border-slate-100">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="max-h-[75vh] overflow-y-auto custom-scrollbar">
          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6 text-right">
            <div className="space-y-5">
              {/* عنوان الكتاب */}
              <div className="space-y-1.5 group">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pr-1 group-focus-within:text-[#94B4BC] transition-colors">عنوان الكتاب</label>
                <input 
                  ref={titleInputRef}
                  name="title" 
                  value={formData.title} 
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-[#94B4BC]/10 focus:border-[#94B4BC] outline-none transition-all bg-slate-50/50 hover:bg-white font-bold text-black" 
                  placeholder="عنوان الكتاب..." 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* المؤلف */}
                <div className="space-y-1.5 group">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pr-1 group-focus-within:text-[#94B4BC] transition-colors">المؤلف</label>
                  <input 
                    name="author" 
                    value={formData.author} 
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-[#94B4BC]/10 focus:border-[#94B4BC] outline-none transition-all bg-slate-50/50 hover:bg-white text-black font-bold" 
                    placeholder="اسم المؤلف..." 
                  />
                </div>
                {/* المحقق */}
                <div className="space-y-1.5 group">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pr-1 group-focus-within:text-[#94B4BC] transition-colors">المحقق</label>
                  <input 
                    name="editor" 
                    value={formData.editor} 
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-[#94B4BC]/10 focus:border-[#94B4BC] outline-none transition-all bg-slate-50/50 hover:bg-white text-black font-bold" 
                    placeholder="اسم المحقق..." 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* المقرر */}
                <div className="space-y-1.5 group">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pr-1 group-focus-within:text-[#94B4BC] transition-colors">المقرر</label>
                  <input 
                    name="course" 
                    value={formData.course} 
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-[#94B4BC]/10 focus:border-[#94B4BC] outline-none transition-all bg-slate-50/50 hover:bg-white text-black font-bold" 
                    placeholder="اسم المقرر..." 
                  />
                </div>
                {/* عدد الأجزاء */}
                <div className="space-y-1.5 group">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pr-1 group-focus-within:text-[#94B4BC] transition-colors">عدد الأجزاء</label>
                  <div className="flex items-center gap-2">
                    <button 
                      type="button"
                      onClick={decrementVolumes}
                      className="w-12 h-12 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all border border-slate-200 active:scale-95"
                    >
                      <Minus size={18} />
                    </button>
                    <div className="relative flex-1">
                      <input 
                        type="number" 
                        min="1" 
                        name="volumes" 
                        value={formData.volumes} 
                        onChange={handleChange} 
                        className="w-full px-5 py-3 h-12 rounded-xl border border-slate-200 focus:ring-4 focus:ring-[#94B4BC]/10 focus:border-[#94B4BC] outline-none transition-all bg-slate-50/50 hover:bg-white font-black text-center text-black [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                      />
                    </div>
                    <button 
                      type="button"
                      onClick={incrementVolumes}
                      className="w-12 h-12 flex items-center justify-center bg-[#94B4BC]/10 hover:bg-[#94B4BC]/20 text-[#94B4BC] rounded-xl transition-all border border-[#94B4BC]/20 active:scale-95"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* دار النشر */}
                <div className="space-y-1.5 group">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pr-1 group-focus-within:text-[#94B4BC] transition-colors">دار النشر</label>
                  <input 
                    name="publisher" 
                    value={formData.publisher} 
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-[#94B4BC]/10 focus:border-[#94B4BC] outline-none transition-all bg-slate-50/50 hover:bg-white text-black font-bold" 
                    placeholder="اسم دار النشر..." 
                  />
                </div>
                {/* مكان الطباعة */}
                <div className="space-y-1.5 group">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pr-1 group-focus-within:text-[#94B4BC] transition-colors">مكان الطباعة</label>
                  <input 
                    name="printPlace" 
                    value={formData.printPlace} 
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-[#94B4BC]/10 focus:border-[#94B4BC] outline-none transition-all bg-slate-50/50 hover:bg-white text-black font-bold" 
                    placeholder="اسم مكان الطباعة..." 
                  />
                </div>
              </div>

              {/* ملاحظات إضافية */}
              <div className="space-y-1.5 group">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pr-1 group-focus-within:text-[#94B4BC] transition-colors">ملاحظات إضافية</label>
                <textarea 
                  name="notes" 
                  value={formData.notes} 
                  onChange={handleChange}
                  rows={3} 
                  className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-[#94B4BC]/10 focus:border-[#94B4BC] outline-none transition-all bg-slate-50/50 hover:bg-white resize-none text-black font-medium" 
                  placeholder="أي معلومات أخرى تود إضافتها..." 
                />
              </div>
            </div>

            {/* الأزرار */}
            <div className="flex flex-col gap-3 pt-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  type="submit" 
                  className="flex-[2] bg-[#94B4BC] hover:bg-[#7da1aa] text-white py-4 rounded-2xl font-bold transition-all shadow-xl shadow-[#94B4BC]/10 hover:shadow-[#94B4BC]/30 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  {initialData ? 'تحديث البيانات' : 'حفظ الكتاب'}
                </button>
                
                {!initialData && (
                  <button 
                    type="button" 
                    onClick={handleSaveAndAddAnother}
                    className="flex-[2] bg-[#94B4BC]/10 text-[#94B4BC] hover:bg-[#94B4BC]/20 py-4 rounded-2xl font-bold transition-all border border-[#94B4BC]/20 flex items-center justify-center gap-2"
                  >
                    <CopyPlus size={18} />
                    <span>حفظ وإضافة آخر</span>
                  </button>
                )}
              </div>

              {/* زر الإلغاء */}
              <button 
                type="button" 
                onClick={onClose}
                className="w-full bg-slate-100 text-slate-500 hover:bg-slate-200 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 border border-slate-200/50"
              >
                <RotateCcw size={18} />
                <span>إلغاء الأمر</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookFormModal;
