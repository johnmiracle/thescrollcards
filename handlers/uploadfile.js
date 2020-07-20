const multer = require("multer");
const uuid = require("uuid");
const path = require("path");

module.exports = multer({
  storage: multer.diskStorage({}),
  limits: { fileSize: 500000 },
  fileFilter: (req, file, callback) => {
    // 1. create a regEx to store allowed extensions

    const allowedExts = new RegExp("jpg|jpeg|png");
    // 2. check if extension of file uploaded is passed
    const extPassed = allowedExts.test(path.extname(file.originalname).toLowerCase());

    // 3. check if the mimeType is passed
    const mimeType = allowedExts.test(file.mimetype);

    // 4. check if both are passed
    if (extPassed && mimeType) {
      return callback(null, true);
    } else {
      return callback(
        {
          message: "That filetype isn't allowed!",
        },
        false
      );
    }
  },
});
