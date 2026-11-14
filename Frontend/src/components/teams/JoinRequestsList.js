import { Box, Button, Card, Stack, Typography } from "@mui/material";
import ActionRow from "@/components/common/ActionRow";

// processingId: the request that is being accepted or rejected right now
export default function JoinRequestsList({
  requests,
  processingId,
  onAccept,
  onReject,
}) {
  if (requests.length === 0) {
    return (
      <Card sx={{ p: 3 }}>
        <Typography color="text.secondary">
          No pending join requests.
        </Typography>
      </Card>
    );
  }

  return (
    <Stack spacing={2}>
      {requests.map((request) => {
        const disabled = processingId === request._id;

        return (
          <ActionRow
            key={request._id}
            actions={
              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  color="success"
                  disabled={disabled}
                  onClick={() => onAccept(request._id)}
                >
                  Accept
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  disabled={disabled}
                  onClick={() => onReject(request._id)}
                >
                  Reject
                </Button>
              </Stack>
            }
          >
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                {request.player?.username || "Unknown Player"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Wants to join your team.
              </Typography>
            </Box>
          </ActionRow>
        );
      })}
    </Stack>
  );
}
