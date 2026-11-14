import { Box, Typography } from "@mui/material";
import Link from "next/link";
import { formatDate } from "@/lib/formatDate";

export default function AnnouncementCard({ announcement }) {
  return (
    <Box
      component={Link}
      href={`/announcements/${announcement._id}`}
      sx={{
        position: "relative",
        display: "block",
        height: 320,
        overflow: "hidden",
        borderRadius: 2,
        border: 1,
        borderColor: "divider",
        textDecoration: "none",
        color: "inherit",
        cursor: "pointer",
        backgroundColor: "background.paper",
        backgroundImage: announcement.image
          ? `url(${announcement.image})`
          : "linear-gradient(135deg, #1A1616 0%, #0C0A0A 100%)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        transition: "all 0.2s ease",
        "&:hover": {
          borderColor: "primary.main",
          transform: "translateY(-3px)",
        },
      }}
    >
      {/* Overlay */}
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
          variant="h6"
          fontWeight={900}
          lineHeight={1.25}
          sx={{
            fontSize: { xs: "1.25rem", sm: "1.4rem" },
            color: "#fff",
          }}
        >
          {announcement.title}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            mt: 1,
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
          variant="caption"
          sx={{
            mt: 1.5,
            color: "rgba(255,255,255,0.55)",
          }}
        >
          {formatDate(announcement.createdAt)}
        </Typography>
      </Box>
    </Box>
  );
}
