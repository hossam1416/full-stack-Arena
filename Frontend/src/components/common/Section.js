import { Box, Typography } from "@mui/material";

// a page section: title + content
export default function Section({ title, children }) {
  return (
    <Box component="section" sx={{ mb: 4 }}>
      <Typography
        variant="h6"
        component="h2"
        sx={{ mb: 2.5, letterSpacing: "0.05em" }}
      >
        {title}
      </Typography>
      {children}
    </Box>
  );
}
