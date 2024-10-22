const axios = require("axios");

exports.createTradeOffer = async (req, res) => {
  const items = req.body;
  const { steamId: partnerSteamID } = req.params;
  const sID = req.sessionID;
  let sessionCookies = req.cookies;
  sessionCookies = `connect.sid=${sessionCookies["connect.sid"]}; sessionid=${sID}`;
  console.log(sessionCookies);

  if (
    !partnerSteamID ||
    !items ||
    !Array.isArray(items) ||
    items.length === 0
  ) {
    return res.status(400).json({ error: "Invalid request payload" });
  }

  try {
    const tradeURL = `https://steamcommunity.com/tradeoffer/new/send`;

    const offerData = {
      sessionid: sID,
      serverid: 1,
      partner: process.env.PARTNER_ID,
      tradeoffermessage: "",
      json_tradeoffer: JSON.stringify({
        newversion: true,
        version: 2,
        me: {
          assets: items.map((item) => ({
            appid: 252490,
            contextid: "2",
            assetid: item.assetid,
          })),
          currency: [],
          ready: false,
        },
        them: {
          assets: [],
          currency: [],
          ready: false,
        },
      }),
      trade_offer_create_params: {},
    };

    const response = await axios.post(tradeURL, offerData, {
      headers: {
        Cookie: sessionCookies,
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json, text/plain, */*",
        "User-Agent": "axios/1.7.2",
        Referer: `https://steamcommunity.com/tradeoffer/new/?partner=1756531196&token=vPJjYkFq`,
      },
    });

    res.json(response.data);
  } catch (err) {
    // console.error("Error sending trade offer:", err.response);
    res.status(500).json({ error: err.message });
  }
};
