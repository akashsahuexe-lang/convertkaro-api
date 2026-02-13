const fs = require("fs");
const path = require("path");
const { PDFDocument } = require("pdf-lib");

exports.mergePdfService = async (files) => {
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const pdfBytes = fs.readFileSync(file.path);
    const pdf = await PDFDocument.load(pdfBytes);
    const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    pages.forEach(page => mergedPdf.addPage(page));
  }

  const outputPath = path.join("/tmp", `merged-${Date.now()}.pdf`);
  const mergedPdfBytes = await mergedPdf.save();

  fs.writeFileSync(outputPath, mergedPdfBytes);

  // 🔥 cleanup input PDFs
  files.forEach(file => {
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
  });

  return outputPath;
};
