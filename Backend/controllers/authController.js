import User from "../models/User.js";
import { isValidEmail } from "../utils/validators.js";
import { generateToken, formatUser } from "../utils/userHelpers.js";

export const register = async (req, res) => {
  try {
    let { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide username, email and password" });
    }

    username = username.trim();
    email = email.trim().toLowerCase();

    if (!isValidEmail(email)) {
      return res
        .status(400)
        .json({ message: "Please provide a valid email address" });
    }
    if (username.length < 3 || username.length > 15) {
      return res
        .status(400)
        .json({ message: "Username must be between 3 and 15 characters" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const user = await User.create({ username, email, password });

    res.status(201).json({
      token: generateToken(user),
      user: formatUser(user),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    email = email.trim().toLowerCase();

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isActive) {
      return res
        .status(403)
        .json({ message: "Your account has been deactivated" });
    }

    res.status(200).json({
      token: generateToken(user),
      user: formatUser(user),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// the logged in user (req.user is set by the protect middleware)
export const getMe = async (req, res) => {
  res.status(200).json({ user: formatUser(req.user) });
};
