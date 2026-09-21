import Registration from "../models/Registration.js";
import Tournament from "../models/Tournament.js";
import Team from "../models/Team.js";
import { GAME_FORMATS } from "../constants/formats.js";
import { createNotification } from "../services/notificationService.js";

export const createRegistration = async (req, res) => {
  try {
    const { tournamentId } = req.params;
    const { teamId, players } = req.body;

    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      return res.status(404).json({
        message: "Tournament not found",
      });
    }
    if (tournament.status !== "open") {
      return res.status(400).json({
        message: "Registration is not open for this tournament",
      });
    }
    if (new Date() > tournament.registrationDeadline) {
      return res.status(400).json({
        message: "Registration deadline has passed",
      });
    }
    // Check if the team exists and if the user is the captain of the team
    const team = await Team.findOne({
      _id: teamId,
      captain: req.user._id,
    });
    if (!team) {
      return res.status(404).json({
        message: "Team not found or you are not the captain of this team",
      });
    }
    // Check if the team is eligible to register for the tournament
    if (team.game.toString() !== tournament.game.toString()) {
      return res.status(400).json({
        message: "This team cannot register for this tournament",
      });
    }

    const requiredPlayers = GAME_FORMATS[tournament.format];
    if (team.members.length < requiredPlayers) {
      return res.status(400).json({
        message: `Team must have at least ${requiredPlayers} players for this tournament`,
      });
    }
    // Check if the players array is valid and contains the correct number of players
    if (!Array.isArray(players)) {
      return res.status(400).json({
        message: "Please provide the tournament lineup",
      });
    }
    // Check if the number of players selected matches the required number for the tournament format
    if (players.length !== requiredPlayers) {
      return res.status(400).json({
        message: `You must select exactly ${requiredPlayers} players for this tournament`,
      });
    }

    const allPlayersAreMembers = players.every((playerId) =>
      team.members.some(
        (memberId) => memberId.toString() === playerId.toString(),
      ),
    );
    if (!allPlayersAreMembers) {
      return res.status(400).json({
        message: "All selected players must be members of the team",
      });
    }

    // Check if the players array contains unique player IDs
    const uniquePlayers = new Set(players);
    // compare set size with original array length to check for duplicates
    if (uniquePlayers.size !== players.length) {
      return res.status(400).json({
        message: "A player cannot be selected more than once",
      });
    }
    const existingRegistration = await Registration.findOne({
      team: team._id,
      tournament: tournament._id,
    });

    if (existingRegistration) {
      return res.status(400).json({
        message: "This team is already registered for this tournament",
      });
    }

    const registrationCount = await Registration.countDocuments({
      tournament: tournament._id,
      status: { $ne: "withdrawn" },
    });

    if (registrationCount >= tournament.maxTeams) {
      return res.status(400).json({
        message: "Tournament is full",
      });
    }
    // Create the registration
    const registration = await Registration.create({
      team: team._id,
      tournament: tournament._id,
      players,
      status: "confirmed",
    });

    await createNotification({
      recipient: team.captain,
      type: "registration_confirmed",
      title: "Registration Confirmed",
      message: `Your team ${team.name} has been registered for ${tournament.name}.`,
      metadata: {
        registrationId: registration._id,
        tournamentId: tournament._id,
        teamId: team._id,
      },
    });
    res.status(201).json({
      message: "Team registered successfully",
      registration,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getRegistrationOptions = async (req, res) => {
  try {
    const { tournamentId } = req.params;
    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      return res.status(404).json({
        message: "Tournament not found",
      });
    }

    const teams = await Team.find({
      captain: req.user._id,
      game: tournament.game,
    })
      .populate("members", "username avatar")
      .populate("game", "name logo");
    res.status(200).json({
      teams,
      requiredPlayers: GAME_FORMATS[tournament.format],
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
