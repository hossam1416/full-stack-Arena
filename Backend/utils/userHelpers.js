import jwt from "jsonwebtoken";

// create a login token that lasts 7 days
export const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// the user data we send to the frontend (never the password)
export const formatUser = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  role: user.role,
  avatar: user.avatar,
  bio: user.bio,
  favoriteGames: user.favoriteGames,
  createdAt: user.createdAt,
});
