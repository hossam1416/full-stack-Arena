"use client";

import { useEffect, useState } from "react";
import { Alert, Box, Grid, Typography } from "@mui/material";
import { apiRequest } from "@/lib/api";
import AnnouncementCard from "@/components/dashboard/AnnouncementCard";

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await apiRequest("/announcements");
        setAnnouncements(data.announcements || []);
      } catch (error) {
        console.error("Failed to fetch announcements:", error);
        setError(error.message || "Failed to load announcements");
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Loading announcements...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: 1200,
        mx: "auto",
        px: { xs: 2, md: 3 },
        py: { xs: 3, md: 5 },
      }}
    >
      <Typography
        sx={{
          fontSize: { xs: "1.8rem", md: "2.3rem" },
          fontWeight: 900,
          mb: 1,
        }}
      >
        Announcements
      </Typography>

      <Typography
        color="text.secondary"
        sx={{
          mb: 4,
          fontSize: "0.9rem",
        }}
      >
        Stay up to date with the latest Arena news and updates.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {!error && announcements.length === 0 ? (
        <Typography color="text.secondary">
          No announcements available.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {announcements.map((announcement) => (
            <Grid key={announcement._id} size={{ xs: 12, sm: 6, md: 4 }}>
              <AnnouncementCard announcement={announcement} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
