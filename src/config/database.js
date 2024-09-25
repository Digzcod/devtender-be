const moogose = require("mongoose");

const urlMongb =
  "mongodb+srv://jaradiggy:DigzNamasteNODEJS@digz.s2bxp.mongodb.net/devtender";

const connectDB = async () => {
  await moogose.connect(urlMongb);
};

module.exports = connectDB