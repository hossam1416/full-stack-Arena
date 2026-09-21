import mongoose from "mongoose";
import { GAME_FORMATS } from "../constants/formats.js";

const prizeSchema = new mongoose.Schema(
  {
    position: {
      type: Number,
      required: true,
      min: 1,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false },
);

const tournamentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tournament name is required"],
      trim: true,
    },
    game: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Game",
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    rules: {
      type: String,
      default: "",
    },
    banner: {
      type: String,
      default: null,
    },
    format: {
      type: String,
      enum: Object.keys(GAME_FORMATS),
      required: true,
    },
    maxTeams: {
      type: Number,
      required: true,
      min: 2,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    registrationDeadline: {
      type: Date,
      required: true,
    },
    prizes: [prizeSchema],
    status: {
      type: String,
      enum: ["draft", "open", "in_progress", "completed", "cancelled"],
      default: "draft",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const Tournament = mongoose.model("Tournament", tournamentSchema);

export default Tournament;
