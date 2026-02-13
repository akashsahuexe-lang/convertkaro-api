const express = require("express");
const multer = require("multer");
const { mergePdf } = require("../controllers/pdfMerge.controller");

const upload = multer({ dest: "src/temp/" });
const router = express.Router();

router.post("/", upload.array("pdfs"), mergePdf);

module.exports = router;
