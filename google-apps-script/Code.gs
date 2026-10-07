/**
 * CA FOUNDATION STUDENT ONLINE TEST FORM - GOOGLE APPS SCRIPT BACKEND
 */

function setupSheetHeaders(sheet) {
  var headers = [
    "Student Name",
    "Mobile Number",
    "CA Foundation Attempt",
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

function isPhoneAlreadySubmitted(sheet, phone) {
  if (!phone) return false;
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return false;
  
  // Mobile Number is in Column B (index 2)
  var phoneValues = sheet.getRange(2, 2, lastRow - 1, 1).getValues();
  var targetPhone = phone.toString().trim();
  
  for (var i = 0; i < phoneValues.length; i++) {
    if (phoneValues[i][0] && phoneValues[i][0].toString().trim() === targetPhone) {
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

    var studentPhone = data.phone || data.mobile || data.email || "";

    // Prevent duplicate mobile number recording in Google Sheet
    if (studentPhone && isPhoneAlreadySubmitted(sheet, studentPhone)) {
      return ContentService
        .createTextOutput(JSON.stringify({ result: "duplicate", message: "Mobile number already registered in Google Sheet" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var row = [
      data.studentName || "",
      studentPhone,
      data.caAttempt || "",
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
    .createTextOutput(JSON.stringify({ result: "active", message: "CA Foundation Test Apps Script API Live" }))
    .setMimeType(ContentService.MimeType.JSON);
}
