import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function testConnection() {
  try {
    console.log("Connecting to:", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("SUCCESS: Connected to MongoDB");
    process.exit(0);
  } catch (err) {
    console.error("FAILURE: Could not connect to MongoDB", err);
    process.exit(1);
  }
}

testConnection();
