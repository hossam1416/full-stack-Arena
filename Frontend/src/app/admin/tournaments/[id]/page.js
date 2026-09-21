"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { apiRequest } from "@/lib/api";

const statusColors = { open: "success", in_progress: "warning" };

// the buttons of each status: they change the status of the tournament
const statusActions = {
  draft: [
    { label: "Open Registration", value: "open" },
    { label: "Cancel Tournament", value: "cancelled" },
  ],
  open: [{ label: "Cancel Tournament", value: "cancelled" }],
  in_progress: [{ label: "Complete Tournament", value: "completed" }],
  completed: [],
  cancelled: [],
};

const formatDate = (date) => (date ? new Date(date).toLocaleString() : "—");

export default function AdminTournamentDetailsPage() {
  const { id } = useParams();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [acting, setActing] = useState(false);
  const [actionError, setActionError] = useState("");

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

  const runAction = async (action) => {
    try {
      setActing(true);
      setActionError("");
      await action();
    } catch (err) {
      setActionError(err.message || "Action failed");
    } finally {
      setActing(false);
    }
  };

  const changeStatus = (status) =>
    runAction(async () => {
      await apiRequest(`/tournaments/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });

      // only the status changes, so we keep the game and the other data
      setTournament({ ...tournament, status });
    });

  const generateBracket = () =>
    runAction(async () => {
      await apiRequest(`/matches/tournament/${id}/generate`, {
        method: "POST",
      });

      setTournament({ ...tournament, status: "in_progress" });
    });

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !tournament) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error || "Tournament not found"}</Alert>
      </Container>
    );
  }

  const infoCards = [
    { label: "Format", value: tournament.format || "—" },
    {
      label: "Teams",
      value: `${tournament.registrationCount ?? 0} / ${tournament.maxTeams ?? "—"}`,
    },
    {
      label: "Registration Deadline",
      value: formatDate(tournament.registrationDeadline),
    },
    { label: "Start Date", value: formatDate(tournament.startDate) },
    { label: "End Date", value: formatDate(tournament.endDate) },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ overflow: "hidden" }}>
        {/* banner */}
        <Box
          sx={{
            height: 260,
            bgcolor: "grey.900",
            backgroundImage: tournament.banner
              ? `url(${tournament.banner})`
              : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <Box sx={{ p: 3 }}>
          {/* name, status and the action buttons */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            flexWrap="wrap"
            gap={2}
          >
            <Box>
              <Typography variant="h4" fontWeight={700}>
                {tournament.name}
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                {tournament.game?.name || "No game"}
              </Typography>
            </Box>

            <Stack direction="row" alignItems="center" spacing={1}>
              <Chip
                label={tournament.status || "Unknown"}
                color={statusColors[tournament.status] || "default"}
              />

              {(statusActions[tournament.status] || []).map((action) => (
                <Button
                  key={action.value}
                  variant="outlined"
                  disabled={acting}
                  onClick={() => changeStatus(action.value)}
                >
                  {action.label}
                </Button>
              ))}

              {tournament.status === "open" && (
                <Button
                  variant="contained"
                  disabled={acting}
                  onClick={generateBracket}
                >
                  Generate Bracket
                </Button>
              )}
            </Stack>
          </Stack>

          {actionError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {actionError}
            </Alert>
          )}

          {/* information cards */}
          <Box
            sx={{
              mt: 4,
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                md: "repeat(3, 1fr)",
              },
              gap: 2,
            }}
          >
            {infoCards.map((card) => (
              <Paper key={card.label} sx={{ p: 2 }}>
                <Typography color="text.secondary">{card.label}</Typography>
                <Typography variant="h6" fontWeight={600}>
                  {card.value}
                </Typography>
              </Paper>
            ))}
          </Box>

          {/* registrations */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
              Registrations
            </Typography>

            {!tournament.registrations?.length ? (
              <Paper sx={{ p: 3 }}>
                <Typography color="text.secondary">
                  No teams have registered for this tournament yet.
                </Typography>
              </Paper>
            ) : (
              <Stack spacing={1.5}>
                {tournament.registrations.map((registration) => (
                  <Paper
                    key={registration._id}
                    sx={{
                      p: 2,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Box>
                      <Typography fontWeight={600}>
                        {registration.team?.name || "Unknown Team"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {registration.players?.length || 0} players
                      </Typography>
                    </Box>

                    <Chip label="Confirmed" color="success" size="small" />
                  </Paper>
                ))}
              </Stack>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
