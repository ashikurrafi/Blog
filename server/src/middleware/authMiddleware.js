import jwt from 'jsonwebtoken';
import apiError from '../errors/apiError.js';
import asyncHandler from '../errors/asyncHandler.js';
import userModel from '../models/userModel.js';

const authenticate = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    throw new apiError(401, 'No token, authorization denied');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await userModel
      .findById(decoded.userId)
      .select('_id name email role');

    if (!user) {
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      });
      throw new apiError(401, 'User not found');
    }

    req.user = user;
    req.id = user._id;

    next();
  } catch (error) {
    throw new apiError(401, 'Token is not valid');
  }
});

export default authenticate;
