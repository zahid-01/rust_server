const { default: axios } = require("axios");
const GameResult = require("../Models/gameResultModel");
const Lobby = require("../Models/lobbyModel");
const AppError = require("../Utils/appError");
const { catchAsync } = require("../Utils/catchAsync");
const { createToken, cookieOptions } = require("../Utils/cookie");

//================================================================================//

// const SteamUser = require("steam-user");
// const SteamTotp = require("steam-totp");
// const SteamCommunity = require("steamcommunity");
// const TradeOfferManager = require("steam-tradeoffer-manager");

// const client = new SteamUser();
// const community = new SteamCommunity();
// const manager = new TradeOfferManager({
//   steam: client,
//   community: community,
//   language: "en",
// });

// const logOnOptions = {
//   accountName: process.env.STEAM_ACCOUNT_NAME,
//   password: process.env.STEAM_PASSWORD,
//   twoFactorCode: SteamTotp.generateAuthCode(process.env.STEAM_SECRET),
// };

// client.logOn(logOnOptions);

// client.on("loggedOn", () => {
//   console.log("Logged into Steam!");
//   client.setPersona(SteamUser.EPersonaState.Online);
//   client.gamesPlayed([730]);
// });
// client.on("webSession", (sessionID, cookies) => {
//   console.log(cookies);
//   manager.setCookies(cookies);
//   community.setCookies(cookies);
//   console.log("Web session created. Ready to send trade offers.");
// });

function getTradeInfoFromURL(url) {
  const urlParams = new URLSearchParams(url.split("?")[1]);
  // const partner = urlParams.get("partner");
  const token = urlParams.get("token");

  return {
    // partnerSteamID: TradeOfferManager.getSteamID64(partner),
    tradeToken: token,
  };
}

function sendTradeOffer(itemsToSend, req) {
  console.log(itemsToSend);

  itemsToSend = itemsToSend.map((item) => ({
    appid: 252490,
    contextid: 2,
    assetid: item.assetid,
  }));

  const partnerTradeURL = req.localUser.steamTradeUrl;
  const partnerSteamID = req.localUser.steamId;
  const { tradeToken } = getTradeInfoFromURL(partnerTradeURL);
  console.log(tradeToken);

  const offer = manager.createOffer(partnerSteamID);

  // Add items to the trade offer
  offer.addMyItems(itemsToSend);

  // Set a message (optional)
  offer.setMessage("Coin Flip Game - Best of luck!");

  // Include the trade token (important if they are not your Steam friend)
  offer.setToken(tradeToken);

  // Send the offer
  offer.send((err, status) => {
    if (err) {
      console.error(`Error sending trade offer: ${err}`);
    } else {
      console.log(`Trade offer sent with status: ${status}`);
    }
  });
}

//================================================================================//

const coinFlip = async () => {
  const response = await axios.post(
    "https://api.random.org/json-rpc/4/invoke",
    {
      jsonrpc: "2.0",
      method: "generateIntegers",
      params: {
        apiKey: "fc3cdac4-41d2-436c-8aaa-fd7f32922617",
        n: 1,
        min: 0,
        max: 1,
      },
      id: 1,
    }
  );

  return response.data.result.random.data[0];
};

//Lobby Creation
exports.createLobby = catchAsync(async (req, res, next) => {
  const { userPick, items } = req.body;

  //Check if the user has already active lobby
  const activeLobby = await Lobby.findOne({
    lobbyCreator: req.localUser.id,
    lobbyActive: true,
  });

  if (activeLobby)
    return next(new AppError(422, "You already have an active lobby"));

  if (userPick !== "redCoin" && userPick !== "blackCoin")
    return next(new AppError(401, "Provide a valid coin selection."));

  const lobyData = {
    lobbyCreator: req.localUser.id,
    selectedCoin: userPick,
    creatorItemsTraded: items,
    creatorAmountInCents: 22,
  };

  await sendTradeOffer(items, req);

  const newLobby = await Lobby.create(lobyData);

  res.status(200).json({
    status: "Success",
    newLobby,
  });
});

//Get all active lobbies
exports.getAllLobbies = catchAsync(async (req, res, next) => {
  const activeLobbies = await Lobby.find({ lobbyActive: true }).populate({
    path: "lobbyCreator opponentInfo.opponentId",
    select:
      "-_id -steamId -profileUrl -avatarHash -primaryClanId -communityVisibleState -__v",
  });

  res.status(200).json({
    status: "Success",
    count: activeLobbies.length,
    activeLobbies,
  });
});

//JOIN game
exports.joinGame = catchAsync(async (req, res, next) => {
  const { lobbyId, items } = req.body;

  const lobby = await Lobby.findById(lobbyId);

  if (!lobby) return next(new AppError(404, "No such lobby found"));

  //Check if creator and user is same
  const userId = await lobby.lobbyCreator._id.toString();

  if (userId === req.localUser.id)
    return next(new AppError(422, "Its your own lobby"));

  if (lobby.opponentInfo)
    return next(new AppError(422, "Lobby not accepting trades!"));

  const { id: opponentId } = req.localUser;

  lobby.opponentInfo = {
    opponentId,
    opponentAmountInCents: 12,
    opponentAllotedCoin:
      lobby.selectedCoin === "redCoin" ? "blackCoin" : "redCoin",
    opponentItemsTraded: items,
  };

  const lobbyOwnerCoin = lobby.selectedCoin;
  const opponentAllotedCoin = lobby.opponentInfo.opponentAllotedCoin;

  const flipResult = await coinFlip();

  if (flipResult === 0) {
    lobby.winningCoin = lobbyOwnerCoin;
    lobby.winner = userId;
  } else if (flipResult === 1) {
    lobby.winningCoin = opponentAllotedCoin;
    lobby.winner = opponentId;
  }

  await lobby.save();

  res.status(200).json({
    status: "Success",
    message: "You successfully joined the game",
    flipping: "Flipping in 5.....4...3..2.1-----",
    flipResult,
  });
});
