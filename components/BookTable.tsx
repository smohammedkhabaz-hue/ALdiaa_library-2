
import React from 'react';
import { Book } from '../types';
import { Trash2, User, BookOpen, Building2, Info, Pencil, Glasses, MapPin, UserCheck } from 'lucide-react';

interface BookTableProps {
  books: Book[];
  onDelete: (id: string) => void;
  onEdit: (book: Book) => void;
}

const BookTable: React.FC<BookTableProps> = ({ books, onDelete, onEdit }) => {
  if (books.length === 0) {
    return (
      <div className="py-24 text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-slate-50 rounded-full mb-6">
          <BookOpen className="w-12 h-12 text-slate-200" />
        </div>
        <p className="text-xl text-slate-400 font-bold">المكتبة فارغة حالياً..</p>
        <p className="text-slate-300 mt-2">ابدأ بإضافة أول كتاب للمجموعة</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {books.map((book) => (
        <div 
          key={book.id} 
          className="group relative bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 p-7 flex flex-col h-full overflow-hidden text-right border-r-4 border-r-[#94B4BC]"
        >
          {/* Action Buttons */}
          <div className="absolute top-4 left-4 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => onEdit(book)}
              className="p-2.5 bg-white shadow-md text-slate-400 hover:text-[#94B4BC] rounded-xl transition-all border border-slate-50"
              title="تعديل"
            >
              <Pencil size={16} />
            </button>
            <button 
              onClick={() => onDelete(book.id)}
              className="p-2.5 bg-white shadow-md text-slate-400 hover:text-red-500 rounded-xl transition-all border border-slate-50"
              title="حذف"
            >
              <Trash2 size={16} />
            </button>
          </div>

          <div className="space-y-3.5">
            {/* العنوان */}
            <div className="flex items-start gap-3">
              <div className="mt-1 text-[#94B4BC]">
                <BookOpen size={18} />
              </div>
              <div>
                <span className="text-sm font-black text-slate-800 ml-1">العنوان:</span>
                <span className="text-lg font-bold text-[#94B4BC]">{book.title}</span>
              </div>
            </div>

            {/* المؤلف */}
            <div className="flex items-start gap-3">
              <div className="mt-1 text-slate-400">
                <User size={18} />
              </div>
              <div>
                <span className="text-sm font-black text-slate-800 ml-1">المؤلف:</span>
                <span className="text-sm font-bold text-slate-600">{book.author}</span>
              </div>
            </div>

            {/* المحقق */}
            <div className="flex items-start gap-3">
              <div className="mt-1 text-slate-400">
                <Glasses size={18} />
              </div>
              <div>
                <span className="text-sm font-black text-slate-800 ml-1">المحقق:</span>
                <span className="text-sm font-medium text-slate-600">{book.editor || '—'}</span>
              </div>
            </div>

            {/* المقرر */}
            <div className="flex items-start gap-3">
              <div className="mt-1 text-slate-400">
                <UserCheck size={18} />
              </div>
              <div>
                <span className="text-sm font-black text-slate-800 ml-1">المقرر:</span>
                <span className="text-sm font-medium text-slate-600">{book.course || '—'}</span>
              </div>
            </div>

            {/* دار النشر */}
            <div className="flex items-start gap-3">
              <div className="mt-1 text-slate-400">
                <Building2 size={18} />
              </div>
              <div>
                <span className="text-sm font-black text-slate-800 ml-1">دار النشر:</span>
                <span className="text-sm font-medium text-slate-600">{book.publisher || '—'}</span>
              </div>
            </div>

            {/* مكان الطباعة */}
            <div className="flex items-start gap-3">
              <div className="mt-1 text-slate-400">
                <MapPin size={18} />
              </div>
              <div>
                <span className="text-sm font-black text-slate-800 ml-1">مكان الطباعة:</span>
                <span className="text-sm font-medium text-slate-600">{book.printPlace || '—'}</span>
              </div>
            </div>

            {/* الأجزاء */}
            <div className="flex items-center gap-2 pt-2">
              <div className="h-px flex-1 bg-slate-50"></div>
              <span className="text-[10px] font-black text-[#94B4BC] bg-[#94B4BC]/5 px-3 py-1 rounded-full uppercase">
                {book.volumes.toLocaleString('ar-EG')} {book.volumes > 10 ? 'جزءاً' : 'أجزاء'}
              </span>
              <div className="h-px flex-1 bg-slate-50"></div>
            </div>

            {/* الملاحظات */}
            <div className="bg-slate-50 rounded-2xl p-4 mt-1">
              <div className="flex items-start gap-2 mb-1">
                <Info size={14} className="text-[#94B4BC] mt-0.5" />
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">الملاحظات:</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed italic line-clamp-2">
                {book.notes || 'لا توجد ملاحظات إضافية لهذا الكتاب.'}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookTable;
