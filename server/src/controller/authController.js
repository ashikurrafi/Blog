import bcrypt from "bcrypt";
import user from "../model/User.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { generateUserName } from "../utils/generateUserName.js";

export const signup = async (req, res) => {
  const { fullname, email, password } = req.body;

  try {
    if (fullname.length <= 0 || email.length <= 0 || password.length <= 0) {
      throw new Error(`all fields are required`);
    }

    const userAlreadyExists = await user.findOne({ email });

    if (userAlreadyExists) {
      return res.status(400).json({
        message: `User already exists.`,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 2);

    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // const users = new user({
    //   fullname,
    //   email,
    //   password: hashedPassword,
    //   verificationToken,
    //   verificationTokenExpiredAt: Date.now() + 24 * 60 * 60 * 1000, //24 hr
    // });

    const username = await generateUserName(email);

    const users = new user({
      personal_info: {
        fullname,
        email,
        password: hashedPassword,
        username: username,
      },
      verificationToken,
      verificationTokenExpiredAt: Date.now() + 24 * 60 * 60 * 1000, //24 hr
    });
    console.log(users);
    // await users.save();

    //JWT
    generateTokenAndSetCookie(res, users._id);

    res.status(201).json({
      success: true,
      message: `User created successfully`,
      user: {
        ...users._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(400).json({ success: `False`, error: error.message });
  }
};
