// src/components/AddWorkout.jsx
import * as React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Picker from "react-mobile-picker";

const TYPE_OPTIONS = ["Cardio", "Strength", "Flexibility", "Balance"];

const EXERCISE_OPTIONS = [
  // --- Compound Strength ---
  "Squats",
  "Front Squats",
  "Hack Squats",
  "Deadlift",
  "Romanian Deadlift",
  "Sumo Deadlift",
  "Bench Press",
  "Incline Bench Press",
  "Decline Bench Press",
  "Overhead Press",
  "Push Press",
  "Clean and Press",
  "Barbell Row",
  "Pendlay Row",
  "T-Bar Row",
  "Pull-Up",
  "Chin-Up",
  "Dips",

  // --- Dumbbell & Isolation ---
  "Dumbbell Press",
  "Incline Dumbbell Press",
  "Dumbbell Fly",
  "Dumbbell Pullover",
  "Dumbbell Curl",
  "Hammer Curl",
  "Concentration Curl",
  "Tricep Kickback",
  "Overhead Tricep Extension",
  "Lateral Raise",
  "Front Raise",
  "Reverse Fly",
  "Shrugs",
  "Dumbbell Lunges",
  "Bulgarian Split Squat",
  "Step-Ups",
  "Glute Bridge",
  "Hip Thrust",
  "Calf Raise",

  // --- Machine / Cable ---
  "Lat Pulldown",
  "Seated Row",
  "Cable Fly",
  "Cable Curl",
  "Cable Lateral Raise",
  "Leg Extension",
  "Leg Curl",
  "Chest Press Machine",
  "Shoulder Press Machine",
  "Leg Press",
  "Smith Machine Squat",
  "Pec Deck",
  "Tricep Rope Pushdown",
  "Cable Crunch",

  // --- Core / Stability ---
  "Plank",
  "Side Plank",
  "Crunches",
  "Reverse Crunch",
  "Russian Twist",
  "Hanging Leg Raise",
  "Mountain Climbers",
  "Bicycle Crunch",
  "V-Ups",
  "Ab Rollout",
  "Flutter Kicks",
  "Side Bends",

  // --- Cardio / Conditioning ---
  "Running",
  "Jogging",
  "Treadmill Sprint",
  "Cycling",
  "Rowing",
  "Elliptical",
  "Jump Rope",
  "Stair Climber",
  "Box Jumps",
  "Burpees",
  "Jumping Jacks",
  "Battle Ropes",
  "Sled Push",
  "Ski Erg",

  // --- Functional / Mobility ---
  "Kettlebell Swing",
  "Turkish Get-Up",
  "Farmer's Carry",
  "Medicine Ball Slam",
  "Wall Ball Shots",
  "Bear Crawl",
  "Lunge Twist",
  "Good Morning",
  "Face Pull",
  "Pull-Apart Band Rows",
  "Resistance Band Squat",
  "Yoga",
  "Pilates",
  "Foam Rolling",
  "Stretching Routine",
];

// shared dark dropdown styling (kept)
const DARK_MENU_PROPS = {
  PaperProps: {
    sx: {
      bgcolor: "#1A1C1F",
      color: "#EAEAEA",
      borderRadius: 2,
      border: "1px solid rgba(255,255,255,0.15)",
      "& .MuiMenuItem-root": {
        color: "#EAEAEA",
        fontSize: 14,
        "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
        "&.Mui-selected": { bgcolor: "", color: "#fff" },
        "&.Mui-selected:hover": { bgcolor: "" },
        "&.Mui-focusVisible": {
          bgcolor: "rgba(255,255,255,0.08) !important",
        },
      },
    },
  },
};

// small inline wheel component (adapted from your wheel app)
function MiniWheel({ label, unit, name, values, value, onChange }) {
  const wheelHeight = 150;
  const itemHeight = 40;

    const handleWheel = (e) => {
    e.preventDefault();
    const dir = e.deltaY > 0 ? 1 : -1;
    const idx = values.indexOf(value);
    const nextIdx = Math.min(values.length - 1, Math.max(0, idx + dir));
    if (nextIdx !== idx) onChange(values[nextIdx]);
  };


  return (
    <Box
      onWheel={handleWheel}
      sx={{
        position: "relative",
        display: "grid",
        placeItems: "center",
        width: "100%",
        minWidth: 140,
        bgcolor: "rgba(26,28,31,0.35)",
        borderRadius: 3,
        border: "1px solid rgba(255,255,255,0.05)",
        py: 1.5,
      }}
    >
      <Picker
        className="wheel-picker"
        value={{ [name]: String(value) }}
        onChange={(v) => onChange(Number(v[name]))}
        height={wheelHeight}
        itemHeight={itemHeight}
      >
        <Picker.Column name={name}>
          {values.map((v) => {
            const selected = Number(value) === v;
            return (
            <Picker.Item key={v} value={String(v)}>
              <span
                className={`wheel-item ${selected ? "selected" : ""}`}
                style={{
                  height: itemHeight,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: selected ? 26 : 16,
                  opacity: selected ? 1 : 0.45,
                  transition: "all 0.2s ease",
                }}
              >
                {v}
              </span>
            </Picker.Item>
          )})}
        </Picker.Column>
      </Picker>

      {/* left label */}
      <Box
        sx={{
          position: "absolute",
          left: 10,
          top: "50%",
          transform: "translateY(-50%)",
          fontSize: 12,
          fontWeight: 600,
          opacity: 0.9,
          pointerEvents: "none",
        }}
      >
        {label}
      </Box>

      {/* right unit */}
      <Box
        sx={{
          position: "absolute",
          right: 10,
          top: "50%",
          transform: "translateY(-50%)",
          fontSize: 12,
          opacity: 0.7,
          pointerEvents: "none",
        }}
      >
        {unit}
      </Box>
    </Box>
  );
}

