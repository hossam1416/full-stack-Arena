"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import {
  Box,
  Button,
  Container,
  Grid,
  Stack,
  Typography,
  CircularProgress,
} from "@mui/material";
import TeamCard from "../../../components/teams/TeamCard";
import TeamFilter from "../../../components/teams/TeamFilters";

export default function TeamsPage() {
  const router = useRouter();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedGame, setSelectedGame] = useState("all");

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const data = await apiRequest("/teams");
        setTeams(data.teams || []);
        setError(false);
      } catch (error) {
        console.error("Failed to fetch teams:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  const games = useMemo(
    () => [
      // for unique games, we can use a Map to filter out duplicates based on game ID
      ...new Map(
        teams
          .filter((team) => team.game)
          .map((team) => [team.game._id, team.game]),
      ).values(),
    ],
    [teams],
  );

  const filteredTeams = useMemo(
    () =>
      teams.filter((team) => {
        const matchesSearch = team.name
          ?.toLowerCase()
          .includes(search.toLowerCase());

        const matchesGame =
          selectedGame === "all" || team.game?._id === selectedGame;

        return matchesSearch && matchesGame;
      }),
    [teams, search, selectedGame],
  );

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 72px)",
        backgroundColor: "background.default",
        py: { xs: 3, md: 5 },
      }}
    >
      <Container maxWidth="xl">
        {/* Header */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
          spacing={2}
          sx={{ mb: 4 }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: 900, letterSpacing: "-0.02em" }}
            >
              TEAMS
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ mt: 0.75, fontSize: "0.95rem" }}
            >
              Find your squad. Build your roster. Enter the arena.
            </Typography>
          </Box>

          <Button
            variant="contained"
            sx={{
              fontWeight: 800,
              px: 3,
              py: 1.2,
              boxShadow: "0 0 18px rgba(220, 38, 38, 0.25)",
            }}
            onClick={() => router.push("/teams/create")}
          >
            CREATE TEAM
          </Button>
        </Stack>

        {/* Filters */}
        <TeamFilter
          search={search}
          onSearchChange={setSearch}
          selectedGame={selectedGame}
          onGameChange={setSelectedGame}
          games={games}
        />

        {/* Content Area */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : error ? (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              backgroundColor: "background.paper",
              borderRadius: 2,
              border: "1px dashed rgba(220, 38, 38, 0.3)",
            }}
          >
            <Typography color="error" variant="h6">
              Failed to load teams. Please try again.
            </Typography>
          </Box>
        ) : filteredTeams.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              backgroundColor: "background.paper",
              borderRadius: 2,
              border: "1px dashed rgba(255,255,255,0.1)",
            }}
          >
            <Typography color="text.secondary" variant="h6">
              No teams found
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredTeams.map((team) => (
              <Grid key={team._id} size={{ xs: 12, sm: 6, md: 4 }}>
                <TeamCard team={team} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
