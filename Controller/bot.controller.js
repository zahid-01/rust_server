const SteamUser = require("steam-user");
const SteamTotp = require("steam-totp");
const SteamCommunity = require("steamcommunity");
const TradeOfferManager = require("steam-tradeoffer-manager");

const client = new SteamUser();
const community = new SteamCommunity();

exports.manager = new TradeOfferManager({
  steam: client,
  community: community,
  language: "en",
});

const logOnOptions = {
  accountName: process.env.STEAM_ACCOUNT_NAME,
  password: process.env.STEAM_PASSWORD,
  twoFactorCode: SteamTotp.generateAuthCode(process.env.STEAM_SECRET),
};

client.logOn(logOnOptions);

client.on("loggedOn", () => {
  console.log("Logged into Steam");
  client.setPersona(SteamUser.EPersonaState.Online);
});

let sessionCookies = [];
let sessionId = "";

client.on("webSession", (sessionID, cookies) => {
  // sessionCookies = cookies;
  // sessionId = sessionID;
  console.log("COKIES ARE HERE ", cookies);
  manager.setCookies(cookies);
  community.setCookies(cookies);
  console.log("Web session established and cookies set");
});

// manager.on("newOffer", (offer) => {
//   console.log(
//     `Received a new trade offer from ${offer.partner.getSteamID64()}`
//   );
//   offer.getUserDetails((err, me, them) => {
//     if (err) {
//       console.error("Error getting user details:", err);
//       return;
//     }

//     if (true) {
//       // Replace with your criteria for accepting offers
//       offer.accept((err) => {
//         if (err) {
//           console.error("Error accepting trade offer:", err);
//         } else {
//           console.log("Trade offer accepted");
//         }
//       });
//     } else {
//       offer.decline((err) => {
//         if (err) {
//           console.error("Error declining trade offer:", err);
//         } else {
//           console.log("Trade offer declined");
//         }
//       });
//     }
//   });
// });
