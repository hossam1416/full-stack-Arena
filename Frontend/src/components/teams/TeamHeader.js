import { Avatar, Box, Card, Stack, Typography } from "@mui/material";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import Banner from "@/components/common/Banner";

// Banner + logo + name + game.
// "children" is the right side, each page puts its own content there.
export default function TeamHeader({ team, children }) {
  return (
    <Card sx={{ mb: 4 }}>
<Banner src={team.banner} height={{ xs: 160, md: 240 }} overlay />
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={3}
        alignItems={{ xs: "flex-start", md: "center" }}
        justifyContent="space-between"
        sx={{ p: { xs: 3, md: 4 } }}
      >
        <Stack direction="row" spacing={3} alignItems="center">
          <Avatar
            src={team.logo || undefined}
            alt={`${team.name} logo`}
            sx={{
              width: 72,
              height: 72,
              bgcolor: "action.selected",
              color: "primary.main",
              fontSize: "2rem",
              fontWeight: 900,
            }}
          >
            {team.name?.charAt(0).toUpperCase()}
          </Avatar>

          <Box>
            <Typography variant="h4" sx={{ textTransform: "uppercase" }}>
              {team.name}
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mt: 0.5 }}
            >
              <SportsEsportsIcon color="primary" fontSize="small" />
              <Typography color="primary.main" sx={{ fontWeight: 700 }}>
                {team.game?.name || "Unknown Game"}
              </Typography>
            </Stack>
          </Box>
        </Stack>

        {children}
      </Stack>
    </Card>
  );
}
