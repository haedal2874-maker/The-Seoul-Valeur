import fs from "node:fs/promises";
import path from "node:path";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const outputDir = path.resolve("_artifacts");
await fs.mkdir(outputDir, { recursive: true });

const workbook = Workbook.create();
const inquiries = workbook.worksheets.add("문의접수");
const metrics = workbook.worksheets.add("주간지표");
const font = "Aptos";
const black = "#111111";
const ivory = "#F8F5F0";
const line = "#DED6C9";
const sage = "#DCE6D8";

const inquiryHeaders = [
  "제출 ID", "접수일시", "처리상태", "이름", "연락처", "여행시기", "관심분야",
  "문의내용", "유입페이지", "UTM Source", "UTM Medium", "UTM Campaign", "담당자", "상담결과"
];
const metricHeaders = [
  "주차", "방문", "페이지뷰", "검색노출", "검색클릭", "검색 CTR", "CTA 클릭",
  "문의 수", "유효 문의 수", "방문 대비 문의율", "CTA 대비 문의완료율", "인기 콘텐츠",
  "주요 검색어", "성과 해석", "다음 주 개선안"
];

inquiries.getRange("A1:N1").values = [inquiryHeaders];
metrics.getRange("A1:O1").values = [metricHeaders];

for (const [sheet, range] of [[inquiries, "A1:N1000"], [metrics, "A1:O53"]]) {
  sheet.showGridLines = false;
  sheet.getRange(range).format.font = { name: font, size: 10, color: black };
  sheet.getRange(range).format.verticalAlignment = "center";
  sheet.getRange(range).format.borders = { preset: "all", style: "thin", color: line };
  sheet.getRange(range).format.fill = ivory;
  sheet.freezePanes.freezeRows(1);
}

inquiries.getRange("A1:N1").format = {
  fill: black,
  font: { name: font, size: 10, bold: true, color: "#FFFFFF" },
  wrapText: true,
  rowHeightPx: 34
};
metrics.getRange("A1:O1").format = {
  fill: black,
  font: { name: font, size: 10, bold: true, color: "#FFFFFF" },
  wrapText: true,
  rowHeightPx: 34
};

inquiries.getRange("C2:C1000").dataValidation = {
  rule: { type: "list", values: ["신규", "검토중", "답변완료", "상담전환", "종료", "스팸"] }
};
inquiries.getRange("M2:M1000").dataValidation = {
  rule: { type: "list", values: ["김영희", "팀장", "박꼼꼼"] }
};
inquiries.getRange("B2:B1000").setNumberFormat("yyyy-mm-dd hh:mm");
inquiries.getRange("C2:C1000").conditionalFormats.add("cellIs", {
  operator: "equal",
  formula: '"상담전환"',
  format: { fill: sage, font: { bold: true, color: "#315B3A" } }
});

metrics.getRange("F2:F53").formulas = Array.from({ length: 52 }, (_, i) => [`=IFERROR(E${i + 2}/D${i + 2},0)`]);
metrics.getRange("J2:J53").formulas = Array.from({ length: 52 }, (_, i) => [`=IFERROR(H${i + 2}/B${i + 2},0)`]);
metrics.getRange("K2:K53").formulas = Array.from({ length: 52 }, (_, i) => [`=IFERROR(H${i + 2}/G${i + 2},0)`]);
metrics.getRange("F2:F53").setNumberFormat("0.0%");
metrics.getRange("J2:K53").setNumberFormat("0.0%");
metrics.getRange("A2:A53").setNumberFormat("yyyy-mm-dd");
metrics.getRange("B2:E53").setNumberFormat("#,##0");
metrics.getRange("G2:I53").setNumberFormat("#,##0");
metrics.getRange("A2:O53").format.wrapText = true;

const inquiryWidths = [170, 145, 90, 110, 180, 140, 160, 320, 260, 110, 110, 120, 90, 220];
inquiryWidths.forEach((width, index) => {
  inquiries.getRangeByIndexes(0, index, 1000, 1).format.columnWidthPx = width;
});
const metricWidths = [110, 75, 85, 90, 90, 85, 85, 75, 95, 120, 145, 240, 220, 260, 260];
metricWidths.forEach((width, index) => {
  metrics.getRangeByIndexes(0, index, 53, 1).format.columnWidthPx = width;
});

workbook.recalculate();
for (const sheetName of ["문의접수", "주간지표"]) {
  const preview = await workbook.render({ sheetName, range: sheetName === "문의접수" ? "A1:N8" : "A1:O8", scale: 1, format: "png" });
  await fs.writeFile(path.join(outputDir, `${sheetName}.png`), new Uint8Array(await preview.arrayBuffer()));
}

const inspect = await workbook.inspect({ kind: "sheet,formula", maxChars: 5000 });
await fs.writeFile(path.join(outputDir, "verification.txt"), inspect.ndjson, "utf8");

const file = await SpreadsheetFile.exportXlsx(workbook);
await file.save(path.join(outputDir, "The Seoul Valeur Website Intake.xlsx"));
