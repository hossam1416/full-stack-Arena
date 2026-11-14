"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Alert,
  Button,
  Card,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import SecurityIcon from "@mui/icons-material/Security";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import BackButton from "@/components/common/BackButton";
import Section from "@/components/common/Section";
import { LoadingState, MessageState } from "@/components/common/PageState";
import PageContainer from "@/components/layout/PageContainer";
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
      } catch {
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
      <PageContainer>
        <LoadingState />
      </PageContainer>
    );
  }

  if (fetchError || !team) {
    return (
      <PageContainer>
        <MessageState error text="Failed to load team. Please try again." />
      </PageContainer>
    );
  }

  // not the captain: the page is redirecting
  if (team.captain?._id !== user?.id) return null;

  const confirmConfig = confirmAction
    ? CONFIRM_CONFIG[confirmAction.type]
    : null;

  return (
    <PageContainer maxWidth="lg">
      <BackButton href={`/teams/${id}`}>BACK TO TEAM</BackButton>

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
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
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

      <Section title={`ROSTER MANAGEMENT (${team.members?.length || 0})`}>
        <RosterList
          team={team}
          onRemove={(member) => openConfirm("remove", member)}
          onTransfer={(member) => openConfirm("transfer", member)}
        />
      </Section>

      <Section title="JOIN REQUESTS">
        <JoinRequestsList
          requests={joinRequests}
          processingId={processingId}
          onAccept={(requestId) => handleRequest(requestId, "accept")}
          onReject={(requestId) => handleRequest(requestId, "reject")}
        />
      </Section>

      {/* a team can only be deleted when the captain is the only member */}
      {team.members?.length === 1 && (
        <Card
          sx={(theme) => ({
            p: { xs: 3, md: 4 },
            borderColor: alpha(theme.palette.error.main, 0.3),
          })}
        >
          <Typography variant="h6">DELETE TEAM</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
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
        </Card>
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
    </PageContainer>
  );
}
