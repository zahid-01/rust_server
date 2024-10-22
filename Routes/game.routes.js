const { protect } = require("../Controller/authController");
const {
  createLobby,
  getAllLobbies,
  joinGame,
} = require("../Controller/games.controller");

const GameRouter = require("express").Router();

GameRouter.use(protect);

GameRouter.route("/coinFlip")
  .post(createLobby)
  .get(getAllLobbies)
  .patch(joinGame);

module.exports = GameRouter;
