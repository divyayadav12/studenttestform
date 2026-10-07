import React, { useState } from 'react';
import { User, Mail, Calendar, Award, ArrowRight, Clock, ShieldAlert } from 'lucide-react';

const ATTEMPT_OPTIONS = [
  "September 2026",
  "January 2027",
  "May 2027",
  "September 2027",
  "Other"
];

export default function StudentDetailsForm({ onStartTest, initialData }) {
  const [formData, setFormData] = useState(initialData || {
    studentName: '',
    email: '',
    caAttempt: 'September 2026',
    examAttemptDate: ''
  });

  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Real-time error clearing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const isFormValid = () => {
    return (
      formData.studentName.trim().length >= 2 &&
      validateEmail(formData.email) &&
      formData.caAttempt &&
      formData.examAttemptDate
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.studentName.trim()) {
      newErrors.studentName = "Full name is required";
    }
    if (!formData.email.trim() || !validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.caAttempt) {
      newErrors.caAttempt = "Please select your CA Final Attempt";
    }
    if (!formData.examAttemptDate) {
      newErrors.examAttemptDate = "Please pick your Exam Attempt Date";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onStartTest(formData);
  };

  return (
    <div className="max-w-2xl mx-auto my-8 px-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        {/* Card Header */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-900 text-white p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-700/40 rounded-full blur-2xl pointer-events-none"></div>
          <div className="relative z-10">
            <span className="inline-block bg-indigo-500/30 text-indigo-200 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-3 border border-indigo-400/20">
              Examination Portal
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              CA Final Online Test
            </h2>
            <p className="mt-2 text-indigo-100 text-sm sm:text-base font-normal">
              Please enter your details before starting the test.
            </p>
          </div>
        </div>

        {/* Test Guidelines Banner */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-start gap-3 text-xs sm:text-sm text-slate-600">
          <Clock className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-800">Test Rules:</span> 5 MCQs total. Each question has a strict <span className="font-semibold text-indigo-600">1-minute timer</span> (5 mins total). Once time expires or you click Next, you cannot return to previous questions.
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* Student Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Student Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-5 h-5" />
              </div>
              <input
                type="text"
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
                placeholder="e.g. Rahul Sharma"
                className={`w-full pl-11 pr-4 py-3 rounded-xl border text-sm font-medium transition-all focus:outline-none focus:ring-2 ${
                  errors.studentName
                    ? 'border-rose-300 bg-rose-50/30 focus:ring-rose-500 focus:border-rose-500'
                    : 'border-slate-200 focus:ring-indigo-500 focus:border-indigo-500 hover:border-slate-300'
                }`}
              />
            </div>
            {errors.studentName && (
              <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
                <ShieldAlert className="w-3.5 h-3.5" /> {errors.studentName}
              </p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="rahul.sharma@example.com"
                className={`w-full pl-11 pr-4 py-3 rounded-xl border text-sm font-medium transition-all focus:outline-none focus:ring-2 ${
                  errors.email
                    ? 'border-rose-300 bg-rose-50/30 focus:ring-rose-500 focus:border-rose-500'
                    : 'border-slate-200 focus:ring-indigo-500 focus:border-indigo-500 hover:border-slate-300'
                }`}
              />
            </div>
            {errors.email && (
              <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
                <ShieldAlert className="w-3.5 h-3.5" /> {errors.email}
              </p>
            )}
          </div>

          {/* Grid for Attempt Dropdown & Date Picker */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* CA Final Attempt */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                CA Final Attempt <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Award className="w-5 h-5" />
                </div>
                <select
                  name="caAttempt"
                  value={formData.caAttempt}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border text-sm font-medium transition-all focus:outline-none focus:ring-2 bg-white ${
                    errors.caAttempt
                      ? 'border-rose-300 bg-rose-50/30 focus:ring-rose-500 focus:border-rose-500'
                      : 'border-slate-200 focus:ring-indigo-500 focus:border-indigo-500 hover:border-slate-300'
                  }`}
                >
                  {ATTEMPT_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              {errors.caAttempt && (
                <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
                  <ShieldAlert className="w-3.5 h-3.5" /> {errors.caAttempt}
                </p>
              )}
            </div>

            {/* Exam Attempt Date */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Exam Attempt Date <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Calendar className="w-5 h-5" />
                </div>
                <input
                  type="date"
                  name="examAttemptDate"
                  value={formData.examAttemptDate}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border text-sm font-medium transition-all focus:outline-none focus:ring-2 bg-white ${
                    errors.examAttemptDate
                      ? 'border-rose-300 bg-rose-50/30 focus:ring-rose-500 focus:border-rose-500'
                      : 'border-slate-200 focus:ring-indigo-500 focus:border-indigo-500 hover:border-slate-300'
                  }`}
                />
              </div>
              {errors.examAttemptDate && (
                <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
                  <ShieldAlert className="w-3.5 h-3.5" /> {errors.examAttemptDate}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={!isFormValid()}
              className={`w-full py-4 px-6 rounded-xl font-bold text-base shadow-lg transition-all flex items-center justify-center gap-2 ${
                isFormValid()
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 hover:shadow-indigo-300 cursor-pointer active:scale-[0.99]'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              <span>Start Test</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            {!isFormValid() && (
              <p className="text-center text-xs text-slate-400 mt-2">
                * Complete all required fields above to unlock the test.
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
