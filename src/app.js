const express = require("express");
const cors = require("cors");

// Routes
const pdfMergeRoutes = require("./routes/pdfMerge.routes");
const pdfSplitRoutes = require("./routes/pdfSplit.routes");
const pdfCompressRoutes = require("./routes/pdfCompress.routes");
const pdfToImageRoutes = require("./routes/pdfToImage.routes");

const app = express();

// ✅ CORS MUST COME AFTER app initialization
app.use(cors({
  origin: "*",
  exposedHeaders: ["Content-Disposition"]
}));

app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("ConvertKaro Backend is running");
});

// Routes
app.use("/api/pdf/merge", pdfMergeRoutes);
app.use("/api/pdf/split", pdfSplitRoutes);
app.use("/api/pdf/compress", pdfCompressRoutes);
app.use("/api/pdf/to-image", pdfToImageRoutes);

module.exports = app;
