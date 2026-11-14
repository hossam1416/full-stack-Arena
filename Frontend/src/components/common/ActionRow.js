import { Card, Stack } from "@mui/material";

// a row card: the info on the left (children), the buttons on the right (actions)
export default function ActionRow({ children, actions, sx }) {
  return (
    <Card sx={{ p: 2, ...sx }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
      >
        {children}
        {actions}
      </Stack>
    </Card>
  );
}
