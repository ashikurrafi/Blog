import apiError from '../errors/apiError.js';
import asyncHandler from '../errors/asyncHandler.js';

const isSuperUser = asyncHandler(async (req, res, next) => {
  if (!req.user || req.user?.role !== 'superuser') {
    throw new apiError(403, 'Not authorized as a superuser');
  }
  next();
});

export default isSuperUser;
