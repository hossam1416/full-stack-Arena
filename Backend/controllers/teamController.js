import Team from "../models/Team.js";
import Game from "../models/Game.js";
import JoinRequest from "../models/JoinRequest.js";
import Registration from "../models/Registration.js";
import slugify from "slugify";

const isInActiveTournament = async (teamId) => {
  const registrations = await Registration.find({
    team: teamId,
    status: "confirmed",
  }).populate("tournament", "status");

  return registrations.some((registration) =>
    ["open", "in_progress"].includes(registration.tournament?.status),
  );
};

export const createTeam = async (req, res) => {
  try {
    let { name, logo, banner, description, game } = req.body;
    const captain = req.user._id;

    if (!name || !game) {
      return res.status(400).json({
        message: "Team name and game are required",
      });
    }

    name = name.trim();

    if (name.length < 3 || name.length > 40) {
      return res.status(400).json({
        message: "Team name must be between 3 and 40 characters",
      });
    }

    const selectedGame = await Game.findById(game);

    if (!selectedGame) {
      return res.status(404).json({
        message: "Game not found",
      });
    }

    if (selectedGame.active === false) {
      return res.status(400).json({
        message: "This game is currently inactive",
      });
    }

    const existingMembership = await Team.findOne({
      game,
      members: captain,
    });

    if (existingMembership) {
      return res.status(400).json({
        message: "You already belong to a team for this game",
      });
    }

    const slug = slugify(name, { lower: true, strict: true });

    const existingTeam = await Team.findOne({ slug });

    if (existingTeam) {
      return res.status(400).json({
        message: "Team name already exists",
      });
    }

    const team = await Team.create({
      name,
      slug,
      logo,
      banner,
      description,
      game,
      captain,
      members: [captain],
    });

    res.status(201).json({
      message: "Team created successfully",
      team,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTeams = async (req, res) => {
  try {
    const teams = await Team.find()
      .populate("game", "name slug logo")
      .populate("captain", "username avatar")
      .populate("members", "username avatar");

    res.status(200).json({
      teams,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getTeamById = async (req, res) => {
  try {
    const { id } = req.params;

    const team = await Team.findById(id)
      .populate("game", "name slug logo")
      .populate("captain", "username avatar")
      .populate("members", "username avatar");

    if (!team) {
      return res.status(404).json({
        message: "Team not found",
      });
    }

    res.status(200).json({
      team,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getMyTeams = async (req, res) => {
  try {
    const teams = await Team.find({
      members: req.user._id,
    })
      .populate("game", "name slug logo")
      .populate("captain", "username avatar")
      .populate("members", "username avatar");

    res.status(200).json({
      teams,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateTeam = async (req, res) => {
  try {
    const { id } = req.params;
    let { name, logo, banner, description } = req.body;

    const team = await Team.findById(id);

    if (!team) {
      return res.status(404).json({
        message: "Team not found",
      });
    }

    if (team.captain.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Only the team captain can update the team",
      });
    }

    if (name !== undefined) {
      name = name.trim();

      if (name.length < 3 || name.length > 40) {
        return res.status(400).json({
          message: "Team name must be between 3 and 40 characters",
        });
      }

      const slug = slugify(name, { lower: true, strict: true });

      const existingTeam = await Team.findOne({
        slug,
        _id: { $ne: id },
      });

      if (existingTeam) {
        return res.status(400).json({
          message: "Team name or slug already exists",
        });
      }

      team.name = name;
      team.slug = slug;
    }

    if (logo !== undefined) team.logo = logo;
    if (banner !== undefined) team.banner = banner;
    if (description !== undefined) team.description = description;

    await team.save();

    res.status(200).json({
      message: "Team updated successfully",
      team,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const leaveTeam = async (req, res) => {
  try {
    const { teamId } = req.params;
    const playerId = req.user._id;

    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({
        message: "Team not found",
      });
    }

    if (await isInActiveTournament(team._id)) {
      return res.status(400).json({
        message: "This team is registered in an active tournament",
      });
    }

    const isMember = team.members.some(
      (member) => member.toString() === playerId.toString(),
    );

    if (!isMember) {
      return res.status(400).json({
        message: "You are not a member of this team",
      });
    }

    if (team.captain.toString() === playerId.toString()) {
      return res.status(400).json({
        message: "Captain must transfer captaincy before leaving the team",
      });
    }

    team.members = team.members.filter(
      (member) => member.toString() !== playerId.toString(),
    );

    await team.save();

    res.status(200).json({
      message: "You left the team successfully",
      team,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const removeMember = async (req, res) => {
  try {
    const { teamId, playerId } = req.params;

    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({
        message: "Team not found",
      });
    }

    if (await isInActiveTournament(team._id)) {
      return res.status(400).json({
        message: "This team is registered in an active tournament",
      });
    }

    if (team.captain.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Only the team captain can remove members",
      });
    }

    const isMember = team.members.some(
      (member) => member.toString() === playerId.toString(),
    );

    if (!isMember) {
      return res.status(400).json({
        message: "This player is not a member of the team",
      });
    }

    if (team.captain.toString() === playerId.toString()) {
      return res.status(400).json({
        message: "Captain cannot remove themselves from the team",
      });
    }

    team.members = team.members.filter(
      (member) => member.toString() !== playerId.toString(),
    );

    await team.save();

    res.status(200).json({
      message: "Member removed successfully",
      team,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const transferCaptaincy = async (req, res) => {
  try {
    const { teamId, playerId } = req.params;

    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({
        message: "Team not found",
      });
    }

    if (team.captain.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Only the team captain can transfer captaincy",
      });
    }

    const isMember = team.members.some(
      (member) => member.toString() === playerId.toString(),
    );

    if (!isMember) {
      return res.status(400).json({
        message: "This player is not a member of the team",
      });
    }

    if (team.captain.toString() === playerId.toString()) {
      return res.status(400).json({
        message: "You are already the team captain",
      });
    }

    team.captain = playerId;

    await team.save();

    res.status(200).json({
      message: "Captaincy transferred successfully",
      team,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;

    const team = await Team.findById(id);

    if (!team) {
      return res.status(404).json({
        message: "Team not found",
      });
    }

    if (await isInActiveTournament(team._id)) {
      return res.status(400).json({
        message: "This team is registered in an active tournament",
      });
    }

    const isCaptain = team.captain.toString() === req.user._id.toString();

    if (!isCaptain) {
      return res.status(403).json({
        message: "Only the team captain can delete the team",
      });
    }

    const isCaptainMember = team.members.some(
      (member) => member.toString() === req.user._id.toString(),
    );

    if (!isCaptainMember) {
      return res.status(400).json({
        message: "Team captain must be a team member",
      });
    }

    if (team.members.length !== 1) {
      return res.status(400).json({
        message: "A team can only be deleted when it has one member",
      });
    }

    await JoinRequest.deleteMany({
      team: team._id,
    });

    await Team.findByIdAndDelete(team._id);

    res.status(200).json({
      message: "Team deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const adminDeleteTeam = async (req, res) => {
  try {
    const { id } = req.params;

    const team = await Team.findById(id);

    if (!team) {
      return res.status(404).json({
        message: "Team not found",
      });
    }

    if (await isInActiveTournament(team._id)) {
      return res.status(400).json({
        message: "This team is registered in an active tournament",
      });
    }

    await JoinRequest.deleteMany({
      team: team._id,
    });

    await Team.findByIdAndDelete(team._id);

    res.status(200).json({
      message: "Team deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
