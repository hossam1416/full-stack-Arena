import express from "express";
import {
  getTeamLeaderboard,
  getTeamStats,
} from "../controllers/leaderboardController.js";
import { protect } from "../middleware/protect.js";

const router = express.Router();

router.get("/teams", protect, getTeamLeaderboard);
router.get("/team/:teamId", protect, getTeamStats);
export default router;
