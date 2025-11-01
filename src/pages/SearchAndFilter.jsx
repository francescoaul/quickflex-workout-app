// src/pages/SearchAndFilter.jsx
import * as React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Stack,
  Chip,
  Button,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import SearchBar from "../components/SearchBar.jsx";

/** ----------------- Simple, local filter util ----------------- **/
function filterWorkouts(data, { query, groups, types, durations, difficulties }) {
  const q = (query || "").trim().toLowerCase();

  return (data || []).filter((w) => {
    const textHit =
      !q ||
      (w.name || "").toLowerCase().includes(q) ||
      (w.exercise || "").toLowerCase().includes(q) ||
      (w.type || "").toLowerCase().includes(q);

    const groupHit =
      !groups?.length ||
      (w.muscleGroup &&
        groups.some((g) => g.toLowerCase() === String(w.muscleGroup).toLowerCase()));

    const typeHit =
      !types?.length ||
      (w.type && types.some((t) => t.toLowerCase() === String(w.type).toLowerCase()));

    const dur = Number(w.durationMinutes) || 0;
    const durationHit =
      !durations?.length ||
      durations.some((bucket) => {
        if (bucket === "Under 10 min") return dur > 0 && dur < 10;
        if (bucket === "10–20 min") return dur >= 10 && dur <= 20;
        if (bucket === "20–40 min") return dur > 20 && dur <= 40;
        if (bucket === "40+ min") return dur > 40;
        return true;
      });

    const diffHit =
      !difficulties?.length ||
      (w.difficulty &&
        difficulties.some((d) => d.toLowerCase() === String(w.difficulty).toLowerCase()));

    return textHit && groupHit && typeHit && durationHit && diffHit;
  });
}

/** ----------------- Image sources (fallback) ----------------- **/
const IMG = {
  "weighted exercise": "https://images.unsplash.com/photo-1558611848-73f7eb4001a1",
  bodyweight: "https://images.unsplash.com/photo-1518611012118-696072aa579a",
  hiit: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
  yoga: "https://images.unsplash.com/photo-1546483875-ad9014c88eba",
  stretching: "https://images.unsplash.com/photo-1546483875-ad9014c88eba",
  chest: "https://images.unsplash.com/photo-1554284126-aa88f22d8b74",
  quadriceps: "https://images.unsplash.com/photo-1558611848-73f7eb4001a1",
  hamstrings: "https://images.unsplash.com/photo-1517964603305-11c74e50cc2d",
  shoulders: "https://images.unsplash.com/photo-1554284126-aa88f22d8b74",
  back: "https://images.unsplash.com/photo-1517832606299-7ae9b720a186",
  "lower back": "https://images.unsplash.com/photo-1517832606299-7ae9b720a186",
  abs: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b",
  calves: "https://images.unsplash.com/photo-1519999482648-25049ddd37b1",
  triceps: "https://images.unsplash.com/photo-1554284126-aa88f22d8b74",
  _default: "https://images.unsplash.com/photo-1579758629938-03607ccdbaba",
};

const pickImage = (w) => {
  const typeKey = (w.type || "").toLowerCase();
  const groupKey = (w.muscleGroup || "").toLowerCase();
  return IMG[typeKey] || IMG[groupKey] || IMG._default;
};

// ---------- Pills styling ----------
const groupSx = {
  flexWrap: "wrap",
  gap: 1.5,
  mt: 1,
  "& .MuiToggleButtonGroup-grouped": {
    borderRadius: "100px !important",
    margin: "0 !important",
    border: "none !important",
  },
};

const pillSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: 126,
  height: 42,
  px: 2.25,
  whiteSpace: "nowrap",
  opacity: 1,
  backgroundColor: "rgb(40, 36, 35)",
  borderRadius: "100px !important",
  border: 0,
  outline: "none",
  overflow: "hidden",
  textTransform: "none",
  fontSize: "1rem",
  color: "white",
  "&.Mui-selected": {
    backgroundColor: "rgb(121, 215, 255)",
    color: "black",
  },
  "&:hover": {
    backgroundColor: "rgba(121, 215, 255, 0.2)",
  },
};

