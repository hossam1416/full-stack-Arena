import { Box, Button, Card, Chip, Typography, Stack } from "@mui/material";
import Link from "next/link";
import { formatDate } from "@/lib/formatDate";

export default function TournamentCard({ tournament }) {
  return (
    <Card
      sx={{
        minHeight: 300,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        transition: "0.2s ease",
        "&:hover": {
          borderColor: "primary.main",
          boxShadow: (theme) => `0 0 20px ${theme.palette.action.selected}`,
        },
      }}
    >
      {/* Tournament Banner */}
      {tournament.banner ? (
        <Box
          component="img"
          src={tournament.banner}
          alt={tournament.name}
          sx={{
            width: "100%",
            height: 170,
            objectFit: "cover",
          }}
        />
      ) : (
        <Box
          sx={{
            height: 170,
            background:
              "linear-gradient(135deg, rgba(220, 38, 38, 0.35) 0%, #0C0A0A 100%)",
          }}
        />
      )}

      {/* Tournament Info */}
      <Box
        sx={{
          p: 2.5,
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
        }}
      >
        <Chip
          label={tournament.game?.name || "Unknown Game"}
          color="primary"
          size="small"
          sx={{
            alignSelf: "flex-start",
            mb: 1.5,
            fontWeight: 800,
          }}
        />

        <Typography variant="h6" sx={{ lineHeight: 1.3 }}>
          {tournament.name}
        </Typography>

        <Stack spacing={0.75} sx={{ mt: 0.75 }}>
          <Typography variant="body2" color="text.secondary">
            {tournament.format}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Registration deadline:{" "}
            {tournament.registrationDeadline
              ? formatDate(tournament.registrationDeadline)
              : "TBD"}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {tournament.registrationCount} / {tournament.maxTeams} teams
          </Typography>
        </Stack>

        <Button
          component={Link}
          href={`/tournaments/${tournament._id}/register`}
          variant="contained"
          fullWidth
          sx={{ mt: "auto", pt: 1 }}
        >
          REGISTER
        </Button>
      </Box>
    </Card>
  );
}
