import { Box } from "@mui/material";
import { alpha } from "@mui/material/styles";

// banner image (or a gradient when the team has none) with a dark layer on top.
// children are placed over the banner (chips, name...)
export default function TeamBanner({ banner, height, children }) {
  return (
    <Box
      sx={{
        position: "relative",
        height,
        overflow: "hidden",
        bgcolor: "background.default",
      }}
    >
      <Box
        className="team-banner-image"
        sx={(theme) => ({
          position: "absolute",
          inset: 0,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transition: "transform 0.5s ease",
          backgroundImage: banner
            ? `url("${banner}")`
            : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.35)} 0%, #0C0A0A 100%)`,
        })}
      />

      {/* dark layer so the text stays readable */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.88))",
        }}
      />

      {children}
    </Box>
  );
}
