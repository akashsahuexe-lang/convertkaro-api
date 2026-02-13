const express = require("express");
const multer = require("multer");
const { pdfToImage } = require("../controllers/pdfToImage.controller");

const router = express.Router();

const upload = multer({
  dest: "/tmp/",});

router.post("/", upload.single("pdf"), pdfToImage);

module.exports = router;
