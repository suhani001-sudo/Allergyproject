import jwt from "jsonwebtoken";
import User from "../models/User.js";

// 🔹 Function to generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// 🔹 Signup Controller
export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate inputs
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    // Check if user already exists with the same email AND role
    const existingUser = await User.findOne({ email, role: role || "user" });
    if (existingUser) {
      return res.status(409).json({ message: `This email is already registered as a ${role || "user"}` });
    }

    // Create new user with role
    const user = await User.create({ 
      name, 
      email, 
      password, 
      role: role || "user" 
    });

    // Generate token
    const token = generateToken(user._id);

    // Send response
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.error("Signup error:", err);
    
    // Handle duplicate key error (MongoDB E11000)
    if (err.code === 11000) {
      return res.status(409).json({ 
        message: "This email is already registered. Please use a different email or login instead.",
        error: "DUPLICATE_EMAIL"
      });
    }
    
    res.status(500).json({ 
      message: "Server error during signup. Please try again.",
      error: err.message 
    });
  }
};

// 🔹 Login Controller
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Validate inputs
    if (!email || !password || !role) {
      return res.status(400).json({ message: "Email, password, and role are required" });
    }

    // Find user with specific email and role combination
    const user = await User.findOne({ email, role });
    if (!user) {
      return res.status(401).json({ message: `No ${role} account found with this email. Please check your credentials or register.` });
    }

    // Match password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken(user._id);

    // Send response
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
