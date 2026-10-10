import React from 'react';
import { GraduationCap, ShieldCheck, Database } from 'lucide-react';

export default function Navbar({ onOpenAdmin }) {
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

        {/* View Saved Numbers Button */}
        <button
          onClick={onOpenAdmin}
          className="text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg border border-indigo-200 shrink-0 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
          title="View saved numbers and sync to Excel"
        >
          <Database className="w-3.5 h-3.5 text-indigo-600" />
          <span>Saved Numbers</span>
        </button>
      </div>
    </header>
  );
}