export default function SearchAndFilter({ workouts = [], onClose, renderCard }) {
  const [query, setQuery] = React.useState("");

  const [selectedMuscles, setSelectedMuscles] = React.useState([]);
  const [selectedTypes, setSelectedTypes] = React.useState([]);
  const [selectedDurations, setSelectedDurations] = React.useState([]);
  const [selectedDifficulties, setSelectedDifficulties] = React.useState([]);
  const [showResults, setShowResults] = React.useState(false);

  const hasAnyFilter =
    selectedMuscles.length ||
    selectedTypes.length ||
    selectedDurations.length ||
    selectedDifficulties.length;

  const isTyping = query.trim() !== "";

  const TYPES = [
    "Cardio",
    "Strength",
    "Flexibility",
    "Balance",
    "Bodyweight",
    "Weighted Exercise",
    "Stretching",
    "Yoga",
    "HIIT",
  ];

  const results = React.useMemo(
    () =>
      filterWorkouts(workouts, {
        query,
        groups: selectedMuscles,
        types: selectedTypes,
        durations: selectedDurations,
        difficulties: selectedDifficulties,
      }),
    [workouts, query, selectedMuscles, selectedTypes, selectedDurations, selectedDifficulties]
  );

  const clearAll = React.useCallback(() => {
    setQuery("");
    setSelectedMuscles([]);
    setSelectedTypes([]);
    setSelectedDurations([]);
    setSelectedDifficulties([]);
    setShowResults(false);
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: "black",
        color: "white",
        minHeight: "100vh",
        px: 2,
        pt: 2,
        pb: "calc(96px + env(safe-area-inset-bottom))",
      }}
    >
      {/* Top bar */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>Search & Filter</Typography>
        <IconButton onClick={onClose} sx={{ color: "white" }} aria-label="Close advanced filters">
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ maxWidth: 480, mx: "auto" }}>
        {/* Search */}
        <Box sx={{ mb: 2 }}>
          <SearchBar
            placeholder="Search workouts, trainers..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (e.target.value.trim() !== "") setShowResults(true);
            }}
          />
          <Typography variant="body2" sx={{ mt: 1, color: "rgba(255,255,255,0.7)" }}>
            {results.length} result{results.length === 1 ? "" : "s"}
          </Typography>
        </Box>

        {/* Clear when results visible */}
        {(showResults || isTyping) && (
          <Box sx={{ mb: 1.5, display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              onClick={clearAll}
              disabled={!isTyping && !hasAnyFilter}
              sx={{
                bgcolor: "rgb(121, 215, 255)",
                color: "black",
                fontWeight: 700,
                borderRadius: 2,
                "&:hover": { bgcolor: "rgb(101, 195, 235)" },
              }}
            >
              Clear
            </Button>
          </Box>
        )}

        {/* Filters when not typing and not viewing results */}
        {!isTyping && !showResults ? (
          <>
            {/* Muscle Group */}
            <Accordion
              defaultExpanded
              sx={{
                bgcolor: "rgb(22, 18, 17)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.08)",
                "&::before": { display: "none" },
                mb: 1.5,
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}>
                <Typography component="span">Muscle Group</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ color: "rgba(255,255,255,0.8)" }}>
                <ToggleButtonGroup
                  value={selectedMuscles}
                  onChange={(_e, v) => setSelectedMuscles(v)}
                  sx={groupSx}
                >
                  {[
                    "Hamstrings","Abs","Shoulders","Back","Quadriceps","Triceps","Chest","Lower Back","Calves",
                  ].map((label) => (
                    <ToggleButton key={label} value={label} sx={pillSx}>
                      {label}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </AccordionDetails>
            </Accordion>

            {/* Workout Type */}
            <Accordion
              defaultExpanded
              sx={{
                bgcolor: "rgb(22, 18, 17)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.08)",
                "&::before": { display: "none" },
                mb: 1.5,
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}>
                <Typography component="span">Workout Type</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ color: "rgba(255,255,255,0.8)" }}>
                <ToggleButtonGroup
                  value={selectedTypes}
                  onChange={(_e, v) => setSelectedTypes(v)}
                  sx={groupSx}
                >
                  {[
                    "Cardio","Strength","Flexibility","Balance","Bodyweight","Weighted Exercise","Stretching","Yoga","HIIT",
                  ].map((label) => (
                    <ToggleButton key={label} value={label} sx={pillSx}>
                      {label}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </AccordionDetails>
            </Accordion>

            {/* Workout Duration */}
            <Accordion
              sx={{
                bgcolor: "rgb(22, 18, 17)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.08)",
                "&::before": { display: "none" },
                mb: 1.5,
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}>
                <Typography component="span">Workout Duration</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ color: "rgba(255,255,255,0.8)" }}>
                <ToggleButtonGroup
                  value={selectedDurations}
                  onChange={(_e, v) => setSelectedDurations(v)}
                  sx={groupSx}
                >
                  {["Under 10 min","10–20 min","20–40 min","40+ min"].map((label) => (
                    <ToggleButton key={label} value={label} sx={pillSx}>
                      {label}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </AccordionDetails>
            </Accordion>

            {/* Difficulty */}
            <Accordion
              sx={{
                bgcolor: "rgb(22, 18, 17)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.08)",
                "&::before": { display: "none" },
                mb: 1.5,
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}>
                <Typography component="span">Difficulty</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ color: "rgba(255,255,255,0.8)" }}>
                <ToggleButtonGroup
                  value={selectedDifficulties}
                  onChange={(_e, v) => setSelectedDifficulties(v)}
                  sx={groupSx}
                >
                  {["Beginner","Intermediate","Advanced"].map((label) => (
                    <ToggleButton key={label} value={label} sx={pillSx}>
                      {label}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </AccordionDetails>
            </Accordion>

            {/* Sticky CTA */}
            <Box
              sx={{
                position: "sticky",
                bottom: "calc(88px + env(safe-area-inset-bottom))",
                pt: 1,
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.85) 100%)",
              }}
            >
              <Button
                fullWidth
                variant="contained"
                onClick={() => setShowResults(true)}
                disabled={!hasAnyFilter}
                sx={{
                  bgcolor: "rgb(121, 215, 255)",
                  color: "black",
                  fontWeight: 700,
                  borderRadius: 2,
                  "&:hover": { bgcolor: "rgb(101, 195, 235)" },
                }}
              >
                Show {results.length} result{results.length === 1 ? "" : "s"}
              </Button>
            </Box>
          </>
        ) : (
          <>
            <ResultsList results={results} renderCard={renderCard} />
            {!isTyping && (
              <Box sx={{ mt: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={clearAll}
                  disabled={!hasAnyFilter && !isTyping}
                  sx={{
                    bgcolor: "rgb(121, 215, 255)",
                    color: "black",
                    fontWeight: 700,
                    borderRadius: 2,
                    "&:hover": { bgcolor: "rgb(101, 195, 235)" },
                  }}
                >
                  Clear
                </Button>
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}

/* -------- Results list --------
   If renderCard is provided, we render those cards (your Recents cards).
   Otherwise, we fall back to the image tiles. */
function ResultsList({ results, renderCard }) {
  if (renderCard) {
    return (
      <Box sx={{ mt: 2 }}>
        {results.length === 0 ? (
          <Typography sx={{ color: "rgba(255,255,255,0.7)" }}>
            No matches. Try a different search or filters.
          </Typography>
        ) : (
          <Box sx={{ display: "grid", gap: 1.5, justifyItems: "center" }}>
            {results.map((w) => (
              <Box key={w.id} sx={{ width: 360 }}>
                {renderCard(w)}
              </Box>
            ))}
          </Box>
        )}
      </Box>
    );
  }

  // Fallback: image tiles (kept for flexibility)
  return (
    <Box sx={{ mt: 2 }}>
      {results.length === 0 ? (
        <Typography sx={{ color: "rgba(255,255,255,0.7)" }}>
          No matches. Try a different search or filters.
        </Typography>
      ) : (
        <Stack spacing={1.5}>
          {results.map((w) => {
            const img = pickImage(w);
            return (
              <Box
                key={w.id}
                sx={{
                  position: "relative",
                  height: 140,
                  borderRadius: 2,
                  overflow: "hidden",
                  bgcolor: "rgb(22,18,17)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  backgroundImage: `url(${img})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.55) 65%, rgba(0,0,0,0.85) 100%)",
                  }}
                />
                <Box sx={{ position: "absolute", left: 12, right: 12, bottom: 10, color: "white" }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 0.25 }}>
                    {w.name || "Workout"}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.85)" }}>
                    {(w.type || "—")} • {(w.muscleGroup || "—")} • {(w.durationMinutes || "—")} min
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 0.75 }}>
                    {w.difficulty && (
                      <Chip
                        label={w.difficulty}
                        size="small"
                        sx={{ bgcolor: "rgba(255,255,255,0.18)", color: "#fff", borderRadius: "12px", height: 22 }}
                      />
                    )}
                    {w.isCompleted ? (
                      <Chip
                        label="Completed"
                        size="small"
                        sx={{ bgcolor: "rgba(121,215,255,0.35)", color: "#fff", borderRadius: "12px", height: 22 }}
                      />
                    ) : null}
                  </Stack>
                </Box>
              </Box>
            );
          })}
        </Stack>
      )}
    </Box>
  );
}
