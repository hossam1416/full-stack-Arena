import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "team_invitation",
        "join_request",
        "registration_confirmed",
        "match_scheduled",
        "match_starting",
        "match_result",
        "advanced_to_next_round",
        "tournament_won",
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    // store any additional data related to the notification, such as match details or tournament info
    // just additional context
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: () => ({}),
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
