import { Box, Container } from "@mui/material";

// must match the height of AppHeader
const HEADER_HEIGHT = 72;

export default function PageContainer({ children, maxWidth = "xl" }) {
  return (
    <Box
      className="arena-background"
      sx={{
        minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
        py: { xs: 3, md: 5 },
      }}
    >
      <Container maxWidth={maxWidth}>{children}</Container>
    </Box>
  );
}
