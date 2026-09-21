import mongoose from "mongoose";

const scoreSchema = new mongoose.Schema(
  {
    teamA: {
      type: Number,
      default: null,
    },
    teamB: {
      type: Number,
      default: null,
    },
  },
  { _id: false },
);

const matchSchema = new mongoose.Schema(
  {
    tournament: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tournament",
      required: true,
    },
    round: {
      type: Number,
      required: true,
    },
    matchNumber: {
      type: Number,
      required: true,
    },
    teamA: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      default: null,
    },
    teamB: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      default: null,
    },
    scheduledAt: {
      type: Date,
      default: null,
    },
    score: scoreSchema,
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      default: null,
    },
    status: {
      type: String,
      enum: ["scheduled", "in_progress", "completed", "cancelled"],
      default: "scheduled",
    },
    nextMatch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Match",
      default: null,
    },
    // where the winner of this match will be placed in the next match (teamA or teamB)
    nextMatchSlot: {
      type: String,
      enum: ["teamA", "teamB", null],
      default: null,
    },
  },
  { timestamps: true },
);
matchSchema.index(
  { tournament: 1, round: 1, matchNumber: 1 },
  { unique: true },
);
const Match = mongoose.model("Match", matchSchema);

export default Match;
