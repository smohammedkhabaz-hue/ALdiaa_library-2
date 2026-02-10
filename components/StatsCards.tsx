
import React, { useState, useEffect, useRef } from 'react';
import { Stats } from '../types';
import { BookCopy, Layers, Users } from 'lucide-react';

interface AnimatedNumberProps {
  value: number;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const prevValueRef = useRef(0);
  const duration = 1200; // مدة الحركة ١.٢ ثانية

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
      
      // دالة التخفيف لسلاسة الحركة
      const easeOutExpo = (x: number): number => {
        return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
      };

      const currentCount = Math.floor(prevValueRef.current + (value - prevValueRef.current) * easeOutExpo(progress));
      setDisplayValue(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
        prevValueRef.current = value;
        startTimeRef.current = null;
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  return <span>{displayValue.toLocaleString('ar-EG')}</span>;
};

interface StatsCardsProps {
  stats: Stats;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* إجمالي الكتب */}
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6 transition-all hover:shadow-md hover:-translate-y-1">
        <div className="w-16 h-16 bg-[#94B4BC]/10 text-[#94B4BC] rounded-2xl flex items-center justify-center shadow-sm">
          <BookCopy size={30} />
        </div>
        <div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">إجمالي الكتب</p>
          <p className="text-3xl font-black text-slate-800">
            <AnimatedNumber value={stats.totalBooks} />
          </p>
        </div>
      </div>

      {/* إجمالي المجلدات */}
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6 transition-all hover:shadow-md hover:-translate-y-1">
        <div className="w-16 h-16 bg-[#94B4BC]/10 text-[#94B4BC] rounded-2xl flex items-center justify-center shadow-sm">
          <Layers size={30} />
        </div>
        <div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">إجمالي المجلدات</p>
          <p className="text-3xl font-black text-slate-800">
            <AnimatedNumber value={stats.totalVolumes} />
          </p>
        </div>
      </div>

      {/* إجمالي المؤلفين */}
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6 transition-all hover:shadow-md hover:-translate-y-1">
        <div className="w-16 h-16 bg-[#94B4BC]/10 text-[#94B4BC] rounded-2xl flex items-center justify-center shadow-sm">
          <Users size={30} />
        </div>
        <div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">إجمالي المؤلفين</p>
          <p className="text-3xl font-black text-slate-800">
            <AnimatedNumber value={stats.totalAuthors} />
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
