import express from "express";
import {
  sendJoinRequest,
  getJoinRequests,
  acceptJoinRequest,
  rejectJoinRequest,
  getMyJoinRequestStatus,
} from "../controllers/joinRequestController.js";
import { protect } from "../middleware/protect.js";

const router = express.Router();

router.post("/:teamId", protect, sendJoinRequest);
router.get("/:teamId/my-status", protect, getMyJoinRequestStatus);
router.get("/:teamId", protect, getJoinRequests);
router.patch("/:requestId/accept", protect, acceptJoinRequest);
router.patch("/:requestId/reject", protect, rejectJoinRequest);
export default router;
