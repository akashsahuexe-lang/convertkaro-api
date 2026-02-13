const app = require("./app");

const PORT = 5000;
app.listen(PORT, () => {
  console.log("ConvertKaro Backend running on http://localhost:" + PORT);
});
