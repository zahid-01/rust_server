const mongoose = require("mongoose");

const lobbySchema = mongoose.Schema(
  {
    lobbyActive: {
      type: Boolean,
      default: true,
    },
    lobbyCreator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: [true, "Provide the lobby owner"],
    },
    selectedCoin: {
      type: String,
      enum: ["redCoin", "blackCoin"],
    },
    creatorAmountInCents: {
      type: Number,
      required: true,
    },
    creatorItemsTraded: [
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
    winningChances: {
      type: Number,
      default: 50,
    },
    opponentInfo: {
      type: {
        opponentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users",
        },
        opponentAmountInCents: {
          type: Number,
          default: 0,
          required: [true, "Opponent amount not provided"],
        },
        opponentAllotedCoin: {
          type: String,
          enum: ["redCoin", "blackCoin"],
        },
        opponentItemsTraded: [
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
      },
      default: null,
    },
    winningCoin: {
      type: String,
      enum: ["redCoin", "blackCoin"],
    },
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
  },
  { timestamps: true }
);

const Lobby = mongoose.model("Lobby", lobbySchema);

module.exports = Lobby;
