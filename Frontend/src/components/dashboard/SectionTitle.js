import { Box, Typography } from "@mui/material";

export default function SectionTitle({ title }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        mb: 2,
      }}
    >
      <Typography variant="subtitle1" fontWeight={900} letterSpacing="0.05em">
        {title}
      </Typography>

      <Box
        sx={{
          width: 40,
          height: 2,
          bgcolor: "primary.main",
        }}
      />
    </Box>
  );
}
