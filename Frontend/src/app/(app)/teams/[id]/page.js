"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SettingsIcon from "@mui/icons-material/Settings";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import TeamHeader from "@/components/teams/TeamHeader";

const centerScreen = {
  minHeight: "calc(100vh - 72px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "background.default",
};

// small style objects used more than once in this page
const sectionTitleSx = { fontWeight: 900, mb: 1.5, letterSpacing: "0.05em" };
const cardSx = {
  border: "1px solid rgba(156, 163, 175, 0.12)",
  borderRadius: 2.5,
};

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

export default function TeamDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [team, setTeam] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [message, setMessage] = useState("");
  // join
  const [joining, setJoining] = useState(false);
  const [joinPending, setJoinPending] = useState(false);
  const [joinError, setJoinError] = useState("");

  // leave (confirmation dialog)
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [leaveError, setLeaveError] = useState("");

  useEffect(() => {
    if (!id) return;
    const loadTeam = async () => {
      try {
        const data = await apiRequest(`/teams/${id}`);
        setTeam(data.team);
      } catch (err) {
        setFetchError(true);
      } finally {
        setLoading(false);
      }
    };

    const loadStats = async () => {
      try {
        const data = await apiRequest(`/leaderboard/team/${id}`);
        setStats(data.stats);
      } catch (err) {
        console.error("Failed to load team stats:", err);
      }
    };
    const loadJoinRequestStatus = async () => {
      try {
        const data = await apiRequest(`/join-requests/${id}/my-status`);
        setJoinPending(data.pending);
      } catch (err) {
        console.error("Failed to load join request status:", err);
      }
    };
    loadTeam();
    loadStats();
    loadJoinRequestStatus();
  }, [id]);

  const handleJoin = async () => {
    try {
      setJoining(true);
      setJoinError("");

      await apiRequest(`/join-requests/${id}`, { method: "POST" });

      setJoinPending(true);
      setMessage("Join request sent");
    } catch (err) {
      setJoinError(err.message || "Failed to send the request");
    } finally {
      setJoining(false);
    }
  };

  const handleLeave = async () => {
    try {
      setLeaving(true);
      setLeaveError("");

      await apiRequest(`/teams/${id}/leave`, { method: "PATCH" });

      router.push("/teams");
    } catch (err) {
      setLeaveError(err.message || "Failed to leave the team");
      setLeaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={centerScreen}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (fetchError || !team) {
    return (
      <Box sx={centerScreen}>
        <Typography color="error">
          {fetchError
            ? "Failed to load team. Please try again."
            : "Team not found"}
        </Typography>
      </Box>
    );
  }

  const isCaptain = team.captain?._id === user?.id;
  const isMember = team.members?.some((member) => member._id === user?.id);

  const statItems = stats
    ? [
        { label: "WINS", value: stats.wins },
        { label: "LOSSES", value: stats.losses },
        { label: "MATCHES PLAYED", value: stats.matchesPlayed },
        { label: "TOURNAMENTS", value: stats.tournamentsPlayed },
      ]
    : [];

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 72px)",
        backgroundColor: "background.default",
        py: { xs: 3, md: 5 },
      }}
    >
      <Container maxWidth="lg">
        <Button
          component={Link}
          href="/teams"
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 3, color: "text.secondary" }}
        >
          BACK TO TEAMS
        </Button>

        {joinError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {joinError}
          </Alert>
        )}

        {/* banner, logo, name, game + captain, date and buttons on the right */}
        <TeamHeader team={team}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={3}
            alignItems={{ xs: "flex-start", sm: "center" }}
          >
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
                CAPTAIN
              </Typography>
              <Typography sx={{ fontWeight: 800 }}>
                {team.captain?.username || "Unknown"}
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
                FOUNDED
              </Typography>
              <Typography sx={{ fontWeight: 800 }}>
                {formatDate(team.createdAt)}
              </Typography>
            </Box>

            {isCaptain && (
              <Button
                component={Link}
                href={`/teams/${team._id}/manage`}
                variant="contained"
                startIcon={<SettingsIcon />}
              >
                MANAGE TEAM
              </Button>
            )}

            {isMember && !isCaptain && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<ExitToAppIcon />}
                onClick={() => {
                  setLeaveError("");
                  setLeaveOpen(true);
                }}
              >
                LEAVE TEAM
              </Button>
            )}

            {!isMember && (
              <Button
                variant="contained"
                startIcon={<PersonAddIcon />}
                disabled={joining || joinPending}
                onClick={handleJoin}
              >
                {joinPending
                  ? "PENDING"
                  : joining
                    ? "SENDING..."
                    : "REQUEST TO JOIN"}
              </Button>
            )}
          </Stack>
        </TeamHeader>

        {/* about */}
        {team.description && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={sectionTitleSx}>
              ABOUT THE TEAM
            </Typography>
            <Paper elevation={0} sx={{ p: 3, ...cardSx }}>
              <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                {team.description}
              </Typography>
            </Paper>
          </Box>
        )}

        {/* stats */}
        {stats && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={sectionTitleSx}>
              TEAM STATS
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(2, 1fr)",
                  sm: "repeat(4, 1fr)",
                },
                gap: 2,
              }}
            >
              {statItems.map((item) => (
                <Paper
                  key={item.label}
                  elevation={0}
                  sx={{ p: 2.5, textAlign: "center", ...cardSx }}
                >
                  <Typography
                    variant="h4"
                    color="primary.main"
                    sx={{ fontWeight: 900 }}
                  >
                    {item.value}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: 700 }}
                  >
                    {item.label}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Box>
        )}

        {/* roster */}
        <Typography variant="h6" sx={{ ...sectionTitleSx, mb: 2.5 }}>
          ROSTER ({team.members?.length || 0})
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: 2,
          }}
        >
          {team.members?.map((member) => {
            const isMemberCaptain = member._id === team.captain?._id;

            return (
              <Paper
                key={member._id}
                component={Link}
                href={`/players/${member._id}`}
                elevation={0}
                sx={{
                  p: 2.5,
                  textDecoration: "none",
                  transition: "all 0.2s ease-in-out",
                  ...cardSx,
                  "&:hover": {
                    borderColor: "rgba(220, 38, 38, 0.35)",
                    boxShadow: "0 0 20px rgba(220, 38, 38, 0.08)",
                  },
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar
                    src={member.avatar || undefined}
                    alt={member.username}
                    sx={{ width: 48, height: 48, fontWeight: 800 }}
                  >
                    {member.username?.charAt(0).toUpperCase()}
                  </Avatar>

                  <Box>
                    <Typography sx={{ fontWeight: 800, fontSize: "0.95rem" }}>
                      {member.username}
                    </Typography>
                    <Typography
                      color={
                        isMemberCaptain ? "primary.main" : "text.secondary"
                      }
                      sx={{ fontSize: "0.725rem", fontWeight: 800 }}
                    >
                      {isMemberCaptain ? "CAPTAIN" : "MEMBER"}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            );
          })}
        </Box>

        <ConfirmDialog
          open={leaveOpen}
          title="Leave Team"
          message={`Are you sure you want to leave ${team.name}? You will need to send a new join request if you want to come back.`}
          confirmText="Leave"
          confirmColor="error"
          loading={leaving}
          error={leaveError}
          onConfirm={handleLeave}
          onClose={() => setLeaveOpen(false)}
        />

        <Snackbar
          open={Boolean(message)}
          autoHideDuration={3000}
          onClose={() => setMessage("")}
          message={message}
        />
      </Container>
    </Box>
  );
}
