import express from "express";
import {
  getMyNotifications,
  markAllAsRead,
  markAsRead,
} from "../controllers/notificationController.js";
import { protect } from "../middleware/protect.js";

const router = express.Router();

router.get("/", protect, getMyNotifications);
router.patch("/read-all", protect, markAllAsRead);
router.patch("/:id/read", protect, markAsRead);

export default router;
