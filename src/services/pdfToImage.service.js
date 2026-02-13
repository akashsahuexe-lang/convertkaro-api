const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

exports.pdfToImageService = async (file, format, rangesInput, dpiInput) => {
  const originalName = path.parse(file.originalname).name;

  // 🔥 High quality base rasterization
  let rasterDPI = 600;

  const page = 1;

  const outputDir = path.join("src/temp", `${originalName}-${Date.now()}`);
  fs.mkdirSync(outputDir, { recursive: true });

  const outputPath = path.join(outputDir, `${originalName}`);

  let popplerFormat = "jpeg";

  if (format === "png") popplerFormat = "png";
  if (format === "tiff-special") popplerFormat = "tiff";

  // Step 1: Rasterize
  await new Promise((resolve, reject) => {
    exec(
      `pdftoppm -r ${rasterDPI} -f ${page} -l ${page} -${popplerFormat} "${file.path}" "${outputPath}"`,
      (error) => {
        if (error) reject(error);
        else resolve();
      }
    );
  });

  fs.unlinkSync(file.path);

  const generatedFiles = fs.readdirSync(outputDir);
  let imagePath = path.join(outputDir, generatedFiles[0]);

  // 🔥 TIFF SPECIAL PROCESSING
  if (format === "tiff-special") {

    // Step 2: Convert to CMYK
    await new Promise((resolve, reject) => {
      exec(
        `magick "${imagePath}" -colorspace CMYK "${imagePath}"`,
        (error) => {
          if (error) reject(error);
          else resolve();
        }
      );
    });

    // Step 3: Change DPI metadata to 72 WITHOUT resampling
    await new Promise((resolve, reject) => {
      exec(
        `magick "${imagePath}" -units PixelsPerInch -density 72 "${imagePath}"`,
        (error) => {
          if (error) reject(error);
          else resolve();
        }
      );
    });
  }

  return imagePath;
};
