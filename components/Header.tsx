
import React, { useState } from 'react';
import { Plus, User, LogOut, Cloud, CloudOff, LogIn } from 'lucide-react';
import { User as UserType } from '../types';

interface HeaderProps {
  onAddClick: () => void;
  onAuthClick: () => void;
  user: UserType | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAddClick, onAuthClick, user, onLogout }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

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
              {"YRARBIL AAIDLA".split('').map((char, index) => (
                <span key={index} className="flex-none">
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
          {/* User Section */}
          <div className="relative">
            {user ? (
              <div className="flex items-center gap-2">
                <div className="hidden md:flex flex-col items-end mr-1">
                  <span className="text-xs font-black text-slate-700 truncate max-w-[120px]">{user.name}</span>
                  <div className="flex items-center gap-1 text-[9px] text-green-500 font-bold">
                    <Cloud size={10} />
                    <span>مزامنة نشطة</span>
                  </div>
                </div>
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-[#94B4BC] transition-all overflow-hidden"
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <User size={20} />
                  )}
                </button>
                
                {/* Dropdown Menu */}
                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-50 py-2 z-20 animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-2 border-b border-slate-50 mb-1 md:hidden">
                         <p className="text-xs font-black text-slate-700 truncate">{user.name}</p>
                         <p className="text-[9px] text-slate-400 truncate">{user.email}</p>
                      </div>
                      <button 
                        onClick={() => { onLogout(); setShowUserMenu(false); }}
                        className="w-full px-4 py-2.5 text-right text-sm font-bold text-red-500 hover:bg-red-50 flex items-center gap-2 transition-colors"
                      >
                        <LogOut size={16} />
                        <span>تسجيل الخروج</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={onAuthClick}
                className="flex items-center gap-2 text-slate-500 hover:text-[#94B4BC] px-3 py-2 rounded-xl font-bold text-sm transition-all"
              >
                <LogIn size={18} />
                <span className="hidden sm:inline">تسجيل الدخول</span>
              </button>
            )}
          </div>

          <div className="w-px h-8 bg-slate-100 mx-1 hidden sm:block" />

          <button
            onClick={onAddClick}
            className="flex items-center gap-1.5 md:gap-2 bg-[#94B4BC] hover:bg-[#7da1aa] text-white px-4 py-2.5 md:px-7 md:py-3.5 rounded-xl md:rounded-2xl font-bold text-xs md:text-base transition-all shadow-lg shadow-[#94B4BC]/20 hover:shadow-[#94B4BC]/40 hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap"
          >
            <Plus size={18} className="md:w-5 md:h-5" />
            <span>إضافة كتاب جديد</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
