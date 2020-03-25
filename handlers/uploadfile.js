const multer = require("multer");
const uuid = require("uuid");
const path = require("path");

function uploadFile(req, details) {
  // set storage engine
  const storage = multer.diskStorage({
    destination: details.destination,
    filename: (req, file, callback) => {
      callback(null, `${details.filename || uuid.v4()}${path.extname(file.originalname)}`);
    }
  });

  // init upload
  const upload = multer({
    storage,
    limits: { fileSize: details.fileLimit },
    fileFilter: (req, file, callback) => {
      // 1. create a regEx to store allowed extensions

      const allowedExts = new RegExp(details.allowedExts);
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
            message: "That filetype isn't allowed!"
          },
          false
        );
      }
    }
  }).single(details.field);

  return upload;
}

module.exports = uploadFile;
