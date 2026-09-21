import mongoose from "mongoose";
import { GAME_FORMATS } from "../constants/formats.js";

const gameSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Game name is required"],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    logo: {
      type: String,
      default: null,
    },
    banner: {
      type: String,
      default: null,
    },
    genre: {
      type: String,
      default: "",
    },
    formats: [
      {
        type: String,
        // enum values are derived from the keys of GAME_FORMATS
        enum: Object.keys(GAME_FORMATS),
      },
    ],
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const Game = mongoose.model("Game", gameSchema);

export default Game;
