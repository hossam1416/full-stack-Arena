"use client";
import { MenuItem, Select, Stack, TextField } from "@mui/material";

export default function TeamFilter({
  search,
  onSearchChange,
  selectedGame,
  onGameChange,
  games,
}) {
  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={2}
      alignItems="center"
      sx={{ mb: 4 }}
    >
      <TextField
        fullWidth
        placeholder="Search teams..."
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        sx={{
          flex: 1,
          "& .MuiOutlinedInput-root": {
            backgroundColor: "background.paper",
          },
        }}
      />

      <Select
        value={selectedGame}
        onChange={(event) => onGameChange(event.target.value)}
        sx={{
          width: { xs: "100%", md: 240 },
          backgroundColor: "background.paper",
        }}
      >
        <MenuItem value="all">All Games</MenuItem>
        {games.map((game) => (
          <MenuItem key={game._id} value={game._id}>
            {game.name}
          </MenuItem>
        ))}
      </Select>
    </Stack>
  );
}
