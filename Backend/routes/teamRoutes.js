import express from "express";

import {
  createTeam,
  getTeams,
  getTeamById,
  updateTeam,
  getMyTeams,
  leaveTeam,
  removeMember,
  transferCaptaincy,
  deleteTeam,
  adminDeleteTeam,
} from "../controllers/teamController.js";
import { protect, adminOnly } from "../middleware/protect.js";
const router = express.Router();

router.post("/", protect, createTeam);
router.get("/", protect, getTeams);
router.get("/my-teams", protect, getMyTeams);
router.delete("/admin/:id", protect, adminOnly, adminDeleteTeam);
router.get("/:id", protect, getTeamById);
router.put("/:id", protect, updateTeam);
router.patch("/:teamId/leave", protect, leaveTeam);
router.patch("/:teamId/members/:playerId", protect, removeMember);
router.patch(
  "/:teamId/transfer-captaincy/:playerId",
  protect,
  transferCaptaincy,
);
router.delete("/:id", protect, deleteTeam);
export default router;
