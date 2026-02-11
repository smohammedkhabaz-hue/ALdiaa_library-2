
import React from 'react';
import { AlertCircle, Copy, CheckCircle2, X } from 'lucide-react';

interface DuplicateWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  bookTitle: string;
}

const DuplicateWarningModal: React.FC<DuplicateWarningModalProps> = ({ isOpen, onClose, onConfirm, bookTitle }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" dir="rtl">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-amber-950/20 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 border-2 border-amber-100">
        <div className="p-8 text-center">
          <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-amber-100">
            <Copy size={40} />
          </div>
          
          <h3 className="text-2xl font-black text-slate-800 mb-3">تنبيه: كتاب مكرر!</h3>
          <p className="text-slate-500 leading-relaxed mb-8 font-medium">
            يوجد كتاب مسجل مسبقاً بنفس العنوان: <br />
            <span className="text-amber-600 font-bold text-lg block mt-2">"{bookTitle}"</span>
            <span className="text-sm opacity-75 block mt-2">هل تود إضافة نسخة أخرى من هذا الكتاب أم تود التراجع؟</span>
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={onConfirm}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-amber-200 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0"
            >
              <CheckCircle2 size={20} />
              إضافة على أي حال
            </button>
            <button
              onClick={onClose}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 py-4 rounded-2xl font-bold transition-all border border-slate-200"
            >
              تراجع وتعديل العنوان
            </button>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="absolute top-5 left-5 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default DuplicateWarningModal;
