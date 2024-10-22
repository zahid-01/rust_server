const {
  getRustItems,
  getMyInventory,
} = require("../Controller/steam.controller");

const SteamRouter = require("express").Router();

// SteamRouter.get("/items/:hashName/appId", getRustItems);
SteamRouter.get("/steamInventory/:steam", getMyInventory);

module.exports = SteamRouter;
