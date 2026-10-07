import React from 'react';
import { GraduationCap, ShieldCheck, Database } from 'lucide-react';

export default function Navbar({ onOpenSheetsConfig, scriptUrl }) {
  const isConfigured = scriptUrl && !scriptUrl.includes('YOUR_DEPLOYED_SCRIPT_ID');

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
              <ShieldCheck className="w-3 h-3 inline" /> Official Online Test Series
            </p>
          </div>
        </div>

        {/* Google Sheets Config Button */}
        <button
          onClick={onOpenSheetsConfig}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
            isConfigured
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
              : 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100 animate-pulse'
          }`}
          title="Configure Google Sheets backend integration"
        >
          <Database className="w-4 h-4" />
          <span className="hidden sm:inline">
            {isConfigured ? 'Google Sheets Connected' : 'Connect Google Sheets'}
          </span>
          <span className="sm:hidden">
            {isConfigured ? 'Connected' : 'Setup Sheets'}
          </span>
        </button>
      </div>
    </header>
  );
}
