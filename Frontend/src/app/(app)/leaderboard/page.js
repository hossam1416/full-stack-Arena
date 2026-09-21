"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { apiRequest } from "@/lib/api";
import PodiumCard from "@/components/leaderboard/PodiumCard";
import RankingRow, {
  RANKING_COLUMNS,
} from "@/components/leaderboard/RankingRow";

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // load the leaderboard, again every time the game filter changes
  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const query = selectedGame ? `?game=${selectedGame}` : "";
        const data = await apiRequest(`/leaderboard/teams${query}`);

        setLeaderboard(data.leaderboard || []);
        setError("");
      } catch (err) {
        setError(err.message || "Failed to load the leaderboard");
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboard();
  }, [selectedGame]);

  // the games for the filter
  useEffect(() => {
    const loadGames = async () => {
      try {
        const data = await apiRequest("/games");
        setGames(data.games || []);
      } catch (err) {
        console.error("Failed to load games:", err);
      }
    };

    loadGames();
  }, []);

  const topThree = leaderboard.slice(0, 3);
  const others = leaderboard.slice(3);

  return (
    <Box
      sx={{
        maxWidth: 1200,
        mx: "auto",
        px: { xs: 2, md: 3 },
        py: { xs: 4, md: 6 },
      }}
    >
      {/* header + game filter */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "flex-end" },
          gap: 3,
          mb: 5,
        }}
      >
        <Box>
          <Typography
            variant="h3"
            sx={{ fontWeight: 900, mb: 1, letterSpacing: "-0.03em" }}
          >
            Leaderboard
          </Typography>
          <Typography color="text.secondary">
            Track the top teams and see who is dominating the Arena.
          </Typography>
        </Box>

        <FormControl sx={{ minWidth: { xs: "100%", md: 220 } }}>
          <InputLabel id="game-filter-label">Filter by Game</InputLabel>
          <Select
            labelId="game-filter-label"
            value={selectedGame}
            label="Filter by Game"
            onChange={(event) => setSelectedGame(event.target.value)}
          >
            <MenuItem value="">All Games</MenuItem>
            {games.map((game) => (
              <MenuItem key={game._id} value={game._id}>
                {game.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {loading && (
        <Box sx={{ py: 10, textAlign: "center" }}>
          <CircularProgress color="primary" />
        </Box>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && leaderboard.length === 0 && (
        <Typography color="text.secondary">
          No leaderboard data available yet.
        </Typography>
      )}

      {/* top 3 */}
      {topThree.length > 0 && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
            gap: 2,
            alignItems: "end",
          }}
        >
          {topThree.map((entry, index) => (
            <PodiumCard key={entry.team._id} entry={entry} index={index} />
          ))}
        </Box>
      )}

      {/* rank 4 and below */}
      {others.length > 0 && (
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 2.5 }}>
            Rankings
          </Typography>

          {/* table header, only on desktop */}
          <Box
            sx={{
              display: { xs: "none", sm: "grid" },
              gridTemplateColumns: RANKING_COLUMNS,
              gap: 2,
              px: 3,
              py: 1.5,
              color: "text.secondary",
              fontSize: "0.75rem",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            {["Rank", "Team", "Points", "Wins", "Losses", "Win Rate"].map(
              (label, index) => (
                <Box
                  key={label}
                  sx={{ textAlign: index < 2 ? "left" : "center" }}
                >
                  {label}
                </Box>
              ),
            )}
          </Box>

          <Box
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
              overflow: "hidden",
              backgroundColor: "background.paper",
            }}
          >
            {others.map((entry, index) => (
              <RankingRow
                key={entry.team._id}
                entry={entry}
                rank={index + 4}
                isLast={index === others.length - 1}
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}
