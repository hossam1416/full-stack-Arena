"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { apiRequest } from "@/lib/api";
import ConfirmDialog from "@/components/common/ConfirmDialog";

export default function AdminTeamDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [team, setTeam] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    if (!id) return;

    const loadTeam = async () => {
      try {
        const [teamData, statsData] = await Promise.all([
          apiRequest(`/teams/${id}`),
          // stats are optional: if this request fails, the page still opens
          apiRequest(`/leaderboard/team/${id}`).catch(() => null),
        ]);

        setTeam(teamData.team);
        setStats(statsData);
      } catch (err) {
        setError(err.message || "Failed to load team");
      } finally {
        setLoading(false);
      }
    };

    loadTeam();
  }, [id]);

  const handleDeleteTeam = async () => {
    try {
      setDeleting(true);
      setDeleteError("");

      await apiRequest(`/teams/admin/${id}`, { method: "DELETE" });

      router.push("/admin/teams");
    } catch (err) {
      setDeleteError(err.message || "Failed to delete team");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !team) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error || "Team not found"}</Alert>
      </Container>
    );
  }

  const statItems = stats
    ? [
        { label: "Wins", value: stats.wins },
        { label: "Losses", value: stats.losses },
        { label: "Matches", value: stats.matchesPlayed },
        { label: "Points", value: stats.points },
        { label: "Tournaments", value: stats.tournamentsPlayed },
      ]
    : [];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ overflow: "hidden" }}>
        {/* banner */}
        <Box
          sx={{
            height: 240,
            bgcolor: "grey.900",
            backgroundImage: team.banner ? `url(${team.banner})` : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <Stack spacing={4} sx={{ p: 3 }}>
          {/* logo + name + game */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              src={team.logo || undefined}
              alt={team.name}
              sx={{ width: 80, height: 80 }}
            >
              {team.name?.charAt(0)}
            </Avatar>

            <Box>
              <Typography variant="h4" fontWeight={700}>
                {team.name}
              </Typography>
              <Typography color="text.secondary">
                {team.game?.name || "No game"}
              </Typography>
            </Box>
          </Stack>

          {/* captain + members */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 3,
            }}
          >
            <Box>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Captain
              </Typography>
              <Typography color="text.secondary">
                {team.captain?.username || "—"}
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Members ({team.members?.length || 0})
              </Typography>

              <Stack spacing={1.5}>
                {team.members?.map((member) => (
                  <Stack
                    key={member._id}
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                  >
                    <Avatar
                      src={member.avatar || undefined}
                      alt={member.username}
                    >
                      {member.username?.charAt(0)}
                    </Avatar>

                    <Box>
                      <Typography fontWeight={600}>
                        {member.username}
                      </Typography>
                      {member._id === team.captain?._id && (
                        <Typography variant="body2" color="text.secondary">
                          Captain
                        </Typography>
                      )}
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </Box>
          </Box>

          {/* description */}
          <Box>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Description
            </Typography>
            <Typography color="text.secondary">
              {team.description || "No description provided."}
            </Typography>
          </Box>

          {/* stats */}
          {stats && (
            <Box>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Team Stats
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr 1fr",
                    sm: "repeat(3, 1fr)",
                    md: "repeat(5, 1fr)",
                  },
                  gap: 2,
                }}
              >
                {statItems.map((item) => (
                  <Paper key={item.label} sx={{ p: 2 }}>
                    <Typography variant="h5" fontWeight={700}>
                      {item.value ?? 0}
                    </Typography>
                    <Typography color="text.secondary">{item.label}</Typography>
                  </Paper>
                ))}
              </Box>
            </Box>
          )}
        </Stack>
      </Paper>

      <Button
        variant="outlined"
        color="error"
        sx={{ mt: 3 }}
        onClick={() => setDeleteDialogOpen(true)}
      >
        Delete Team
      </Button>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Team"
        message={`Are you sure you want to delete ${team.name}? This action cannot be undone.`}
        confirmText="Delete Team"
        confirmColor="error"
        loading={deleting}
        error={deleteError}
        onConfirm={handleDeleteTeam}
        onClose={() => setDeleteDialogOpen(false)}
      />
    </Container>
  );
}
