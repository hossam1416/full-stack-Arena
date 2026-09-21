import express from "express";
import {
  createAnnouncement,
  getAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
} from "../controllers/announcementController.js";
import { protect, adminOnly } from "../middleware/protect.js";

const router = express.Router();
router.get("/", protect, getAnnouncements);
router.get("/:id", protect, getAnnouncementById);
router.post("/", protect, adminOnly, createAnnouncement);
router.put("/:id", protect, adminOnly, updateAnnouncement);
router.delete("/:id", protect, adminOnly, deleteAnnouncement);

export default router;
