/**
 * CA FINAL STUDENT ONLINE TEST FORM - GOOGLE APPS SCRIPT BACKEND
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

function isEmailAlreadySubmitted(sheet, email) {
  if (!email) return false;
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return false;
  
  // Email is in Column B (index 2)
  var emailValues = sheet.getRange(2, 2, lastRow - 1, 1).getValues();
  var targetEmail = email.toString().trim().toLowerCase();
  
  for (var i = 0; i < emailValues.length; i++) {
    if (emailValues[i][0] && emailValues[i][0].toString().trim().toLowerCase() === targetEmail) {
      return true;
    }
  }
  return false;
}

function doPost(e) {
  var lock = LockService.getScriptLock();
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

    var studentEmail = data.email || "";

    // Prevent duplicate email recording in Google Sheet
    if (studentEmail && isEmailAlreadySubmitted(sheet, studentEmail)) {
      return ContentService
        .createTextOutput(JSON.stringify({ result: "duplicate", message: "Email already registered in Google Sheet" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var row = [
      data.studentName || "",
      studentEmail,
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
    .createTextOutput(JSON.stringify({ result: "active", message: "CA Final Test Apps Script API Live" }))
    .setMimeType(ContentService.MimeType.JSON);
}
