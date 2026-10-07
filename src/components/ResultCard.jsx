import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Mail,
  Calendar,
  Award,
  Sparkles,
  AlertCircle,
  RotateCcw
} from 'lucide-react';

export default function ResultCard({
  studentData,
  resultData,
  onStartNewTest
}) {
  const { score, percentage, correctAnswers, wrongAnswers, totalTimeTaken, performanceMessage } = resultData;

  useEffect(() => {
    if (percentage >= 80) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [percentage]);

  const getPerformanceBadgeColor = (pct) => {
    if (pct >= 80) return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    if (pct >= 60) return 'bg-blue-100 text-blue-800 border-blue-300';
    if (pct >= 40) return 'bg-amber-100 text-amber-800 border-amber-300';
    return 'bg-rose-100 text-rose-800 border-rose-300';
  };

  return (
    <div className="max-w-3xl mx-auto my-6 sm:my-8 px-3 sm:px-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        
        {/* Result Header */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-900 text-white p-6 sm:p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 border border-white/20 shadow-inner">
              <Trophy className="w-9 h-9 text-amber-300" />
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Test Completed!
            </h2>
            
            <div className={`mt-4 px-4 py-1.5 rounded-full text-sm font-bold border inline-flex items-center gap-1.5 shadow-sm ${getPerformanceBadgeColor(percentage)}`}>
              <Sparkles className="w-4 h-4" />
              {performanceMessage}
            </div>
          </div>
        </div>

        {/* Student Information Bar */}
        <div className="bg-slate-50 border-b border-slate-200 p-4 sm:p-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 sm:mb-4">
            Candidate Information
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
            <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200">
              <User className="w-5 h-5 text-indigo-600 shrink-0" />
              <div>
                <p className="text-xs text-slate-500 font-medium">Student Name</p>
                <p className="font-bold text-slate-800">{studentData.studentName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200">
              <Mail className="w-5 h-5 text-indigo-600 shrink-0" />
              <div className="overflow-hidden">
                <p className="text-xs text-slate-500 font-medium">Email Address</p>
                <p className="font-bold text-slate-800 truncate">{studentData.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200">
              <Award className="w-5 h-5 text-indigo-600 shrink-0" />
              <div>
                <p className="text-xs text-slate-500 font-medium">CA Foundation Attempt</p>
                <p className="font-bold text-slate-800">{studentData.caAttempt}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200">
              <Calendar className="w-5 h-5 text-indigo-600 shrink-0" />
              <div>
                <p className="text-xs text-slate-500 font-medium">Exam Attempt Date</p>
                <p className="font-bold text-slate-800">{studentData.examAttemptDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Score Grid */}
        <div className="p-4 sm:p-8">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 sm:mb-4">
            Test Performance Summary
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
            {/* Score */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 text-center">
              <p className="text-xs text-indigo-600 font-semibold uppercase tracking-wider">Your Score</p>
              <p className="text-2xl sm:text-3xl font-black text-indigo-900 mt-1">
                {score} <span className="text-sm font-normal text-indigo-600">/ 5</span>
              </p>
            </div>

            {/* Percentage */}
            <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4 text-center">
              <p className="text-xs text-purple-600 font-semibold uppercase tracking-wider">Percentage</p>
              <p className="text-2xl sm:text-3xl font-black text-purple-900 mt-1">
                {percentage}%
              </p>
            </div>

            {/* Correct */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-center">
              <div className="flex items-center justify-center gap-1 text-xs text-emerald-600 font-semibold uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5" /> Correct
              </div>
              <p className="text-2xl sm:text-3xl font-black text-emerald-900 mt-1">
                {correctAnswers}
              </p>
            </div>

            {/* Wrong */}
            <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 text-center">
              <div className="flex items-center justify-center gap-1 text-xs text-rose-600 font-semibold uppercase tracking-wider">
                <XCircle className="w-3.5 h-3.5" /> Wrong
              </div>
              <p className="text-2xl sm:text-3xl font-black text-rose-900 mt-1">
                {wrongAnswers}
              </p>
            </div>
          </div>

          {/* Time Taken Row */}
          <div className="bg-slate-100/70 rounded-xl p-4 flex items-center justify-between text-sm mb-6">
            <div className="flex items-center gap-2 text-slate-700 font-medium">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>Time Used:</span>
            </div>
            <span className="font-mono font-bold text-slate-900 text-base">{totalTimeTaken}</span>
          </div>

          {/* New Registration Button */}
          {onStartNewTest && (
            <div className="pt-2">
              <button
                type="button"
                onClick={onStartNewTest}
                className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm sm:text-base rounded-xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Register Another Candidate / Start New Test</span>
              </button>
            </div>
          )}
        </div>

        {/* Security Notice Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 text-center">
          <p className="text-xs text-slate-500 flex items-center justify-center gap-1 font-medium">
            <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
            Your test response has been recorded. Re-registration with the same email address is blocked.
          </p>
        </div>
      </div>
    </div>
  );
}
