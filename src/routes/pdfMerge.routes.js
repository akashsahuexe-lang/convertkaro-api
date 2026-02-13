const express = require("express");
const multer = require("multer");
const { mergePdf } = require("../controllers/pdfMerge.controller");

const upload = multer({
  dest: "/tmp/",
});

const router = express.Router();

router.post("/", upload.array("pdfs"), mergePdf);

module.exports = router;
