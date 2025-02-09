const User = require("../models/userModel");

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

module.exports = {
  registerUser,
  loginUser,
};
