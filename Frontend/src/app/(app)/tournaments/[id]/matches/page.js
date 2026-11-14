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
import PageContainer from "@/components/layout/PageContainer";
import { LoadingState, MessageState } from "@/components/common/PageState";
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
  const [animatedMatchId, setAnimatedMatchId] = useState(null);

  const bracketRef = useRef(null);
  const matchRefs = useRef({});

  // Fetch tournament and its matches
  const fetchMatches = useCallback(
    async (completedMatchId = null) => {
      try {
        setError("");

        const [tournamentData, matchesData] = await Promise.all([
          apiRequest(`/tournaments/${id}`),
          apiRequest(`/matches/tournament/${id}`),
        ]);

        setTournament(tournamentData.tournament);
        setMatches(matchesData.matches);

        if (completedMatchId) {
          setAnimatedMatchId(completedMatchId);
        }
      } catch (err) {
        setError(err.message || "Failed to load tournament matches");
      }
    },
    [id],
  );

  // Initial loading
  useEffect(() => {
    if (!id) return;

    const load = async () => {
      setLoading(true);
      await fetchMatches();
      setLoading(false);
    };

    load();
  }, [id, fetchMatches]);

  // Stop the one-time animation after 1.3 seconds
  useEffect(() => {
    if (!animatedMatchId) return;

    const timeout = setTimeout(() => {
      setAnimatedMatchId(null);
    }, 1300);

    return () => clearTimeout(timeout);
  }, [animatedMatchId]);

  // Calculate connector positions
  useLayoutEffect(() => {
    const bracketElement = bracketRef.current;
    if (!matches.length || !bracketElement) return;

    const calculateConnectors = () => {
      const bracketRect = bracketElement.getBoundingClientRect();
      const lines = [];

      matches.forEach((match) => {
        if (!match.nextMatch) return;

        const fromElement = matchRefs.current[match._id];
        const toElement = matchRefs.current[match.nextMatch];

        if (!fromElement || !toElement) return;

        const from = fromElement.getBoundingClientRect();
        const to = toElement.getBoundingClientRect();

        // Positions relative to the bracket box
        const startX = from.right - bracketRect.left;
        const startY = from.top + from.height / 2 - bracketRect.top;
        const endX = to.left - bracketRect.left;
        const endY = to.top + to.height / 2 - bracketRect.top;
        const middleX = startX + (endX - startX) / 2;

        lines.push({
          id: `${match._id}-${match.nextMatch}`,
          matchId: match._id,
          path: `M ${startX} ${startY} H ${middleX} V ${endY} H ${endX}`,
          lit: match.status === "completed" && Boolean(match.winner),
        });
      });

      // Unlit lines first, lit lines on top
      setConnectors(lines.sort((a, b) => Number(a.lit) - Number(b.lit)));
    };

    calculateConnectors();

    // Recalculate whenever the bracket changes size: window resize,
    // late font loading, a card growing or shrinking, etc.
    const observer = new ResizeObserver(calculateConnectors);
    observer.observe(bracketElement);

    return () => {
      observer.disconnect();
    };
  }, [matches, loading]);

  if (loading) {
    return (
      <PageContainer maxWidth="lg">
        <LoadingState />
      </PageContainer>
    );
  }

  if (error || !tournament) {
    return (
      <PageContainer maxWidth="lg">
        <MessageState error text={error || "Tournament not found."} />
      </PageContainer>
    );
  }

  // One column per round, ordered by the round number itself
  const rounds = [...new Set(matches.map((match) => match.round))].sort(
    (a, b) => a - b,
  );

  return (
    <PageContainer maxWidth="lg">
      {/* Page header */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" gutterBottom>
          {tournament.name}
        </Typography>
      </Box>

      {matches.length === 0 ? (
        <MessageState text="No matches have been created for this tournament yet." />
      ) : (
        // Bracket - scrolls horizontally on small screens
        <Box sx={{ overflowX: "auto", pb: 3 }}>
          <Box
            ref={bracketRef}
            sx={{
              position: "relative",
              display: "flex",
              gap: 6,
              minWidth: "max-content",
            }}
          >
            {/* Connector lines */}
            <Box
              component="svg"
              sx={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                overflow: "visible",
              }}
            >
              {connectors.map((connector) => (
                <Box component="g" key={connector.id}>
                  {/* Red outer glow */}
                  {connector.lit && (
                    <Box
                      component="path"
                      d={connector.path}
                      sx={{
                        fill: "none",
                        stroke: "#ff1744",
                        strokeWidth: 8,
                        opacity: 0.45,
                        filter: "blur(5px)",
                      }}
                    />
                  )}

                  {/* Main connector */}
                  <Box
                    component="path"
                    d={connector.path}
                    sx={{
                      fill: "none",
                      stroke: connector.lit ? "#ff1744" : "#777",
                      strokeWidth: connector.lit ? 3 : 1.5,
                      opacity: connector.lit ? 1 : 0.35,
                      filter: connector.lit
                        ? "drop-shadow(0 0 4px #ff1744) drop-shadow(0 0 10px #ff1744)"
                        : "none",
                      transition: "all 0.5s ease",
                    }}
                  />

                  {/* One-time advancement animation */}
                  {connector.lit && connector.matchId === animatedMatchId && (
                    <Box
                      component="path"
                      d={connector.path}
                      pathLength="1"
                      sx={{
                        fill: "none",
                        stroke: "#fff",
                        strokeWidth: 4,
                        strokeLinecap: "round",
                        strokeDasharray: "0.14 0.86",
                        animation: "advancePulse 1.1s linear 1 forwards",
                        filter:
                          "drop-shadow(0 0 5px #fff) drop-shadow(0 0 12px #ff1744)",
                        "@keyframes advancePulse": {
                          from: { strokeDashoffset: 0 },
                          to: { strokeDashoffset: -0.86 },
                        },
                      }}
                    />
                  )}

                  {/* Continuous white moving light */}
                  {connector.lit && (
                    <Box
                      component="path"
                      d={connector.path}
                      pathLength="1"
                      sx={{
                        fill: "none",
                        stroke: "#ffffff",
                        strokeWidth: 1.5,
                        strokeLinecap: "round",
                        strokeDasharray: "0.12 0.88",
                        animation: "lightsaber 2s linear infinite",
                        filter: "drop-shadow(0 0 5px #ffffff)",
                        "@keyframes lightsaber": {
                          from: { strokeDashoffset: 0 },
                          to: { strokeDashoffset: -1 },
                        },
                      }}
                    />
                  )}
                </Box>
              ))}
            </Box>

            {/* One column per round */}
            {rounds.map((round) => {
              const roundMatches = matches.filter(
                (match) => match.round === round,
              );

              return (
                <Box
                  key={round}
                  sx={{
                    width: 300,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography
                    variant="overline"
                    color="text.secondary"
                    align="center"
                    sx={{
                      display: "block",
                      fontWeight: 800,
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
                        >
                          <MatchCard
                            match={match}
                            onResultSubmitted={(matchId) =>
                              fetchMatches(matchId)
                            }
                          />
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      )}
    </PageContainer>
  );
}
