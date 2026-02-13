const fs = require("fs");
const { splitPdfService } = require("../services/pdfSplit.service");

exports.splitPdf = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "PDF file required" });
    }

    const ranges = req.body.ranges || "all";
    const zipPath = await splitPdfService(req.file, ranges);

    // 🔐 IMPORTANT HEADERS (Windows warning reduce karne ke liye)
    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${zipPath.split("/").pop()}"`
    );
    res.setHeader("X-Content-Type-Options", "nosniff");

    res.download(zipPath, (err) => {
      if (err) console.error(err);
      if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "PDF split failed" });
  }
};
