const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const imagekit = require("../config/imagekit");

// ======================
// REGISTER USER
// ======================

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, category } = req.body;

    // check image
    if (!req.file) {
      return res.status(400).json({
        message: "Profile image is required",
      });
    }

    // check if user exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // upload image to ImageKit
    const uploadResponse = await imagekit.upload({
      file: req.file.buffer,
      fileName: Date.now() + ".jpg",
    });

    // create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      category: role === "Staff" ? category : null,
      image: uploadResponse.url,
    });
    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.log("REGISTER ERROR:", error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ======================
// LOGIN USER
// ======================

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // create JWT token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    // send cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.json({
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    console.log("LOGIN ERROR:", error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
