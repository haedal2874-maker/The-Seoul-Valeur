const INQUIRY_SHEET = "문의접수";
const METRICS_SHEET = "주간지표";

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents || "{}");
    const expectedSecret = PropertiesService.getScriptProperties().getProperty("FORM_SHARED_SECRET");

    if (!expectedSecret || payload.secret !== expectedSecret) {
      return jsonResponse_({ ok: false, error: "unauthorized" });
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(INQUIRY_SHEET);
      if (!sheet) throw new Error("Missing inquiry sheet");

      const submissionId = safeCell_(payload.submissionId);
      const ids = sheet.getRange(2, 1, Math.max(sheet.getLastRow() - 1, 1), 1).getValues().flat();
      if (ids.includes(submissionId)) return jsonResponse_({ ok: true, duplicate: true });

      sheet.appendRow([
        submissionId,
        safeCell_(payload.receivedAt),
        "신규",
        safeCell_(payload.name),
        safeCell_(payload.contact),
        safeCell_(payload.travelTiming),
        safeCell_(payload.interest),
        safeCell_(payload.question),
        safeCell_(payload.sourceUrl),
        safeCell_(payload.utmSource),
        safeCell_(payload.utmMedium),
        safeCell_(payload.utmCampaign),
        "김영희",
        ""
      ]);
    } finally {
      lock.releaseLock();
    }

    return jsonResponse_({ ok: true });
  } catch (error) {
    console.error(error);
    return jsonResponse_({ ok: false, error: "internal_error" });
  }
}

function setupWorkbook() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const inquiryHeaders = [
    "제출 ID", "접수일시", "처리상태", "이름", "연락처", "여행시기", "관심분야",
    "문의내용", "유입페이지", "UTM Source", "UTM Medium", "UTM Campaign", "담당자", "상담결과"
  ];
  const metricHeaders = [
    "주차", "방문", "페이지뷰", "검색노출", "검색클릭", "검색 CTR", "CTA 클릭",
    "문의 수", "유효 문의 수", "방문 대비 문의율", "CTA 대비 문의완료율", "인기 콘텐츠",
    "주요 검색어", "성과 해석", "다음 주 개선안"
  ];

  setupSheet_(spreadsheet, INQUIRY_SHEET, inquiryHeaders);
  setupSheet_(spreadsheet, METRICS_SHEET, metricHeaders);
}

function setupSheet_(spreadsheet, name, headers) {
  const sheet = spreadsheet.getSheetByName(name) || spreadsheet.insertSheet(name);
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#111111").setFontColor("#ffffff");
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, headers.length);
}

function safeCell_(value) {
  const text = String(value == null ? "" : value).trim();
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function jsonResponse_(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}
