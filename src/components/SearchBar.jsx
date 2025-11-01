// src/components/SearchBar.jsx
import * as React from "react";
import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";

const PLACEHOLDER = "rgba(255,255,255,0.55)"; // lighter grey for dark background

export default function SearchBar({
  placeholder = "Search…",
  value,
  onChange,
  onSubmit,
}) {
  return (
    <Box
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        if (onSubmit) onSubmit();
      }}
      sx={{
        position: "relative",
        width: "100%",
        borderRadius: 2,
        bgcolor: "#1A1C1F", // dark background to match app
        border: "1px solid rgba(255,255,255,0.15)",
        transition: "background-color .2s ease, border-color .2s ease",
        "&:hover": {
          bgcolor: "#2A2C30",
          borderColor: "rgba(255,255,255,0.25)",
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          pl: 1.5,
          pointerEvents: "none",
          color: "rgba(255,255,255,0.6)",
        }}
      >
        <SearchIcon />
      </Box>

      <InputBase
        placeholder={placeholder}
        inputProps={{ "aria-label": "search" }}
        value={value}
        onChange={onChange}
        sx={{
            color: "#fff",
            width: "100%",
            pl: (theme) => `calc(1em + ${theme.spacing(4)})`,
            pr: 1.25,
            py: 0.6,       
            fontSize: "1rem", 
            lineHeight: 1.2,
            }}

      />
    </Box>
  );
}
