import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  Stack,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// a card you click to select (a team, a player...)
export default function SelectableCard({
  title,
  subtitle,
  avatarSrc,
  selected,
  disabled,
  onClick,
}) {
  return (
    <Card
      sx={{
        borderWidth: 2,
        borderColor: selected ? "primary.main" : "divider",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <CardActionArea disabled={disabled} onClick={onClick} sx={{ p: 2.5 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            src={avatarSrc || undefined}
            alt={title}
            sx={{ width: 52, height: 52, fontWeight: 800 }}
          >
            {title?.charAt(0).toUpperCase()}
          </Avatar>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography noWrap sx={{ fontWeight: 800 }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>

          {selected && <CheckCircleIcon color="primary" />}
        </Stack>
      </CardActionArea>
    </Card>
  );
}
