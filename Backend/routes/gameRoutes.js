import express from "express";

import {
  createGame,
  getGames,
  getGameById,
  updateGame,
  getGameFormats,
} from "../controllers/gameController.js";
import { protect, adminOnly } from "../middleware/protect.js";
const router = express.Router();

router.post("/", protect, adminOnly, createGame);
router.get("/", getGames);
router.get("/formats", getGameFormats);
router.get("/:id", protect, getGameById);
router.put("/:id", protect, adminOnly, updateGame);
export default router;
