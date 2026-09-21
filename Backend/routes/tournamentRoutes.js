import express from "express";
import {
  createTournament,
  getTournaments,
  getTournamentById,
  updateTournament,
  deleteTournament,
} from "../controllers/tournamentController.js";
import { protect, adminOnly } from "../middleware/protect.js";
const router = express.Router();

router.post("/", protect, adminOnly, createTournament);
router.get("/", protect, getTournaments);
router.get("/:id", protect, getTournamentById);
router.put("/:id", protect, adminOnly, updateTournament);
router.delete("/:id", protect, adminOnly, deleteTournament);
export default router;
