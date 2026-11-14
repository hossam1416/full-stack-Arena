import { Box, Card, CircularProgress, Typography } from "@mui/material";

// spinner in the middle of the page
export function LoadingState() {
  return (
    <Box sx={{ py: 10, textAlign: "center" }}>
      <CircularProgress color="primary" />
    </Box>
  );
}

// dashed box with a message (empty list, error...)
export function MessageState({ text, error = false }) {
  return (
    <Card
      sx={{
        py: 8,
        textAlign: "center",
        borderStyle: "dashed",
        borderColor: error ? "error.main" : "divider",
      }}
    >
      <Typography variant="h6" color={error ? "error" : "text.secondary"}>
        {text}
      </Typography>
    </Card>
  );
}
