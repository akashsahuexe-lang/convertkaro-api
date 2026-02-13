const express = require("express");
const multer = require("multer");
const { pdfToImage } = require("../controllers/pdfToImage.controller");

const router = express.Router();

const upload = multer({
  dest: "src/temp/",
});

router.post("/", upload.single("pdf"), pdfToImage);

module.exports = router;
