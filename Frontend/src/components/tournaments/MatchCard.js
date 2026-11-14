"use client";

import { useState } from "react";
import { Avatar, Box, Button, Card, Stack, Typography } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useAuth } from "@/context/AuthContext";
import EnterResultDialog from "./EnterResultDialog";

// theme color names, named by their role
const COLORS = {
  primary: "text.primary",
  secondary: "text.secondary",
  disabled: "text.disabled",
  accent: "primary.main",
};

// Text shown on the right side of the card header.
// ("scheduled" is not here: it shows the match time, rendered separately.)
const STATUS_TEXT = {
  bye: { label: "BYE", color: COLORS.accent },
  pending: { label: "PENDING", color: COLORS.disabled },
  completed: { label: "COMPLETED", color: COLORS.primary },
};

// small bold text used in the card header
const labelSx = { fontWeight: 800, letterSpacing: "0.06em" };

function getStatus(match) {
  const hasBothTeams = match.teamA && match.teamB;
  const hasOneTeam = Boolean(match.teamA) !== Boolean(match.teamB);

  if (match.status === "completed" && hasOneTeam) return "bye";
  if (!hasBothTeams) return "pending";
  if (match.status === "completed") return "completed";
  if (match.status === "scheduled") return "scheduled";
  return null;
}

function TeamRow({ team, score, isWinner, withBorder, isLoser }) {
  const color = isWinner
    ? COLORS.primary
    : isLoser
      ? COLORS.disabled
      : team
        ? COLORS.secondary
        : COLORS.disabled;

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        px: 2,
        py: 1.5,
        borderBottom: withBorder ? 1 : 0,
        borderColor: "divider",
        opacity: isLoser ? 0.35 : 1,
        filter: isLoser ? "grayscale(1)" : "none",
        transition: "all 0.5s ease",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.25}
        sx={{ minWidth: 0 }}
      >
        <Avatar
          variant="rounded"
          src={team?.logo || undefined}
          alt={team?.name}
          sx={{
            width: 28,
            height: 28,
            borderRadius: 0.75,
            fontSize: "0.75rem",
            fontWeight: 800,
            bgcolor: "action.hover",
            color,
          }}
        >
          {team?.name?.charAt(0).toUpperCase() ?? ""}
        </Avatar>

        <Typography noWrap sx={{ fontWeight: isWinner ? 900 : 700, color }}>
          {team?.name || "TBD"}
        </Typography>

        {isWinner && (
          <Typography color="primary" sx={{ fontWeight: 900 }}>
            ✓
          </Typography>
        )}
      </Stack>

      <Typography sx={{ ml: 2, fontWeight: 900, color }}>
        {team ? (score ?? "-") : "-"}
      </Typography>
    </Stack>
  );
}

export default function MatchCard({ match, onResultSubmitted }) {
  const { user } = useAuth();
  const [resultOpen, setResultOpen] = useState(false);

  const status = getStatus(match);
  const isCompleted = match.status === "completed";
  const teamAWon = isCompleted && match.winner?._id === match.teamA?._id;
  const teamBWon = isCompleted && match.winner?._id === match.teamB?._id;

  // only an admin can enter a result, and only when both teams are known
  const canEnterResult =
    user?.role === "admin" &&
    match.status === "scheduled" &&
    match.teamA &&
    match.teamB;

  return (
    <Card sx={{ width: 300, borderRadius: 1.5 }}>
      {/* header: match number + status */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: 2, py: 1, borderBottom: 1, borderColor: "divider" }}
      >
        <Typography variant="caption" color={COLORS.secondary} sx={labelSx}>
          MATCH {match.matchNumber}
        </Typography>

        {status === "scheduled" && (
          <Stack
            direction="row"
            alignItems="center"
            spacing={0.5}
            sx={{ color: COLORS.secondary }}
          >
            <AccessTimeIcon sx={{ fontSize: 14 }} />
            <Typography variant="caption" sx={labelSx}>
              {match.scheduledAt
                ? new Date(match.scheduledAt).toLocaleString([], {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "UPCOMING"}
            </Typography>
          </Stack>
        )}

        {STATUS_TEXT[status] && (
          <Typography
            variant="caption"
            color={STATUS_TEXT[status].color}
            sx={labelSx}
          >
            {STATUS_TEXT[status].label}
          </Typography>
        )}
      </Stack>

      <TeamRow
        team={match.teamA}
        score={match.score?.teamA}
        isWinner={teamAWon}
        isLoser={isCompleted && match.teamA && !teamAWon}
        withBorder
      />

      <TeamRow
        team={match.teamB}
        score={match.score?.teamB}
        isWinner={teamBWon}
        isLoser={isCompleted && match.teamB && !teamBWon}
      />

      {canEnterResult && (
        <Box sx={{ px: 2, pb: 2, pt: 1 }}>
          <Button
            fullWidth
            variant="outlined"
            size="small"
            onClick={() => setResultOpen(true)}
          >
            Enter Result
          </Button>
        </Box>
      )}

      {/* extra line only for bye matches */}
      {status === "bye" && (
        <Box
          sx={{
            px: 2,
            py: 1,
            borderTop: 1,
            borderColor: "divider",
            bgcolor: "action.selected",
          }}
        >
          <Typography
            variant="caption"
            color={COLORS.accent}
            align="center"
            sx={{ ...labelSx, display: "block" }}
          >
            ADVANCED BY BYE
          </Typography>
        </Box>
      )}

      {/* the dialog only exists while it is open */}
      {resultOpen && (
        <EnterResultDialog
          match={match}
          onClose={() => setResultOpen(false)}
          onSubmitted={() => {
            setResultOpen(false);
            onResultSubmitted(match._id);
          }}
        />
      )}
    </Card>
  );
}
