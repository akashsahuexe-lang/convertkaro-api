const fs = require("fs");
const { mergePdfService } = require("../services/pdfMerge.service");

exports.mergePdf = async (req, res) => {
  try {
    if (!req.files || req.files.length < 2) {
      return res.status(400).json({ error: "Minimum 2 PDFs required" });
    }

    const mergedFilePath = await mergePdfService(req.files);

    res.download(mergedFilePath, () => {
      if (fs.existsSync(mergedFilePath)) {
        fs.unlinkSync(mergedFilePath);
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "PDF merge failed" });
  }
};
