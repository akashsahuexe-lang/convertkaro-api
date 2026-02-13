const fs = require("fs");
const path = require("path");
const archiver = require("archiver");
const { PDFDocument } = require("pdf-lib");

/**
 * Parse page ranges like:
 * "1-3,5,7-9"
 */
function parseRanges(ranges, totalPages) {
  if (!ranges || ranges === "all") {
    return Array.from({ length: totalPages }, (_, i) => [i, i]);
  }

  const result = [];
  const parts = ranges.split(",");

  for (let part of parts) {
    part = part.trim();

    if (part.includes("-")) {
      const [start, end] = part.split("-").map(n => parseInt(n, 10) - 1);
      if (
        Number.isInteger(start) &&
        Number.isInteger(end) &&
        start >= 0 &&
        end < totalPages &&
        start <= end
      ) {
        result.push([start, end]);
      }
    } else {
      const page = parseInt(part, 10) - 1;
      if (Number.isInteger(page) && page >= 0 && page < totalPages) {
        result.push([page, page]);
      }
    }
  }

  return result;
}

exports.splitPdfService = async (file, rangesInput) => {
  // 🔐 SAFE original file name
  const originalName = file && file.originalname
    ? path.parse(file.originalname).name
    : "split";

  // 🔥 MISSING PART FIX (IMPORTANT)
  const pdfBytes = fs.readFileSync(file.path);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const totalPages = pdfDoc.getPageCount();

  const ranges = parseRanges(rangesInput, totalPages);

  // ZIP path
  const zipPath = path.join(
    "src/temp",
    `${originalName}-split-${Date.now()}.zip`
  );

  const output = fs.createWriteStream(zipPath);
  const archive = archiver("zip", { zlib: { level: 9 } });

  archive.pipe(output);

  let count = 1;

  for (const [start, end] of ranges) {
    const newPdf = await PDFDocument.create();

    const pageIndexes = [];
    for (let i = start; i <= end; i++) {
      pageIndexes.push(i);
    }

    const pages = await newPdf.copyPages(pdfDoc, pageIndexes);
    pages.forEach(p => newPdf.addPage(p));

    const bytes = await newPdf.save();

    // ✅ Uint8Array → Buffer (CRITICAL)
    archive.append(
      Buffer.from(bytes),
      { name: `${originalName}-${count}.pdf` }
    );

    count++;
  }

  // Wait for ZIP to fully finish
  await new Promise((resolve, reject) => {
    output.on("close", resolve);
    archive.on("error", reject);
    archive.finalize();
  });

  // Cleanup uploaded PDF
  fs.unlinkSync(file.path);

  return zipPath;
};
