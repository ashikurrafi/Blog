const errorResponserHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // In production, do not send stack trace
  const stack = process.env.NODE_ENV === "production" ? null : err.stack;

  return res.status(statusCode).json({
    message,
    stack,
  });
};

module.exports = { errorResponserHandler };
