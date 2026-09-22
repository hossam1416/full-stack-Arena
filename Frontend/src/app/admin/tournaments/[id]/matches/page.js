"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
  TextField,
} from "@mui/material";
import { apiRequest } from "@/lib/api";

const toDateTimeLocal = (date) => {
  if (!date) return "";

  const value = new Date(date);
  value.setMinutes(value.getMinutes() - value.getTimezoneOffset());

  return value.toISOString().slice(0, 16);
};

const toISO = (value) => (value ? new Date(value).toISOString() : value);

export default function AdminTournamentMatchesPage() {
  const { id } = useParams();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scheduledTimes, setScheduledTimes] = useState({});
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const data = await apiRequest(`/matches/tournament/${id}`);
        setMatches(data.matches);
      } catch (error) {
        console.error("Failed to fetch matches:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [id]);

  const handleSchedule = async (matchId) => {
    const localValue = scheduledTimes[matchId];

    if (!localValue) return;

    const scheduledAt = toISO(localValue);

    try {
      setSavingId(matchId);

      await apiRequest(`/matches/${matchId}`, {
        method: "PUT",
        body: JSON.stringify({ scheduledAt }),
      });

      setMatches((prev) =>
        prev.map((match) =>
          match._id === matchId ? { ...match, scheduledAt } : match,
        ),
      );
    } catch (error) {
      console.error("Failed to schedule match:", error);
    } finally {
      setSavingId(null);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 5 }}>
      {/* Page title */}
      <Typography variant="h4" sx={{ fontWeight: 900, mb: 4 }}>
        Tournament Matches
      </Typography>

      {/* Matches grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2, 1fr)",
          },
          gap: 2,
        }}
      >
        {matches.map((match) => (
          <Box
            key={match._id}
            sx={{
              p: 3,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
            }}
          >
            {/* Match information */}
            <Typography variant="overline" sx={{ fontWeight: 800 }}>
              Round {match.round} — Match {match.matchNumber}
            </Typography>

            <Typography sx={{ mt: 2, fontWeight: 800 }}>
              {match.teamA?.name || "TBD"}
            </Typography>

            <Typography
              sx={{
                my: 1,
                fontWeight: 900,
                color: "primary.main",
              }}
            >
              VS
            </Typography>

            <Typography sx={{ fontWeight: 800 }}>
              {match.teamB?.name || "TBD"}
            </Typography>

            {/* Match status */}
            <Typography
              sx={{
                mt: 2,
                fontSize: 14,
                opacity: 0.7,
              }}
            >
              Status: {match.status}
            </Typography>

            <Typography
              sx={{
                fontSize: 14,
                opacity: 0.7,
              }}
            >
              {match.scheduledAt
                ? new Date(match.scheduledAt).toLocaleString()
                : "Time not scheduled"}
            </Typography>

            {/* Schedule input */}
            <TextField
              label="Match Time"
              type="datetime-local"
              value={
                scheduledTimes[match._id] ?? toDateTimeLocal(match.scheduledAt)
              }
              onChange={(event) =>
                setScheduledTimes((prev) => ({
                  ...prev,
                  [match._id]: event.target.value,
                }))
              }
              slotProps={{ inputLabel: { shrink: true } }}
              fullWidth
              sx={{
                mt: 2,
                "& input::-webkit-calendar-picker-indicator": {
                  filter: "invert(1)",
                  cursor: "pointer",
                },
              }}
            />
            {/* Save schedule */}
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 2, fontWeight: 800 }}
              disabled={!scheduledTimes[match._id] || savingId === match._id}
              onClick={() => handleSchedule(match._id)}
            >
              {savingId === match._id
                ? "Saving..."
                : match.scheduledAt
                  ? "Update Time"
                  : "Schedule Match"}
            </Button>
          </Box>
        ))}
      </Box>
    </Container>
  );
}
