const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://indu5836_db_user:alpha@cluster0.0nkbb9u.mongodb.net/?appName=Cluster0");

    console.log("MongoDB connected successfully with new connection");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;