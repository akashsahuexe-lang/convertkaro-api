const express = require("express");
const cors = require("cors");

const mergePdfRoute = require("./routes/mergePdf.route");

const app = express();

// ✅ CORS – THIS WAS MISSING
app.use(cors());

// optional but safe
app.use(express.json());

app.use("/api/merge-pdf", mergePdfRoute);

app.get("/", (req, res) => {
  res.send("ConvertKaro backend is running 🚀");
});

module.exports = app;
