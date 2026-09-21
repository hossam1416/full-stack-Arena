"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  CircularProgress,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const inputStyles = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "rgba(0, 0, 0, 0.2)",

    "& fieldset": {
      borderColor: "rgba(156, 163, 175, 0.35)",
    },

    "&:hover fieldset": {
      borderColor: "rgba(156, 163, 175, 0.6)",
    },

    "&.Mui-focused fieldset": {
      borderColor: "primary.main",
      boxShadow: "0 0 0 1px rgba(220, 38, 38, 0.25)",
    },
  },

  "& .MuiInputLabel-root": {
    color: "text.secondary",
  },

  "& .MuiInputLabel-root.Mui-focused": {
    color: "primary.main",
  },

  "& .MuiOutlinedInput-input": {
    color: "text.primary",
  },
};

export default function AuthForm({
  title,
  subtitle,
  fields,
  formData,
  errors,
  serverError,
  onChange,
  onSubmit,
  submitText,
  bottomText,
  bottomLinkText,
  bottomLinkHref,
  forgotPassword = false,
  loading = false,
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "background.default",
        px: 2,
        py: 4,
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Image
          src="/images/arena-logo.png"
          alt="Arena Logo"
          width={200}
          height={200}
          priority
          style={{ objectFit: "contain" }}
        />
      </Box>

      <Box
        sx={{
          width: "100%",
          maxWidth: 460,
          p: { xs: 3, sm: 4 },
          backgroundColor: "background.paper",
          border: "1px solid rgba(156, 163, 175, 0.15)",
          borderRadius: 3,
          boxShadow: "0 0 35px rgba(220, 38, 38, 0.12)",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            textAlign: "center",
            mb: 1,
          }}
        >
          {title}
        </Typography>

        <Typography
          color="text.secondary"
          sx={{
            textAlign: "center",
            fontSize: "0.9rem",
          }}
        >
          {subtitle}
        </Typography>

        <Box
          component="form"
          autoComplete="on"
          onSubmit={onSubmit}
          sx={{
            mt: 4,
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
          }}
        >
          {fields.map((field) => {
            if (field.type === "password") {
              return (
                <Box key={field.name}>
                  <TextField
                    label={field.label}
                    name={field.name}
                    type={showPassword ? "text" : "password"}
                    value={formData[field.name]}
                    onChange={onChange}
                    error={Boolean(errors[field.name])}
                    helperText={errors[field.name] || field.helperText}
                    autoComplete={field.autoComplete}
                    fullWidth
                    disabled={loading}
                    sx={inputStyles}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword((prev) => !prev)}
                              edge="end"
                              disabled={loading}
                              aria-label={
                                showPassword ? "Hide password" : "Show password"
                              }
                              sx={{
                                color: "text.secondary",
                                "&:hover": {
                                  color: "primary.main",
                                },
                              }}
                            >
                              {showPassword ? (
                                <VisibilityOffIcon fontSize="small" />
                              ) : (
                                <VisibilityIcon fontSize="small" />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Box>
              );
            }

            return (
              <TextField
                key={field.name}
                label={field.label}
                name={field.name}
                type={field.type}
                value={formData[field.name]}
                onChange={onChange}
                error={Boolean(errors[field.name])}
                helperText={errors[field.name]}
                autoComplete={field.autoComplete}
                fullWidth
                disabled={loading}
                sx={inputStyles}
              />
            );
          })}

          {forgotPassword && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Link
                href="/forgot-password"
                style={{
                  color: "#DC2626",
                  textDecoration: "none",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                }}
              >
                Forgot password?
              </Link>
            </Box>
          )}

          {serverError && (
            <Typography
              color="error"
              sx={{
                textAlign: "center",
                fontSize: "0.85rem",
                fontWeight: 600,
              }}
            >
              {serverError}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={loading}
            sx={{
              mt: forgotPassword ? 0.5 : 1,
              py: 1.5,
              fontWeight: 800,
              boxShadow: "0 0 20px rgba(220, 38, 38, 0.35)",
              "&:hover": {
                boxShadow: "0 0 30px rgba(220, 38, 38, 0.55)",
              },
            }}
          >
            {loading ? (
              <CircularProgress
                size={24}
                sx={{ color: "primary.contrastText" }}
              />
            ) : (
              submitText
            )}
          </Button>

          <Typography
            color="text.secondary"
            sx={{
              textAlign: "center",
              fontSize: "0.85rem",
              mt: 0.5,
            }}
          >
            {bottomText}{" "}
            <Link
              href={bottomLinkHref}
              style={{
                color: "#DC2626",
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              {bottomLinkText}
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
