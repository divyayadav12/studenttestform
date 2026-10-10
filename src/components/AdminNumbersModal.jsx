import React, { useState, useEffect } from 'react';
import { X, Phone, RefreshCw, Copy, Check, ShieldCheck, Database, AlertCircle } from 'lucide-react';

export default function AdminNumbersModal({ isOpen, onClose, scriptUrl }) {
  const [phones, setPhones] = useState([]);
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadLocalPhones();
      setSyncStatus(null);
      setCopied(false);
    }
  }, [isOpen]);

  const loadLocalPhones = () => {
    const list = new Set();
    try {
      // 1. Primary submitted phones list
      const rawList = localStorage.getItem('ca_final_submitted_phones_v1');
      if (rawList) {
        const parsed = JSON.parse(rawList);
        if (Array.isArray(parsed)) {
          parsed.forEach(p => p && list.add(String(p).trim()));
        }
      }

      // 2. Backup saved state
      const rawState = localStorage.getItem('ca_final_test_state_v1');
      if (rawState) {
        const parsedState = JSON.parse(rawState);
        if (parsedState?.studentData?.phone) {
          list.add(String(parsedState.studentData.phone).trim());
        }
      }
    } catch (e) {
      console.error("Error loading local phones:", e);
    }
    setPhones(Array.from(list));
  };

  const handleCopyAll = () => {
    if (phones.length === 0) return;
    const text = phones.join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSyncToSheets = async () => {
    if (phones.length === 0 || !scriptUrl) return;
    setSyncing(true);
    setSyncStatus("Syncing numbers to Google Sheets...");

    let successCount = 0;
    for (const phone of phones) {
      try {
        const payload = {
          studentName: 'Synced Student Record',
          phone: phone,
          mobile: phone,
          mobileNumber: phone,
          email: phone,
          caAttempt: 'May 2026 / Sept 2026',
          testDate: new Date().toISOString().split('T')[0],
          status: 'Manual Sync'
        };

        await fetch(scriptUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8',
          },
          body: JSON.stringify(payload),
        });
        successCount++;
      } catch (err) {
        console.error("Sync error for phone", phone, err);
      }
    }

    setSyncing(false);
    setSyncStatus(`✅ Sent ${phones.length} mobile number(s) to Google Sheets! Check your Excel Sheet now.`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl text-white">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Saved Student Numbers</h3>
              <p className="text-xs text-slate-400">Local Browser Storage & Excel Sync Manager</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {syncStatus && (
            <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-medium flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>{syncStatus}</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Numbers Found: <span className="text-indigo-600 font-extrabold text-sm">{phones.length}</span>
            </span>

            {phones.length > 0 && (
              <button
                onClick={handleCopyAll}
                className="text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                <span>{copied ? "Copied All!" : "Copy Numbers"}</span>
              </button>
            )}
          </div>

          {phones.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200">
              <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No Mobile Numbers Stored in This Browser</p>
              <p className="text-xs text-slate-500 mt-1">
                When students fill and submit the test form on their phones, their numbers automatically register here and send to Google Sheets.
              </p>
            </div>
          ) : (
            <div className="bg-slate-900 rounded-xl p-4 font-mono text-emerald-400 text-sm max-h-48 overflow-y-auto space-y-1.5 border border-slate-800">
              {phones.map((phone, idx) => (
                <div key={idx} className="flex items-center justify-between border-b border-slate-800/60 pb-1 last:border-none">
                  <span className="text-slate-400 text-xs">#{idx + 1}</span>
                  <span className="font-bold tracking-wider">{phone}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold"
          >
            Close
          </button>

          <button
            onClick={handleSyncToSheets}
            disabled={syncing || phones.length === 0}
            className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all ${
              syncing || phones.length === 0
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200 cursor-pointer active:scale-95'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? "Syncing..." : "Sync All to Google Sheet (Excel)"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
