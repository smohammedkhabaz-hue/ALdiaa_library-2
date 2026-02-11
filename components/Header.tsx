
import React, { useState } from 'react';
import { Plus, User, LogOut, Cloud, CloudOff, ChevronDown } from 'lucide-react';
import { User as UserType } from '../types';

interface HeaderProps {
  onAddClick: () => void;
  onAuthClick: () => void;
  user: UserType | null;
  onLogout: () => void;
  isSyncing: boolean;
}

const Header: React.FC<HeaderProps> = ({ onAddClick, onAuthClick, user, onLogout, isSyncing }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 md:h-24 flex items-center justify-between gap-4">
        
        {/* Logo Section */}
        <div className="flex items-center min-w-0 flex-shrink-0">
          <div className="inline-flex flex-col">
            <h1 className="text-xl md:text-2xl font-bold text-[#94B4BC] tracking-tight leading-none whitespace-nowrap mb-1">
              مكتبة الضياء
            </h1>
            <div className="flex justify-between w-full text-[6px] md:text-[8px] font-black text-slate-500 uppercase leading-none select-none tracking-tighter">
              {"YRARBYA AAYIHDLA".split('').map((char, index) => (
                <span key={index} className="flex-none">
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons & Profile */}
        <div className="flex items-center gap-3">
          <button
            onClick={onAddClick}
            className="flex items-center gap-1.5 md:gap-2 bg-[#94B4BC] hover:bg-[#7da1aa] text-white px-4 py-2.5 md:px-7 md:py-3.5 rounded-xl md:rounded-2xl font-bold text-xs md:text-base transition-all shadow-lg shadow-[#94B4BC]/20 hover:shadow-[#94B4BC]/40 hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap"
          >
            <Plus size={18} className="md:w-5 md:h-5" />
            <span className="hidden sm:inline">إضافة كتاب جديد</span>
            <span className="sm:hidden">إضافة</span>
          </button>

          <div className="h-10 w-px bg-slate-100 mx-1 hidden md:block"></div>

          {user ? (
            <div className="relative">
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 p-1.5 pr-3 rounded-2xl border border-slate-100 transition-all group"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">المستخدم المتصل</p>
                  <p className="text-sm font-bold text-slate-700 leading-none">{user.name}</p>
                </div>
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-[#94B4BC] relative">
                  <User size={20} />
                  {isSyncing ? (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                      <Cloud className="text-white w-2.5 h-2.5 animate-pulse" />
                    </div>
                  ) : (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                      <Cloud className="text-white w-2.5 h-2.5" />
                    </div>
                  )}
                </div>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)}></div>
                  <div className="absolute left-0 mt-3 w-56 bg-white rounded-3xl shadow-2xl border border-slate-100 p-2 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 border-b border-slate-50 mb-1">
                      <p className="text-xs font-bold text-slate-400 mb-1">البريد الإلكتروني</p>
                      <p className="text-sm font-bold text-slate-600 truncate">{user.email}</p>
                    </div>
                    <button 
                      onClick={() => { onLogout(); setShowDropdown(false); }}
                      className="w-full flex items-center gap-3 p-4 text-red-500 hover:bg-red-50 rounded-2xl transition-all font-bold"
                    >
                      <LogOut size={18} />
                      <span>تسجيل الخروج</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={onAuthClick}
              className="flex items-center gap-2 bg-white border-2 border-[#94B4BC] text-[#94B4BC] px-4 py-2.5 md:px-7 md:py-3 rounded-xl md:rounded-2xl font-bold text-xs md:text-base hover:bg-[#94B4BC] hover:text-white transition-all shadow-sm"
            >
              <User size={18} />
              <span>دخول</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;