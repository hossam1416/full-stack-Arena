"use client";

import { Avatar, Box, Card, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
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
  const unread = !notification.read;

  const handleClick = () => {
    if (unread) {
      onRead(notification._id);
    }

    onClose?.(); // close the bell menu

    const link = getLink(notification);
    if (link) router.push(link);
  };

  return (
    <Card
      onClick={handleClick}
      sx={(theme) => ({
        p: 2,
        cursor: "pointer",
        transition: "all 0.2s ease",
        ...(unread && {
          backgroundColor: "action.selected",
          borderColor: alpha(theme.palette.primary.main, 0.3),
        }),
        "&:hover": {
          backgroundColor: unread
            ? alpha(theme.palette.primary.main, 0.16)
            : "action.hover",
        },
      })}
    >
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
        <Avatar sx={{ bgcolor: "action.selected", color: "primary.main" }}>
          {ICONS[notification.type] || <GroupsIcon />}
        </Avatar>

        <Box
          sx={{ display: "flex", flexDirection: "column", gap: 0.5, flex: 1 }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            {notification.title}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {notification.message}
          </Typography>

          <Typography variant="caption" color="text.secondary">
            {new Date(notification.createdAt).toLocaleDateString()}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
}
