"use client";

import { useEffect, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { apiRequest } from "@/lib/api";
import PageContainer from "@/components/layout/PageContainer";
import { LoadingState, MessageState } from "@/components/common/PageState";
import TournamentCard from "@/components/tournaments/TournamentCard";

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const data = await apiRequest("/tournaments");
        setTournaments(data.tournaments);
      } catch (err) {
        setError(err.message || "Failed to load tournaments");
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  let content;

  if (loading) {
    content = <LoadingState />;
  } else if (error) {
    content = <MessageState error text={error} />;
  } else if (tournaments.length === 0) {
    content = <MessageState text="No tournaments available right now." />;
  } else {
    content = (
      <Grid container spacing={3}>
        {tournaments.map((tournament) => (
          <Grid key={tournament._id} size={{ xs: 12, sm: 6, lg: 4 }}>
            <TournamentCard tournament={tournament} />
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <PageContainer>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          TOURNAMENTS
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 650 }}>
          Discover gaming tournaments, register your team, and compete for the
          win.
        </Typography>
      </Box>

      {content}
    </PageContainer>
  );
}
