const SteamUser = require("steam-user");
const SteamCommunity = require("steamcommunity");
const TradeOfferManager = require("steam-tradeoffer-manager");
const SteamTotp = require("steam-totp");

const client = new SteamUser();
const community = new SteamCommunity();
const manager = new TradeOfferManager({
  steam: client,
  community: community,
  language: "en",
});

const logOnOptions = {
  accountName: process.env.STEAM_ACCOUNT_NAME,
  password: process.env.STEAM_PASSWORD,
  twoFactorCode: SteamTotp.generateAuthCode(process.env.STEAM_SHARED_SECRET),
};

client.logOn(logOnOptions);

client.on("loggedOn", () => {
  console.log("Logged into Steam");
  client.setPersona(SteamUser.EPersonaState.Online);
});

client.on("webSession", (sessionID, cookies) => {
  manager.setCookies(cookies, (err) => {
    if (err) {
      console.log(err);
      process.exit(1); // Fatal error since we couldn't get our API key
      return;
    }
    console.log("Got API key: " + manager.apiKey);

    // Partner details (replace with actual values)
    const partnerSteamID = "PARTNER_STEAM_ID"; // The Steam ID of the user you want to trade with

    // Example Rust items from the partner's inventory
    const partnerItems = [
      { appid: 252490, contextid: 2, assetid: "PARTNER_ITEM_ASSET_ID_1" },
      { appid: 252490, contextid: 2, assetid: "PARTNER_ITEM_ASSET_ID_2" },
      // Add more items as needed
    ];

    const tradeOffer = manager.createOffer(partnerSteamID);

    // Add the partner's items to the trade offer
    partnerItems.forEach((item) => {
      tradeOffer.addTheirItem(item);
    });

    tradeOffer.send((err, status) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log("Trade offer sent. Status: " + status);

      // Generate and print the trade offer URL
      const tradeOfferURL = `https://steamcommunity.com/tradeoffer/new/?partner=${partnerSteamID}&token=${tradeOffer.message.tradeid}`;
      console.log(`Trade offer URL: ${tradeOfferURL}`);
    });
  });

  community.setCookies(cookies);
});

client.on("error", (err) => {
  console.log("Error: " + err);
});

// const SteamCommunity = require("steamcommunity");
// const SteamUser = require("steam-user");
// const TradeOfferManager = require("steam-tradeoffer-manager");
// const SteamTotp = require("steam-totp");

// const { catchAsync } = require("../Utils/catchAsync");

// // Initialize steam components
// const community = new SteamCommunity();
// const client = new SteamUser();
// exports.manager = new TradeOfferManager({
//   steam: client,
//   community: community,
//   language: "en",
// });

// exports.botLogin = async (accountDetails) => {
//   return new Promise((resolve, reject) => {
//     client.logOn({
//       // accountName: accountDetails.username,
//       accountName: "baaitbhat2107",
//       // password: accountDetails.password,
//       password: "Silver@1118",
//       twoFactorCode: SteamTotp.getAuthCode(process.env.STEAM_SECRET),
//     });

//     client.on("loggedOn", () => {
//       console.log("Bot logged in!");
//       resolve();
//     });

//     client.on("error", (err) => {
//       console.error("Login error:", err);
//       reject(err);
//     });
//   });
// };

// // exports.botLogin = catchAsync(async (req, res, next)=>{
// //   const
// // })

const SteamTotp = require("steam-totp");

const SteamCommunity = require("steamcommunity");
const SteamUser = require("steam-user");
const TradeOfferManager = require("steam-tradeoffer-manager");

const saveGameResult = catchAsync(async (winnerData, looserData) => {});

// const createTradeOffer = async (items, req) => {
//   const partnerSteamID = req.localUser.steamId;
//   const partnerTradeURL = req.localUser.steamTradeUrl;
//   const sID = req.sessionID;

