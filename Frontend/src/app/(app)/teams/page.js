"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import { apiRequest } from "@/lib/api";
import PageContainer from "@/components/layout/PageContainer";
import { LoadingState, MessageState } from "@/components/common/PageState";
import TeamCard from "@/components/teams/TeamCard";
import TeamFilter from "@/components/teams/TeamFilters";

export default function TeamsPage() {
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
      } catch (err) {
        console.error("Failed to fetch teams:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  // the games for the filter (a Map removes the duplicates by game ID)
  const games = useMemo(
    () => [
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

  let content;

  if (loading) {
    content = <LoadingState />;
  } else if (error) {
    content = (
      <MessageState error text="Failed to load teams. Please try again." />
    );
  } else if (filteredTeams.length === 0) {
    content = <MessageState text="No teams found" />;
  } else {
    content = (
      <Grid container spacing={3}>
        {filteredTeams.map((team) => (
          <Grid key={team._id} size={{ xs: 12, sm: 6, md: 4 }}>
            <TeamCard team={team} />
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <PageContainer>
      {/* header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 4 }}
      >
        <Box>
          <Typography variant="h4" gutterBottom>
            TEAMS
          </Typography>
          <Typography color="text.secondary">
            Find your squad. Build your roster. Enter the arena.
          </Typography>
        </Box>

        <Button component={Link} href="/teams/create" variant="contained">
          CREATE TEAM
        </Button>
      </Stack>

      <TeamFilter
        search={search}
        onSearchChange={setSearch}
        selectedGame={selectedGame}
        onGameChange={setSelectedGame}
        games={games}
      />

      {content}
    </PageContainer>
  );
}
