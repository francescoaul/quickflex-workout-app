// src/App.jsx
import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  TextField,
  Button,
  Modal,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import TuneSharpIcon from "@mui/icons-material/TuneSharp";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LoopIcon from "@mui/icons-material/Loop";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import SearchBar from "./components/SearchBar.jsx";
import AnalyticsCard from "./components/AnalyticsCard";
import NavBar from "./components/NavBar";
import AddWorkout from "./components/AddWorkout";
import SearchAndFilter from "./pages/SearchAndFilter.jsx";
import TopBar from "./components/TopBar";

const CARD_WIDTH = 360;

const editCardStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "#1A1C1F",
  color: "#fff",
  borderRadius: "25px",
  boxShadow:
    "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
  transition: "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
  padding: "16px",
  maxWidth: CARD_WIDTH,
  width: "90%",
  overflow: "hidden",
  outline: "none",
};

// --- WorkoutCard component ---
function WorkoutCard({ workout, onToggleFavorite, onDelete, onStartEdit }) {
  const { id, name, type, exercise, sets, reps, createdAtTs, favorite } = workout;

  const formattedDate = new Date(createdAtTs).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Card
      sx={{
        backgroundColor: "#1A1C1F",
        color: "#fff",
        borderRadius: 3,
        p: 2,
        maxWidth: CARD_WIDTH,
        width: "100%",
        mx: "auto",
      }}
    >
      <CardContent>
        {/* Top row */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {name || "Workout"}
          </Typography>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.65)" }}>
            {formattedDate}
          </Typography>
        </Box>

        {/* Subheading */}
        <Typography
          variant="body2"
          sx={{
            color: "rgba(255,255,255,0.75)",
            mb: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {(type && exercise) ? `${type} • ${exercise}` : type || exercise || ""}
        </Typography>

        {/* Time + Reps */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <AccessTimeIcon sx={{ fontSize: 18, color: "gray" }} />
          <Typography variant="body2" color="gray">
            Added just now
          </Typography>
          <Box sx={{ width: 2, height: 16, bgcolor: "rgba(255,255,255,0.2)" }} />
          <LoopIcon sx={{ fontSize: 18, color: "gray" }} />
          <Typography variant="body2" color="gray">
            {sets}x{reps} reps
          </Typography>
        </Box>
      </CardContent>

      {/* Actions */}
      <CardActions
        sx={{
          pt: 1,
          borderTop: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          gap: 2,
        }}
      >
        <Box
          role="button"
          onClick={() => onToggleFavorite(id)}
          sx={{
            cursor: "pointer",
            color: favorite ? "#9C7CFF" : "rgba(255,255,255,0.7)",
            "&:active": { transform: "scale(0.94)" },
          }}
        >
          {favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </Box>

        <Box
          role="button"
          onClick={onStartEdit}
          sx={{
            cursor: "pointer",
            color: "rgba(255,255,255,0.7)",
            "&:hover": { color: "#9C7CFF" },
          }}
        >
          <EditIcon />
        </Box>

        <Box
          role="button"
          onClick={() => onDelete(id)}
          sx={{
            cursor: "pointer",
            color: "rgba(255,255,255,0.7)",
            "&:hover": { color: "#ff6161" },
          }}
        >
          <DeleteForeverIcon />
        </Box>
      </CardActions>
    </Card>
  );
}

// --- App component ---
export default function App() {
  const [tab, setTab] = React.useState(3);

  // Add form state
  const [name, setName] = React.useState("");
  const [type, setType] = React.useState("");
  const [exercise, setExercise] = React.useState("");
  const [sets, setSets] = React.useState(1);
  const [reps, setReps] = React.useState(1);

  // Search (inline)
  const [search, setSearch] = React.useState("");

  // Data (StrictMode-safe: hydrate from localStorage lazily)
  const [workouts, setWorkouts] = React.useState(() => {
    try {
      const stored = localStorage.getItem("fittrack:workouts");
      const parsed = stored ? JSON.parse(stored) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  // Save to localStorage whenever workouts change
  React.useEffect(() => {
    try {
      localStorage.setItem("fittrack:workouts", JSON.stringify(workouts));
    } catch (err) {
      console.error("Error saving workouts to localStorage:", err);
    }
  }, [workouts]);

  // Edit modal
  const [editOpen, setEditOpen] = React.useState(false);
  const [tempEdit, setTempEdit] = React.useState(null);

  // Advanced filters modal
  const [searchOpen, setSearchOpen] = React.useState(false);

  // Visible items using only search
  const visibleWorkouts = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = workouts;

    if (!q) return list;
    if (q.length === 1) {
      return list.filter((w) => (w.name || "").toLowerCase().startsWith(q));
    }
    return list.filter(
      (w) =>
        (w.name || "").toLowerCase().includes(q) ||
        (w.exercise || "").toLowerCase().includes(q) ||
        (w.type || "").toLowerCase().includes(q)
    );
  }, [workouts, search]);

  // Handlers
  const openEditFor = (w) => { setTempEdit({ ...w }); setEditOpen(true); };
  const closeEdit = () => { setEditOpen(false); setTempEdit(null); };
  const saveEdit = () => {
    if (!tempEdit) return;
    setWorkouts((prev) => prev.map((w) => (w.id === tempEdit.id ? { ...w, ...tempEdit } : w)));
    closeEdit();
  };

  const addWorkout = () => {
    if (!name.trim() || !type.trim() || !exercise.trim()) return;
    const now = new Date();
    setWorkouts((prev) => [
      {
        id: Date.now(),
        name,
        type,
        exercise,
        sets,
        reps,
        createdAtTs: now.getTime(),
        favorite: false,
      },
      ...prev,
    ]);
    setName(""); setType(""); setExercise(""); setSets(1); setReps(1);
  };

  const toggleFavorite = (id) =>
    setWorkouts((prev) =>
      prev.map((w) => (w.id === id ? { ...w, favorite: !w.favorite } : w))
    );

  const deleteWorkout = (id) => {
    setWorkouts((prev) => prev.filter((w) => w.id !== id));
    if (tempEdit?.id === id) closeEdit();
  };

  // Views
  const WorkoutsView = (
    <Box sx={{ color: "#A0A4AE", width: "100%", maxWidth: 960 }}>
      {/* Header column (kept aligned to card width) */}
      <Box sx={{ width: CARD_WIDTH, mx: "auto", mb: 2 }}>
        <Typography variant="h6" sx={{ color: "#fff", fontWeight: 600, mb: 1 }}>
          Workouts
        </Typography>

        {/* Search + Filters Icon */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{ flex: 1 }}>
            <SearchBar
              placeholder="Search workouts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Box>

          {/* Open Advanced Filters (icon button) */}
          <IconButton
            onClick={() => setSearchOpen(true)}
            sx={{
              color: "rgba(255,255,255,0.8)",
              transition: "all 0.25s ease",
              "&:hover": {
                color: "#A075FF",
                transform: "rotate(10deg)",
              },
            }}
            aria-label="Open filters"
          >
            <TuneSharpIcon />
          </IconButton>
        </Box>

        <Typography
          variant="caption"
          sx={{
            color: "rgba(255,255,255,0.6)",
            display: "block",
            textAlign: "center",
            mt: 1,
          }}
        >
          Showing {visibleWorkouts.length} of {workouts.length}
        </Typography>
      </Box>

      {/* Cards (aligned to same width) */}
      <Box sx={{ width: CARD_WIDTH, mx: "auto", mt: 2 }}>
        <Box sx={{ display: "grid", gap: 1.5, justifyItems: "center" }}>
          {visibleWorkouts.length === 0 ? (
            <Typography align="center" sx={{ mt: 2 }}>
              No workouts found.
            </Typography>
          ) : (
            visibleWorkouts.map((w) => (
              <WorkoutCard
                key={w.id}
                workout={w}
                onToggleFavorite={toggleFavorite}
                onDelete={deleteWorkout}
                onStartEdit={() => openEditFor(w)}
              />
            ))
          )}
        </Box>
      </Box>
    </Box>
  );

  const visibleFavorites = React.useMemo(
    () => visibleWorkouts.filter((w) => w.favorite),
    [visibleWorkouts]
  );

  const FavoritesView = (
    <Box sx={{ color: "#A0A4AE", textAlign: "center", width: "100%" }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Favorites</Typography>
      {visibleFavorites.length === 0 ? (
        <Typography>No favorites yet.</Typography>
      ) : (
        <Box sx={{ display: "grid", gap: 1.5, justifyItems: "center" }}>
          {visibleFavorites.map((w) => (
            <WorkoutCard
              key={w.id}
              workout={w}
              onToggleFavorite={toggleFavorite}
              onDelete={deleteWorkout}
              onStartEdit={() => openEditFor(w)}
            />
          ))}
        </Box>
      )}
    </Box>
  );

  const renderContent = () => {
    switch (tab) {
      case 0:
        return (
          <AddWorkout
            name={name} setName={setName}
            type={type} setType={setType}
            exercise={exercise} setExercise={setExercise}
            sets={sets} setSets={setSets}
            reps={reps} setReps={setReps}
            addWorkout={addWorkout}
          />
        );
      case 1:
        return WorkoutsView;
      case 2:
        return FavoritesView;
      case 3:
      default:
        return <AnalyticsCard workouts={workouts} />;
    }
  };

  const setOptions = Array.from({ length: 12 }, (_, i) => i + 1);
  const repOptions = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <>
      <TopBar />

      <Box
        sx={{
          backgroundColor: "#060A13",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 4,
          pt: 10,
          pb: 10,
          width: "100%",
        }}
      >
        {renderContent()}
      </Box>

      <NavBar value={tab} onChange={setTab} />

      {/* Edit Modal */}
      <Modal open={editOpen} onClose={closeEdit}>
        <Box
          component="form"
          sx={editCardStyle}
          onSubmit={(e) => {
            e.preventDefault();
            saveEdit();
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Edit Workout
          </Typography>

          <TextField
            label="Workout Name"
            value={tempEdit?.name ?? ""}
            onChange={(e) => setTempEdit({ ...tempEdit, name: e.target.value })}
            fullWidth
            margin="normal"
            InputLabelProps={{ style: { color: "rgba(255,255,255,0.7)" } }}
            InputProps={{
              style: {
                color: "#fff",
                backgroundColor: "#2A2C30",
                borderRadius: 25,
              },
            }}
          />

          <TextField
            label="Exercise"
            value={tempEdit?.exercise ?? ""}
            onChange={(e) =>
              setTempEdit({ ...tempEdit, exercise: e.target.value })
            }
            fullWidth
            margin="normal"
            InputLabelProps={{ style: { color: "rgba(255,255,255,0.7)" } }}
            InputProps={{
              style: {
                color: "#fff",
                backgroundColor: "#2A2C30",
                borderRadius: 25,
              },
            }}
          />

          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="sets-label" sx={{ color: "rgba(255,255,255,0.7)" }}>
                Sets
              </InputLabel>
              <Select
                labelId="sets-label"
                value={tempEdit?.sets ?? 1}
                onChange={(e) =>
                  setTempEdit({ ...tempEdit, sets: Number(e.target.value) })
                }
                sx={{
                  color: "#fff",
                  backgroundColor: "#2A2C30",
                  borderRadius: 6,
                }}
              >
                {setOptions.map((n) => (
                  <MenuItem key={n} value={n}>
                    {n}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel id="reps-label" sx={{ color: "rgba(255,255,255,0.7)" }}>
                Reps
              </InputLabel>
              <Select
                labelId="reps-label"
                value={tempEdit?.reps ?? 1}
                onChange={(e) =>
                  setTempEdit({ ...tempEdit, reps: Number(e.target.value) })
                }
                sx={{
                  color: "#fff",
                  backgroundColor: "#2A2C30",
                  borderRadius: 6,
                }}
              >
                {repOptions.map((n) => (
                  <MenuItem key={n} value={n}>
                    {n}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 1 }}>
            <Button
              onClick={closeEdit}
              variant="text"
              sx={{ color: "rgba(255,255,255,0.8)" }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "#1976d2",
                "&:hover": { backgroundColor: "#1565c0" },
                borderRadius: "20px",
              }}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Advanced Search & Filter (full screen) */}
      <Modal open={searchOpen} onClose={() => setSearchOpen(false)}>
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            bgcolor: "black",
            overflow: "auto",
            outline: "none",
          }}
        >
          <SearchAndFilter
            workouts={workouts}
            onClose={() => setSearchOpen(false)}
            renderCard={(w) => (
              <WorkoutCard
                workout={w}
                onToggleFavorite={toggleFavorite}
                onDelete={deleteWorkout}
                onStartEdit={() => openEditFor(w)}
              />
            )}
          />
        </Box>
      </Modal>
    </>
  );
}
