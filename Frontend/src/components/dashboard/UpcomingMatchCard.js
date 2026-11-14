import { Box, Stack, Typography } from "@mui/material";
import ScheduleIcon from "@mui/icons-material/Schedule";
import Link from "next/link";
import { formatDateTime } from "@/lib/formatDate";

export default function UpcomingMatchCard({ match }) {
  return (
    <Box
      component={Link}
      href={`/tournaments/${match.tournament?._id}/matches`}
      sx={{
        display: "block",
        textDecoration: "none",
        color: "inherit",
        p: 2.25,
        backgroundColor: "background.paper",
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
        transition: "all 0.2s ease",
        cursor: "pointer",
        "&:hover": {
          borderColor: "primary.main",
          boxShadow: (theme) => `0 0 20px ${theme.palette.action.selected}`,
          transform: "translateY(-3px)",
        },
      }}
    >
      <Stack spacing={1.5}>
        {/* Top Row */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="subtitle2" color="primary.main">
            {match.tournament?.name}
          </Typography>

          <Typography
            variant="overline"
            color="primary.main"
            sx={{ fontWeight: 900 }}
          >
            ROUND {match.round}
          </Typography>
        </Stack>

        {/* Teams */}
        <Box>
          <Typography variant="h6">{match.teamA?.name || "TBD"}</Typography>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontWeight: 700, display: "block", my: 0.25 }}
          >
            VS
          </Typography>

          <Typography variant="h6">{match.teamB?.name || "TBD"}</Typography>
        </Box>

        {/* Date */}
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{
            pt: 1.25,
            borderTop: 1,
            borderColor: "divider",
          }}
        >
          <ScheduleIcon fontSize="small" color="action" />

          <Typography variant="body2" color="text.secondary">
            {match.scheduledAt
              ? formatDateTime(match.scheduledAt)
              : "Time not scheduled"}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}
