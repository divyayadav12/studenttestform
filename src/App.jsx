import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import StudentDetailsForm from './components/StudentDetailsForm';
import TestQuestionCard from './components/TestQuestionCard';
import ResultCard from './components/ResultCard';
import GoogleSheetsModal from './components/GoogleSheetsModal';

import { TEST_QUESTIONS, DEFAULT_SCRIPT_URL } from './data/questions';

const STORAGE_KEY = 'ca_final_test_state_v1';
const SCRIPT_URL_KEY = 'ca_final_test_script_url_v1';

export default function App() {
  // Configured Script URL
  const [scriptUrl, setScriptUrl] = useState(() => {
    return localStorage.getItem(SCRIPT_URL_KEY) || DEFAULT_SCRIPT_URL;
  });

  // Main application state
  const [step, setStep] = useState('details'); // 'details' | 'test' | 'result'
  const [studentData, setStudentData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { 0: 'A', 1: 'B', ... }
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds per question
  
  // Timing data
  const [testStartTime, setTestStartTime] = useState(null);
  const [testEndTime, setTestEndTime] = useState(null);
  const [isTimeExpiredSubmission, setIsTimeExpiredSubmission] = useState(false);

  // Result state
  const [resultData, setResultData] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState('idle'); // 'idle' | 'sending' | 'success' | 'failed' | 'local_only'

  // Modal control
  const [isSheetsModalOpen, setIsSheetsModalOpen] = useState(false);

  // 1. Restore persistent state on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.submitted && parsed.resultData) {
          setStudentData(parsed.studentData);
          setAnswers(parsed.answers || {});
          setResultData(parsed.resultData);
          setSubmissionStatus(parsed.submissionStatus || 'success');
          setStep('result');
        } else if (parsed.step === 'test' && parsed.studentData) {
          setStudentData(parsed.studentData);
          setCurrentIndex(parsed.currentIndex || 0);
          setAnswers(parsed.answers || {});
          setTimeLeft(parsed.timeLeft || 60);
          setTestStartTime(parsed.testStartTime);
          setStep('test');
        }
      }
    } catch (e) {
      console.error("Failed to load saved state", e);
    }
  }, []);

  // 2. Persist ongoing test state to localStorage to handle refresh seamlessly
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

  // Handle saving new Google Apps Script URL
  const handleSaveScriptUrl = (newUrl) => {
    setScriptUrl(newUrl);
    localStorage.setItem(SCRIPT_URL_KEY, newUrl);
  };

  // Helper to send data to Google Apps Script
  const sendToGoogleSheets = async (payload) => {
    if (!scriptUrl || scriptUrl.includes('YOUR_DEPLOYED_SCRIPT_ID')) {
      setSubmissionStatus('failed');
      return false;
    }

    setSubmissionStatus('sending');
    try {
      // Send as POST JSON payload using mode 'no-cors' or standard text/plain to handle Google Apps Script CORS
      await fetch(scriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
      });

      setSubmissionStatus('success');
      return true;
    } catch (err) {
      console.error("Google Sheets POST Error:", err);
      setSubmissionStatus('failed');
      return false;
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

    // Calculate total time taken in format "X min Y sec"
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
    setTestEndTime(endTime);
    setIsTimeExpiredSubmission(expiredByTime);

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

    // Send payload to Google Apps Script
    const isSent = await sendToGoogleSheets(payload);
    const statusVal = isSent ? 'success' : 'failed';

    // Persist final submission state in localStorage to block retaking
    const finalSavedState = {
      step: 'result',
      studentData,
      answers,
      resultData: calculated,
      submitted: true,
      submissionStatus: statusVal
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

  // Retry submission if Google Sheets sync failed
  const handleRetrySubmission = async () => {
    if (!resultData || !studentData) return;
    const endTimeFormatted = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    const payload = {
      studentName: studentData.studentName,
      email: studentData.email,
      caAttempt: studentData.caAttempt,
      examAttemptDate: studentData.examAttemptDate,
      testDate: studentData.testDate || new Date().toISOString().split('T')[0],
      testStartTime: studentData.startTimeFormatted || '',
      testEndTime: endTimeFormatted,
      q1Answer: answers[0] || 'Unanswered',
      q2Answer: answers[1] || 'Unanswered',
      q3Answer: answers[2] || 'Unanswered',
      q4Answer: answers[3] || 'Unanswered',
      q5Answer: answers[4] || 'Unanswered',
      correctAnswers: resultData.correctAnswers,
      wrongAnswers: resultData.wrongAnswers,
      score: resultData.score,
      percentage: resultData.percentage,
      totalTimeTaken: resultData.totalTimeTaken,
      status: resultData.status
    };

    const success = await sendToGoogleSheets(payload);
    if (success) {
      const currentSaved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      currentSaved.submissionStatus = 'success';
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentSaved));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header Bar */}
      <Navbar
        onOpenSheetsConfig={() => setIsSheetsModalOpen(true)}
        scriptUrl={scriptUrl}
      />

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
            submissionStatus={submissionStatus}
            onRetrySubmission={handleRetrySubmission}
            scriptUrl={scriptUrl}
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

      {/* Google Sheets Setup Modal */}
      <GoogleSheetsModal
        isOpen={isSheetsModalOpen}
        onClose={() => setIsSheetsModalOpen(false)}
        scriptUrl={scriptUrl}
        onSaveScriptUrl={handleSaveScriptUrl}
      />
    </div>
  );
}
