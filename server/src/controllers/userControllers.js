const User = require("../models/userModel");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "All fields (name, email, password) are required" });
    }
    console.log(req.body);

    // Basic email format validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({ message: "User already exists" });
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
    res.status(400).json({ message: error.message });
    next(error);
  }
};

module.exports = {
  registerUser,
};
