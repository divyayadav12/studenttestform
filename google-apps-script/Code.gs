/**
 * CA FINAL STUDENT ONLINE TEST FORM - GOOGLE APPS SCRIPT BACKEND
 * 
 * SETUP INSTRUCTIONS:
 * 1. Open Google Sheets (https://sheets.new)
 * 2. Rename sheet to "Student Test Results" (optional)
 * 3. Go to Extensions -> Apps Script
 * 4. Replace all contents in Editor with this Code.gs script.
 * 5. Click "Deploy" -> "New Deployment"
 * 6. Select type: "Web app"
 * 7. Set Description: "CA Final Test Handler"
 * 8. Set Execute as: "Me"
 * 9. Set Who has access: "Anyone" (IMPORTANT!)
 * 10. Click "Deploy", authorize permissions, and copy the Web App URL.
 * 11. Paste the Web App URL into src/data/questions.js (or configure in the test form UI).
 */

function setupSheetHeaders(sheet) {
  var headers = [
    "Student Name",
    "Email",
    "CA Final Attempt",
    "Exam Attempt Date",
    "Test Date",
    "Test Start Time",
    "Test End Time",
    "Question 1 Answer",
    "Question 2 Answer",
    "Question 3 Answer",
    "Question 4 Answer",
    "Question 5 Answer",
    "Correct Answers",
    "Wrong Answers",
    "Score",
    "Percentage",
    "Total Time Taken",
    "Status"
  ];
  
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground("#1E40AF");
    headerRange.setFontColor("#FFFFFF");
    headerRange.setFontWeight("bold");
    headerRange.setHorizontalAlignment("center");
    sheet.setFrozenRows(1);
  }
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  // Wait up to 10 seconds for concurrent writes
  lock.tryLock(10000);

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    setupSheetHeaders(sheet);

    var data;
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      data = e.parameter;
    } else {
      throw new Error("No data received");
    }

    var row = [
      data.studentName || "",
      data.email || "",
      data.caAttempt || "",
      data.examAttemptDate || "",
      data.testDate || "",
      data.testStartTime || "",
      data.testEndTime || "",
      data.q1Answer || "Unanswered",
      data.q2Answer || "Unanswered",
      data.q3Answer || "Unanswered",
      data.q4Answer || "Unanswered",
      data.q5Answer || "Unanswered",
      data.correctAnswers || 0,
      data.wrongAnswers || 0,
      data.score || "0 / 5",
      (data.percentage || 0) + "%",
      data.totalTimeTaken || "0s",
      data.status || "Completed"
    ];

    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success", row: sheet.getLastRow() }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ result: "active", message: "CA Final Test Apps Script Backend API is live." }))
    .setMimeType(ContentService.MimeType.JSON);
}
