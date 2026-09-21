"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Alert,
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
import SecurityIcon from "@mui/icons-material/Security";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import TeamHeader from "@/components/teams/TeamHeader";
import TeamSettingsForm from "@/components/teams/TeamSettingsForm";
import RosterList from "@/components/teams/RosterList";
import JoinRequestsList from "@/components/teams/JoinRequestsList";

// texts for the confirmation dialog, one entry for each action
const CONFIRM_CONFIG = {
  remove: {
    title: "Remove Member",
    confirmText: "Remove",
    confirmColor: "error",
    getMessage: (member) =>
      `Are you sure you want to remove ${member.username} from your team?`,
  },
  transfer: {
    title: "Transfer Captaincy",
    confirmText: "Transfer",
    confirmColor: "primary",
    getMessage: (member) =>
      `Make ${member.username} the new captain? You will no longer be the team captain.`,
  },
  delete: {
    title: "Delete Team",
    confirmText: "Delete",
    confirmColor: "error",
    getMessage: () =>
      "Are you sure you want to permanently delete this team? This cannot be undone.",
  },
};

const centerScreen = {
  minHeight: "calc(100vh - 72px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "background.default",
};

export default function ManageTeamPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [team, setTeam] = useState(null);
  const [joinRequests, setJoinRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const reload = () => setRefreshTrigger((key) => key + 1);
  // message at the bottom
  const [message, setMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const [processingId, setProcessingId] = useState(null);
  // confirmation dialog
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [confirmError, setConfirmError] = useState("");

  // load the team, and the join requests (only the captain can see them)
  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      try {
        const teamData = await apiRequest(`/teams/${id}`);
        setTeam(teamData.team);

        if (teamData.team.captain?._id === user?.id) {
          const requestsData = await apiRequest(`/join-requests/${id}`);
          setJoinRequests(requestsData.joinRequests || []);
        } else {
          router.replace(`/teams/${id}`); // not the captain
        }
      } catch (err) {
        setFetchError(true);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, user, router, refreshTrigger]);

  // accept or reject a join request
  const handleRequest = async (requestId, action) => {
    try {
      setProcessingId(requestId);
      setActionError("");

      await apiRequest(`/join-requests/${requestId}/${action}`, {
        method: "PATCH",
      });

      setMessage(
        action === "accept" ? "Player added to the team" : "Request rejected",
      );
      reload();
    } catch (err) {
      setActionError(err.message || `Failed to ${action} the request`);
    } finally {
      setProcessingId(null);
    }
  };

  const openConfirm = (type, member) => {
    setConfirmError("");
    setConfirmAction({ type, member });
  };

  // the Confirm button of the dialog
  const handleConfirm = async () => {
    const { type, member } = confirmAction;

    try {
      setConfirming(true);
      setConfirmError("");

      if (type === "remove") {
        await apiRequest(`/teams/${id}/members/${member._id}`, {
          method: "PATCH",
        });
        setMessage("Member removed");
        reload();
      } else if (type === "transfer") {
        await apiRequest(`/teams/${id}/transfer-captaincy/${member._id}`, {
          method: "PATCH",
        });
        router.push(`/teams/${id}`);
      } else if (type === "delete") {
        await apiRequest(`/teams/${id}`, { method: "DELETE" });
        router.push("/teams");
      }

      setConfirmAction(null);
    } catch (err) {
      setConfirmError(err.message || "Something went wrong");
    } finally {
      setConfirming(false);
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
          Failed to load team. Please try again.
        </Typography>
      </Box>
    );
  }

  // not the captain: the page is redirecting
  if (team.captain?._id !== user?.id) return null;

  const confirmConfig = confirmAction
    ? CONFIRM_CONFIG[confirmAction.type]
    : null;

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
          href={`/teams/${id}`}
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 3, color: "text.secondary" }}
        >
          BACK TO TEAM
        </Button>

        {actionError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {actionError}
          </Alert>
        )}

        <TeamHeader team={team}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            color="text.secondary"
          >
            <SecurityIcon fontSize="small" />
            <Typography sx={{ fontSize: "0.8rem", fontWeight: 700 }}>
              TEAM CAPTAIN
            </Typography>
          </Stack>
        </TeamHeader>

        <TeamSettingsForm
          team={team}
          onSaved={() => {
            setMessage("Team updated");
            reload();
          }}
        />

        <RosterList
          team={team}
          onRemove={(member) => openConfirm("remove", member)}
          onTransfer={(member) => openConfirm("transfer", member)}
        />

        <JoinRequestsList
          requests={joinRequests}
          processingId={processingId}
          onAccept={(requestId) => handleRequest(requestId, "accept")}
          onReject={(requestId) => handleRequest(requestId, "reject")}
        />

        {/* a team can only be deleted when the captain is the only member */}
        {team.members?.length === 1 && (
          <Paper
            elevation={0}
            sx={{
              mt: 5,
              p: { xs: 3, md: 4 },
              border: "1px solid rgba(239, 68, 68, 0.2)",
              borderRadius: 3,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 900 }}>
              DELETE TEAM
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ mb: 2.5, fontSize: "0.9rem" }}
            >
              Permanently delete this team and all of its pending join requests.
            </Typography>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => openConfirm("delete")}
            >
              DELETE TEAM
            </Button>
          </Paper>
        )}

        <ConfirmDialog
          open={Boolean(confirmAction)}
          title={confirmConfig?.title}
          message={confirmConfig?.getMessage(confirmAction.member)}
          confirmText={confirmConfig?.confirmText}
          confirmColor={confirmConfig?.confirmColor}
          loading={confirming}
          error={confirmError}
          onConfirm={handleConfirm}
          onClose={() => setConfirmAction(null)}
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
