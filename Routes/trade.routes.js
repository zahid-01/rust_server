const TradeRouter = require("express").Router();
const TradeOfferManager = require("steam-tradeoffer-manager");
const { createTradeOffer } = require("../Controller/trade.controller");

TradeRouter.post("/tradeOffer/:steamId", createTradeOffer);

module.exports = TradeRouter;
