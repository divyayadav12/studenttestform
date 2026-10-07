import React from 'react';
import { GraduationCap, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 text-white p-2 rounded-xl shadow-md shadow-indigo-200">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">
              CA Final Portal
            </h1>
            <p className="text-xs font-medium text-indigo-600 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 inline" /> Official Online Test Series
            </p>
          </div>
        </div>

        <div className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
          Student Assessment Form
        </div>
      </div>
    </header>
  );
}
