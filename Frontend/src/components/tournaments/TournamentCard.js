import Link from "next/link";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Typography,
} from "@mui/material";
import {
  formatStatus,
  getPrizePool,
  STATUS_COLORS,
} from "@/lib/tournamentHelpers";

const formatDate = (date) => new Date(date).toLocaleDateString();

export default function TournamentCard({ tournament }) {
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        border: "1px solid",
        borderColor: "divider",
        transition: "0.2s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          borderColor: "primary.main",
        },
      }}
    >
      <Box
        component="img"
        src={
          tournament.banner ||
          "https://placehold.co/800x450/18181b/ffffff?text=Tournament"
        }
        alt={tournament.name}
        sx={{ width: "100%", height: 200, objectFit: "cover" }}
      />

      <CardContent
        sx={{ display: "flex", flexDirection: "column", flexGrow: 1, gap: 2 }}
      >
        <Box>
          <Chip
            label={formatStatus(tournament.status)}
            color={STATUS_COLORS[tournament.status] || "default"}
            size="small"
            sx={{ mb: 1.5 }}
          />

          <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
            {tournament.name}
          </Typography>

          <Typography color="text.secondary">
            {tournament.game?.name} • {tournament.format}
          </Typography>
        </Box>

        <Box>
          <Typography variant="body2" color="text.secondary">
            Starts
          </Typography>
          <Typography fontWeight={600}>
            {formatDate(tournament.startDate)}
          </Typography>
        </Box>

        <Box>
          <Typography variant="body2" color="text.secondary">
            Registration closes
          </Typography>
          <Typography fontWeight={600}>
            {formatDate(tournament.registrationDeadline)}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Teams
            </Typography>
            <Typography fontWeight={700}>
              {tournament.registrationCount} / {tournament.maxTeams}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Prize Pool
            </Typography>
            <Typography fontWeight={700}>
              ${getPrizePool(tournament).toLocaleString()}
            </Typography>
          </Box>
        </Box>

        <Button
          component={Link}
          href={`/tournaments/${tournament._id}`}
          variant="contained"
          fullWidth
          sx={{ mt: "auto", fontWeight: 700 }}
        >
          View Tournament
        </Button>
      </CardContent>
    </Card>
  );
}
