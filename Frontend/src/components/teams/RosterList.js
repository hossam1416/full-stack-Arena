import { Avatar, Box, Button, Paper, Stack, Typography } from "@mui/material";
import StarsIcon from "@mui/icons-material/Stars";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";

export default function RosterList({ team, onRemove, onTransfer }) {
  return (
    <Box>
      <Typography
        variant="h6"
        sx={{ fontWeight: 900, mb: 2.5, letterSpacing: "0.05em" }}
      >
        ROSTER MANAGEMENT ({team.members?.length || 0})
      </Typography>

      <Stack spacing={2}>
        {team.members?.map((member) => {
          const isCaptain = member._id === team.captain?._id;

          return (
            <Paper
              key={member._id}
              elevation={0}
              sx={{
                p: 2,
                border: "1px solid rgba(156, 163, 175, 0.12)",
                borderRadius: 2,
              }}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                alignItems={{ xs: "flex-start", sm: "center" }}
                justifyContent="space-between"
              >
                {/* player */}
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar
                    src={member.avatar || undefined}
                    alt={member.username}
                    sx={{ width: 46, height: 46, fontWeight: 800 }}
                  >
                    {member.username?.charAt(0).toUpperCase()}
                  </Avatar>

                  <Box>
                    <Typography sx={{ fontWeight: 800 }}>
                      {member.username}
                    </Typography>
                    <Typography
                      color={isCaptain ? "primary.main" : "text.secondary"}
                      sx={{ fontSize: "0.7rem", fontWeight: 800 }}
                    >
                      {isCaptain ? "CAPTAIN" : "MEMBER"}
                    </Typography>
                  </Box>
                </Stack>

                {/* buttons: the captain can not remove himself */}
                {!isCaptain && (
                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<StarsIcon />}
                      onClick={() => onTransfer(member)}
                    >
                      Transfer Captaincy
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      startIcon={<PersonRemoveIcon />}
                      onClick={() => onRemove(member)}
                    >
                      Remove
                    </Button>
                  </Stack>
                )}
              </Stack>
            </Paper>
          );
        })}
      </Stack>
    </Box>
  );
}
