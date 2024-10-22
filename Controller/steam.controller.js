const { default: axios } = require("axios");
const SteamMarketFetcher = require("steam-market-fetcher");
const AppError = require("../Utils/appError");
const { catchAsync } = require("../Utils/catchAsync");

const getImagesPrice = async (hashName, appId) => {
  let imageUri, amount;

  const market = new SteamMarketFetcher({
    currency: "USD",
    format: "json",
  });

  await market.getItemPrice({
    market_hash_name: hashName,
    appid: 252490,
    callback: (err, price) => {
      if (err) throw err;
      amount = price.median_price;
    },
  });

  // await market.getItemImage({
  //   market_hash_name: hashName,
  //   appid: 252490,
  //   callback: (err, image) => {
  //     if (err) throw err;

  //     imageUri = image;
  //   },
  // });

  //image: imageUri
  return { price: amount };
};

exports.getMyInventory = catchAsync(async (req, res, next) => {
  const { steam } = req.params;
  const rustAppId = 252490;
  const appId = 2;

  const cookieString = `connect.sid=${req.cookies["connect.sid"]}; sessionid=${req.sessionID}`;

  // const data = await axios({
  //   method: "GET",
  //   // url: "https://steamcommunity.com/profiles/76561198958721467/inventory/json/252490/2",
  //   url: `https://steamcommunity.com/inventory/76561198958721467/252490/2`,
  //   withCredentials: true,
  //   headers: {
  //     Cookie: cookieString,
  //   },
  // });

  let data = await fetch(
    `https://steamcommunity.com/inventory/${steam}/${rustAppId}/${appId}`
  );

  data = await data.json();

  if (!data) {
    return next(
      new AppError(404, "No data found, check for inventory visibility")
    );
  }

  const assets = data.assets;
  const inventory = data.descriptions;
  let inventoryJson = {};

  for (let i = 0; i < inventory.length; i++) {
    inventory[
      i
    ].icon_url = `https://community.akamai.steamstatic.com/economy/image/${inventory[i].icon_url}`;

    inventory[
      i
    ].icon_url_large = `https://community.akamai.steamstatic.com/economy/image/${inventory[i].icon_url_large}`;
    inventoryJson[inventory[i].classid] = inventory[i];
  }

  let mainstream = [];
  for (let i = 0; i < assets.length; i++) {
    let obj = {
      item: inventoryJson[assets[i].classid],
      assetid: assets[i].assetid,
    };
    mainstream.push(obj);
  }

  let outstream = [];

  for (let i = 0; i < mainstream.length; i++) {
    let imagePrice = await getImagesPrice(
      mainstream[i].item.market_hash_name,
      mainstream[i].item.appid
    );

    if (mainstream[i].item.marketable)
      outstream.push({
        //image: imagePrice.image,
        image: mainstream[i].item.icon_url,
        price: imagePrice.price,
        name: mainstream[i].item.name,
        descriptions: mainstream[i].item.descriptions[0].value,
        assetid: mainstream[i].assetid,
        appid: 252490,
        contextid: "2",
      });
  }

  res.status(200).json({
    message: "Success",
    outstream,
  });
});
