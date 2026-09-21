import { Box, Button, Chip, Typography } from "@mui/material";
import Link from "next/link";
export default function TournamentCard({ tournament }) {
  return (
    <Box
      sx={{
        minHeight: 300,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        backgroundColor: "background.paper",
        border: "1px solid rgba(156, 163, 175, 0.12)",
        borderRadius: 2,
        transition: "0.2s ease",
        "&:hover": {
          borderColor: "rgba(220, 38, 38, 0.35)",
          boxShadow: "0 0 20px rgba(220, 38, 38, 0.08)",
        },
      }}
    >
      {/* tournament banner */}
      <Box
        component="img"
        src={
          tournament.banner ||
          "https://placehold.co/800x350/18181b/ffffff?text=Tournament"
        }
        alt={tournament.name}
        sx={{
          width: "100%",
          height: 170,
          objectFit: "cover",
        }}
      />

      <Box
        sx={{
          p: 2.5,
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
        }}
      >
        {/* game */}
        <Chip
          label={tournament.game?.name || "Unknown Game"}
          color="primary"
          size="small"
          sx={{
            alignSelf: "flex-start",
            mb: 1.5,
            fontSize: "0.65rem",
            fontWeight: 800,
          }}
        />

        {/* tournament info */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 900,
            lineHeight: 1.3,
          }}
        >
          {tournament.name}
        </Typography>

        <Typography
          color="text.secondary"
          sx={{
            mt: 0.75,
            fontSize: "0.8rem",
          }}
        >
          {tournament.format}
        </Typography>
        <Typography
          color="text.secondary"
          sx={{
            mt: 0.75,
            fontSize: "0.8rem",
          }}
        >
          Registration deadline:{" "}
          {tournament.registrationDeadline
            ? new Date(tournament.registrationDeadline).toLocaleDateString()
            : "TBD"}
        </Typography>
        <Typography color="text.secondary" sx={{ fontSize: "0.8rem" }}>
          {tournament.registrationCount} / {tournament.maxTeams} teams
        </Typography>
        {/* register */}
        <Button
          component={Link}
          href={`/tournaments/${tournament._id}/register`}
          variant="contained"
          fullWidth
          sx={{
            mt: "auto",
            pt: 1,
            fontWeight: 800,
            boxShadow: "0 0 18px rgba(220, 38, 38, 0.3)",
          }}
        >
          REGISTER
        </Button>
      </Box>
    </Box>
  );
}
