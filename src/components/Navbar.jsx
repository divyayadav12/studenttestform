import React from 'react';
import { GraduationCap, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-4xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo & Brand */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="bg-indigo-600 text-white p-2 rounded-xl shadow-md shadow-indigo-200 shrink-0">
            <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-none mb-1">
              CA Foundation Portal
            </h1>
            <p className="text-[11px] sm:text-xs font-semibold text-indigo-600 flex items-center gap-1 leading-none">
              <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 inline shrink-0" />
              Official Online Test Series
            </p>
          </div>
        </div>

        {/* Badge hidden on mobile to prevent header squishing */}
        <div className="hidden sm:block text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 shrink-0">
          Student Assessment Form
        </div>
      </div>
    </header>
  );
}
