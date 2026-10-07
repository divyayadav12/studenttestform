# CA Final Student Online Test Form

A modern, attractive, and responsive **CA Final Student Assessment Portal** built with React, Tailwind CSS, Google Apps Script, and Google Sheets.

Designed for simple, single-link public sharing with **no admin panel, no login required, and no dashboard**.

---

## 🌟 Key Features

1. **Student Details Page**:
   - Student Name
   - Email Address
   - CA Final Attempt (September 2026, January 2027, May 2027, September 2027, Other)
   - Exam Attempt Date
   - Validation prevents starting until all required fields are complete.

2. **5 MCQ Test Structure (Strict 1-Min per Question)**:
   - Exactly 5 CA Final questions.
   - Prominent countdown timer per question (`01:00` → `00:00`).
   - Auto-advance on timer expiration.
   - Forward-only navigation (students cannot return to previous questions).

3. **Instant Result Page**:
   - **Score**: X / 5 & Percentage (%)
   - **Correct / Wrong breakdown**
   - **Total Time Used** (e.g. 4 min 32 sec)
   - **Performance Message**:
     - 80%+ : *Excellent Performance!*
     - 60-79% : *Good Performance!*
     - 40-59% : *Needs Improvement*
     - Below 40% : *More Practice Required*

4. **Automatic Google Sheets Sync**:
   - Automatically appends student details, individual answers (Q1–Q5), total score, time taken, and completion status to Google Sheets via Google Apps Script Web App API.

5. **State Persistence & Anti-Cheating**:
   - Prevents duplicate submissions.
   - Browser refresh preserves active question and timer state.
   - Blocks restarting test once completed.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite)
- **Styling**: Tailwind CSS v4, Lucide Icons, Canvas Confetti
- **Backend / Storage**: Google Apps Script & Google Sheets

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build for production
npm run build
```

---

## 📊 Google Sheets Setup Guide

1. Create a new Google Sheet at [sheets.new](https://sheets.new).
2. Go to **Extensions > Apps Script**.
3. Copy all contents from [`google-apps-script/Code.gs`](./google-apps-script/Code.gs) and paste it into the editor.
4. Click **Deploy > New deployment**:
   - Select **Web app**.
   - **Execute as**: *Me*
   - **Who has access**: *Anyone*
5. Click **Deploy**, authorize access, and copy your **Web App URL**.
6. Paste your Web App URL into `DEFAULT_SCRIPT_URL` in [`src/data/questions.js`](./src/data/questions.js) or configure it live using the **"Connect Google Sheets"** button in the web interface header.
