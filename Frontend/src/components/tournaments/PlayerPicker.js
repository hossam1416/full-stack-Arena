import { Box, Chip, Grid, Stack, Typography } from "@mui/material";
import SelectableCard from "@/components/common/SelectableCard";

// The captain picks the players who will play in the tournament.
export default function PlayerPicker({
  team,
  requiredPlayers,
  selectedPlayers,
  onToggle,
}) {
  const isComplete = selectedPlayers.length === requiredPlayers;

  return (
    <Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
        spacing={1}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h5" gutterBottom>
            Select Tournament Players
          </Typography>
          <Typography color="text.secondary">
            Select exactly {requiredPlayers} players for this tournament.
          </Typography>
        </Box>

        <Chip
          label={`${selectedPlayers.length} / ${requiredPlayers} selected`}
          color={isComplete ? "primary" : "default"}
        />
      </Stack>

      <Grid container spacing={2}>
        {team.members.map((member) => (
          <Grid key={member._id} size={{ xs: 12, sm: 6, md: 4 }}>
            <SelectableCard
              title={member.username}
              avatarSrc={member.avatar}
              selected={selectedPlayers.includes(member._id)}
              onClick={() => onToggle(member._id)}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
