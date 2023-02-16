const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to Mongo");
  } catch (error) {
    console.log(`Error connecting: ${error.message}`);
    process.exit();
  }
};

module.exports = connectDB;
