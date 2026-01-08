// src/components/AnalyticsCard.jsx
import * as React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import { LineChart } from "@mui/x-charts/LineChart";
import DonutChart from "./DonutChart";

// --- date helpers ---
function monthKey(d) {
  const dt = new Date(d);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
}

function lastNMonthsLabels(n = 12) {
  const today = new Date();
  const labels = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    labels.push(d.toLocaleString("en-US", { month: "short" }));
  }
  return labels;
}

function lastNMonthsKeys(n = 12) {
  const today = new Date();
  const keys = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    keys.push(monthKey(d));
  }
  return keys;
}

function calendarYearKeys(year) {
  return Array.from({ length: 12 }, (_, i) => `${year}-${String(i + 1).padStart(2, "0")}`);
}

function calendarYearLabels(year) {
  return Array.from({ length: 12 }, (_, i) =>
    new Date(year, i, 1).toLocaleString("en-US", { month: "short" })
  );
}

// --- shared dropdown styling ---
const DARK_MENU_PROPS = {
  PaperProps: {
    sx: {
      bgcolor: "#1A1C1F",
      color: "#EAEAEA",
      borderRadius: 2,
      border: "1px solid rgba(255,255,255,0.15)",
      "& .MuiMenuItem-root": {
        color: "#EAEAEA",
        "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
        "&.Mui-selected": { bgcolor: "#A075FF", color: "#fff" },
        "&.Mui-selected:hover": { bgcolor: "#8B5CF6" },
      },
    },
  },
};

