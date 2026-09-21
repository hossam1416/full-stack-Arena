import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  Chip,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

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
        mb={3}
      >
        <Box>
          <Typography variant="h5" fontWeight={800} mb={0.5}>
            Select Tournament Players
          </Typography>
          <Typography color="text.secondary">
            Select exactly {requiredPlayers} players for this tournament.
          </Typography>
        </Box>

        <Chip
          label={`${selectedPlayers.length} / ${requiredPlayers} selected`}
          color={isComplete ? "primary" : "default"}
          sx={{ fontWeight: 700 }}
        />
      </Stack>

      <Grid container spacing={2}>
        {team.members.map((member) => {
          const isSelected = selectedPlayers.includes(member._id);

          return (
            <Grid key={member._id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                sx={{
                  border: "2px solid",
                  borderColor: isSelected ? "primary.main" : "divider",
                }}
              >
                <CardActionArea
                  onClick={() => onToggle(member._id)}
                  sx={{ p: 2 }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      src={member.avatar || undefined}
                      alt={member.username}
                      sx={{ fontWeight: 800 }}
                    >
                      {member.username?.charAt(0).toUpperCase()}
                    </Avatar>

                    <Typography fontWeight={700} noWrap sx={{ flex: 1 }}>
                      {member.username}
                    </Typography>

                    {isSelected && <CheckCircleIcon color="primary" />}
                  </Stack>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
