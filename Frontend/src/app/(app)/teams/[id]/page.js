"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  Card,
  Grid,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import BackButton from "@/components/common/BackButton";
import Section from "@/components/common/Section";
import { LoadingState, MessageState } from "@/components/common/PageState";
import PageContainer from "@/components/layout/PageContainer";
import TeamHeader from "@/components/teams/TeamHeader";
import MembersGrid from "@/components/teams/MembersGrid";

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

// small label + value (CAPTAIN, FOUNDED)
function InfoItem({ label, value }) {
  return (
    <Box>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block" }}
      >
        {label}
      </Typography>
      <Typography sx={{ fontWeight: 800 }}>{value}</Typography>
    </Box>
  );
}

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
      } catch {
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
      <PageContainer>
        <LoadingState />
      </PageContainer>
    );
  }

  if (fetchError || !team) {
    return (
      <PageContainer>
        <MessageState
          error
          text={
            fetchError
              ? "Failed to load team. Please try again."
              : "Team not found"
          }
        />
      </PageContainer>
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
    <PageContainer maxWidth="lg">
      <BackButton href="/teams">BACK TO TEAMS</BackButton>

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
          <InfoItem
            label="CAPTAIN"
            value={team.captain?.username || "Unknown"}
          />
          <InfoItem label="FOUNDED" value={formatDate(team.createdAt)} />

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

      {team.description && (
        <Section title="ABOUT THE TEAM">
          <Card sx={{ p: 3 }}>
            <Typography color="text.secondary">{team.description}</Typography>
          </Card>
        </Section>
      )}

      {stats && (
        <Section title="TEAM STATS">
          <Grid container spacing={2}>
            {statItems.map((item) => (
              <Grid key={item.label} size={{ xs: 6, sm: 3 }}>
                <Card sx={{ p: 2.5, textAlign: "center" }}>
                  <Typography variant="h4" color="primary.main">
                    {item.value}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: 700 }}
                  >
                    {item.label}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Section>
      )}

      <Section title={`ROSTER (${team.members?.length || 0})`}>
        <MembersGrid team={team} />
      </Section>

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
    </PageContainer>
  );
}
