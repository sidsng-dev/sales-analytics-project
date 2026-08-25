require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/User");

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected");

    const existingAdmin = await User.findOne({
      email: "admin@salesanalytics.com",
    });

    if (existingAdmin) {
      console.log("Admin user already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("Admin@123456", 12);

    const admin = await User.create({
      name: "Sales Analytics Admin",
      email: "admin@salesanalytics.com",
      password: hashedPassword,
      role: "admin",
      status: "active",
    });

    console.log("Admin user created successfully");
    console.log({
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    });

    process.exit(0);
  } catch (error) {
    console.error("Admin creation failed:", error.message);
    process.exit(1);
  }
};

createAdmin();