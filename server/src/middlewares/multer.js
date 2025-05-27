import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/public/images");
  },
  filename: function (req, file, cb) {
    if (!req.user || !req.user.name) {
      return cb(new Error("User is not authenticated or user name is missing"));
    }
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
    cb(null, newFileName);
  },
});

const upload = multer({ storage: storage });

export default upload;
