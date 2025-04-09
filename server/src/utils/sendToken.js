const sendToken = async (user, statusCode, message, res) => {
  const token = await user.generateToken();

  console.log("Token generated:", token);
  res
    .status(statusCode)
    .cookie("token", token, {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    })
    .json({
      success: true,
      message: message,
      token: token,
      user: user,
    });
};

module.exports = sendToken;
