"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Alert,
  Button,
  CircularProgress,
  Container,
  Paper,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { apiRequest } from "@/lib/api";
import PageHeader from "@/components/admin/PageHeader";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import CreateTournamentDialog from "@/components/admin/CreateTournamentDialog";
import EditTournamentDialog from "@/components/admin/EditTournamentDialog";

export default function AdminTournamentsPage() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const reload = () => setReloadKey((key) => key + 1);
  const [createOpen, setCreateOpen] = useState(false);
  const [editingTournament, setEditingTournament] = useState(null);
  const [tournamentToDelete, setTournamentToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadTournaments = async () => {
      try {
        const data = await apiRequest("/tournaments");
        setTournaments(data.tournaments || []);
      } catch (err) {
        setError(err.message || "Failed to load tournaments");
      } finally {
        setLoading(false);
      }
    };

    loadTournaments();
  }, [reloadKey]);

  const handleCreated = () => {
    setCreateOpen(false);
    setMessage("Tournament created");
    reload();
  };

  const handleEditClick = async (tournamentId) => {
    try {
      const data = await apiRequest(`/tournaments/${tournamentId}`);
      setEditingTournament(data.tournament);
    } catch (err) {
      setMessage(err.message || "Failed to load tournament");
    }
  };

  const handleEdited = () => {
    setEditingTournament(null);
    setMessage("Edit success");
    reload();
  };

  const openDeleteDialog = (tournament) => {
    setDeleteError("");
    setTournamentToDelete(tournament);
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      setDeleteError("");

      await apiRequest(`/tournaments/${tournamentToDelete._id}`, {
        method: "DELETE",
      });

      setTournamentToDelete(null);
      setMessage("Tournament deleted");
      reload();
    } catch (err) {
      setDeleteError(err.message || "Failed to delete tournament");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <PageHeader
        title="Manage Tournaments"
        subtitle="View and manage tournaments on Arena."
        action={
          <Button variant="contained" onClick={() => setCreateOpen(true)}>
            Create Tournament
          </Button>
        }
      />

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Game</TableCell>
                <TableCell>Format</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Teams</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {tournaments.map((tournament) => (
                <TableRow key={tournament._id}>
                  <TableCell>
                    <Typography fontWeight={600}>{tournament.name}</Typography>
                  </TableCell>
                  <TableCell>{tournament.game?.name || "—"}</TableCell>
                  <TableCell>{tournament.format || "—"}</TableCell>
                  <TableCell>{tournament.status || "—"}</TableCell>
                  <TableCell>
                    {tournament.registrationCount ?? 0} /{" "}
                    {tournament.maxTeams ?? "—"}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        variant="outlined"
                        component={Link}
                        href={`/admin/tournaments/${tournament._id}`}
                      >
                        View
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="warning"
                        onClick={() => handleEditClick(tournament._id)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => openDeleteDialog(tournament)}
                      >
                        Delete
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* dialogs */}
      {createOpen && (
        <CreateTournamentDialog
          onClose={() => setCreateOpen(false)}
          onCreated={handleCreated}
        />
      )}

      {editingTournament && (
        <EditTournamentDialog
          tournament={editingTournament}
          onClose={() => setEditingTournament(null)}
          onSaved={handleEdited}
        />
      )}

      <ConfirmDialog
        open={Boolean(tournamentToDelete)}
        title="Delete Tournament"
        message={`Are you sure you want to delete ${tournamentToDelete?.name ?? ""}? This action cannot be undone.`}
        confirmText="Delete"
        confirmColor="error"
        loading={deleting}
        error={deleteError}
        onConfirm={handleDelete}
        onClose={() => setTournamentToDelete(null)}
      />

      <Snackbar
        open={Boolean(message)}
        autoHideDuration={3000}
        onClose={() => setMessage("")}
        message={message}
      />
    </Container>
  );
}
