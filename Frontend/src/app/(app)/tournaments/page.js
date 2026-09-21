"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { Box, CircularProgress, Grid, Typography } from "@mui/material";
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
      } catch (error) {
        setError(error.message || "Failed to load tournaments");
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: 1400,
        mx: "auto",
        px: { xs: 2, md: 4 },
        py: 5,
      }}
    >
      <Box sx={{ mb: 5 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 900,
            mb: 1,
          }}
        >
          Tournaments
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 650 }}
        >
          Discover gaming tournaments, register your team, and compete for the
          win.
        </Typography>
      </Box>
      {error ? (
        <Typography color="error">{error}</Typography>
      ) : tournaments.length === 0 ? (
        <Typography color="text.secondary">
          No tournaments available right now.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {tournaments.map((tournament) => (
            <Grid
              key={tournament._id}
              size={{
                xs: 12,
                sm: 6,
                lg: 4,
              }}
            >
              <TournamentCard tournament={tournament} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
