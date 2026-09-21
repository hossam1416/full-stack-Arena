import mongoose from "mongoose";
import Match from "../models/Match.js";
import Registration from "../models/Registration.js";
export const getTeamLeaderboard = async (req, res) => {
  try {
    const { game } = req.query;

    if (game && !mongoose.Types.ObjectId.isValid(game)) {
      return res.status(400).json({
        message: "Invalid game ID",
      });
    }

    const matchFilter = {
      status: "completed",
      teamA: { $ne: null },
      teamB: { $ne: null },
    };

    const pipeline = [
      // filter the matches based on the matchFilter object
      {
        $match: matchFilter,
      },
      // pass the teamA and teamB fields to the next stage
      {
        $project: {
          teams: ["$teamA", "$teamB"],
          //  1 means show the field, 0 means hide the field
          winner: 1,
        },
      },
      // split the teams array into separate documents for each team
      {
        $unwind: "$teams",
      },
      {
        $lookup: {
          from: "teams",
          localField: "teams",
          foreignField: "_id",
          as: "team",
        },
      },
      {
        $unwind: "$team",
      },
    ];
    // filter the matches based on the game ID if provided
    if (game) {
      pipeline.push({
        $match: {
          "team.game": new mongoose.Types.ObjectId(game),
        },
      });
    }

    pipeline.push(
      {
        $set: {
          result: {
            $cond: [{ $eq: ["$teams", "$winner"] }, "win", "loss"],
          },
        },
      },
      {
        $group: {
          _id: "$teams",

          team: {
            $first: "$team",
          },

          wins: {
            $sum: {
              $cond: [{ $eq: ["$result", "win"] }, 1, 0],
            },
          },

          losses: {
            $sum: {
              $cond: [{ $eq: ["$result", "loss"] }, 1, 0],
            },
          },

          matchesPlayed: {
            $sum: 1,
          },
        },
      },
      {
        $set: {
          points: {
            $multiply: ["$wins", 3],
          },

          winRate: {
            $multiply: [
              {
                $divide: ["$wins", "$matchesPlayed"],
              },
              100,
            ],
          },
        },
      },
      {
        $sort: {
          points: -1,
          winRate: -1,
          matchesPlayed: -1,
        },
      },
      {
        $project: {
          _id: 0,

          team: {
            _id: 1,
            name: 1,
            logo: 1,
            game: 1,
          },

          wins: 1,
          losses: 1,
          matchesPlayed: 1,
          points: 1,
          winRate: 1,
        },
      },
    );

    const leaderboard = await Match.aggregate(pipeline);

    res.status(200).json({
      leaderboard,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export const getTeamStats = async (req, res) => {
  try {
    const { teamId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(teamId)) {
      return res.status(400).json({ message: "Invalid team ID" });
    }

    const teamObjectId = new mongoose.Types.ObjectId(teamId);

    const matchFilter = {
      status: "completed",
      teamA: { $ne: null },
      teamB: { $ne: null },
      $or: [{ teamA: teamObjectId }, { teamB: teamObjectId }],
    };

    const pipeline = [
      { $match: matchFilter },
      {
        $group: {
          _id: null,
          wins: {
            $sum: {
              $cond: [{ $eq: ["$winner", teamObjectId] }, 1, 0],
            },
          },
          matchesPlayed: { $sum: 1 },
        },
      },
      {
        $set: {
          losses: { $subtract: ["$matchesPlayed", "$wins"] },
          points: { $multiply: ["$wins", 3] },
          winRate: {
            $cond: [
              { $eq: ["$matchesPlayed", 0] },
              0,
              { $multiply: [{ $divide: ["$wins", "$matchesPlayed"] }, 100] },
            ],
          },
        },
      },
      {
        $project: {
          _id: 0,
          wins: 1,
          losses: 1,
          matchesPlayed: 1,
          points: 1,
          winRate: 1,
        },
      },
    ];

    const result = await Match.aggregate(pipeline);

    const stats = result[0] || {
      wins: 0,
      losses: 0,
      matchesPlayed: 0,
      points: 0,
      winRate: 0,
    };

    const tournamentsCount = await Registration.countDocuments({
      team: teamObjectId,
      status: "confirmed",
    });

    res.status(200).json({
      stats: { ...stats, tournamentsPlayed: tournamentsCount },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
