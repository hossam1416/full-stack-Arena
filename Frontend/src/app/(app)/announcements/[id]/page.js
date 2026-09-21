"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Box, Button, Typography } from "@mui/material";
import { apiRequest } from "@/lib/api";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

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
    return <Box sx={{ p: 4 }}>Loading...</Box>;
  }

  if (!announcement) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Announcement not found.</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: 1100,
        mx: "auto",
        px: { xs: 2, md: 3 },
        py: { xs: 3, md: 5 },
      }}
    >
      <Button
        component={Link}
        href="/announcements"
        startIcon={<ArrowBackIcon />}
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

        {/* Hero Content */}
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
            sx={{
              fontSize: "0.7rem",
              fontWeight: 800,
              letterSpacing: 1.5,
              color: "primary.main",
              mb: 1,
            }}
          >
            ANNOUNCEMENT
          </Typography>

          <Typography
            sx={{
              fontSize: {
                xs: "1.8rem",
                md: "2.8rem",
              },
              fontWeight: 900,
              lineHeight: 1.15,
              color: "#fff",
            }}
          >
            {announcement.title}
          </Typography>

          <Typography
            sx={{
              mt: 1.5,
              fontSize: "0.8rem",
              color: "rgba(255,255,255,0.65)",
            }}
          >
            {new Date(announcement.createdAt).toLocaleDateString()}
          </Typography>
        </Box>
      </Box>

      {/* Content */}
      <Box
        sx={{
          mt: 4,
          maxWidth: 850,
        }}
      >
        <Typography
          sx={{
            fontSize: "1rem",
            lineHeight: 1.9,
            color: "text.secondary",
            whiteSpace: "pre-line",
          }}
        >
          {announcement.content}
        </Typography>
      </Box>
    </Box>
  );
}
