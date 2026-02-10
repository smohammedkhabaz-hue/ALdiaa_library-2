
import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Book } from '../types';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  bookTitle: string;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ isOpen, onClose, onConfirm, bookTitle }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" dir="rtl">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-red-950/20 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8 text-center">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <AlertTriangle size={40} />
          </div>
          
          <h3 className="text-2xl font-black text-slate-800 mb-3">تأكيد حذف الكتاب</h3>
          <p className="text-slate-500 leading-relaxed mb-8 font-medium">
            هل أنت متأكد من رغبتك في حذف كتاب <span className="text-red-500 font-bold">"{bookTitle}"</span>؟ 
            <br />
            <span className="text-sm opacity-75">هذا الإجراء لا يمكن التراجع عنه.</span>
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={onConfirm}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-red-200 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0"
            >
              <Trash2 size={20} />
              نعم، قم بالحذف الآن
            </button>
            <button
              onClick={onClose}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 py-4 rounded-2xl font-bold transition-all"
            >
              تراجع
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

export default DeleteConfirmModal;
