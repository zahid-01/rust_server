require("dotenv").config({ path: "./config.env" });
const { default: mongoose } = require("mongoose");
const app = require("./app");
// const { botLogin } = require("./Controller/bot.controller");

// botLogin();
app.listen(process.env.PORT, () => {
  console.log(`💥 SERVER FIRED ON PORT ${process.env.PORT}`);
});

mongoose.connect(process.env.MONGO_DB_URI).then(
  () => {
    console.log("🎯 MONGODB CONNECTED");
  },
  () => {
    console.log("🙊 DB CONNECTION FAILED");
  }
);
