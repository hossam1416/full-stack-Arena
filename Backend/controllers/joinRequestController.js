import JoinRequest from "../models/JoinRequest.js";
import Team from "../models/Team.js";
import { createNotification } from "../services/notificationService.js";

export const sendJoinRequest = async (req, res) => {
  try {
    const { teamId } = req.params;
    const player = req.user._id;

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    if (
      team.members.some((member) => member.toString() === player.toString())
    ) {
      return res
        .status(400)
        .json({ message: "You are already a member of this team" });
    }

    if (team.members.length >= 5) {
      return res.status(400).json({ message: "This team is already full" });
    }

    const existingMembership = await Team.findOne({
      game: team.game._id || team.game,
      members: player,
    });
    if (existingMembership) {
      return res
        .status(400)
        .json({ message: "You already belong to a team for this game" });
    }

    const existingRequest = await JoinRequest.findOne({
      player,
      team: teamId,
      status: "pending",
    });
    if (existingRequest) {
      return res.status(400).json({
        message: "You already have a pending join request for this team",
      });
    }

    const joinRequest = await JoinRequest.create({ player, team: teamId });
    // Send notification to the team captain about the new join request
    await createNotification({
      recipient: team.captain,
      type: "join_request",
      title: "New Join Request",
      message: `${req.user.username} wants to join ${team.name}.`,
      metadata: {
        joinRequestId: joinRequest._id,
        teamId: team._id,
      },
    });
    res
      .status(201)
      .json({ message: "Join request sent successfully", joinRequest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getJoinRequests = async (req, res) => {
  try {
    const { teamId } = req.params;
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({
        message: "Team not found",
      });
    }
    if (team.captain.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Only the team captain can view join requests",
      });
    }
    const joinRequests = await JoinRequest.find({
      team: teamId,
      status: "pending",
    }).populate("player", "username avatar");
    res.status(200).json({
      joinRequests,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getMyJoinRequestStatus = async (req, res) => {
  try {
    const { teamId } = req.params;
    const player = req.user._id;

    const existingRequest = await JoinRequest.findOne({
      player,
      team: teamId,
      status: "pending",
    });

    res.status(200).json({
      pending: !!existingRequest,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const acceptJoinRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const joinRequest = await JoinRequest.findOne({
      _id: requestId,
      status: "pending",
    });
    if (!joinRequest) {
      return res.status(404).json({
        message: "Pending join request not found",
      });
    }

    // Join request is connected to a team,
    // so we need to check if the user is the captain of that team
    const team = await Team.findById(joinRequest.team);
    if (!team) {
      return res.status(404).json({
        message: "Team not found",
      });
    }
    if (team.captain.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Only the team captain can accept join requests",
      });
    }
    if (team.members.length >= 5) {
      return res.status(400).json({
        message: "Your team is already full",
      });
    }
    const existingMembership = await Team.findOne({
      game: team.game,
      members: joinRequest.player,
      // Do not include the current team
      _id: { $ne: team._id },
    });
    if (existingMembership) {
      return res.status(400).json({
        message: "This player already belongs to a team for this game",
      });
    }
    team.members.push(joinRequest.player);
    joinRequest.status = "accepted";

    await team.save();
    await joinRequest.save();
    // Cancel all other pending join requests for the same player in the same game
    const sameGameTeams = await Team.find({
      game: team.game,
    }).select("_id");
    await JoinRequest.updateMany(
      {
        player: joinRequest.player,
        team: { $in: sameGameTeams.map((team) => team._id) },
        status: "pending",
        // not the current join request
        _id: { $ne: joinRequest._id },
      },
      {
        $set: {
          status: "cancelled",
        },
      },
    );
    // Send notification to the player about the acceptance of their join request
    await createNotification({
      recipient: joinRequest.player,
      type: "join_request",
      title: "Join Request Accepted",
      message: `Your request to join ${team.name} has been accepted.`,
      metadata: {
        joinRequestId: joinRequest._id,
        teamId: team._id,
      },
    });
    res.status(200).json({
      message: "Join request accepted successfully",
      joinRequest,
      team,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const rejectJoinRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const joinRequest = await JoinRequest.findOne({
      _id: requestId,
      status: "pending",
    });
    if (!joinRequest) {
      return res.status(404).json({
        message: "Pending join request not found",
      });
    }
    const team = await Team.findById(joinRequest.team);
    if (!team) {
      return res.status(404).json({
        message: "Team not found",
      });
    }

    if (team.captain.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Only the team captain can reject join requests",
      });
    }
    joinRequest.status = "rejected";

    await joinRequest.save();
    // Send notification to the player about the rejection of their join request
    await createNotification({
      recipient: joinRequest.player,
      type: "join_request",
      title: "Join Request Rejected",
      message: `Your request to join ${team.name} has been rejected.`,
      metadata: {
        joinRequestId: joinRequest._id,
        teamId: team._id,
      },
    });
    res.status(200).json({
      message: "Join request rejected successfully",
      joinRequest,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
