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
import LoginCard from "./components/LoginCard.jsx";

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

const API_BASE = "http://localhost:3000";

async function apiFetch(path, { token, retry = true, ...options } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include", // IMPORTANT so refresh cookie works
  });

  // If access token expired, try refresh once
  if (res.status === 401 && retry) {
    const r = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (r.ok) {
      const data = await r.json().catch(() => ({}));
      const newToken = data.token;
      if (newToken) localStorage.setItem("accessToken", newToken);

      // retry original request with new token
      return apiFetch(path, { token: newToken, retry: false, ...options });
    }
  }

  return res;
}

// DB → UI mapper (keep your UI unchanged)
function mapWorkoutFromDb(row) {
  return {
    id: row.id,
    name: row.exercise_name,
    type: row.exercise_type
      ? row.exercise_type.charAt(0).toUpperCase() + row.exercise_type.slice(1)
      : "",
    exercise: row.exercise_key,
    sets: row.sets,
    reps: row.reps,
    createdAtTs: row.performed_at
  ? new Date(row.performed_at).getTime()
  : row.created_at
    ? new Date(row.created_at).getTime()
    : Date.now(),

    favorite: !!row.is_favorite,
  };
}

// UI → DB payload mapper
function mapWorkoutToDbPayload(w) {
  return {
    exerciseName: w.name,
    exerciseType: w.type, // backend lowercases it
    exerciseKey: w.exercise,
    sets: w.sets,
    reps: w.reps,
    performedAt: null,
  };
}

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
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
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
          {type && exercise ? `${type} • ${exercise}` : type || exercise || ""}
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
  const [token, setToken] = React.useState(() => localStorage.getItem("accessToken") || "");

  const [tab, setTab] = React.useState(3);

  // Add form state
  const [name, setName] = React.useState("");
  const [type, setType] = React.useState("");
  const [exercise, setExercise] = React.useState("");
  const [sets, setSets] = React.useState(1);
  const [reps, setReps] = React.useState(1);
  const [weight, setWeight] = React.useState("");

  // Search (inline)
  const [search, setSearch] = React.useState("");

  // Data (FROM API)
  const [workouts, setWorkouts] = React.useState([]);

  // Edit modal
  const [editOpen, setEditOpen] = React.useState(false);
  const [tempEdit, setTempEdit] = React.useState(null);

  // Advanced filters modal
  const [searchOpen, setSearchOpen] = React.useState(false);

  // ALWAYS call hooks. Just bail out inside the effect when not logged in.
  React.useEffect(() => {
    if (!token) return; // <— important: no early return from component, only from effect

    let cancelled = false;

    (async () => {
      const res = await apiFetch("/workouts", { token });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        console.error("Fetch workouts failed:", data);

        if (res.status === 401) {
          localStorage.removeItem("accessToken");
          if (!cancelled) setToken("");
        }
        return;
      }

      const rows = Array.isArray(data.workouts) ? data.workouts : [];
      const mapped = rows.map(mapWorkoutFromDb);

      if (!cancelled) setWorkouts(mapped);
    })();

    return () => {
      cancelled = true;
    };
  }, [token]);

  // Visible items using only search
  const visibleWorkouts = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = workouts;

    if (!q) return list;
    if (q.length === 1) return list.filter((w) => (w.name || "").toLowerCase().startsWith(q));

    return list.filter(
      (w) =>
        (w.name || "").toLowerCase().includes(q) ||
        (w.exercise || "").toLowerCase().includes(q) ||
        (w.type || "").toLowerCase().includes(q)
    );
  }, [workouts, search]);

  const visibleFavorites = React.useMemo(() => visibleWorkouts.filter((w) => w.favorite), [visibleWorkouts]);

  // Handlers
  const openEditFor = (w) => {
    setTempEdit({ ...w });
    setEditOpen(true);
  };
  const closeEdit = () => {
    setEditOpen(false);
    setTempEdit(null);
  };

  const addWorkout = async () => {
    if (!name.trim() || !type.trim() || !exercise.trim()) return;
    if (!token) return;

    const payload = mapWorkoutToDbPayload({ name, type, exercise, sets, reps });

    const res = await apiFetch("/workouts", {
      token,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error("Add workout failed:", data);
      return;
    }

    const created = mapWorkoutFromDb(data);
    setWorkouts((prev) => [created, ...prev]);

    setName("");
    setType("");
    setExercise("");
    setSets(1);
    setReps(1);
    setWeight(0);
  };

  const toggleFavorite = async (id) => {
    if (!token) return;

    const current = workouts.find((w) => w.id === id);
    if (!current) return;

    const nextValue = !current.favorite;

    // optimistic
    setWorkouts((prev) => prev.map((w) => (w.id === id ? { ...w, favorite: nextValue } : w)));

    const res = await apiFetch(`/workouts/${id}/favorite`, {
      token,
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isFavorite: nextValue }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error("Favorite update failed:", data);
      // rollback
      setWorkouts((prev) => prev.map((w) => (w.id === id ? { ...w, favorite: !nextValue } : w)));
    }
  };

  const saveEdit = async () => {
    if (!tempEdit || !token) return;

    const res = await apiFetch(`/workouts/${tempEdit.id}`, {
      token,
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        exerciseName: tempEdit.name,
        exerciseType: tempEdit.type,
        exerciseKey: tempEdit.exercise,
        sets: tempEdit.sets,
        reps: tempEdit.reps,
        performedAt: null,
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error("Edit failed:", data);
      return;
    }

    const updated = mapWorkoutFromDb(data);
    setWorkouts((prev) => prev.map((w) => (w.id === updated.id ? updated : w)));

    closeEdit();
  };

  const deleteWorkout = async (id) => {
    if (!token) return;

    const snapshot = workouts;

    // optimistic remove
    setWorkouts((prev) => prev.filter((w) => w.id !== id));
    if (tempEdit?.id === id) closeEdit();

    const res = await apiFetch(`/workouts/${id}`, { token, method: "DELETE" });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error("Delete failed:", data);
      // rollback
      setWorkouts(snapshot);
    }
  };

  // Views
  const WorkoutsView = (
    <Box sx={{ color: "#A0A4AE", width: "100%", maxWidth: 960 }}>
      <Box sx={{ width: CARD_WIDTH, mx: "auto", mb: 2 }}>
        <Typography variant="h6" sx={{ color: "#fff", fontWeight: 600, mb: 1 }}>
          Workouts
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{ flex: 1 }}>
            <SearchBar placeholder="Search workouts..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </Box>

          <IconButton
            onClick={() => setSearchOpen(true)}
            sx={{
              color: "rgba(255,255,255,0.8)",
              transition: "all 0.25s ease",
              "&:hover": { color: "#A075FF", transform: "rotate(10deg)" },
            }}
            aria-label="Open filters"
          >
            <TuneSharpIcon />
          </IconButton>
        </Box>

        <Typography
          variant="caption"
          sx={{ color: "rgba(255,255,255,0.6)", display: "block", textAlign: "center", mt: 1 }}
        >
          Showing {visibleWorkouts.length} of {workouts.length}
        </Typography>
      </Box>

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

  const FavoritesView = (
    <Box sx={{ color: "#A0A4AE", textAlign: "center", width: "100%" }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Favorites
      </Typography>
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
            name={name}
            setName={setName}
            type={type}
            setType={setType}
            exercise={exercise}
            setExercise={setExercise}
            sets={sets}
            setSets={setSets}
            reps={reps}
            setReps={setReps}
            weight={weight}
            setWeight={setWeight}
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

  if (!token) {
    return (
      <LoginCard
        onSuccess={(payload) => {
          // support either shape: {token} or {accessToken} or nested
          const t = payload?.token || payload?.accessToken || payload?.user?.token || "";
          if (!t) {
            // If backend only uses cookies (no access token in JSON),
            // you can call refresh here to obtain one, but we won't change LoginCard.
            console.warn("Login success but no token returned. Ensure /auth/login returns { token }.");
            return;
          }
          localStorage.setItem("accessToken", t);
          setToken(t);
        }}
      />
    );
  }

  return (
    <>
      <TopBar 
        onLogout={() => { localStorage.removeItem("accessToken"); setToken("");}} // avoid storing locally due to xss threat..
      />

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
            onChange={(e) => setTempEdit({ ...tempEdit, exercise: e.target.value })}
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
                onChange={(e) => setTempEdit({ ...tempEdit, sets: Number(e.target.value) })}
                sx={{ color: "#fff", backgroundColor: "#2A2C30", borderRadius: 6 }}
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
                onChange={(e) => setTempEdit({ ...tempEdit, reps: Number(e.target.value) })}
                sx={{ color: "#fff", backgroundColor: "#2A2C30", borderRadius: 6 }}
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
            <Button onClick={closeEdit} variant="text" sx={{ color: "rgba(255,255,255,0.8)" }}>
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
        <Box sx={{ position: "fixed", inset: 0, bgcolor: "black", overflow: "auto", outline: "none" }}>
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
