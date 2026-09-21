"use client";

import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useAuth } from "@/context/AuthContext";
import EnterResultDialog from "./EnterResultDialog";

// colors come from the theme
const COLORS = {
  white: "text.primary",
  gray: "text.secondary",
  darkGray: "text.disabled",
  red: "primary.main",
};

// Text shown on the right side of the card header
const STATUS_TEXT = {
  bye: { label: "BYE", color: COLORS.red },
  pending: { label: "PENDING", color: COLORS.darkGray },
  completed: { label: "COMPLETED", color: COLORS.white },
};

function getStatus(match) {
  const hasBothTeams = match.teamA && match.teamB;
  const hasOneTeam = Boolean(match.teamA) !== Boolean(match.teamB);

  if (match.status === "completed" && hasOneTeam) return "bye";
  if (!hasBothTeams) return "pending";
  if (match.status === "completed") return "completed";
  if (match.status === "scheduled") return "scheduled";
  return null;
}

function TeamRow({ team, score, isWinner, withBorder }) {
  const color = isWinner ? COLORS.white : team ? COLORS.gray : COLORS.darkGray;

  return (
    <Box
      sx={{
        px: 2,
        py: 1.5,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: withBorder
          ? "1px solid rgba(156, 163, 175, 0.08)"
          : "none",
      }}
    >
      <Box
        sx={{ display: "flex", alignItems: "center", gap: 1.25, minWidth: 0 }}
      >
        {team ? (
          <Box
            component="img"
            src={team.logo || "/placeholder-team.png"}
            alt={team.name}
            sx={{
              width: 28,
              height: 28,
              objectFit: "cover",
              borderRadius: 0.75,
              flexShrink: 0,
            }}
          />
        ) : (
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: 0.75,
              backgroundColor: "rgba(156, 163, 175, 0.08)",
              flexShrink: 0,
            }}
          />
        )}

        <Typography
          sx={{
            fontWeight: isWinner ? 900 : 700,
            color,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {team?.name || "TBD"}
        </Typography>

        {isWinner && (
          <Typography
            sx={{ color: COLORS.red, fontWeight: 900, fontSize: "0.9rem" }}
          >
            ✓
          </Typography>
        )}
      </Box>

      <Typography sx={{ ml: 2, fontWeight: 900, color }}>
        {team ? (score ?? "-") : "-"}
      </Typography>
    </Box>
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
    <Box
      sx={{
        width: 300,
        backgroundColor: "background.paper",
        border: "1px solid rgba(156, 163, 175, 0.18)",
        borderRadius: 1.5,
        overflow: "hidden",
      }}
    >
      {/* header: match number + status */}
      <Box
        sx={{
          px: 2,
          py: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(156, 163, 175, 0.12)",
        }}
      >
        <Typography
          sx={{
            fontSize: "0.7rem",
            fontWeight: 800,
            color: COLORS.gray,
            letterSpacing: "0.08em",
          }}
        >
          MATCH {match.matchNumber}
        </Typography>

        {status === "scheduled" && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              color: COLORS.gray,
            }}
          >
            <AccessTimeIcon sx={{ fontSize: 14 }} />
            <Typography
              sx={{
                fontSize: "0.65rem",
                fontWeight: 800,
                letterSpacing: "0.04em",
              }}
            >
              {match.scheduledAt
                ? new Date(match.scheduledAt).toLocaleString([], {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "UPCOMING"}
            </Typography>
          </Box>
        )}

        {STATUS_TEXT[status] && (
          <Typography
            sx={{
              fontSize: "0.65rem",
              fontWeight: 900,
              color: STATUS_TEXT[status].color,
              letterSpacing: "0.06em",
            }}
          >
            {STATUS_TEXT[status].label}
          </Typography>
        )}
      </Box>

      <TeamRow
        team={match.teamA}
        score={match.score?.teamA}
        isWinner={teamAWon}
        withBorder
      />
      <TeamRow
        team={match.teamB}
        score={match.score?.teamB}
        isWinner={teamBWon}
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
            borderTop: "1px solid rgba(156, 163, 175, 0.08)",
            backgroundColor: "rgba(220, 38, 38, 0.04)",
          }}
        >
          <Typography
            sx={{
              fontSize: "0.65rem",
              fontWeight: 800,
              color: COLORS.red,
              letterSpacing: "0.05em",
              textAlign: "center",
            }}
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
            onResultSubmitted();
          }}
        />
      )}
    </Box>
  );
}
