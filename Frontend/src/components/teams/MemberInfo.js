import { Avatar, Box, Stack, Typography } from "@mui/material";

// avatar + username + CAPTAIN / MEMBER
export default function MemberInfo({ member, isCaptain }) {
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Avatar
        src={member.avatar || undefined}
        alt={member.username}
        sx={{ width: 48, height: 48, fontWeight: 800 }}
      >
        {member.username?.charAt(0).toUpperCase()}
      </Avatar>

      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
          {member.username}
        </Typography>
        <Typography
          variant="caption"
          color={isCaptain ? "primary.main" : "text.secondary"}
          sx={{ fontWeight: 800 }}
        >
          {isCaptain ? "CAPTAIN" : "MEMBER"}
        </Typography>
      </Box>
    </Stack>
  );
}
