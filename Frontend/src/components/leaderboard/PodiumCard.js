import Link from "next/link";
import { Avatar, Box, Typography } from "@mui/material";

const PLACE_LABELS = ["1st Place", "2nd Place", "3rd Place"];

// index: 0 = first place, 1 = second, 2 = third
export default function PodiumCard({ entry, index }) {
  const isFirst = index === 0;

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
        display: "block",
        textDecoration: "none",
        color: "inherit",
        p: { xs: 3, md: 4 },
        borderRadius: 3,
        backgroundColor: "background.paper",
        border: "1px solid",
        borderColor: isFirst ? "primary.main" : "divider",
        boxShadow: isFirst ? "0 12px 35px rgba(0, 0, 0, 0.25)" : "none",
        textAlign: "center",
        // the first place is a little higher than the others
        transform: { md: isFirst ? "translateY(-18px)" : "none" },
      }}
    >
      <Typography
        sx={{
          fontSize: "0.75rem",
          fontWeight: 800,
          color: isFirst ? "primary.main" : "text.secondary",
          mb: 2,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        {PLACE_LABELS[index]}
      </Typography>

      <Avatar
        src={entry.team.logo || undefined}
        alt={entry.team.name}
        sx={{
          width: 78,
          height: 78,
          mx: "auto",
          mb: 2,
          fontSize: "1.5rem",
          fontWeight: 900,
          border: "2px solid",
          borderColor: isFirst ? "primary.main" : "divider",
        }}
      >
        {entry.team.name.charAt(0).toUpperCase()}
      </Avatar>

      <Typography sx={{ fontSize: "1.15rem", fontWeight: 800, mb: 2 }}>
        {entry.team.name}
      </Typography>

      <Typography
        sx={{
          fontSize: "2rem",
          fontWeight: 900,
          color: "primary.main",
          lineHeight: 1,
        }}
      >
        {entry.points}
      </Typography>
      <Typography
        color="text.secondary"
        sx={{ mt: 0.5, mb: 2, fontSize: "0.75rem" }}
      >
        Points
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", gap: 3 }}>
        {stats.map((stat) => (
          <Box key={stat.label}>
            <Typography sx={{ fontWeight: 800 }}>{stat.value}</Typography>
            <Typography sx={{ fontSize: "0.7rem", color: "text.secondary" }}>
              {stat.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
