const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  steamId: {
    type: String,
    required: [true, "Provide the steam id"],
    unique: [true, "User exists"],
  },
  steamTradeUrl: {
    type: String,
    default: null,
  },
  userName: {
    type: String,
    required: [true, "Provide the steam id"],
    unique: [true, "User Name exists"],
  },
  profileUrl: {
    type: String,
    required: [true, "Profile URI missing"],
    unique: [true, "Profile exists exists"],
  },
  avatar: {
    type: String,
  },
  avatarHash: {
    type: String,
  },
  primaryClanId: {
    type: String,
  },
  communityVisibleState: {
    type: Number,
  },
});

const User = new mongoose.model("users", userSchema);
module.exports = User;
