"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Box, Button, Typography } from "@mui/material";
import { apiRequest } from "@/lib/api";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PageContainer from "@/components/layout/PageContainer";

export default function AnnouncementDetailsPage() {
  const { id } = useParams();
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchAnnouncement = async () => {
      try {
        const data = await apiRequest(`/announcements/${id}`);
        setAnnouncement(data.announcement);
      } catch (error) {
        console.error("Failed to fetch announcement:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncement();
  }, [id]);

  if (loading) {
    return (
      <PageContainer>
        <Typography color="text.secondary">Loading...</Typography>
      </PageContainer>
    );
  }

  if (!announcement) {
    return (
      <PageContainer>
        <Typography color="text.secondary">Announcement not found.</Typography>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Box sx={{ maxWidth: 1100, mx: "auto" }}>
        <Button
          component={Link}
          href="/announcements"
          startIcon={<ArrowBackIcon />}
          color="inherit"
          sx={{
            mb: 3,
            color: "text.secondary",
            "&:hover": {
              color: "primary.main",
            },
          }}
        >
          BACK TO ANNOUNCEMENTS
        </Button>

        {/* Hero */}
        <Box
          sx={{
            position: "relative",
            height: { xs: 300, md: 450 },
            borderRadius: 3,
            overflow: "hidden",
            backgroundImage: announcement.image
              ? `url(${announcement.image})`
              : "linear-gradient(135deg, #1A1616 0%, #0C0A0A 100%)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0.1) 100%)",
            }}
          />

          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              p: { xs: 3, md: 5 },
            }}
          >
            <Typography
              variant="overline"
              color="primary.main"
              sx={{ fontWeight: 800, letterSpacing: 1.5 }}
            >
              ANNOUNCEMENT
            </Typography>

            <Typography
              variant="h3"
              sx={{
                color: "#fff",
                fontSize: { xs: "1.8rem", md: "2.8rem" },
                lineHeight: 1.15,
              }}
            >
              {announcement.title}
            </Typography>

            <Typography
              variant="caption"
              sx={{ mt: 1.5, color: "rgba(255,255,255,0.65)" }}
            >
              {new Date(announcement.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>

        {/* Content */}
        <Box sx={{ mt: 4, maxWidth: 850 }}>
          <Typography
            sx={{
              lineHeight: 1.9,
              color: "text.secondary",
              whiteSpace: "pre-line",
            }}
          >
            {announcement.content}
          </Typography>
        </Box>
      </Box>
    </PageContainer>
  );
}
