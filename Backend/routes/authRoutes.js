import express from "express";
import { register, login, getMe } from "../controllers/authController.js";
import {
  updateProfile,
  changePassword,
  getPublicProfile,
} from "../controllers/userController.js";
import { protect } from "../middleware/protect.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.patch("/profile", protect, updateProfile);
router.patch("/change-password", protect, changePassword);
router.get("/players/:id", getPublicProfile);
export default router;
