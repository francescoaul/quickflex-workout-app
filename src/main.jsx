// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import CssBaseline from "@mui/material/CssBaseline";
import { CssVarsProvider as MaterialCssVarsProvider } from "@mui/material/styles";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MaterialCssVarsProvider defaultMode="dark">
      <CssBaseline />
      <App />
    </MaterialCssVarsProvider>
  </StrictMode>
);
