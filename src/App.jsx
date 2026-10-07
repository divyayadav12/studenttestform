import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import StudentDetailsForm from './components/StudentDetailsForm';
import TestQuestionCard from './components/TestQuestionCard';
import ResultCard from './components/ResultCard';

import { TEST_QUESTIONS, DEFAULT_SCRIPT_URL } from './data/questions';

const STORAGE_KEY = 'ca_final_test_state_v1';

export default function App() {
  const scriptUrl = DEFAULT_SCRIPT_URL;

  // Main application state
  const [step, setStep] = useState('details'); // 'details' | 'test' | 'result'
  const [studentData, setStudentData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { 0: 'A', 1: 'B', ... }
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds per question
  
  // Timing data
  const [testStartTime, setTestStartTime] = useState(null);
  const [resultData, setResultData] = useState(null);

  // 1. Restore persistent state on mount (only for mid-test progress)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Only restore if student was actively in the middle of a test
        if (parsed.step === 'test' && parsed.studentData && !parsed.submitted) {
          setStudentData(parsed.studentData);
          setCurrentIndex(parsed.currentIndex || 0);
          setAnswers(parsed.answers || {});
          setTimeLeft(parsed.timeLeft || 60);
          setTestStartTime(parsed.testStartTime);
          setStep('test');
        } else if (parsed.submitted) {
          // If test was already completed, clear transient state so page reopens at registration
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (e) {
      console.error("Failed to load saved state", e);
    }
  }, []);

  // 2. Scroll to top on step or question index change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [step, currentIndex]);

  // 3. Persist ongoing test state to localStorage to handle refresh seamlessly
  useEffect(() => {
    if (step === 'test' && studentData) {
      const stateToSave = {
        step: 'test',
        studentData,
        currentIndex,
        answers,
        timeLeft,
        testStartTime,
        submitted: false
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    }
  }, [step, studentData, currentIndex, answers, timeLeft, testStartTime]);

  // Silent background transmission to Google Sheets Apps Script API
  const sendToGoogleSheets = async (payload) => {
    if (!scriptUrl || scriptUrl.includes('YOUR_DEPLOYED_SCRIPT_ID')) {
      console.log("Apps Script Web App URL not configured");
      return;
    }

    try {
      const dataString = JSON.stringify(payload);
      
      // Send using fetch with mode 'no-cors' to prevent CORS preflight blocks
      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: dataString,
      });
    } catch (err) {
      console.error("Background Google Sheets push error:", err);
      // Fallback: sendBeacon
      try {
        if (navigator.sendBeacon) {
          const blob = new Blob([JSON.stringify(payload)], { type: 'text/plain;charset=utf-8' });
          navigator.sendBeacon(scriptUrl, blob);
        }
      } catch (e) {
        console.error("sendBeacon fallback error:", e);
      }
    }
  };

  // 3. Start Test action
  const handleStartTest = (details) => {
    const startTimeISO = new Date().toISOString();
    const startTimeFormatted = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const enrichedDetails = {
      ...details,
      startTimeISO,
      startTimeFormatted,
      testDate: new Date().toISOString().split('T')[0]
    };

    setStudentData(enrichedDetails);
    setTestStartTime(Date.now());
    setCurrentIndex(0);
    setAnswers({});
    setTimeLeft(60);
    setStep('test');
  };

  // Select Answer for current question
  const handleSelectAnswer = (optionId) => {
    setAnswers(prev => ({
      ...prev,
      [currentIndex]: optionId
    }));
  };

  // Calculate results and performance summary
  const calculateResult = useCallback((finalAnswers, startTime, endTime, expiredByTime) => {
    let correctCount = 0;
    TEST_QUESTIONS.forEach((q, index) => {
      if (finalAnswers[index] === q.correctAnswer) {
        correctCount++;
      }
    });

    const wrongCount = TEST_QUESTIONS.length - correctCount;
    const percentage = Math.round((correctCount / TEST_QUESTIONS.length) * 100);

    const totalMs = (endTime || Date.now()) - (startTime || Date.now());
    const totalSecs = Math.max(1, Math.floor(totalMs / 1000));
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    const totalTimeTaken = mins > 0 ? `${mins} min ${secs} sec` : `${secs} sec`;

    let performanceMessage = "";
    if (percentage >= 80) {
      performanceMessage = "Excellent Performance!";
    } else if (percentage >= 60) {
      performanceMessage = "Good Performance!";
    } else if (percentage >= 40) {
      performanceMessage = "Needs Improvement";
    } else {
      performanceMessage = "More Practice Required";
    }

    return {
      score: `${correctCount} / ${TEST_QUESTIONS.length}`,
      percentage,
      correctAnswers: correctCount,
      wrongAnswers: wrongCount,
      totalTimeTaken,
      performanceMessage,
      status: expiredByTime ? 'Time Expired' : 'Completed'
    };
  }, []);

  // 4. Submit Complete Test action
  const handleFinalSubmit = useCallback(async (expiredByTime = false) => {
    const endTime = Date.now();

    const calculated = calculateResult(answers, testStartTime, endTime, expiredByTime);
    setResultData(calculated);
    setStep('result');

    // Build payload for Google Sheets
    const endTimeFormatted = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const payload = {
      studentName: studentData?.studentName || '',
      email: studentData?.email || '',
      caAttempt: studentData?.caAttempt || '',
      examAttemptDate: studentData?.examAttemptDate || '',
      testDate: studentData?.testDate || new Date().toISOString().split('T')[0],
      testStartTime: studentData?.startTimeFormatted || '',
      testEndTime: endTimeFormatted,
      q1Answer: answers[0] || 'Unanswered',
      q2Answer: answers[1] || 'Unanswered',
      q3Answer: answers[2] || 'Unanswered',
      q4Answer: answers[3] || 'Unanswered',
      q5Answer: answers[4] || 'Unanswered',
      correctAnswers: calculated.correctAnswers,
      wrongAnswers: calculated.wrongAnswers,
      score: calculated.score,
      percentage: calculated.percentage,
      totalTimeTaken: calculated.totalTimeTaken,
      status: calculated.status
    };

    // Silent background transmission to Google Sheets
    sendToGoogleSheets(payload);

    // Save submitted email to local list of registered emails to prevent re-registration
    if (studentData?.email) {
      try {
        const SUBMITTED_EMAILS_KEY = 'ca_final_submitted_emails_v1';
        const existing = localStorage.getItem(SUBMITTED_EMAILS_KEY);
        const emailList = existing ? JSON.parse(existing) : [];
        const cleanEmail = studentData.email.trim().toLowerCase();
        if (!emailList.includes(cleanEmail)) {
          emailList.push(cleanEmail);
          localStorage.setItem(SUBMITTED_EMAILS_KEY, JSON.stringify(emailList));
        }
      } catch (err) {
        console.error("Error saving submitted email", err);
      }
    }

    // Persist final submission state in localStorage to block retaking
    const finalSavedState = {
      step: 'result',
      studentData,
      answers,
      resultData: calculated,
      submitted: true
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(finalSavedState));
  }, [answers, testStartTime, studentData, calculateResult, scriptUrl]);

  // Move to next question
  const handleNextQuestion = (expiredByTime = false) => {
    if (currentIndex < TEST_QUESTIONS.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setTimeLeft(60); // Reset 1-min timer for next question
    } else {
      handleFinalSubmit(expiredByTime);
    }
  };

  // Reset state to allow a new candidate registration
  const handleStartNewTest = () => {
    localStorage.removeItem(STORAGE_KEY);
    setStudentData(null);
    setAnswers({});
    setResultData(null);
    setCurrentIndex(0);
    setTimeLeft(60);
    setStep('details');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header Bar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 pb-12">
        {step === 'details' && (
          <StudentDetailsForm
            onStartTest={handleStartTest}
            initialData={studentData}
          />
        )}

        {step === 'test' && (
          <TestQuestionCard
            questions={TEST_QUESTIONS}
            currentIndex={currentIndex}
            selectedAnswer={answers[currentIndex] || ''}
            onSelectAnswer={handleSelectAnswer}
            timeLeft={timeLeft}
            setTimeLeft={setTimeLeft}
            onNextQuestion={handleNextQuestion}
            onSubmitTest={handleFinalSubmit}
          />
        )}

        {step === 'result' && resultData && (
          <ResultCard
            studentData={studentData}
            resultData={resultData}
            onStartNewTest={handleStartNewTest}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} CA Final Online Assessment System. All rights reserved.</p>
          <p className="font-medium text-slate-400">Single Public Student Link System</p>
        </div>
      </footer>
    </div>
  );
}
