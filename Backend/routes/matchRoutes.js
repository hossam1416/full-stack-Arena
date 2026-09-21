import express from "express";
import {
  generateBracket,
  getTournamentMatches,
  getMatchById,
  updateMatch,
  getUpcomingMatches,
  submitMatchResult,
  cancelMatch,
} from "../controllers/matchController.js";
import { protect, adminOnly } from "../middleware/protect.js";

const router = express.Router();
router.post(
  "/tournament/:tournamentId/generate",
  protect,
  adminOnly,
  generateBracket,
);
router.get("/upcoming", protect, getUpcomingMatches);
router.get("/tournament/:tournamentId", protect, getTournamentMatches);
router.get("/:id", protect, getMatchById);
router.put("/:id", protect, adminOnly, updateMatch);
router.patch("/:id/result", protect, adminOnly, submitMatchResult);
router.patch("/:id/cancel", protect, adminOnly, cancelMatch);

export default router;