//   console.log(partnerSteamID);
//   console.log(partnerTradeURL);
//   console.log(sID);

//   if (
//     !partnerSteamID ||
//     !items ||
//     !Array.isArray(items) ||
//     items.length === 0
//   ) {
//     return res.status(400).json({ error: "Invalid request payload" });
//   }

//   const offer = manager.createOffer(partnerTradeURL);

//   // Add the items to the trade offer
//   items.forEach((item) => {
//     offer.addMyItem({
//       appid: 252490, // Game ID for the items
//       contextid: 2,
//       assetid: item.assetid,
//     });
//   });

//   // Send the trade offer
//   offer.send((err, status) => {
//     if (err) {
//       console.error("Error sending trade:", err);
//       // return res.status(500).json({ error: "Trade offer failed" });
//     }
//     console.log("Trade offer status:", status);
//     // return res.status(200).json({ success: true, status });
//   });

//   // const tradeURL = `https://steamcommunity.com/tradeoffer/new/send`;

//   // const offerData = {
//   //   sessionid: sID,
//   //   serverid: 1,
//   //   partner: process.env.PARTNER_ID,
//   //   tradeoffermessage: "",
//   //   json_tradeoffer: JSON.stringify({
//   //     newversion: true,
//   //     version: 2,
//   //     me: {
//   //       assets: items.map((item) => ({
//   //         appid: 252490,
//   //         contextid: "2",
//   //         assetid: item.assetid,
//   //       })),
//   //       currency: [],
//   //       ready: false,
//   //     },
//   //     them: {
//   //       assets: [],
//   //       currency: [],
//   //       ready: false,
//   //     },
//   //   }),
//   //   trade_offer_create_params: {
//   //     trade_offer_access_token: new URL(partnerTradeURL).searchParams.get(
//   //       "token"
//   //     ),
//   //   },
//   // };

//   // const response = await axios.post(tradeURL, offerData, {
//   //   headers: {
//   //     Cookie: sessionCookies,
//   //     "Content-Type": "application/x-www-form-urlencoded",
//   //     Accept: "application/json, text/plain, */*",
//   //     "User-Agent": "axios/1.7.2",
//   //     Referer: partnerTradeURL,
//   //   },
//   // });
// };

// Initialize steam components

const community = new SteamCommunity();
const client = new SteamUser();

const manager = new TradeOfferManager({
  steam: client,
  community: community,
  language: "en",
});
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

client.on("webSession", (sessionID, cookies) => {
  // sessionCookies = cookies;
  // sessionId = sessionID;
  console.log("COKIES ARE HERE ", cookies);
  manager.setCookies(cookies);
  community.setCookies(cookies);
  console.log("Web session established and cookies set");
});

const createTradeOffer = async (items, req, res) => {
  const partnerSteamID = req.localUser.steamId;
  const partnerTradeURL = req.localUser.steamTradeUrl;

  console.log(partnerSteamID);
  console.log(partnerTradeURL);

  if (
    !partnerSteamID ||
    !items ||
    !Array.isArray(items) ||
    items.length === 0
  ) {
    return res.status(400).json({ error: "Invalid request payload" });
  }

  // Make sure bot is logged in and session is valid
  try {
    // Login the bot (if not already logged in)
    // await botLogin({
    //   username: process.env.BOT_USERNAME,
    //   password: process.env.BOT_PASSWORD,
    //   sharedSecret: process.env.BOT_SHARED_SECRET,
    // });

    const offer = manager.createOffer(partnerTradeURL);

    items.forEach((item) => {
      offer.addMyItem({
        appid: 252490,
        contextid: 2,
        assetid: item.assetid,
      });
    });

    console.log(offer);
    // Send the trade offer
    offer.send((err, status) => {
      if (err) {
        console.error("Error sending trade:", err);
      }
      console.log("Trade offer status:", status);
    });
  } catch (error) {
    console.error("Bot error:", error);
  }
};
