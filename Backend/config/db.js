

// db.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const uri = process.env.MONGODB_URI;

const connectMongoose = async () => {
  if (mongoose.connection.readyState === 0) { // 0 = disconnected
    try {
      await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("✅ Mongoose connected to Snap-Storm");
    } catch (err) {
      console.error("❌ Mongoose connection error:", err);
      throw err;
    }
  }
};

module.exports = connectMongoose;
