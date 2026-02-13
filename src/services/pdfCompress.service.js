const fs = require("fs");
const path = require("path");
const { PDFDocument } = require("pdf-lib");

exports.compressPdfService = async (file, level = "medium") => {
  // ✅ original file name (without .pdf)
  const originalName = file && file.originalname
    ? path.parse(file.originalname).name
    : "file";

  const pdfBytes = fs.readFileSync(file.path);
  const pdfDoc = await PDFDocument.load(pdfBytes, {
    updateMetadata: false
  });

  // 🔹 mild compression (pdf-lib limit)
  const compressedBytes = await pdfDoc.save({
    useObjectStreams: true,
    compress: true
  });

  // ✅ FINAL output name
  const outputPath = path.join(
    "src/temp",
    `${originalName}_compressed.pdf`
  );

  fs.writeFileSync(outputPath, compressedBytes);

  // cleanup uploaded file
  fs.unlinkSync(file.path);

  return outputPath;
};
