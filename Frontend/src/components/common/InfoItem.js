import { Box, Typography } from "@mui/material";

// small gray label with a bold value under it
export default function InfoItem({ label, value }) {
  return (
    <Box>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography sx={{ fontWeight: 700 }}>{value}</Typography>
    </Box>
  );
}
