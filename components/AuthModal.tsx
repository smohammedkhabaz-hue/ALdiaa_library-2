
import React, { useState } from 'react';
import { X, Mail, Lock, Chrome, ArrowRight, Loader2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, name: string) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'selection' | 'email'>('selection');

  if (!isOpen) return null;

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // محاكاة عملية تسجيل دخول
    setTimeout(() => {
      onLogin(email, email.split('@')[0]);
      setIsLoading(false);
      onClose();
    }, 1500);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      onLogin('user@gmail.com', 'مستخدم جوجل');
      setIsLoading(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300" dir="rtl">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8">
          <button onClick={onClose} className="absolute top-6 left-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all">
            <X size={20} />
          </button>

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#94B4BC]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="text-[#94B4BC]" size={32} />
            </div>
            <h3 className="text-2xl font-black text-slate-800">تسجيل الدخول</h3>
            <p className="text-slate-500 font-medium mt-1">لمزامنة كتبك عبر جميع أجهزتك</p>
          </div>

          {mode === 'selection' ? (
            <div className="space-y-4">
              <button 
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-100 hover:border-[#94B4BC] hover:bg-slate-50 py-4 rounded-2xl font-bold text-slate-700 transition-all group"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Chrome className="text-red-500 group-hover:scale-110 transition-transform" size={22} />}
                <span>الدخول بواسطة Google</span>
              </button>

              <button 
                onClick={() => setMode('email')}
                className="w-full flex items-center justify-center gap-3 bg-[#94B4BC] text-white py-4 rounded-2xl font-bold shadow-lg shadow-[#94B4BC]/20 hover:bg-[#7da1aa] transition-all"
              >
                <Mail size={20} />
                <span>البريد الإلكتروني</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 pr-1">البريد الإلكتروني</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-[#94B4BC]/10 focus:border-[#94B4BC] outline-none transition-all"
                  placeholder="name@example.com"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 pr-1">كلمة المرور</label>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-[#94B4BC]/10 focus:border-[#94B4BC] outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
              
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#94B4BC] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#7da1aa] transition-all disabled:opacity-70"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : <span>دخول الآن</span>}
              </button>

              <button 
                type="button"
                onClick={() => setMode('selection')}
                className="w-full text-slate-400 font-bold py-2 hover:text-[#94B4BC] transition-colors flex items-center justify-center gap-2"
              >
                <ArrowRight size={16} />
                <span>الرجوع للخيارات</span>
              </button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-slate-50 text-center">
            <p className="text-xs text-slate-400 font-medium">
              عند تسجيل الدخول، سيتم حفظ كتبك في سحابة الضياء تلقائياً.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
