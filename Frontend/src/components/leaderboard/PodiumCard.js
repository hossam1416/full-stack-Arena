import Link from "next/link";
import { Avatar, Box, Card, Typography } from "@mui/material";

const PLACE_LABELS = ["1st Place", "2nd Place", "3rd Place"];

export default function PodiumCard({ entry, index }) {
  const isFirst = index === 0;

  const stats = [
    { label: "Wins", value: entry.wins },
    { label: "Losses", value: entry.losses },
    { label: "Win Rate", value: `${entry.winRate.toFixed(1)}%` },
  ];

  return (
    <Card
      component={Link}
      href={`/teams/${entry.team._id}`}
      sx={{
        display: "block",
        p: { xs: 3, md: 4 },
        textAlign: "center",
        textDecoration: "none",
        color: "inherit",
        borderColor: isFirst ? "primary.main" : undefined,
        boxShadow: isFirst ? 8 : undefined,
        transform: { md: isFirst ? "translateY(-18px)" : "none" },
      }}
    >
      <Typography
        variant="overline"
        sx={{
          display: "block",
          mb: 2,
          fontWeight: 800,
          color: isFirst ? "primary.main" : "text.secondary",
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

      <Typography variant="h6" sx={{ mb: 2 }}>
        {entry.team.name}
      </Typography>

      <Typography variant="h4" color="primary.main">
        {entry.points}
      </Typography>

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", mt: 0.5, mb: 2 }}
      >
        Points
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", gap: 3 }}>
        {stats.map((stat) => (
          <Box key={stat.label}>
            <Typography sx={{ fontWeight: 800 }}>{stat.value}</Typography>

            <Typography variant="caption" color="text.secondary">
              {stat.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Card>
  );
}
