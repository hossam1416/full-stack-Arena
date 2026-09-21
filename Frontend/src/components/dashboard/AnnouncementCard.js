import { Box, Typography } from "@mui/material";
import Link from "next/link";

export default function AnnouncementCard({ announcement }) {
  return (
    <Box
      component={Link}
      href={`/announcements/${announcement._id}`}
      sx={{
        position: "relative",
        height: 320,
        overflow: "hidden",
        borderRadius: 2.5,
        cursor: "pointer",
        textDecoration: "none",
        color: "inherit",
        display: "block",
        backgroundColor: "background.paper",
        backgroundImage: announcement.image
          ? `url(${announcement.image})`
          : "linear-gradient(135deg, #1A1616 0%, #0C0A0A 100%)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        border: "1px solid rgba(156, 163, 175, 0.12)",
        transition: "0.2s ease",
        "&:hover": {
          borderColor: "rgba(220, 38, 38, 0.35)",
          transform: "translateY(-3px)",
          boxShadow: "0 0 25px rgba(220, 38, 38, 0.12)",
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.65) 45%, rgba(0,0,0,0.15) 100%)",
        }}
      />

      {/* Content */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          p: 3,
        }}
      >
        <Typography
          sx={{
            fontSize: {
              xs: "1.25rem",
              sm: "1.4rem",
            },
            fontWeight: 900,
            lineHeight: 1.25,
            color: "#fff",
          }}
        >
          {announcement.title}
        </Typography>

        <Typography
          sx={{
            mt: 1,
            fontSize: "0.85rem",
            lineHeight: 1.6,
            color: "rgba(255,255,255,0.75)",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {announcement.content}
        </Typography>

        <Typography
          sx={{
            mt: 1.5,
            fontSize: "0.7rem",
            color: "rgba(255,255,255,0.55)",
          }}
        >
          {new Date(announcement.createdAt).toLocaleDateString()}
        </Typography>
      </Box>
    </Box>
  );
}
