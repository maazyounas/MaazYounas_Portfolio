require("dotenv").config();
const bcrypt = require("bcrypt");
const Admin = require("./models/Admin");
const connectDB = require("./config/db");

const createAdmin = async () => {
  await connectDB(); // use same DB logic as server

  const exists = await Admin.findOne({ email: "admin@example.com" });

  if (exists) {
    console.log("Admin already exists");
    process.exit();
  }

  const hashed = await bcrypt.hash("Admin@123", 10);

  await Admin.create({
    email: "admin@example.com",
    password: hashed,
  });

  console.log("Admin created successfully");
  process.exit();
};

createAdmin();
