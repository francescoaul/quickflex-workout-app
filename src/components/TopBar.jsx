// src/components/TopBar.jsx
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import logo from "../assets/logo.svg";

const SETTINGS = ["Profile", "Account", "Logout"];

export default function TopBar({ onLogout }) {
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const openUserMenu = (e) => setAnchorElUser(e.currentTarget);
  const closeUserMenu = () => setAnchorElUser(null);

  const handleLogout = async () => {
    closeUserMenu();

    try {
      await fetch('http://localhost:3000/auth/logout', {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout request failed:", err)
    }

    localStorage.removeItem("accessToken");
    onLogout?.();
  }

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(11, 15, 25, 0.75)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
    <Container maxWidth="xl">
    <Toolbar disableGutters>
        {/* Desktop logo */}
        <Box
        component="img"
        src={logo}
        alt="Quickflex logo"
        sx={{
            display: { xs: "none", md: "flex" },
            height: 36,
            width: "auto",
            mr: 1,
        }}
        />
        <Typography
        variant="h6"
        noWrap
        sx={{
            mr: 2,
            display: { xs: "none", md: "flex" },
            fontWeight: 700,
            letterSpacing: ".15rem",
            color: "inherit",
            textDecoration: "none",
        }}
        >
        Quickflex
        </Typography>

        {/* Mobile logo */}
        <Box
        component="img"
        src={logo}
        alt="Quickflex logo"
        sx={{
            display: { xs: "flex", md: "none" },
            height: 32,
            width: "auto",
            mr: 1,
        }}
        />
        <Typography
        variant="h6"
        noWrap
        sx={{
            mr: 2,
            display: { xs: "flex", md: "none" },
            fontWeight: 700,
            letterSpacing: ".15rem",
            color: "inherit",
            textDecoration: "none",
        }}
        >
        Quickflex
        </Typography>

          {/* Spacer pushes avatar to the right on all breakpoints */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Avatar / user menu */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={openUserMenu} sx={{ p: 0 }}>
                <Avatar
                  alt="User"
                  src=""
                  sx={{ width: 32, height: 32, bgcolor: "#9C7CFF" }}
                >
                  U
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{
                mt: "45px",
                "& .MuiPaper-root": {
                  bgcolor: "#131722",
                  color: "#EAEAEA",
                  border: "1px solid rgba(255,255,255,0.08)",
                },
              }}
              id="menu-user"
              anchorEl={anchorElUser}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              open={Boolean(anchorElUser)}
              onClose={closeUserMenu}
            >
              {SETTINGS.map((setting) => (
                <MenuItem key={setting} onClick={setting === "Logout" ? handleLogout : closeUserMenu}>
                  <Typography sx={{ textAlign: "center" }}>{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}