const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const { mergePdfs } = require("../utils/mergePdf.util");

const router = express.Router();

const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 50 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("ONLY_PDF"));
    }
    cb(null, true);
  }
});

router.post("/", upload.array("pdfs"), async (req, res) => {
  try {
    if (!req.files || req.files.length < 2) {
      return res.status(400).json({
        message: "Please upload at least 2 PDF files"
      });
    }

    const outputPath = path.join(
      __dirname,
      "../../uploads",
      `merged-${Date.now()}.pdf`
    );

    await mergePdfs(req.files, outputPath);

    // ✅ Force correct headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=merged.pdf"
    );

    const fileStream = fs.createReadStream(outputPath);

    fileStream.pipe(res);

    fileStream.on("end", () => {
      // cleanup after response fully sent
      req.files.forEach(f => {
        if (fs.existsSync(f.path)) fs.unlinkSync(f.path);
      });
      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    });

    fileStream.on("error", (err) => {
      console.error("Stream error:", err);
      res.status(500).end();
    });

  } catch (err) {
    console.error("Merge error:", err);

    if (err.message === "ONLY_PDF") {
      return res.status(400).json({
        message: "Please upload only PDF files"
      });
    }

    res.status(500).json({
      message: "Server error while merging PDFs"
    });
  }
});

module.exports = router;
