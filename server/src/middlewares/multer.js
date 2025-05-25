const multer = require("multer");
const path = require("path");

// Define storage configuration for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
<<<<<<< HEAD
    cb(null, "src/public/images"); // Save files in 'public/images'
=======
    cb(null, "src/public"); // Save files in 'src/public'
>>>>>>> c6812db3b179d448f336322f872876fbbe7125f1
  },
  filename: function (req, file, cb) {
    // Assuming req.user.name contains the user's name
    const userName = req.user.name.replace(/\s+/g, "-"); // Replace spaces with dashes

    // Get the current date in YYYYMMDD format
    const currentDate = new Date()
      .toISOString()
      .split("T")[0]
      .replace(/-/g, ""); // 'YYYYMMDD'

    // Extract the original file name and extension
    const originalFilename = path.parse(file.originalname).name; // Get filename without extension
    const extname = path.extname(file.originalname); // Get file extension

    // Generate the new filename: username-date-originalFilename.extension
    const newFileName = `${userName}-${currentDate}-${originalFilename}${extname}`;

    cb(null, newFileName); // Use the new filename
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB max file size
  },
  fileFilter: function (req, file, cb) {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(
        new apiError(400, "Only image files (JPEG, JPG, PNG, GIF) are allowed.")
      );
    }
  },
}).single("profileImage"); // We expect a single file with the field name 'profileImage'

module.exports = upload;

module.exports = upload;
