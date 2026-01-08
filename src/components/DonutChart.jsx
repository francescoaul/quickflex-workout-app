import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { Box, Typography } from "@mui/material";

/**
 * props:
 *  - slices: [{ label, value, color }]
 *  - centerLabel: string
 *  - centerValue: string | number
 */
export default function DonutChart({ slices = [], centerLabel = "", centerValue = "" }) {
  const data = (slices.length ? slices : [
    { label: "Cardio", value: 0, color: "#A075FF" },
    { label: "Strength", value: 0, color: "#FF914D" },
    { label: "Flexibility", value: 0, color: "#3DCF91" },
  ]).map((d) => ({ ...d }));

  return (
    <Box
      sx={{
        position: "relative",
        width: 240,
        height: 240,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <PieChart
        series={[
          {
            innerRadius: 80,
            outerRadius: 110,
            data,
            cornerRadius: 4,
            paddingAngle: 3,
            arcLabel: null,
            valueFormatter: () => "",
          },
        ]}
        width={240}
        height={240}
        slotProps={{ legend: { hidden: true } }}
        legend={{ hidden: true }}
        sx={{
          "& .MuiPieArc-root": { stroke: "#0B0F19", strokeWidth: 2 },
          "& .MuiChartsLegend-root": { display: "none !important" },
        }}
      />

      {/* Center text */}
      <Box sx={{ position: "absolute", textAlign: "center" }}>
        {centerLabel ? (
          <Typography
            variant="caption"
            sx={{ display: "block", color: "rgba(255,255,255,0.6)", mb: 0.5 }}
          >
            {centerLabel}
          </Typography>
        ) : null}
        <Typography variant="h5" sx={{ color: "#fff", fontWeight: 600 }}>
          {centerValue || "0"}
        </Typography>
      </Box>
    </Box>
  );
}