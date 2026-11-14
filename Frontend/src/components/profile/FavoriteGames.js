"use client";

import { Avatar, Box, Card, Tooltip, Typography, Zoom } from "@mui/material";
import { alpha } from "@mui/material/styles";

// popup that appears above the chip on hover
function GamePopup({ game }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
      <Avatar
        variant="rounded"
        src={game.logo || undefined}
        alt={game.name}
        sx={{
          width: 56,
          height: 56,
          fontSize: "1.5rem",
          fontWeight: 800,
          bgcolor: "action.selected",
          color: "primary.main",
        }}
      >
        {game.name.charAt(0).toUpperCase()}
      </Avatar>

      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
        {game.name}
      </Typography>
    </Box>
  );
}
function GameChip({ game }) {
  return (
    <Tooltip
      title={<GamePopup game={game} />}
      placement="top"
      arrow
      enterDelay={100}
      slots={{ transition: Zoom }}
    >
      <Card
        sx={(theme) => ({
          px: 2,
          py: 1.5,
          display: "flex",
          alignItems: "center",
          gap: 2,
          minHeight: 72,
          cursor: "default",
          backgroundColor: "action.hover",
          transition: "all 0.25s ease-in-out",
          "&:hover": {
            backgroundColor: "action.selected",
            borderColor: alpha(theme.palette.primary.main, 0.3),
            transform: "translateY(-3px)",
            boxShadow: 3,
          },
        })}
      >
        <Avatar
          variant="rounded"
          src={game.logo || undefined}
          alt={game.name}
          sx={{
            width: 48,
            height: 48,
            fontWeight: 800,
            bgcolor: "action.selected",
            color: "primary.main",
          }}
        >
          {game.name.charAt(0).toUpperCase()}
        </Avatar>

        <Typography variant="subtitle1" noWrap sx={{ fontWeight: 700 }}>
          {game.name}
        </Typography>
      </Card>
    </Tooltip>
  );
}

// emptyText: if there are no games, show this text.
// Without it the whole card is hidden.
export default function FavoriteGames({ games, emptyText, sx }) {
  const hasGames = games?.length > 0;

  if (!hasGames && !emptyText) return null;

  return (
    <Card sx={{ p: { xs: 3, md: 4 }, ...sx }}>
      <Typography variant="h6" sx={{ mb: 2.5 }}>
        Favorite Games
      </Typography>

      {hasGames ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
            gap: 2,
          }}
        >
          {games.map((game) => (
            <GameChip key={game._id} game={game} />
          ))}
        </Box>
      ) : (
        <Typography color="text.secondary">{emptyText}</Typography>
      )}
    </Card>
  );
}
