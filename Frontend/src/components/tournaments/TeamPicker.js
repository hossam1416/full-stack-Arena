import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// A list of team cards. The captain clicks one team to select it.
export default function TeamPicker({
  teams,
  requiredPlayers,
  registeredIds,
  selectedTeam,
  onSelect,
}) {
  return (
    <Grid container spacing={3}>
      {teams.map((team) => {
        const isSelected = selectedTeam?._id === team._id;

        // reasons why a team can not be selected
        let disabledReason = "";
        if (registeredIds.includes(team._id)) {
          disabledReason = "Already registered";
        } else if (team.members.length < requiredPlayers) {
          disabledReason = `Needs at least ${requiredPlayers} players`;
        }

        return (
          <Grid key={team._id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              sx={{
                border: "2px solid",
                borderColor: isSelected ? "primary.main" : "divider",
                opacity: disabledReason ? 0.5 : 1,
              }}
            >
              <CardActionArea
                disabled={Boolean(disabledReason)}
                onClick={() => onSelect(team)}
                sx={{ p: 2.5 }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar
                    src={team.logo || undefined}
                    alt={team.name}
                    sx={{ width: 52, height: 52, fontWeight: 800 }}
                  >
                    {team.name?.charAt(0).toUpperCase()}
                  </Avatar>

                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography fontWeight={800} noWrap>
                      {team.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {disabledReason || `${team.members.length} members`}
                    </Typography>
                  </Box>

                  {isSelected && <CheckCircleIcon color="primary" />}
                </Stack>
              </CardActionArea>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}
