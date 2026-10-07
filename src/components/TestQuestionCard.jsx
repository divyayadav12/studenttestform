import React, { useEffect } from 'react';
import { Clock, ArrowRight, CheckCircle2, AlertTriangle, BookOpen } from 'lucide-react';

export default function TestQuestionCard({
  questions,
  currentIndex,
  selectedAnswer,
  onSelectAnswer,
  timeLeft,
  setTimeLeft,
  onNextQuestion,
  onSubmitTest
}) {
  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const isLastQuestion = currentIndex === totalQuestions - 1;

  // Scroll to top immediately whenever current question changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [currentIndex]);

  // Countdown Timer Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto advance when time runs out
          if (isLastQuestion) {
            onSubmitTest(true); // triggered by timer expiry
          } else {
            onNextQuestion(true); // triggered by timer expiry
          }
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, isLastQuestion, setTimeLeft, onNextQuestion, onSubmitTest]);

  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isLowTime = timeLeft <= 15;

  return (
    <div className="max-w-3xl mx-auto my-4 sm:my-6 px-3 sm:px-4">
      {/* Header Bar: Prominent Timer & Question Tracker */}
      <div className="flex flex-col-reverse md:grid md:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
        
        {/* Progress Tracker Card */}
        <div className="md:col-span-2 bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              QUESTION {currentIndex + 1} OF {totalQuestions}
            </span>
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
              {currentQuestion.subject}
            </span>
          </div>

          {/* Progress Bar & Dots */}
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2">
              {Array.from({ length: totalQuestions }).map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? 'flex-1 bg-indigo-600'
                      : idx < currentIndex
                      ? 'w-4 sm:w-6 bg-emerald-500'
                      : 'w-4 sm:w-6 bg-slate-200'
                  }`}
                  title={`Question ${idx + 1}`}
                />
              ))}
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Progress: <span className="font-bold text-slate-700">{currentIndex + 1}</span> of {totalQuestions} answered
            </p>
          </div>
        </div>

        {/* Prominent Timer Card (Always visible on mobile top) */}
        <div
          className={`rounded-2xl p-4 sm:p-5 border shadow-sm transition-all duration-300 flex flex-col items-center justify-center text-center ${
            isLowTime
              ? 'bg-rose-50 border-rose-200 text-rose-900 animate-pulse-ring'
              : 'bg-indigo-900 border-indigo-800 text-white shadow-indigo-900/10'
          }`}
        >
          <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest opacity-90 mb-1">
            {isLowTime ? (
              <AlertTriangle className="w-4 h-4 text-rose-600 animate-bounce" />
            ) : (
              <Clock className="w-4 h-4 text-indigo-300" />
            )}
            Time Left
          </div>
          <div className={`text-4xl sm:text-5xl font-black tracking-tight font-mono ${
            isLowTime ? 'text-rose-600' : 'text-white'
          }`}>
            {formatTime(timeLeft)}
          </div>
          <p className="text-[11px] opacity-75 mt-0.5 sm:mt-1">
            1 min per question
          </p>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-4 sm:p-8">
          <h3 className="text-base sm:text-xl font-bold text-slate-900 leading-snug mb-5 sm:mb-6">
            <span className="text-indigo-600 mr-1.5">Q{currentIndex + 1}.</span>
            {currentQuestion.question}
          </h3>

          {/* Options List */}
          <div className="space-y-3">
            {currentQuestion.options.map((opt) => {
              const isSelected = selectedAnswer === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onSelectAnswer(opt.id)}
                  className={`w-full text-left p-3.5 sm:p-4 rounded-xl border-2 transition-all flex items-start gap-3 sm:gap-4 group cursor-pointer active:scale-[0.99] ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/60 shadow-md shadow-indigo-100'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 bg-white'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                    }`}
                  >
                    {opt.id}
                  </div>

                  <div className="flex-1 text-sm sm:text-base text-slate-800 font-medium leading-relaxed">
                    {opt.text}
                  </div>

                  <div className="shrink-0 mt-0.5">
                    {isSelected ? (
                      <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-slate-300 group-hover:border-slate-400" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Card Footer: Action Button */}
        <div className="bg-slate-50 border-t border-slate-100 px-4 sm:px-6 py-4 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            * Moving forward will submit your selection for this question.
          </span>

          <button
            type="button"
            onClick={() => {
              if (isLastQuestion) {
                onSubmitTest(false);
              } else {
                onNextQuestion(false);
              }
            }}
            className="w-full sm:w-auto ml-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm sm:text-base rounded-xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            <span>{isLastQuestion ? 'Submit Test' : 'Next Question'}</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
