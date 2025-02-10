const fs = require("fs");
const path = require("path");

const fileRemover = (filename) => {
  const filePath = path.join(__dirname, "../uploads", filename);

  fs.unlink(filePath, function (err) {
    if (err && err.code == "ENOENT") {
      // file doesn't exist
      console.log(`File ${filename} doesn't exist, won't remove it.`);
    } else if (err) {
      console.log(err.message);
      console.log(`Error occurred while trying to remove file ${filename}`);
    } else {
      console.log(`removed ${filename}`);
    }
  });
};

module.exports = { fileRemover };
