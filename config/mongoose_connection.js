const mongoose = require('mongoose');
const dbgr = require("debug")("development:mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB, {
        
    });
    dbgr("MongoDB Connected");
  } catch (error) {
    dbgr(error.message);
    process.exit(1);
  }
}

module.exports = connectDB;