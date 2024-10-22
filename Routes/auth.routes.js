const passport = require("passport");

const {
  steamLogin,
  steamCallback,
  logout,
  getUser,
  getLoginInfo,
} = require("../Controller/authController");

const AuthRouter = require("express").Router();

AuthRouter.get("/login", steamLogin, getLoginInfo);

AuthRouter.get(
  "/steam/return",
  passport.authenticate("steam", { failureRedirect: "/" }),
  steamCallback
);
AuthRouter.post("/logout", logout);
AuthRouter.get("/user", getUser);

module.exports = AuthRouter;
