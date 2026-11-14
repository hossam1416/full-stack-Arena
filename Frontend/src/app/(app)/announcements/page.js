"use client";

import { useEffect, useState } from "react";
import { Alert, Grid, Typography } from "@mui/material";
import { apiRequest } from "@/lib/api";
import AnnouncementCard from "@/components/dashboard/AnnouncementCard";
import PageContainer from "@/components/layout/PageContainer";

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
      <PageContainer>
        <Typography color="text.secondary">Loading announcements...</Typography>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Typography variant="h4" sx={{ mb: 1 }}>
        Announcements
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 4 }}>
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
    </PageContainer>
  );
}
