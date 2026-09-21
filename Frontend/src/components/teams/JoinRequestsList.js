import { Box, Button, Paper, Stack, Typography } from "@mui/material";

// processingId: the request that is being accepted or rejected right now
export default function JoinRequestsList({
  requests,
  processingId,
  onAccept,
  onReject,
}) {
  return (
    <Box sx={{ mt: 5 }}>
      <Typography
        variant="h6"
        sx={{ fontWeight: 900, mb: 2.5, letterSpacing: "0.05em" }}
      >
        JOIN REQUESTS
      </Typography>

      {requests.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            border: "1px solid rgba(156, 163, 175, 0.12)",
            borderRadius: 2.5,
          }}
        >
          <Typography color="text.secondary">
            No pending join requests.
          </Typography>
        </Paper>
      ) : (
        <Stack spacing={2}>
          {requests.map((request) => (
            <Paper
              key={request._id}
              elevation={0}
              sx={{
                p: 2,
                border: "1px solid rgba(156, 163, 175, 0.12)",
                borderRadius: 2.5,
              }}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                alignItems={{ xs: "flex-start", sm: "center" }}
                justifyContent="space-between"
              >
                <Box>
                  <Typography sx={{ fontWeight: 800 }}>
                    {request.player?.username || "Unknown Player"}
                  </Typography>
                  <Typography
                    color="text.secondary"
                    sx={{ fontSize: "0.8rem" }}
                  >
                    Wants to join your team.
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    color="success"
                    disabled={processingId === request._id}
                    onClick={() => onAccept(request._id)}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    disabled={processingId === request._id}
                    onClick={() => onReject(request._id)}
                  >
                    Reject
                  </Button>
                </Stack>
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}
    </Box>
  );
}
