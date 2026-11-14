import { Box } from "@mui/material";
import { alpha } from "@mui/material/styles";

// banner image (red gradient when there is no image).
export default function Banner({ src, height, overlay = false, children }) {
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
        className="banner-image"
        sx={(theme) => ({
          position: "absolute",
          inset: 0,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transition: "transform 0.5s ease",
          backgroundImage: src
            ? `url("${src}")`
            : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.35)} 0%, #0C0A0A 100%)`,
        })}
      />

      {overlay && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.88))",
          }}
        />
      )}

      {children}
    </Box>
  );
}
