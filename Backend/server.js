import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
// import all routes
import authRoutes from "./routes/authRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import joinRequestRoutes from "./routes/joinRequestRoutes.js";
import tournamentRoutes from "./routes/tournamentRoutes.js";
import registrationRoutes from "./routes/registrationRoutes.js";
import matchRoutes from "./routes/matchRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import announcementRoutes from "./routes/announcementRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
// use routes
app.use("/api/auth", authRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/join-requests", joinRequestRoutes);
app.use("/api/tournaments", tournamentRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Arena API is running",
  });
});
app.listen(PORT, () => {
  console.log(`Arena server running on port ${PORT}`);
});
