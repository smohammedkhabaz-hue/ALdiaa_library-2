
import React from 'react';
import { Search, BookOpen, User, Building2, MapPin, Glasses, UserCheck, X } from 'lucide-react';

interface SearchFilters {
  title: string;
  author: string;
  publisher: string;
  printPlace: string;
  editor: string;
  course: string;
}

interface SearchBarProps {
  filters: SearchFilters;
  onFilterChange: (key: keyof SearchFilters, value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ filters, onFilterChange }) => {
  const renderSearchInput = (id: keyof SearchFilters, label: string, placeholder: string, Icon: any) => (
    <div className="space-y-2 group">
      <label className="text-xs font-bold text-slate-400 pr-1 group-focus-within:text-[#94B4BC] transition-colors flex items-center gap-1.5">
        <Icon size={12} />
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          value={filters[id]}
          onChange={(e) => onFilterChange(id, e.target.value)}
          className="w-full h-12 px-4 pl-10 rounded-xl border border-slate-200 focus:ring-4 focus:ring-[#94B4BC]/10 focus:border-[#94B4BC] transition-all outline-none bg-slate-50/50 text-slate-700 font-medium placeholder:text-slate-300"
        />
        {filters[id] && (
          <button
            onClick={() => onFilterChange(id, '')}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-1 text-slate-300 hover:text-red-400 transition-colors"
            title="إلغاء"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-lg bg-[#94B4BC]/10 flex items-center justify-center text-[#94B4BC]">
          <Search size={16} />
        </div>
        <h3 className="text-lg font-bold text-slate-700">البحث في المكتبة</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {renderSearchInput('title', 'عنوان الكتاب', 'ابحث بالعنوان...', BookOpen)}
        {renderSearchInput('author', 'اسم المؤلف', 'ابحث بالمؤلف...', User)}
        {renderSearchInput('editor', 'اسم المحقق', 'ابحث بالمحقق...', Glasses)}
        {renderSearchInput('course', 'المقرر', 'ابحث بالمقرر...', UserCheck)}
        {renderSearchInput('publisher', 'دار النشر', 'ابحث بالدار...', Building2)}
        {renderSearchInput('printPlace', 'مكان الطباعة', 'ابحث بالمكان...', MapPin)}
      </div>
      
      {(filters.title || filters.author || filters.publisher || filters.printPlace || filters.editor || filters.course) && (
        <div className="flex justify-start">
          <button 
            onClick={() => {
              onFilterChange('title', '');
              onFilterChange('author', '');
              onFilterChange('publisher', '');
              onFilterChange('printPlace', '');
              onFilterChange('editor', '');
              onFilterChange('course', '');
            }}
            className="text-xs font-bold text-[#94B4BC] hover:text-red-500 transition-colors underline underline-offset-4"
          >
            إلغاء كافة عمليات البحث
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
