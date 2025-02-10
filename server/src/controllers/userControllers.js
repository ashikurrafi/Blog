const uploadPicture = require("../middlewares/uploadPictureMiddleware");
const User = require("../models/userModel");
const { fileRemover } = require("../utils/fileRemover");

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new Error("All fields (name, email, password) are required");
    }
    console.log(req.body);

    // Basic email format validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email");
    }

    const existUser = await User.findOne({ email });
    if (existUser) {
      throw new Error("User already exists");
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    console.log(user);

    return res.status(201).json({
      _id: user._id,
      avatar: user.avatar,
      name: user.name,
      email: user.email,
      verified: user.verified,
      super: user.super,
      admin: user.admin,
      token: await user.generateJWT(),
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new Error("All fields (email, password) are required");
    }

    // Basic email format validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    // Compare provided password with the hashed password in DB
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error("Invalid username or password");
    }

    // Generate JWT token after successful login
    const token = await user.generateJWT();

    return res.status(200).json({
      _id: user._id,
      avatar: user.avatar,
      name: user.name,
      email: user.email,
      verified: user.verified,
      super: user.super,
      admin: user.admin,
      token,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const userProfileByID = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      return res.status(201).json({
        _id: user._id,
        avatar: user.avatar,
        name: user.name,
        email: user.email,
        verified: user.verified,
        super: user.super,
        admin: user.admin,
      });
    } else {
      const error = new Error("User not found");
      error.statusCode = 404;
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new Error("User not found");
    }
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password && req.body.password.length < 8) {
      throw new Error("Password length must be at least 8 character");
    } else if (req.body.password) {
      user.password = req.body.password;
    }
    const updatedUserProfile = await user.save();
    res.json({
      _id: updatedUserProfile._id,
      avatar: updatedUserProfile.avatar,
      name: updatedUserProfile.name,
      email: updatedUserProfile.email,
      verified: updatedUserProfile.verified,
      super: updatedUserProfile.super,
      admin: updatedUserProfile.admin,
      token: await updatedUserProfile.generateJWT(),
    });
  } catch (error) {
    next(error);
  }
};

const updateProfilePicture = async (req, res, next) => {
  try {
    const upload = uploadPicture.single("profilePicture");
    upload(req, res, async function (err) {
      if (err) {
        const error = new Error(
          "An unknown error occurred when uploading " + err.message
        );
        next(error);
      } else {
        // every thing went well
        if (req.file) {
          const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            {
              avatar: req.file.filename,
            },
            { new: true }
          );
          res.json({
            _id: updatedUser._id,
            avatar: updatedUser.avatar,
            name: updatedUser.name,
            email: updatedUser.email,
            verified: updatedUser.verified,
            super: updatedUser.super,
            admin: updatedUser.admin,
            token: await updatedUser.generateJWT(),
          });
        } else {
          const updatedUser = await User.findById(req.user._id);
          const filename = updatedUser.avatar;
          updatedUser.avatar = "";
          await updatedUser.save();
          fileRemover(filename);
          res.json({
            _id: updatedUser._id,
            avatar: updatedUser.avatar,
            name: updatedUser.name,
            email: updatedUser.email,
            verified: updatedUser.verified,
            super: updatedUser.super,
            admin: updatedUser.admin,
            token: await updatedUser.generateJWT(),
          });
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  userProfileByID,
  updateUserProfile,
  updateProfilePicture,
};
