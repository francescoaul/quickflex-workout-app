// src/components/LoginCard.jsx
import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import logo from "../assets/logo.svg";

const API_BASE = "http://localhost:3000";

export default function LoginCard({ onSuccess }) {
  const [mode, setMode] = React.useState("login");

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

  const [message, setMessage] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const isSignup = mode === "signup";

  const setModeSafe = (nextMode) => {
    if (nextMode === mode) return;
    setMode(nextMode);
    setSubmitted(false);
    setMessage("");
  };

  const handleSubmit = async () => {
    if (loading) return;

    setSubmitted(true);
    setMessage("");

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    if (!trimmedEmail || !trimmedPassword) return;

    setLoading(true);

    try {
      const endpoint = mode === "signup" ? "/auth/signup" : "/auth/login";

      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // IMPORTANT: receive cookie(s)
        body: JSON.stringify({
          email: trimmedEmail,
          password: trimmedPassword,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setMessage(data?.error || "Request failed");
        return;
      }

      if (mode === "signup") {
        setMode("login");
        setSubmitted(false);
        setPassword("");
        setMessage("Account created. Please log in.");
        return;
      }

      // ✅ login success: cookies set by server
     //  const user = data?.user || null;
      onSuccess?.(data);

      setMessage("");
    } catch (err) {
      console.error(err);
      setMessage("Network error (backend down, wrong URL, or CORS issue).");
    } finally {
      setLoading(false);
    }
  };

  const isSuccess = message.toLowerCase().includes("account created");

  const fieldSx = {
    width: 260,
    "& .MuiOutlinedInput-root": {
      borderRadius: 20,
      backgroundColor: "#2A2C30",
      color: "#fff",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(255,255,255,0.15)",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(255,255,255,0.25)",
    },
    "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.6)" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#9C7CFF" },
    "& .MuiFormHelperText-root": {
      margin: 0,
      marginTop: "4px",
      minHeight: 12,
    },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#060A13",
      }}
    >
      <Card
        sx={{
          width: 420,
          borderRadius: 4,
          p: 3,
          background: "rgba(20, 24, 38, 0.55)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.35)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          color: "#EAEAEA",
        }}
      >
        <CardContent sx={{ py: 3, px: 3 }}>
          <Stack spacing={2} alignItems="center">
            <img
              src={logo}
              alt="logo"
              style={{ width: 34, height: "auto", opacity: 0.9 }}
            />

            <Box
              sx={{
                position: "relative",
                width: 260,
                height: 40,
                borderRadius: 999,
                p: "4px",
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
                border: "1px solid rgba(255,255,255,0.10)",
                userSelect: "none",
              }}
              role="group"
              aria-label="Login or Sign up"
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 4,
                  left: 4,
                  width: "calc(50% - 4px)",
                  height: "calc(100% - 8px)",
                  borderRadius: 999,
                  backgroundColor: "rgb(156, 124, 255)",
                  transform: isSignup ? "translateX(100%)" : "translateX(0%)",
                  transition: "transform 650ms cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: "0 10px 22px rgba(0,0,0,0.35)",
                }}
              />

              <Box sx={{ position: "relative", display: "flex", height: "100%" }}>
                <Box
                  onClick={() => setModeSafe("login")}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") setModeSafe("login");
                  }}
                  aria-pressed={!isSignup}
                  sx={{
                    flex: 1,
                    display: "grid",
                    placeItems: "center",
                    cursor: "pointer",
                    borderRadius: 999,
                    color: !isSignup ? "#fff" : "rgba(255,255,255,0.85)",
                    transition: "color 200ms cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, letterSpacing: "0.05em" }}>
                    Login
                  </Typography>
                </Box>

                <Box
                  onClick={() => setModeSafe("signup")}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") setModeSafe("signup");
                  }}
                  aria-pressed={isSignup}
                  sx={{
                    flex: 1,
                    display: "grid",
                    placeItems: "center",
                    cursor: "pointer",
                    borderRadius: 999,
                    color: isSignup ? "#fff" : "rgba(255,255,255,0.85)",
                    transition: "color 200ms cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, letterSpacing: "0.05em" }}>
                    Sign up
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Stack spacing={1.5} sx={{ mt: 1.25 }} alignItems="center">
              <TextField
                label="Email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={submitted && !email.trim()}
                helperText={submitted && !email.trim() ? "Email is required" : null}
                sx={fieldSx}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />

              <TextField
                label="Password"
                type="password"
                autoComplete={isSignup ? "new-password" : "current-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={submitted && !password.trim()}
                helperText={submitted && !password.trim() ? "Password is required" : null}
                sx={fieldSx}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            </Stack>

            {message ? (
              <Typography
                sx={{
                  width: 260,
                  fontSize: "0.85rem",
                  textAlign: "center",
                  color: isSuccess
                    ? "rgba(130, 255, 170, 0.9)"
                    : "rgba(255, 120, 120, 0.9)",
                  mt: -1,
                }}
              >
                {message}
              </Typography>
            ) : null}

            <Button
              variant="contained"
              fullWidth
              disabled={loading}
              onClick={handleSubmit}
              sx={{
                height: 48,
                borderRadius: "48px",
                mt: 0.5,
                backgroundColor: "rgb(156, 124, 255)",
                textTransform: "none",
                "&:hover": { backgroundColor: "rgb(156, 124, 255)" },
                opacity: loading ? 0.8 : 1,
              }}
            >
              <Typography fontWeight={600}>
                {loading ? "Please wait..." : isSignup ? "Create account" : "Login"}
              </Typography>
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