export default function AddWorkout({
  name,
  setName,
  type,
  setType,
  exercise,
  setExercise,
  sets,
  setSets,
  reps,
  setReps,
  addWorkout,
}) {
  const isSmall = useMediaQuery("(max-width:560px)");

  const setOptions = Array.from({ length: 10 }, (_, i) => i + 1);
  const repOptions = Array.from({ length: 20 }, (_, i) => i + 1);

  return (
    <Card
      sx={{
        backgroundColor: "rgba(255,255,255,0.02)",
        color: "#EAEAEA",
        borderRadius: 6,
        minWidth: 320,
        backdropFilter: "blur(6px)",
        boxShadow: "0 0 25px rgba(0,0,0,0.3)",
      }}
    >
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, color: "#A075FF", fontWeight: 600 }}>
          Add Workout
        </Typography>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2}}>
          {/* Name */}
          <TextField
            label="Name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{
              minWidth: 260,
              "& .MuiOutlinedInput-root" : {
                borderRadius: "20px",
              },
              "& .MuiInputBase-input": { color: "#EAEAEA" },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255,255,255,0.25)",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#EAEAEA" },
              "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.6)" },
              "& .MuiInputLabel-root.Mui-focused": { color: "#A075FF" },
            }}
          />

          {/* Type */}
          <FormControl
            sx={{
              minWidth: 200,
              "& .MuiOutlinedInput-root" : {
                borderRadius: "20px",
              },
              "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.6)" },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255,255,255,0.25)",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#EAEAEA" },
              "& .MuiSelect-select": {
                color: "#EAEAEA",
                backgroundColor: "#1A1C1F",
                borderRadius: "8px",
              },
              "& .MuiSvgIcon-root": { color: "rgba(255,255,255,0.8)" },
              "&:hover .MuiSvgIcon-root, &.Mui-focused .MuiSvgIcon-root": {
                color: "#A075FF",
              },
            }}
          >
            <InputLabel id="type-label">Type</InputLabel>
            <Select
              labelId="type-label"
              label="Type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              MenuProps={DARK_MENU_PROPS}
            >
              {TYPE_OPTIONS.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Exercise (Autocomplete) */}
          <Autocomplete
            options={EXERCISE_OPTIONS}
            value={exercise || null}
            onChange={(_, newValue) => setExercise(newValue ?? "")}
            isOptionEqualToValue={(option, value) => option === value}
            clearOnEscape
            componentsProps={{
              paper: {
                sx: {
                  bgcolor: "#1A1C1F",
                  color: "#EAEAEA",
                  borderRadius: 2,
                  border: "1px solid rgba(255,255,255,0.15)",
                  "& .MuiAutocomplete-option": {
                    color: "#EAEAEA",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
                    "&.Mui-focused": { bgcolor: "rgba(255,255,255,0.08)" },
                    "&[aria-selected='true']": {
                      bgcolor: "#A075FF",
                      color: "#fff",
                    },
                  },
                },
              },
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Exercise"
                sx={{
                  minWidth: 260,
                   "& .MuiOutlinedInput-root": {
                    borderRadius: "20px",  
                    },
                  "& .MuiInputBase-input": { color: "#EAEAEA" },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255,255,255,0.25)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#EAEAEA" },
                  "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.6)" },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#A075FF" },
                  "& .MuiSvgIcon-root": { color: "rgba(255,255,255,0.8)" },
                }}
              />
            )}
          />
        </Box>

        {/* NEW: Wheel pickers for sets & reps */}
        <Box
          sx={{
            mt: 3,
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            flexDirection: isSmall ? "column" : "row",
          }}
        >
          <MiniWheel
            label="Sets"
            unit=""
            name="sets"
            values={setOptions}
            value={sets}
            onChange={setSets}
          />
          <MiniWheel
            label="Reps"
            unit=""
            name="reps"
            values={repOptions}
            value={reps}
            onChange={setReps}
          />
        </Box>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          variant="contained"
          onClick={addWorkout}
          sx={{
            ml: "auto",
            backgroundColor: "#A075FF",
            "&:hover": { backgroundColor: "#8c5fff" },
            textTransform: "none",
            borderRadius: 209,
          }}
        >
          Add
        </Button>
      </CardActions>
    </Card>
  );
}
