const fs = require("fs");

exports.deleteFiles = (files = []) => {
  files.forEach((file) => {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }
  });
};
