exports.sendErr = (err, req, res, next) => {
  const code = err.statusCode ? err.statusCode : 400;

  res.status(code).json({
    message: err.message,
    stack: err.stack,
  });
};
