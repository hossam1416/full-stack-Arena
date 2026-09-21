"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { apiRequest } from "@/lib/api";
import {
  formatStatus,
  getPrizePool,
  getRegistrationState,
  STATUS_COLORS,
} from "@/lib/tournamentHelpers";

const formatDate = (date) => new Date(date).toLocaleDateString();
// A card with a title and a short text on the left, and a button on the right
function ActionCard({ title, text, children }) {
  return (
    <Paper
      sx={{
        mt: 3,
        p: { xs: 3, md: 4 },
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={800} mb={1}>
            {title}
          </Typography>
          <Typography color="text.secondary">{text}</Typography>
        </Box>
        {children}
      </Box>
    </Paper>
  );
}

export default function TournamentDetailsPage() {
  const { id } = useParams();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    const loadTournament = async () => {
      try {
        const data = await apiRequest(`/tournaments/${id}`);
        setTournament(data.tournament);
      } catch (err) {
        setError(err.message || "Failed to load tournament");
      } finally {
        setLoading(false);
      }
    };
    loadTournament();
  }, [id]);

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

  if (error || !tournament) {
    return (
      <Box sx={{ maxWidth: 1400, mx: "auto", px: 4, py: 5 }}>
        <Alert severity="error">{error || "Tournament not found"}</Alert>
      </Box>
    );
  }

  const registration = getRegistrationState(tournament);

  // the bracket exists only after the tournament started
  const hasBracket = ["in_progress", "completed"].includes(tournament.status);

  const statCards = [
    {
      label: "Teams",
      value: `${tournament.registrationCount} / ${tournament.maxTeams}`,
    },
    {
      label: "Prize Pool",
      value: `$${getPrizePool(tournament).toLocaleString()}`,
    },
    { label: "Starts", value: formatDate(tournament.startDate) },
    {
      label: "Registration Closes",
      value: formatDate(tournament.registrationDeadline),
    },
  ];

  const infoItems = [
    { label: "Game", value: tournament.game?.name },
    { label: "Format", value: tournament.format },
    { label: "Created By", value: tournament.createdBy?.username },
  ];

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", px: { xs: 2, md: 4 }, py: 5 }}>
      {/* hero: banner, status, name, description */}
      <Paper
        sx={{ overflow: "hidden", border: "1px solid", borderColor: "divider" }}
      >
        <Box
          sx={{
            height: { xs: 140, md: 220 },
            backgroundColor: "background.default",
            backgroundImage: tournament.banner
              ? `url(${tournament.banner})`
              : "linear-gradient(135deg, #1A1616 0%, #0C0A0A 100%)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <Box sx={{ p: { xs: 3, md: 4 } }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              flexWrap: "wrap",
              mb: 2,
            }}
          >
            <Chip
              label={formatStatus(tournament.status)}
              color={STATUS_COLORS[tournament.status] || "default"}
              size="small"
            />
            <Typography color="text.secondary">
              {tournament.game?.name} • {tournament.format}
            </Typography>
          </Box>

          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              mb: 2,
              fontSize: { xs: "1.8rem", md: "2.4rem" },
            }}
          >
            {tournament.name}
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ maxWidth: 800, lineHeight: 1.8 }}
          >
            {tournament.description || "No description available."}
          </Typography>
        </Box>
      </Paper>

      {/* numbers */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        {statCards.map((card) => (
          <Grid key={card.label} size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper sx={{ p: 3, height: "100%" }}>
              <Typography variant="body2" color="text.secondary">
                {card.label}
              </Typography>
              <Typography variant="h6" fontWeight={800} sx={{ mt: 1 }}>
                {card.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* register */}
      <ActionCard
        title="Join the Tournament"
        text="Register your team and compete in this tournament."
      >
        <Button
          component={Link}
          href={`/tournaments/${tournament._id}/register`}
          variant="contained"
          size="large"
          disabled={!registration.open}
          sx={{ minWidth: 180, fontWeight: 800 }}
        >
          {registration.label}
        </Button>
      </ActionCard>

      {/* matches */}
      {hasBracket && (
        <ActionCard
          title="Matches & Bracket"
          text="View tournament matches, results, and the competition bracket."
        >
          <Button
            component={Link}
            href={`/tournaments/${tournament._id}/matches`}
            variant="outlined"
            size="large"
            sx={{ minWidth: 180, fontWeight: 800 }}
          >
            View Matches
          </Button>
        </ActionCard>
      )}

      {/* rules + info */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper
            sx={{
              p: { xs: 3, md: 4 },
              height: "100%",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography variant="h5" fontWeight={800} mb={2}>
              Tournament Rules
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ lineHeight: 1.9, whiteSpace: "pre-line" }}
            >
              {tournament.rules || "No specific rules have been provided."}
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            sx={{
              p: { xs: 3, md: 4 },
              height: "100%",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography variant="h5" fontWeight={800} mb={3}>
              Tournament Info
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {infoItems.map((item) => (
                <Box key={item.label}>
                  <Typography variant="body2" color="text.secondary">
                    {item.label}
                  </Typography>
                  <Typography fontWeight={700}>{item.value}</Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* registered teams */}
      <Paper
        sx={{
          mt: 3,
          p: { xs: 3, md: 4 },
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="h5" fontWeight={800}>
          Registered Teams
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5, mb: 3 }}>
          {tournament.registrationCount} of {tournament.maxTeams} teams
          registered
        </Typography>

        {!tournament.registrations?.length ? (
          <Typography color="text.secondary">
            No teams have registered for this tournament yet.
          </Typography>
        ) : (
          <Grid container spacing={2}>
            {tournament.registrations.map((registration) => (
              <Grid key={registration._id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Avatar
                    src={registration.team?.logo || undefined}
                    alt={registration.team?.name}
                    sx={{ width: 52, height: 52 }}
                  >
                    {registration.team?.name?.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography fontWeight={800} noWrap>
                    {registration.team?.name || "Unknown Team"}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </Box>
  );
}