export default function AnalyticsCard({ workouts = [] }) {
  const currentYear = new Date().getFullYear();
  const [mode, setMode] = React.useState("year");
  const [year, setYear] = React.useState(currentYear);

  // show 6 years around current
  const YEAR_OPTIONS = React.useMemo(
    () => Array.from({ length: 6 }, (_, i) => currentYear - 2 + i),
    [currentYear]
  );

  const {
    lineLabels,
    lineSeries,
    typePct,
    donutSlices,
    totalWorkouts,
  } = React.useMemo(() => {
    let keys;
    let labels;

    if (mode === "rolling") {
      keys = lastNMonthsKeys(12);
      labels = lastNMonthsLabels(12);
    } else {
      keys = calendarYearKeys(year);
      labels = calendarYearLabels(year);
    }

    const countsByMonth = Object.fromEntries(keys.map((k) => [k, 0]));

    workouts.forEach((w) => {
      const k = monthKey(w.createdAtTs || Date.now());
      if (k in countsByMonth) countsByMonth[k] += 1;
    });

    const line = keys.map((k) => countsByMonth[k]);

    const types = ["Cardio", "Strength", "Flexibility", "Balance"];
    const colors = ["#A075FF", "#FF914D", "#3DCF91", "#6EC1FF"];
    const byType = Object.fromEntries(types.map((t) => [t, 0]));

    workouts.forEach((w) => {
      const t = (w.type || "").trim();
      if (byType[t] !== undefined) byType[t] += 1;
    });

    const total = workouts.length || 1;
    const pct = types.map((t) => Math.round((byType[t] / total) * 100));

    const slices = types.map((t, i) => ({
      label: t,
      value: byType[t],
      color: colors[i],
    }));

    const totalWorkouts = workouts.length;

    return {
      lineLabels: labels,
      lineSeries: line,
      typePct: pct,
      donutSlices: slices,
      totalWorkouts,
    };
  }, [workouts, mode, year]);

  return (
    <Box sx={{ minWidth: 360 }}>
      <Card
        sx={{
          backgroundColor: "#0B0F19",
          color: "#A0A4AE",
          borderRadius: "16px",
          boxShadow: "0px 4px 20px rgba(0,0,0,0.4)",
          p: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <CardContent sx={{ width: "100%", p: 3 }}>
          {/* === Controls row === */}
          <Box
            sx={{
              mb: 2,
              width: "95%",
              mx: "auto",
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 1.5,
                width: "100%",
                justifyContent: "space-between",
                overflow: "visible",
                flexWrap: "wrap",
              }}
            >
              {/* Mode dropdown */}
              <FormControl
                sx={{
                  minWidth: 200,
                  "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.6)" },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255,255,255,0.25)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#EAEAEA" },
                  "& .MuiSelect-select": {
                    color: "#EAEAEA",
                    backgroundColor: "#1A1C1F",
                  },
                  "& .MuiSvgIcon-root": { color: "rgba(255,255,255,0.8)" },
                  "&:hover .MuiSvgIcon-root, &.Mui-focused .MuiSvgIcon-root": {
                    color: "#A075FF",
                  },
                  // 👇 your radius
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "20px",
                  },
                }}
              >
                <InputLabel id="mode-label">Mode</InputLabel>
                <Select
                  labelId="mode-label"
                  label="Mode"
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  MenuProps={DARK_MENU_PROPS}
                >
                  <MenuItem value="year">This year</MenuItem>
                  <MenuItem value="rolling">Last 12 months</MenuItem>
                </Select>
              </FormControl>

              {/* Year dropdown */}
              {mode === "year" && (
                <FormControl
                  sx={{
                    minWidth: 140,
                    "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.6)" },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(255,255,255,0.25)",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#EAEAEA" },
                    "& .MuiSelect-select": {
                      color: "#EAEAEA",
                      backgroundColor: "#1A1C1F",
                    },
                    "& .MuiSvgIcon-root": { color: "rgba(255,255,255,0.8)" },
                    "&:hover .MuiSvgIcon-root, &.Mui-focused .MuiSvgIcon-root": {
                      color: "#A075FF",
                    },
                    // 👇 your radius
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "20px",
                    },
                  }}
                >
                  <InputLabel id="year-label">Year</InputLabel>
                  <Select
                    labelId="year-label"
                    label="Year"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    MenuProps={{
                      anchorOrigin: { vertical: "bottom", horizontal: "right" },
                      transformOrigin: { vertical: "top", horizontal: "right" },
                      PaperProps: {
                        sx: {
                          bgcolor: "#1A1C1F",
                          color: "#EAEAEA",
                          borderRadius: 2,
                          minWidth: 120,
                        },
                      },
                    }}
                  >
                    {YEAR_OPTIONS.map((y) => (
                      <MenuItem key={y} value={y}>
                        {y}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Box>
          </Box>

          {/* === Line Chart === */}
          <Box
            sx={{
              mb: 4,
              width: "95%",
              mx: "auto",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <LineChart
              xAxis={[
                {
                  data: lineLabels,
                  scaleType: "point",
                  tickLabelStyle: { fill: "#A0A4AE", fontSize: 11 },
                },
              ]}
              yAxis={[
                {
                  tickLabelStyle: { fill: "#A0A4AE", fontSize: 11 },
                },
              ]}
              series={[
                {
                  data: lineSeries,
                  area: true,
                  color: "#9C7CFF",
                  curve: "natural",
                  showMark: false,
                },
              ]}
              width={320}
              height={200}
              sx={{
                ml: -2,
                "& .MuiLineElement-root": {
                  strokeWidth: 3,
                  filter: "drop-shadow(0 0 12px rgba(156,124,255,0.9))",
                },
                "& .MuiAreaElement-root": {
                  fill: "url(#gradientFill)",
                  opacity: 0.55,
                },
                "& .MuiChartsAxis-line": { display: "none" },
                "& .MuiChartsAxis-tickLabel": { fill: "#cbd1d8", fontSize: 11 },
                "& .MuiChartsAxis-tick": { stroke: "none" },
                "& .MuiChartsGrid-line": { stroke: "rgba(255,255,255,0.05)" },
              }}
              slotProps={{
                defs: {
                  children: (
                    <linearGradient id="gradientFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#9C7CFF" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="#9C7CFF" stopOpacity={0} />
                    </linearGradient>
                  ),
                },
              }}
            />
          </Box>

          {/* === Progress Bars === */}
          <Typography
            variant="subtitle2"
            sx={{ color: "rgba(255,255,255,0.6)", mb: 2 }}
          >
            Breakdown by type
          </Typography>

          {["Cardio", "Strength", "Flexibility"].map((label, i) => {
            const colors = ["#A075FF", "#FF914D", "#3DCF91"];
        
            return (
              <Box key={label} sx={{ mb: 2 }}>
                <Typography sx={{ mb: 0.5, color: colors[i] }}>{label}</Typography>
           <LinearProgress
              variant="determinate"
              value={typePct[i] || 0}
              color={["primary", "warning", "success"][i]}
              sx={{
                height: 10,
                borderRadius: 10,
                backgroundColor: "rgba(255,255,255,0.08)",
                "& .MuiLinearProgress-bar": { borderRadius: 10 },
              }}
            />

              </Box>
            );
          })}

          {/* === Donut Chart === */}
          <Box
            sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 3 }}
          >
            <Typography
              variant="subtitle2"
              sx={{ color: "rgba(255,255,255,0.6)", mb: 2 }}
            >
              Type distribution
            </Typography>

            <DonutChart
              slices={donutSlices}
              centerLabel="Total Workouts"
              centerValue={String(totalWorkouts)}
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}