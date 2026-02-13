const express = require("express");
const multer = require("multer");
const { compressPdf } = require("../controllers/pdfCompress.controller");

const upload = multer({ dest: "src/temp/" });
const router = express.Router();

router.post("/", upload.single("pdf"), compressPdf);

module.exports = router;
