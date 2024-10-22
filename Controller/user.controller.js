const Lobby = require("../Models/lobbyModel");
const User = require("../Models/userModel");
const AppError = require("../Utils/appError");
const { catchAsync } = require("../Utils/catchAsync");

const sendResponse = (res, statusCode, data) => {
  res.status(statusCode).json({
    data,
  });
};

exports.getUserGameHistory = catchAsync(async (req, res, next) => {
  const userGames = await Lobby.findOne({
    $or: [
      { lobbyCreator: req.localUser.id },
      { "opponentInfo.opponentId": req.localUser.id },
    ],
  });

  if (!userGames) return sendResponse(res, 404, { message: "No games found" });

  sendResponse(res, 200, {
    userGames,
  });
});

exports.setTradeUrl = catchAsync(async (req, res, next) => {
  const { tradeUri: steamTradeUrl } = req.body;

  if (!steamTradeUrl) return next(new AppError(401, "No trade url provided"));

  const tradeUrl = await User.findByIdAndUpdate(
    req.localUser.id,
    { steamTradeUrl },
    { new: true }
  );

  sendResponse(res, 200, { tradeUrl });
});

exports.getMe = catchAsync(async (req, res, next) => {});
