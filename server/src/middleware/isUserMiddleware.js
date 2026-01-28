import apiError from '../errors/apiError.js';
import asyncHandler from '../errors/asyncHandler.js';

const isUser = asyncHandler(async (req, res, next) => {
  if (!req.user || req.user?.role !== 'user') {
    throw new apiError(403, 'Not authorized as an user');
  }
  next();
});

export default isUser;
