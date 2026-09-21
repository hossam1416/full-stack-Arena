import Tournament from "../models/Tournament.js";
import Registration from "../models/Registration.js";
import Team from "../models/Team.js";
import Match from "../models/Match.js";
import {
  createBracketRounds,
  createFirstRoundMatches,
} from "../utils/bracketUtils.js";
import { createNotification } from "../services/notificationService.js";

export const generateBracket = async (req, res) => {
  try {
    const { tournamentId } = req.params;
    const tournament = await Tournament.findById(tournamentId);

    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }

    if (tournament.status !== "open") {
      return res.status(400).json({
        message: "Tournament must be open to generate a bracket",
      });
    }
    // check if matches already exist for this tournament
    const existingMatches = await Match.findOne({ tournament: tournamentId });
    if (existingMatches) {
      return res
        .status(400)
        .json({ message: "Bracket has already been generated" });
    }

    const registrations = await Registration.find({
      tournament: tournamentId,
      status: "confirmed",
    }).populate("team");
    if (registrations.length < 2) {
      return res.status(400).json({
        message: "At least 2 teams are required to generate a bracket",
      });
    }
    // convert the registrations to an array of teams
    const teams = registrations.map((registration) => registration.team);
    const { matches: firstRoundMatches } = createFirstRoundMatches(teams);
    const rounds = createBracketRounds(firstRoundMatches);

    const createdRounds = [];
    // loop through each round and create matches in the database
    for (let roundIndex = 0; roundIndex < rounds.length; roundIndex++) {
      const round = rounds[roundIndex];
      const createdRound = [];

      for (let matchIndex = 0; matchIndex < round.length; matchIndex++) {
        const match = round[matchIndex];

        const matchDocument = {
          tournament: tournamentId,
          round: roundIndex + 1,
          matchNumber: matchIndex + 1,
          teamA: match.teamA?._id || null,
          teamB: match.teamB?._id || null,
        };
        //  for loop for byes
        if (match.teamA && !match.teamB) {
          matchDocument.winner = match.teamA._id;
          matchDocument.status = "completed";
        }

        const createdMatch = await Match.create(matchDocument);
        createdRound.push(createdMatch);
      }
      createdRounds.push(createdRound);
    }
    // loop through the created rounds and update the nextMatch and nextMatchSlot fields for each match
    for (
      let roundIndex = 0;
      roundIndex < createdRounds.length - 1;
      roundIndex++
    ) {
      const currentRound = createdRounds[roundIndex];
      const nextRound = createdRounds[roundIndex + 1];
      // same loop as above but now we are updating the nextMatch and nextMatchSlot fields for each match
      for (let matchIndex = 0; matchIndex < currentRound.length; matchIndex++) {
        const currentMatch = currentRound[matchIndex];
        // calculate the index of the next match in the next round and determine whether the current match's winner will be teamA or teamB in the next match
        const nextRoundMatchIndex = Math.floor(matchIndex / 2);
        const slot = matchIndex % 2 === 0 ? "teamA" : "teamB";
        const nextMatch = nextRound[nextRoundMatchIndex];

        currentMatch.nextMatch = nextMatch._id;
        currentMatch.nextMatchSlot = slot;
        await currentMatch.save();

        if (currentMatch.status === "completed" && currentMatch.winner) {
          nextMatch[slot] = currentMatch.winner;
          await nextMatch.save();
        }
      }
    }
    tournament.status = "in_progress";
    await tournament.save();
    res.status(201).json({
      message: "Bracket generated successfully",
      rounds: createdRounds,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getTournamentMatches = async (req, res) => {
  try {
    const { tournamentId } = req.params;
    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      return res.status(404).json({
        message: "Tournament not found",
      });
    }
    const matches = await Match.find({
      tournament: tournamentId,
    })
      .populate("teamA", "name logo")
      .populate("teamB", "name logo")
      .populate("winner", "name logo")
      // ascending  order of round and matchNumber
      .sort({ round: 1, matchNumber: 1 });
    res.status(200).json({ matches });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getMatchById = async (req, res) => {
  try {
    const { id } = req.params;

    const match = await Match.findById(id)
      .populate("teamA", "name logo")
      .populate("teamB", "name logo")
      .populate("winner", "name logo");
    if (!match) {
      return res.status(404).json({
        message: "Match not found",
      });
    }

    res.status(200).json({ match });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const getUpcomingMatches = async (req, res) => {
  try {
    const teams = await Team.find({
      members: req.user._id,
    }).select("_id");

    const teamIds = teams.map((team) => team._id);

    const matches = await Match.find({
      $or: [{ teamA: { $in: teamIds } }, { teamB: { $in: teamIds } }],
      status: "scheduled",
      scheduledAt: { $gte: new Date() },
    })
      .populate("teamA", "name logo")
      .populate("teamB", "name logo")
      .populate("tournament", "name game")
      .sort({ scheduledAt: 1 });

    res.status(200).json({ matches });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const updateMatch = async (req, res) => {
  try {
    const { id } = req.params;
    const match = await Match.findById(id);
    if (!match) {
      return res.status(404).json({
        message: "Match not found",
      });
    }
    const { scheduledAt, status } = req.body;
    if (scheduledAt !== undefined) {
      match.scheduledAt = scheduledAt;
    }
    if (status !== undefined) {
      const allowedTransitions = {
        scheduled: ["in_progress"],
        in_progress: [],
        cancelled: ["scheduled"],
      };
      const allowedStatuses = allowedTransitions[match.status] || [];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: `Cannot change match status from ${match.status} to ${status}`,
        });
      }
      match.status = status;
    }
    await match.save();

    if (scheduledAt !== undefined && match.scheduledAt) {
      const teams = await Team.find({
        _id: { $in: [match.teamA, match.teamB].filter(Boolean) },
      }).select("members");

      const playerIds = [
        ...new Set(
          teams.flatMap((team) =>
            team.members.map((member) => member.toString()),
          ),
        ),
      ];

      for (const playerId of playerIds) {
        await createNotification({
          recipient: playerId,
          type: "match_scheduled",
          title: "Match Scheduled",
          message: "Your match has been scheduled.",
          metadata: {
            matchId: match._id,
            tournamentId: match.tournament,
            scheduledAt: match.scheduledAt,
          },
        });
      }
    }
    res.status(200).json({
      message: "Match updated successfully",
      match,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// helper function
const advanceWinner = async (match) => {
  if (!match.nextMatch || !match.nextMatchSlot || !match.winner) {
    return;
  }
  const nextMatch = await Match.findById(match.nextMatch);

  if (!nextMatch) {
    return;
  }

  nextMatch[match.nextMatchSlot] = match.winner;

  await nextMatch.save();

  const winningTeam = await Team.findById(match.winner).select("name members");

  if (!winningTeam) {
    return;
  }

  const results = await Promise.allSettled(
    winningTeam.members.map((playerId) =>
      createNotification({
        recipient: playerId,
        type: "advanced_to_next_round",
        title: "Advanced to Next Round",
        message: `Your team ${winningTeam.name} has advanced to the next round.`,
        metadata: {
          matchId: match._id,
          nextMatchId: nextMatch._id,
          tournamentId: match.tournament,
          teamId: winningTeam._id,
        },
      }),
    ),
  );

  results
    .filter((result) => result.status === "rejected")
    .forEach((result) => console.error("Notification failed:", result.reason));
};
export const submitMatchResult = async (req, res) => {
  try {
    const { id } = req.params;

    const match = await Match.findById(id);

    if (!match) {
      return res.status(404).json({
        message: "Match not found",
      });
    }
    if (match.status !== "scheduled") {
      return res.status(400).json({
        message: "Cannot submit a result for this match",
      });
    }
    const { teamA, teamB } = req.body;

    if (!match.teamA || !match.teamB) {
      return res.status(400).json({
        message: "Match is not ready yet (missing a team)",
      });
    }
    if (teamA === undefined || teamB === undefined) {
      return res.status(400).json({
        message: "Both team scores are required",
      });
    }
    if (
      typeof teamA !== "number" ||
      typeof teamB !== "number" ||
      teamA < 0 ||
      teamB < 0
    ) {
      return res.status(400).json({
        message: "Scores must be non-negative numbers",
      });
    }
    if (teamA === teamB) {
      return res.status(400).json({
        message: "A match cannot end in a draw",
      });
    }

    let winner = null;
    if (teamA > teamB) {
      winner = match.teamA;
    } else if (teamB > teamA) {
      winner = match.teamB;
    }
    match.score = {
      teamA,
      teamB,
    };

    match.winner = winner;
    match.status = "completed";

    await match.save();
    await advanceWinner(match);
    // match_result notification
    const teams = await Team.find({
      _id: { $in: [match.teamA, match.teamB] },
    }).select("members");

    const playerIds = [
      ...new Set(
        teams.flatMap((team) =>
          team.members.map((member) => member.toString()),
        ),
      ),
    ];
    const results = await Promise.allSettled(
      playerIds.map((playerId) =>
        createNotification({
          recipient: playerId,
          type: "match_result",
          title: "Match Result",
          message: "Your match result has been submitted.",
          metadata: {
            matchId: match._id,
            tournamentId: match.tournament,
            winner: match.winner,
            score: match.score,
          },
        }),
      ),
    );

    results
      .filter((result) => result.status === "rejected")
      .forEach((result) =>
        console.error("Notification failed:", result.reason),
      );
    // tournament_won notification
    if (!match.nextMatch && match.winner) {
      const winningTeam = await Team.findById(match.winner).select(
        "name members",
      );

      if (winningTeam) {
        const results = await Promise.allSettled(
          winningTeam.members.map((playerId) =>
            createNotification({
              recipient: playerId,
              type: "tournament_won",
              title: "Tournament Won",
              message: `Your team ${winningTeam.name} has won the tournament!`,
              metadata: {
                matchId: match._id,
                tournamentId: match.tournament,
                teamId: winningTeam._id,
              },
            }),
          ),
        );

        results
          .filter((result) => result.status === "rejected")
          .forEach((result) =>
            console.error("Notification failed:", result.reason),
          );
      }

      const tournament = await Tournament.findById(match.tournament);

      if (tournament) {
        tournament.status = "completed";
        await tournament.save();
      }
    }
    res.status(200).json({
      message: "Match result submitted successfully",
      match,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const cancelMatch = async (req, res) => {
  try {
    const { id } = req.params;
    const match = await Match.findById(id);
    if (!match) {
      return res.status(404).json({
        message: "Match not found",
      });
    }
    if (match.status === "completed" || match.status === "cancelled") {
      return res.status(400).json({
        message: "Match cannot be cancelled",
      });
    }

    match.status = "cancelled";

    await match.save();
    res.status(200).json({
      message: "Match cancelled successfully",
      match,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
