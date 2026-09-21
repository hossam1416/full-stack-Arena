"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Alert,
  Button,
  CircularProgress,
  Container,
  Paper,
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

export default function AdminTeamsPage() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTeams = async () => {
      try {
        const data = await apiRequest("/teams");
        setTeams(data.teams || []);
      } catch (err) {
        setError(err.message || "Failed to load teams");
      } finally {
        setLoading(false);
      }
    };

    loadTeams();
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <PageHeader
        title="Manage Teams"
        subtitle="View teams registered on Arena."
      />

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Team</TableCell>
                <TableCell>Game</TableCell>
                <TableCell>Captain</TableCell>
                <TableCell>Members</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {teams.map((team) => (
                <TableRow key={team._id}>
                  <TableCell>
                    <Typography fontWeight={600}>{team.name}</Typography>
                  </TableCell>
                  <TableCell>{team.game?.name || "—"}</TableCell>
                  <TableCell>{team.captain?.username || "—"}</TableCell>
                  <TableCell>{team.members?.length || 0}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                      component={Link}
                      href={`/admin/teams/${team._id}`}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}
