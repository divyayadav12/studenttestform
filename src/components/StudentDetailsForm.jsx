import React, { useState } from 'react';
import { User, Phone, Award, ArrowRight, Clock, ShieldAlert, AlertTriangle, CheckCircle2 } from 'lucide-react';

const ATTEMPT_OPTIONS = [
  "January 2027",
  "May 2027",
  "September 2027",
  "Other"
];

const SUBMITTED_PHONES_KEY = 'ca_final_submitted_phones_v1';

export default function StudentDetailsForm({ onStartTest, initialData }) {
  const [formData, setFormData] = useState(initialData || {
    studentName: '',
    phone: '',
    caAttempt: 'January 2027'
  });

  const [errors, setErrors] = useState({});
  const [isDuplicatePhone, setIsDuplicatePhone] = useState(false);

  // Check duplicate phone against local storage records
  const checkDuplicatePhone = (phoneVal) => {
    if (!phoneVal || !phoneVal.trim()) return false;
    try {
      const stored = localStorage.getItem(SUBMITTED_PHONES_KEY);
      const phoneList = stored ? JSON.parse(stored) : [];
      const cleanPhone = phoneVal.trim();
      return phoneList.some(p => p.trim() === cleanPhone);
    } catch (err) {
      console.error("Error reading submitted phones", err);
      return false;
    }
  };

  const validatePhoneFormat = (phone) => {
    return /^[6-9]\d{9}$/.test(phone.trim()) || /^\d{10}$/.test(phone.trim());
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...formData, [name]: value };
    setFormData(updatedForm);

    const newErrors = { ...errors };

    // Real-time phone validation
    if (name === 'phone') {
      const trimmedPhone = value.trim();
      if (!trimmedPhone) {
        newErrors.phone = "Mobile Number is required";
        setIsDuplicatePhone(false);
      } else if (!validatePhoneFormat(trimmedPhone)) {
        newErrors.phone = "Please enter a valid 10-digit mobile number";
        setIsDuplicatePhone(false);
      } else if (checkDuplicatePhone(trimmedPhone)) {
        newErrors.phone = "This mobile number is already registered! Multiple test attempts are not allowed.";
        setIsDuplicatePhone(true);
      } else {
        delete newErrors.phone;
        setIsDuplicatePhone(false);
      }
    } else {
      if (newErrors[name]) delete newErrors[name];
    }

    setErrors(newErrors);
  };

  const isFormValid = () => {
    return (
      formData.studentName.trim().length >= 2 &&
      validatePhoneFormat(formData.phone) &&
      !isDuplicatePhone &&
      formData.caAttempt
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.studentName.trim()) {
      newErrors.studentName = "Full name is required";
    }
    
    const trimmedPhone = formData.phone.trim();
    if (!trimmedPhone) {
      newErrors.phone = "Mobile number is required";
    } else if (!validatePhoneFormat(trimmedPhone)) {
      newErrors.phone = "Please enter a valid 10-digit mobile number";
    } else if (checkDuplicatePhone(trimmedPhone)) {
      newErrors.phone = "This mobile number is already registered! Multiple test attempts are not allowed.";
      setIsDuplicatePhone(true);
    }

    if (!formData.caAttempt) {
      newErrors.caAttempt = "Please select your CA Foundation Attempt";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onStartTest(formData);
  };

  const isPhoneValidAndFresh = formData.phone.trim() && validatePhoneFormat(formData.phone) && !isDuplicatePhone;

  return (
    <div className="max-w-2xl mx-auto my-6 sm:my-8 px-3 sm:px-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        {/* Card Header */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-900 text-white p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-700/40 rounded-full blur-2xl pointer-events-none"></div>
          <div className="relative z-10">
            <span className="inline-block bg-indigo-500/30 text-indigo-200 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-3 border border-indigo-400/20">
              Examination Portal
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              CA Foundation Online Test
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
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" /> {errors.studentName}
              </p>
            )}
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Mobile Number <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-5 h-5" />
              </div>
              <input
                type="tel"
                name="phone"
                maxLength={10}
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. 9876543210"
                className={`w-full pl-11 pr-10 py-3 rounded-xl border text-sm font-medium transition-all focus:outline-none focus:ring-2 ${
                  errors.phone || isDuplicatePhone
                    ? 'border-rose-300 bg-rose-50/30 focus:ring-rose-500 focus:border-rose-500'
                    : isPhoneValidAndFresh
                    ? 'border-emerald-300 bg-emerald-50/20 focus:ring-emerald-500 focus:border-emerald-500'
                    : 'border-slate-200 focus:ring-indigo-500 focus:border-indigo-500 hover:border-slate-300'
                }`}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                {isPhoneValidAndFresh && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                {(errors.phone || isDuplicatePhone) && <AlertTriangle className="w-5 h-5 text-rose-600" />}
              </div>
            </div>

            {/* Invalid or Duplicate Phone Alert Banner */}
            {isDuplicatePhone && (
              <div className="mt-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5 animate-bounce" />
                <div>
                  <p className="font-bold">⚠️ Already Registered Mobile Number</p>
                  <p className="mt-0.5">This mobile number (<span className="font-mono font-semibold underline">{formData.phone}</span>) has already completed the assessment. Duplicate submissions with the same mobile number are blocked.</p>
                </div>
              </div>
            )}

            {!isDuplicatePhone && errors.phone && (
              <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" /> {errors.phone}
              </p>
            )}
          </div>

          {/* CA Foundation Attempt Dropdown */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              CA Foundation Attempt <span className="text-rose-500">*</span>
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
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" /> {errors.caAttempt}
              </p>
            )}
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
                {isDuplicatePhone
                  ? '⚠️ Duplicate registration detected for this mobile number.'
                  : '* Complete all required fields with a valid 10-digit mobile number.'}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
