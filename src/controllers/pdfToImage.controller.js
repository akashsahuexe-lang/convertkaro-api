const path = require("path");
const fs = require("fs");
const { pdfToImageService } = require("../services/pdfToImage.service");

exports.pdfToImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No PDF uploaded" });
    }

    const { format = "jpeg", dpi = 300 } = req.body;

    const imagePath = await pdfToImageService(
      req.file,
      format,
      null,
      dpi
    );

    const originalName = path.parse(req.file.originalname).name;

    let extension = "jpg";
    if (format === "png") extension = "png";
    if (format === "tiff-special") extension = "tif";

    const fileName = `${originalName}.${extension}`;

    res.download(imagePath, fileName, () => {

      // 🔥 AUTO DELETE TEMP FOLDER AFTER DOWNLOAD

      const folderPath = path.dirname(imagePath);

      fs.rm(folderPath, { recursive: true, force: true }, (err) => {
        if (err) {
          console.error("Temp cleanup failed:", err);
        } else {
          console.log("Temp files cleaned successfully.");
        }
      });

    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Conversion failed" });
  }
};
