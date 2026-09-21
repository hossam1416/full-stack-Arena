import { Avatar, Box, Paper, Stack, Typography } from "@mui/material";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";

// Banner + logo + name + game.
// "children" is the right side, each page puts its own content there.
export default function TeamHeader({ team, children }) {
  return (
    <Paper
      elevation={0}
      sx={{
        mb: 4,
        overflow: "hidden",
        border: "1px solid rgba(156, 163, 175, 0.12)",
        borderRadius: 3,
      }}
    >
      {/* banner */}
      <Box
        sx={{
          position: "relative",
          height: { xs: 160, md: 240 },
          backgroundImage: team.banner
            ? `url(${team.banner})`
            : "linear-gradient(135deg, #1A1616 0%, #0C0A0A 100%)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* dark layer on top of the image */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(12,10,10,0.15), rgba(12,10,10,0.9))",
          }}
        />

        {!team.banner && (
          <Typography
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "rgba(255,255,255,0.08)",
              fontSize: { xs: "3rem", md: "5rem" },
              fontWeight: 900,
              letterSpacing: "0.08em",
            }}
          >
            ARENA
          </Typography>
        )}
      </Box>

      {/* logo, name, game */}
      <Box sx={{ p: { xs: 3, md: 4 } }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={3}
          alignItems={{ xs: "flex-start", md: "center" }}
          justifyContent="space-between"
        >
          <Stack direction="row" spacing={3} alignItems="center">
            <Avatar
              src={team.logo || undefined}
              alt={`${team.name} logo`}
              sx={{
                width: 72,
                height: 72,
                backgroundColor: "rgba(220, 38, 38, 0.15)",
                color: "primary.main",
                fontSize: "2rem",
                fontWeight: 900,
                border: "2px solid rgba(220, 38, 38, 0.3)",
              }}
            >
              {team.name?.charAt(0).toUpperCase()}
            </Avatar>

            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 900,
                  letterSpacing: "-0.02em",
                  textTransform: "uppercase",
                }}
              >
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
      </Box>
    </Paper>
  );
}
