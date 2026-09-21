"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { useParams } from "next/navigation";
import { Box, Typography } from "@mui/material";
import { apiRequest } from "@/lib/api";
import MatchCard from "@/components/tournaments/MatchCard";

// Title shown above each column, based on how many matches it has
const ROUND_LABELS = {
  1: "FINAL",
  2: "SEMIFINALS",
  4: "QUARTERFINALS",
  8: "ROUND OF 16",
  16: "ROUND OF 32",
};

export default function TournamentMatchesPage() {
  const { id } = useParams();

  const [tournament, setTournament] = useState(null);
  const [matches, setMatches] = useState([]);
  const [connectors, setConnectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const bracketRef = useRef(null);
  const matchRefs = useRef({});

  const fetchMatches = useCallback(async () => {
    try {
      setError("");

      const [tournamentData, matchesData] = await Promise.all([
        apiRequest(`/tournaments/${id}`),
        apiRequest(`/matches/tournament/${id}`),
      ]);

      setTournament(tournamentData.tournament);
      setMatches(matchesData.matches);
    } catch (err) {
      setError(err.message || "Failed to load tournament matches");
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      setLoading(true);

      await fetchMatches();

      setLoading(false);
    };

    load();
  }, [id, fetchMatches]);

  useLayoutEffect(() => {
    if (!matches.length || !bracketRef.current) return;

    const calculateConnectors = () => {
      const bracketRect = bracketRef.current.getBoundingClientRect();
      const lines = [];

      matches.forEach((match) => {
        if (!match.nextMatch) return;

        const fromElement = matchRefs.current[match._id];
        const toElement = matchRefs.current[match.nextMatch];
        if (!fromElement || !toElement) return;

        const from = fromElement.getBoundingClientRect();
        const to = toElement.getBoundingClientRect();

        // Positions relative to the bracket box (not the whole page)
        const startX = from.right - bracketRect.left;
        const startY = from.top + from.height / 2 - bracketRect.top;
        const endX = to.left - bracketRect.left;
        const endY = to.top + to.height / 2 - bracketRect.top;
        const middleX = startX + (endX - startX) / 2;

        lines.push({
          id: `${match._id}-${match.nextMatch}`,
          // go right -> go up/down -> go right
          path: `M ${startX} ${startY} H ${middleX} V ${endY} H ${endX}`,
        });
      });

      setConnectors(lines);
    };

    calculateConnectors();
    // Recalculate connector lines on window resize
    window.addEventListener("resize", calculateConnectors);

    return () => window.removeEventListener("resize", calculateConnectors);
  }, [matches, loading]);

  if (loading) {
    return (
      <Box sx={{ maxWidth: 1200, mx: "auto", px: 4, py: 5 }}>
        <Typography color="text.secondary">Loading matches...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 1200, mx: "auto", px: 4, py: 5 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!tournament) {
    return (
      <Box sx={{ maxWidth: 1200, mx: "auto", px: 4, py: 5 }}>
        <Typography color="text.secondary">Tournament not found.</Typography>
      </Box>
    );
  }

  const countMatches = (round) =>
    matches.filter((m) => m.round === round).length;

  const rounds = [...new Set(matches.map((m) => m.round))].sort(
    (a, b) => countMatches(b) - countMatches(a),
  );

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, md: 4 }, py: 5 }}>
      {/* page header */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h3" sx={{ fontWeight: 900, mb: 1 }}>
          {tournament.name}
        </Typography>
        <Typography color="text.secondary">Matches & Bracket</Typography>
      </Box>

      {/* bracket (scrolls sideways on small screens) */}
      <Box sx={{ mt: 4, overflowX: "auto", pb: 3 }}>
        {matches.length === 0 ? (
          <Typography color="text.secondary">
            No matches have been created for this tournament yet.
          </Typography>
        ) : (
          <Box
            ref={bracketRef}
            sx={{
              position: "relative",
              display: "flex",
              gap: 6,
              minWidth: "max-content",
            }}
          >
            {/* connector lines, drawn on top of the bracket box */}
            <svg
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                overflow: "visible",
              }}
            >
              {connectors.map((connector) => (
                <path
                  key={connector.id}
                  d={connector.path}
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="1.5"
                />
              ))}
            </svg>

            {/* one column per round */}
            {rounds.map((round) => {
              const roundMatches = matches.filter((m) => m.round === round);

              return (
                <Box
                  key={round}
                  sx={{ width: 300, display: "flex", flexDirection: "column" }}
                >
                  <Typography
                    sx={{
                      fontSize: "0.75rem",
                      fontWeight: 900,
                      color: "#A1A1AA",
                      letterSpacing: "0.12em",
                      textAlign: "center",
                    }}
                  >
                    {ROUND_LABELS[roundMatches.length] || `ROUND ${round}`}
                  </Typography>
                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      mt: 2,
                    }}
                  >
                    {roundMatches.map((match) => (
                      <Box
                        key={match._id}
                        sx={{
                          flex: 1,
                          display: "flex",
                          alignItems: "center",
                          py: 1.5,
                        }}
                      >
                        <Box
                          ref={(element) => {
                            matchRefs.current[match._id] = element;
                          }}
                          sx={{ width: "100%" }}
                        >
                          <MatchCard
                            match={match}
                            onResultSubmitted={fetchMatches}
                          />
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
    </Box>
  );
}
