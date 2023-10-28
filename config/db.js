const mongoose = require("mongoose");
require("dotenv").config();

const MONGO_URL = process.env.MONGO_CONNECTION;

function connectToDb() {
  mongoose.connect(MONGO_URL);

  mongoose.connection.on("connected", () => console.log(`Connection to MongoDb successful`));
  mongoose.connection.on("error", (err) => console.log(`An error occured`));
}

module.exports = { connectToDb };
