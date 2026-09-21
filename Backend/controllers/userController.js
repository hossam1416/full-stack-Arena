import User from "../models/User.js";
import { formatUser } from "../utils/userHelpers.js";

export const updateProfile = async (req, res) => {
  try {
    let { username, bio, avatar, favoriteGames } = req.body;

    if (username !== undefined) {
      username = username.trim();

      if (username.length < 3 || username.length > 15) {
        return res
          .status(400)
          .json({ message: "Username must be between 3 and 15 characters" });
      }

      const existingUsername = await User.findOne({
        username,
        _id: { $ne: req.user._id },
      });
      if (existingUsername) {
        return res.status(400).json({ message: "Username already taken" });
      }

      req.user.username = username;
    }

    if (bio !== undefined) req.user.bio = bio;
    if (avatar !== undefined) req.user.avatar = avatar;
    if (favoriteGames !== undefined) req.user.favoriteGames = favoriteGames;

    await req.user.save();

    res.status(200).json({ user: formatUser(req.user) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Please provide current and new password" });
    }
    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "New password must be at least 6 characters" });
    }

    // the password is hidden by default, so we ask for it here
    const user = await User.findById(req.user._id).select("+password");

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }
    if (currentPassword === newPassword) {
      return res
        .status(400)
        .json({ message: "New password must be different" });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// public profile: no email, no role
export const getPublicProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("username avatar bio favoriteGames createdAt")
      .populate("favoriteGames", "name slug logo");

    if (!user) {
      return res.status(404).json({ message: "Player not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
