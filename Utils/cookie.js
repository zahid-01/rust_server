const jwt = require("jsonwebtoken");

exports.cookieOptions = {
  expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  httpOnly: true,
  sameSite: "none",
  // secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  secure: true,
};

exports.createToken = (data) => {
  const jwtOptions = {
    expiresIn: process.env.JWT_EXPIRY,
  };

  const token = jwt.sign(data, process.env.JWT_SECRET, jwtOptions);

  return token;
};

exports.extractCookieData = (cookie) => {
  const data = jwt.verify(cookie, process.env.JWT_SECRET);

  return data;
};
