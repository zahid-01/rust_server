const { protect } = require("../Controller/authController");
const {
  getUserGameHistory,
  setTradeUrl,
} = require("../Controller/user.controller");

const UserRouter = require("express").Router();

UserRouter.use(protect);

UserRouter.route("/").get(getUserGameHistory);
UserRouter.route("/trade").patch(setTradeUrl);

module.exports = UserRouter;
