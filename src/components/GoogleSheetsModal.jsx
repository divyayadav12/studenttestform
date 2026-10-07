import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, Database, Key } from 'lucide-react';

export default function GoogleSheetsModal({ isOpen, onClose, scriptUrl, onSaveScriptUrl }) {
  const [urlInput, setUrlInput] = useState(scriptUrl || '');
  const [copiedCode, setCopiedCode] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const sampleAppsScript = `function setupSheetHeaders(sheet) {
  var headers = [
    "Student Name", "Email", "CA Final Attempt", "Exam Attempt Date",
    "Test Date", "Test Start Time", "Test End Time",
    "Question 1 Answer", "Question 2 Answer", "Question 3 Answer",
    "Question 4 Answer", "Question 5 Answer",
    "Correct Answers", "Wrong Answers", "Score", "Percentage",
    "Total Time Taken", "Status"
  ];
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground("#1E40AF");
    headerRange.setFontColor("#FFFFFF");
    headerRange.setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    setupSheetHeaders(sheet);
    var data = JSON.parse(e.postData.contents);
    sheet.appendRow([
      data.studentName || "", data.email || "", data.caAttempt || "", data.examAttemptDate || "",
      data.testDate || "", data.testStartTime || "", data.testEndTime || "",
      data.q1Answer || "Unanswered", data.q2Answer || "Unanswered", data.q3Answer || "Unanswered",
      data.q4Answer || "Unanswered", data.q5Answer || "Unanswered",
      data.correctAnswers || 0, data.wrongAnswers || 0, data.score || "0 / 5",
      (data.percentage || 0) + "%", data.totalTimeTaken || "0s", data.status || "Completed"
    ]);
    return ContentService.createTextOutput(JSON.stringify({ result: "success" })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ result: "error", error: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sampleAppsScript);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleSave = (e) => {
    e.preventDefault();
    onSaveScriptUrl(urlInput.trim());
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-lg">Google Sheets Backend Setup</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Instructions */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-xs sm:text-sm text-indigo-900 space-y-2">
            <p className="font-bold flex items-center gap-1.5 text-indigo-800">
              <Key className="w-4 h-4 text-indigo-600" />
              How to connect Google Sheets (3 Simple Steps):
            </p>
            <ol className="list-decimal pl-5 space-y-1.5 text-slate-700 font-medium">
              <li>Create a new Google Sheet at <a href="https://sheets.new" target="_blank" rel="noreferrer" className="text-indigo-600 underline font-bold inline-flex items-center gap-0.5">sheets.new <ExternalLink className="w-3 h-3" /></a></li>
              <li>Go to <strong>Extensions &gt; Apps Script</strong>, paste the script below, and click <strong>Deploy &gt; New deployment</strong>.</li>
              <li>Select <strong>Web App</strong>, set <strong>Execute as: Me</strong> and <strong>Who has access: Anyone</strong>. Deploy and paste the Web App URL below!</li>
            </ol>
          </div>

          {/* Web App URL Form */}
          <form onSubmit={handleSave} className="space-y-3">
            <label className="block text-sm font-bold text-slate-800">
              Google Apps Script Web App URL:
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://script.google.com/macros/s/.../exec"
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shrink-0 cursor-pointer"
              >
                {saveSuccess ? 'Saved!' : 'Save Link'}
              </button>
            </div>
            {saveSuccess && (
              <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <Check className="w-4 h-4" /> Endpoint URL updated successfully!
              </p>
            )}
          </form>

          {/* Copyable Script Preview */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Google Apps Script Code (Code.gs)
              </span>
              <button
                onClick={handleCopy}
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedCode ? 'Copied!' : 'Copy Code'}
              </button>
            </div>

            <pre className="bg-slate-900 text-slate-200 p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-48 border border-slate-800">
              <code>{sampleAppsScript}</code>
            </pre>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-sm rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
