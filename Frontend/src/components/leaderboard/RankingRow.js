import Link from "next/link";
import { Avatar, Box, Typography } from "@mui/material";

// Column sizes on desktop. The page uses the same value for the table header.
export const RANKING_COLUMNS = "60px 1fr repeat(4, 90px)";

export default function RankingRow({ entry, rank, isLast }) {
  // wins, losses and win rate are hidden on small screens
  const columns = [entry.wins, entry.losses, `${entry.winRate.toFixed(1)}%`];

  return (
    <Box
      component={Link}
      href={`/teams/${entry.team._id}`}
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "45px 1fr auto", sm: RANKING_COLUMNS },
        alignItems: "center",
        gap: 2,
        px: { xs: 2, sm: 3 },
        py: 2,
        textDecoration: "none",
        color: "inherit",
        borderBottom: isLast ? "none" : "1px solid",
        borderColor: "divider",
        transition: "background-color 0.2s",
        "&:hover": { backgroundColor: "action.hover" },
      }}
    >
      <Typography sx={{ fontWeight: 800, color: "text.secondary" }}>
        #{rank}
      </Typography>

      {/* team */}
      <Box
        sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}
      >
        <Avatar
          src={entry.team.logo || undefined}
          alt={entry.team.name}
          sx={{ width: 42, height: 42, fontWeight: 800 }}
        >
          {entry.team.name.charAt(0).toUpperCase()}
        </Avatar>

        <Typography noWrap sx={{ fontWeight: 700 }}>
          {entry.team.name}
        </Typography>
      </Box>

      {/* points */}
      <Box sx={{ textAlign: "center" }}>
        <Typography sx={{ fontWeight: 800 }}>{entry.points}</Typography>
        <Typography
          sx={{
            display: { xs: "block", sm: "none" },
            fontSize: "0.65rem",
            color: "text.secondary",
          }}
        >
          Points
        </Typography>
      </Box>

      {columns.map((value, index) => (
        <Typography
          key={index}
          sx={{
            display: { xs: "none", sm: "block" },
            textAlign: "center",
            fontWeight: 700,
          }}
        >
          {value}
        </Typography>
      ))}
    </Box>
  );
}
