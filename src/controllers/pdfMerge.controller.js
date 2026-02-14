const fs = require("fs");
const { mergePdfService } = require("../services/pdfMerge.service");

exports.mergePdf = async (req, res) => {
  try {
    if (!req.files || req.files.length < 2) {
      return res.status(400).json({ error: "Minimum 2 PDFs required" });
    }

   const mergedPdfBytes = await mergePdfService(req.files);

res.setHeader("Content-Type", "application/pdf");
res.setHeader("Content-Disposition", "attachment; filename=merged.pdf");
res.send(mergedPdfBytes);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "PDF merge failed" });
  }
};
