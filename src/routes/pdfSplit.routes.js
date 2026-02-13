const express = require("express");
const multer = require("multer");
const { splitPdf } = require("../controllers/pdfSplit.controller");

const upload = multer({ dest: "/tmp/" });
const router = express.Router();

router.post("/", upload.single("pdf"), splitPdf);

module.exports = router;
