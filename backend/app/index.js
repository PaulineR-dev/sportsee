const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const jwt = require("jsonwebtoken");

const router = require("./routes");
const {
  getLastFourWeeks,
  getWeeklyHeartRate,
  getCurrentWeekStats,
  getRestDays 
} = require("./utils/dashboardCalculations");

const app = express();
app.use(cors());
app.use(bodyParser.json());
const port = 8000;

const SECRET_KEY = "sportsee_secret_key";

// Route login
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  const data = JSON.parse(fs.readFileSync("./app/data.json", "utf-8"));
  const user = data.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Identifiants invalides" });
  }

  const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "1h" });
  res.json({ token, userId: user.id });
});

// Route dashboard
app.get("/api/user/:id/dashboard", (req, res) => {
  const { id } = req.params;
  const data = JSON.parse(fs.readFileSync("./app/data.json", "utf-8"));
  const user = data.find((u) => u.id === id);

  if (!user) {
    return res.status(404).json({ message: "Utilisateur non trouvé" });
  }

  const totalDistance = user.runningData.reduce((sum, run) => sum + run.distance, 0);
  const weeklyStats = getCurrentWeekStats(user.runningData, user.weeklyGoal);
  const weeklyDistance = getLastFourWeeks(user.runningData);
  const heartRateStats = getWeeklyHeartRate(user.runningData);

  res.json({
    userId: user.id,
    profile: {
      firstName: user.userInfos.firstName,
      lastName: user.userInfos.lastName,
      createdAt: user.userInfos.createdAt,
      totalDistance,
    },
    weeklyStats,
    charts: {
      weeklyDistance,
      heartRate: heartRateStats,
    },
  });
});

// Route profil
app.get("/api/user/:id/profile", (req, res) => {
  const { id } = req.params;
  const data = JSON.parse(fs.readFileSync("./app/data.json", "utf-8"));
  const user = data.find((u) => u.id === id);

  if (!user) {
    return res.status(404).json({ message: "Utilisateur non trouvé" });
  }

  const totalDuration = user.runningData.reduce((sum, run) => sum + run.duration, 0);
  const totalDistance = user.runningData.reduce((sum, run) => sum + run.distance, 0);
  const totalSessions = user.runningData.length;
  const totalCalories = user.runningData.reduce((sum, run) => sum + run.caloriesBurned, 0);

  // Calcul automatique des jours de repos
  const restDays = getRestDays(user.runningData);

  res.json({
    userId: user.id,
    profile: {
      firstName: user.userInfos.firstName,
      lastName: user.userInfos.lastName,
      createdAt: user.userInfos.createdAt,
      age: user.userInfos.age,
      gender: user.userInfos.gender,
      height: user.userInfos.height,
      weight: user.userInfos.weight
    },
    statistics: {
      totalDuration,
      totalDistance,
      totalSessions,
      totalCalories,
      restDays
    }
  });
});

app.use(router);
router.use("/images", express.static("images"));

app.listen(port, () => console.log(`Magic happens on port ${port}`));
