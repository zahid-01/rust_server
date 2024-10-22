const express = require("express");
const session = require("express-session");
const passport = require("passport");
const SteamStrategy = require("passport-steam").Strategy;
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const path = require("path");

const AuthRouter = require("./Routes/auth.routes");
const SteamRouter = require("./Routes/steam.routes");
const { sendErr } = require("./Controller/error.controller");
const TradeRouter = require("./Routes/trade.routes");
const GameRouter = require("./Routes/game.routes");
const UserRouter = require("./Routes/user.routes");

const app = express();

const buildPath = path.join(__dirname, "public");
app.use(express.static(buildPath));

app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://rust-fe.vercel.app",
    ],
    credentials: true,
  })
);
app.options("*", cors());

app.use(
  session({
    secret: process.env.STEAM_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.use(
  new SteamStrategy(
    {
      returnURL: "http://localhost:5001/api/v1/auth/steam/return",
      realm: "http://localhost:5001/",
      apiKey: process.env.STEAM_API_KEY,
    },
    (identifier, profile, done) => {
      process.nextTick(() => {
        profile.identifier = identifier;
        return done(null, profile);
      });
    }
  )
);

app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/inventory", SteamRouter);
app.use("/api/v1/trade", TradeRouter);
app.use("/api/v1/play", GameRouter);
app.use("/api/v1/user", UserRouter);

app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

app.use(sendErr);

app.all("*", (req, res) => {
  res.status(404).json({
    message: "No such url found!",
  });
});

module.exports = app;
