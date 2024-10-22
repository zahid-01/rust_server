exports.catchAsync = (fn) => async (req, res, next) =>
  fn(req, res, next).catch(next);
