import Link from "next/link";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import {
  formatStatus,
  getPrizePool,
  STATUS_COLORS,
} from "@/lib/tournamentHelpers";
import { formatDate } from "@/lib/formatDate";
import Banner from "@/components/common/Banner";
import InfoItem from "@/components/common/InfoItem";

export default function TournamentCard({ tournament }) {
  return (
    <Card
      variant="interactive"
      sx={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <Banner src={tournament.banner} height={200} />

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

          <Typography variant="h5" gutterBottom>
            {tournament.name}
          </Typography>

          <Typography color="text.secondary">
            {tournament.game?.name} • {tournament.format}
          </Typography>
        </Box>

        <InfoItem label="Starts" value={formatDate(tournament.startDate)} />
        <InfoItem
          label="Registration closes"
          value={formatDate(tournament.registrationDeadline)}
        />

        <Stack direction="row" justifyContent="space-between" gap={2}>
          <InfoItem
            label="Teams"
            value={`${tournament.registrationCount} / ${tournament.maxTeams}`}
          />
          <InfoItem
            label="Prize Pool"
            value={`$${getPrizePool(tournament).toLocaleString()}`}
          />
        </Stack>

        <Button
          component={Link}
          href={`/tournaments/${tournament._id}`}
          variant="contained"
          fullWidth
          sx={{ mt: "auto" }}
        >
          View Tournament
        </Button>
      </CardContent>
    </Card>
  );
}
