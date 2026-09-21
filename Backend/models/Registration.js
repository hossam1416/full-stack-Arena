import mongoose from "mongoose";
const registrationSchema = new mongoose.Schema(
  {
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    tournament: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tournament",
      required: true,
    },
    players: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true },
);
// Ensure that a team can only register once for a specific tournament
registrationSchema.index({ team: 1, tournament: 1 }, { unique: true });

const Registration = mongoose.model("Registration", registrationSchema);

export default Registration;
