const mongoose = require("mongoose");

const gameResultSchema = mongoose.Schema(
  {
    winnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: [true, "User ID is required"],
    },
    winnerTradedItems: [
      {
        appid: {
          type: Number,
          required: [true, "No app Id found"],
        },
        contextid: {
          type: String,
          required: [true, "No context Id found"],
        },
        assetid: {
          type: String,
          required: [true, "No Asset Id found"],
        },
        avatarUri: {
          type: String,
          required: [true, "No avatar Url found"],
        },
        price: {
          type: Number,
          required: [true, "Price field not found"],
        },
      },
    ],
    winnerTotalDeposited: {
      type: Number,
      required: [true, "Provide winner deposited amount"],
    },
    winnerPick: {
      type: String,
      enum: ["heads", "tails"],
      required: [true, "Pick is required"],
    },
    winnerWinningChances: {
      type: Number,
      required: [true, "Winner Winning chances are required"],
    },
    looserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: [true, "User ID is required"],
    },
    looserTradedItems: [
      {
        appid: {
          type: Number,
          required: [true, "No app Id found"],
        },
        contextid: {
          type: String,
          required: [true, "No context Id found"],
        },
        assetid: {
          type: String,
          required: [true, "No Asset Id found"],
        },
        avatarUri: {
          type: String,
          required: [true, "No avatar Url found"],
        },
        price: {
          type: Number,
          required: [true, "Price field not found"],
        },
      },
    ],
    winnerTotalDeposited: {
      type: Number,
      required: [true, "Provide winner deposited amount"],
    },
    looserTotalDeposited: {
      type: Number,
      required: [true, "Provide looser deposited amount"],
    },
    looserPick: {
      type: String,
      enum: ["heads", "tails"],
      required: [true, "Pick is required"],
    },
    looserWinChances: {
      type: Number,
      //It is Looser win chances not looser lossing chances 😎
      required: [true, "Looser win chances are required"],
    },
    outcome: {
      type: String,
      enum: ["win", "lose"],
    },
  },
  { timestamps: true }
);

const GameResult = mongoose.model("GameResult", gameResultSchema);
module.exports = GameResult;
