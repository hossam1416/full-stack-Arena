import Link from "next/link";
import { Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function BackButton({ href, children }) {
  return (
    <Button
      component={Link}
      href={href}
      color="secondary"
      startIcon={<ArrowBackIcon />}
      sx={{ mb: 3 }}
    >
      {children}
    </Button>
  );
}
