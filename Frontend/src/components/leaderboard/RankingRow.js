import Link from "next/link";
import { Avatar, Box, Typography } from "@mui/material";

// Shared column layout for the ranking header and rows
export const RANKING_COLUMNS = "60px 1fr repeat(4, 90px)";

export default function RankingRow({ entry, rank }) {
  const stats = [
    { label: "Wins", value: entry.wins },
    { label: "Losses", value: entry.losses },
    { label: "Win Rate", value: `${entry.winRate.toFixed(1)}%` },
  ];

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
        transition: "background-color 0.2s",
        "&:not(:last-child)": {
          borderBottom: "1px solid",
          borderColor: "divider",
        },
        "&:hover": { backgroundColor: "action.hover" },
      }}
    >
      <Typography color="text.secondary" sx={{ fontWeight: 800 }}>
        #{rank}
      </Typography>

      {/* Team */}
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

      {/* Points */}
      <Box sx={{ textAlign: "center" }}>
        <Typography sx={{ fontWeight: 800 }}>{entry.points}</Typography>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: { xs: "block", sm: "none" } }}
        >
          Points
        </Typography>
      </Box>

      {/* Additional statistics - desktop only */}
      {stats.map((stat) => (
        <Typography
          key={stat.label}
          align="center"
          sx={{ display: { xs: "none", sm: "block" }, fontWeight: 700 }}
        >
          {stat.value}
        </Typography>
      ))}
    </Box>
  );
}
