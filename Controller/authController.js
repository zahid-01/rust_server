const passport = require("passport");
const AppError = require("../Utils/appError");
const User = require("../Models/userModel");
const { catchAsync } = require("../Utils/catchAsync");
const {
  createToken,
  cookieOptions,
  extractCookieData,
} = require("../Utils/cookie");

exports.steamLogin = passport.authenticate("steam", (err, user, info) => {
  console.log("THIS IS USER", user);
});

exports.getLoginInfo = async (req, res) => {
  res.redirect("/");
};

exports.steamCallback = async (req, res) => {
  res.redirect("http://localhost:3000");
};

exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(new AppError(401, "Logout failed!"));
    }

    res.status(200).json({
      success: "True",
    });
  });
};

exports.getUser = catchAsync(async (req, res) => {
  const loggedInUser = req.user._json;
  const steamId = loggedInUser.steamid;

  let userId;
  const user = await User.findOne({ steamId });
  userId = user?.id;

  let newUser;

  //Save the user if its their first time to visit
  if (!user) {
    const userInfo = {
      steamId: loggedInUser.steamid,
      userName: loggedInUser.personaname,
      profileUrl: loggedInUser.profileurl,
      avatar: loggedInUser.avatarfull,
      avatarHash: loggedInUser.avatarhash,
      primaryClanId: loggedInUser.primaryclanid,
      communityVisibleState: loggedInUser.communityvisibilitystate,
    };

    newUser = await User.create(userInfo);
    userId = newUser.id;
  }

  const userCookie = createToken({ userId });

  res.cookie("JWT", userCookie, cookieOptions);

  res.json(req.user);
});

//This verifies the authenticity of a user for every protected route
exports.protect = catchAsync(async (req, res, next) => {
  if (!req.cookies.JWT) return next(new AppError(401, "Login to continue"));

  const { userId } = extractCookieData(req.cookies.JWT);

  const user = await User.findOne({ _id: userId });
  req.localUser = user;
  next();
});
