const fs = require("fs");
const path = require("path");
const { compressPdfService } = require("../services/pdfCompress.service");

exports.compressPdf = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "PDF file required" });
    }

    const outputPath = await compressPdfService(req.file);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${path.basename(outputPath)}"`
    );

    res.download(outputPath, () => {
      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "PDF compression failed" });
  }
};
