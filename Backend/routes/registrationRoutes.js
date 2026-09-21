import express from "express";
import {
  createRegistration,
  getRegistrationOptions,
} from "../controllers/registrationController.js";
import { protect } from "../middleware/protect.js";
const router = express.Router();
router.get("/:tournamentId", protect, getRegistrationOptions);
router.post("/:tournamentId", protect, createRegistration);

export default router;
