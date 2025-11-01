// src/components/NavBar.jsx
import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import FitnessCenterSharpIcon from "@mui/icons-material/FitnessCenterSharp";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import AddIcon from '@mui/icons-material/Add';

export default function NavBar({ value, onChange }) {
  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 20,
        left: 0,
        right: 0,
        mx: "auto",
        maxWidth: 360,
        borderRadius: "50px",
        bgcolor: "rgba(11, 15, 25, 0.9)",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0px 8px 25px rgba(0,0,0,0.4)",
        zIndex: 1000,
      }}
      elevation={0}
    >
      <Box sx={{ width: "100%" }}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => onChange(newValue)}
          sx={{
            bgcolor: "transparent",
            borderRadius: "50px",
            py: 0.5,
            "& .MuiBottomNavigationAction-root": {
              color: "#A0A4AE",
              minWidth: 80,
              "&.Mui-selected": { color: "#9C7CFF" },
            },
          }}
        >
          <BottomNavigationAction label="" icon={<AddIcon />} />
          <BottomNavigationAction label="Workouts" icon={<FitnessCenterSharpIcon />} />
          <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
          <BottomNavigationAction label="Stats" icon={<ShowChartIcon />} />
        </BottomNavigation>
      </Box>
    </Paper>
  );
}
