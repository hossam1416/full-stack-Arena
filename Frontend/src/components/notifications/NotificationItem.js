"use client";

import { Box, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import GroupsIcon from "@mui/icons-material/Groups";
import ScheduleIcon from "@mui/icons-material/Schedule";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

// one icon for each notification type
const ICONS = {
  join_request: <GroupsIcon />,
  team_invitation: <GroupsIcon />,
  registration_confirmed: <CheckCircleIcon />,
  match_scheduled: <ScheduleIcon />,
  match_starting: <SportsEsportsIcon />,
  match_result: <SportsEsportsIcon />,
  advanced_to_next_round: <TrendingUpIcon />,
  tournament_won: <EmojiEventsIcon />,
};

// the types that belong to the bracket page
const MATCH_TYPES = [
  "match_scheduled",
  "match_starting",
  "match_result",
  "advanced_to_next_round",
  "tournament_won",
];

// where the player goes when he clicks the notification (null = nowhere)
const getLink = ({ type, metadata }) => {
  if (type === "join_request" && metadata?.teamId) {
    return `/teams/${metadata.teamId}/manage`;
  }
  if (type === "registration_confirmed" && metadata?.tournamentId) {
    return `/tournaments/${metadata.tournamentId}`;
  }
  if (MATCH_TYPES.includes(type) && metadata?.tournamentId) {
    return `/tournaments/${metadata.tournamentId}/matches`;
  }
  return null;
};

// onClose is only used by the bell menu in the header
export default function NotificationItem({ notification, onRead, onClose }) {
  const router = useRouter();

  const handleClick = () => {
    if (!notification.read) {
      onRead(notification._id);
    }

    onClose?.(); // close the bell menu

    const link = getLink(notification);
    if (link) router.push(link);
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        p: 2,
        borderRadius: 2,
        cursor: "pointer",
        backgroundColor: notification.read
          ? "background.paper"
          : "rgba(220, 38, 38, 0.08)",
        border: "1px solid",
        borderColor: notification.read ? "divider" : "rgba(220, 38, 38, 0.3)",
        transition: "all 0.2s ease",
        "&:hover": {
          backgroundColor: notification.read
            ? "rgba(156, 163, 175, 0.05)"
            : "rgba(220, 38, 38, 0.12)",
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 40,
            height: 40,
            flexShrink: 0,
            borderRadius: "50%",
            color: "primary.main",
            backgroundColor: "rgba(220, 38, 38, 0.1)",
          }}
        >
          {ICONS[notification.type] || <GroupsIcon />}
        </Box>

        <Box
          sx={{ display: "flex", flexDirection: "column", gap: 0.5, flex: 1 }}
        >
          <Typography sx={{ fontWeight: 700, fontSize: "0.95rem" }}>
            {notification.title}
          </Typography>

          <Typography
            sx={{
              fontSize: "0.85rem",
              color: "text.secondary",
              lineHeight: 1.5,
            }}
          >
            {notification.message}
          </Typography>

          <Typography
            sx={{ mt: 0.5, fontSize: "0.7rem", color: "text.secondary" }}
          >
            {new Date(notification.createdAt).toLocaleDateString()}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
