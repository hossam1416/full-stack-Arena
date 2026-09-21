import Tournament from "../models/Tournament.js";
import Game from "../models/Game.js";
import { GAME_FORMATS } from "../constants/formats.js";
import Registration from "../models/Registration.js";

export const createTournament = async (req, res) => {
  try {
    const {
      name,
      game,
      description,
      rules,
      banner,
      format,
      maxTeams,
      startDate,
      endDate,
      registrationDeadline,
      prizes,
    } = req.body;

    if (
      !name ||
      !game ||
      !format ||
      !maxTeams ||
      !registrationDeadline ||
      !startDate ||
      !endDate
    ) {
      return res.status(400).json({
        message: "Please provide all required tournament fields",
      });
    }

    const selectedGame = await Game.findById(game);

    if (!selectedGame) {
      return res.status(404).json({
        message: "Game not found",
      });
    }

    if (!selectedGame.active) {
      return res.status(400).json({
        message: "This game is currently inactive",
      });
    }

    if (!GAME_FORMATS[format]) {
      return res.status(400).json({
        message: "Invalid tournament format",
      });
    }

    if (!selectedGame.formats.includes(format)) {
      return res.status(400).json({
        message: "This game does not support the selected format",
      });
    }

    const registrationDate = new Date(registrationDeadline);
    const tournamentStart = new Date(startDate);
    const tournamentEnd = new Date(endDate);

    if (
      isNaN(registrationDate.getTime()) ||
      isNaN(tournamentStart.getTime()) ||
      isNaN(tournamentEnd.getTime())
    ) {
      return res.status(400).json({
        message: "Invalid tournament dates",
      });
    }

    if (
      registrationDate >= tournamentStart ||
      tournamentStart >= tournamentEnd
    ) {
      return res.status(400).json({
        message: "Invalid tournament dates",
      });
    }

    if (typeof maxTeams !== "number" || maxTeams < 2) {
      return res.status(400).json({
        message: "Tournament must allow at least 2 teams",
      });
    }

    if (prizes !== undefined) {
      if (!Array.isArray(prizes)) {
        return res.status(400).json({
          message: "Please provide prizes as a list of positions and amounts",
        });
      }

      for (const prize of prizes) {
        if (
          prize.position === undefined ||
          prize.amount === undefined ||
          prize.position < 1 ||
          prize.amount < 0
        ) {
          return res.status(400).json({
            message: "Each prize must have a valid position and amount",
          });
        }
      }
    }

    const tournament = await Tournament.create({
      name,
      game,
      description,
      rules,
      banner,
      format,
      maxTeams,
      startDate: tournamentStart,
      endDate: tournamentEnd,
      registrationDeadline: registrationDate,
      prizes,
      createdBy: req.user._id,
    });

    await tournament.populate("game", "name slug logo");

    res.status(201).json({
      message: "Tournament created successfully",
      tournament,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTournaments = async (req, res) => {
  try {
    const filter =
      req.user.role === "admin" ? {} : { status: { $ne: "draft" } };

    const tournaments = await Tournament.find(filter)
      .populate("game", "name slug logo")
      .populate("createdBy", "username");

    const tournamentsWithCount = await Promise.all(
      tournaments.map(async (tournament) => {
        const registrationCount = await Registration.countDocuments({
          tournament: tournament._id,
          status: { $ne: "withdrawn" },
        });

        return {
          ...tournament.toObject(),
          registrationCount,
        };
      }),
    );

    res.status(200).json({
      tournaments: tournamentsWithCount,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getTournamentById = async (req, res) => {
  try {
    const { id } = req.params;

    const tournament = await Tournament.findById(id)
      .populate("game", "name slug logo formats")
      .populate("createdBy", "username");

    if (!tournament) {
      return res.status(404).json({
        message: "Tournament not found",
      });
    }

    if (tournament.status === "draft" && req.user.role !== "admin") {
      return res.status(404).json({
        message: "Tournament not found",
      });
    }

    const registrationCount = await Registration.countDocuments({
      tournament: tournament._id,
      status: { $ne: "withdrawn" },
    });

    const registrations = await Registration.find({
      tournament: tournament._id,
      status: "confirmed",
    })
      .populate("team", "name logo game")
      .select("team players");

    res.status(200).json({
      tournament: {
        ...tournament.toObject(),
        registrationCount,
        registrations,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateTournament = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      game,
      description,
      rules,
      banner,
      format,
      maxTeams,
      startDate,
      endDate,
      registrationDeadline,
      prizes,
      status,
    } = req.body;

    const tournament = await Tournament.findById(id);

    if (!tournament) {
      return res.status(404).json({
        message: "Tournament not found",
      });
    }

    if (game !== undefined) {
      const selectedGame = await Game.findById(game);

      if (!selectedGame) {
        return res.status(404).json({
          message: "Game not found",
        });
      }

      if (!selectedGame.active) {
        return res.status(400).json({
          message: "This game is currently inactive",
        });
      }
    }

    if (format !== undefined) {
      if (!GAME_FORMATS[format]) {
        return res.status(400).json({
          message: "Invalid tournament format",
        });
      }

      const gameId = game !== undefined ? game : tournament.game;
      const selectedGame = await Game.findById(gameId);

      if (!selectedGame.formats.includes(format)) {
        return res.status(400).json({
          message: "This game does not support the selected format",
        });
      }
    }

    const registrationDate =
      registrationDeadline !== undefined
        ? new Date(registrationDeadline)
        : tournament.registrationDeadline;

    const tournamentStart =
      startDate !== undefined ? new Date(startDate) : tournament.startDate;

    const tournamentEnd =
      endDate !== undefined ? new Date(endDate) : tournament.endDate;

    if (
      isNaN(registrationDate.getTime()) ||
      isNaN(tournamentStart.getTime()) ||
      isNaN(tournamentEnd.getTime())
    ) {
      return res.status(400).json({
        message: "Invalid tournament dates",
      });
    }

    if (
      registrationDate >= tournamentStart ||
      tournamentStart >= tournamentEnd
    ) {
      return res.status(400).json({
        message: "Invalid tournament dates",
      });
    }

    if (
      maxTeams !== undefined &&
      (typeof maxTeams !== "number" || maxTeams < 2)
    ) {
      return res.status(400).json({
        message: "Tournament must allow at least 2 teams",
      });
    }

    if (prizes !== undefined) {
      if (!Array.isArray(prizes)) {
        return res.status(400).json({
          message: "Please provide prizes as a list of positions and amounts",
        });
      }

      for (const prize of prizes) {
        if (
          prize.position === undefined ||
          prize.amount === undefined ||
          prize.position < 1 ||
          prize.amount < 0
        ) {
          return res.status(400).json({
            message: "Each prize must have a valid position and amount",
          });
        }
      }
    }

    if (status !== undefined) {
      const allowedStatuses = [
        "draft",
        "open",
        "in_progress",
        "completed",
        "cancelled",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid tournament status",
        });
      }
    }

    if (status !== undefined && status !== tournament.status) {
      const allowedTransitions = {
        draft: ["open", "cancelled"],
        open: ["in_progress", "cancelled"],
        in_progress: ["completed"],
        completed: [],
        cancelled: [],
      };

      if (!allowedTransitions[tournament.status].includes(status)) {
        return res.status(400).json({
          message: "Invalid tournament status transition",
        });
      }
    }

    if (name !== undefined) tournament.name = name;
    if (game !== undefined) tournament.game = game;
    if (description !== undefined) tournament.description = description;
    if (rules !== undefined) tournament.rules = rules;
    if (banner !== undefined) tournament.banner = banner;
    if (format !== undefined) tournament.format = format;
    if (maxTeams !== undefined) tournament.maxTeams = maxTeams;
    if (startDate !== undefined) tournament.startDate = tournamentStart;
    if (endDate !== undefined) tournament.endDate = tournamentEnd;

    if (registrationDeadline !== undefined) {
      tournament.registrationDeadline = registrationDate;
    }

    if (prizes !== undefined) tournament.prizes = prizes;
    if (status !== undefined) tournament.status = status;

    await tournament.save();
    await tournament.populate("game", "name slug logo");

    res.status(200).json({
      message: "Tournament updated successfully",
      tournament,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteTournament = async (req, res) => {
  try {
    const { id } = req.params;

    const tournament = await Tournament.findById(id);

    if (!tournament) {
      return res.status(404).json({
        message: "Tournament not found",
      });
    }

    if (!["draft", "cancelled"].includes(tournament.status)) {
      return res.status(400).json({
        message: "Only draft or cancelled tournaments can be deleted",
      });
    }

    await Registration.deleteMany({
      tournament: tournament._id,
    });

    await Tournament.findByIdAndDelete(tournament._id);

    res.status(200).json({
      message: "Tournament deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
