import { Box, Stack, Typography } from "@mui/material";
import ScheduleIcon from "@mui/icons-material/Schedule";
import Link from "next/link";
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
        border: "1px solid rgba(156, 163, 175, 0.12)",
        borderRadius: 2,
        transition: "all 0.2s ease",
        cursor: "pointer",
        "&:hover": {
          borderColor: "primary.main",
          transform: "translateY(-2px)",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
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
          <Typography
            sx={{
              fontSize: "0.75rem",
              fontWeight: 800,
              color: "primary.main",
              mb: 0.5,
            }}
          >
            {match.tournament?.name}
          </Typography>
          <Typography
            sx={{
              fontSize: "0.7rem",
              fontWeight: 900,
              color: "primary.main",
              letterSpacing: "0.08em",
            }}
          >
            ROUND {match.round}
          </Typography>
        </Stack>

        {/* Teams */}
        <Box>
          <Typography
            sx={{
              fontSize: "1rem",
              fontWeight: 900,
            }}
          >
            {match.teamA?.name || "TBD"}
          </Typography>

          <Typography
            sx={{
              color: "text.secondary",
              fontSize: "0.75rem",
              fontWeight: 700,
              my: 0.25,
            }}
          >
            VS
          </Typography>

          <Typography
            sx={{
              fontSize: "1rem",
              fontWeight: 900,
            }}
          >
            {match.teamB?.name || "TBD"}
          </Typography>
        </Box>

        {/* Date */}
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{
            pt: 1.25,
            borderTop: "1px solid rgba(156, 163, 175, 0.1)",
          }}
        >
          <ScheduleIcon
            sx={{
              fontSize: 17,
              color: "text.secondary",
            }}
          />

          <Typography
            color="text.secondary"
            sx={{
              fontSize: "0.78rem",
            }}
          >
            {match.scheduledAt
              ? new Date(match.scheduledAt).toLocaleString()
              : "Time not scheduled"}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}
