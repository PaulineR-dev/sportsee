// Regroupe les distances des 4 dernières semaines
function getLastFourWeeks(runs) {
  const sortedRuns = runs.sort((a, b) => new Date(a.date) - new Date(b.date));

  const weeks = [];
  let currentWeek = [];
  let lastDate = null;

  sortedRuns.forEach((run) => {
    const date = new Date(run.date);
    if (!lastDate) lastDate = date;

    const diffDays = (date - lastDate) / (1000 * 60 * 60 * 24);
    if (diffDays > 7) {
      weeks.push(currentWeek);
      currentWeek = [];
      lastDate = date;
    }
    currentWeek.push(run);
  });

  if (currentWeek.length) weeks.push(currentWeek);

  const lastFour = weeks.slice(-4);

  return lastFour.map((week, i) => ({
    week: `S${i + 1}`,
    km: week.reduce((sum, run) => sum + run.distance, 0),
  }));
}

// Calcule les BPM min, max et moyenne sur les 7 derniers jours
function getWeeklyHeartRate(runs) {
  const lastSeven = runs.slice(-7);
  const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  return lastSeven.map((run, i) => ({
    day: days[i % 7],
    min: run.heartRate.min,
    max: run.heartRate.max,
    avg: run.heartRate.average,
  }));
}

// Calcule les statistiques hebdomadaires (dernière semaine disponible)
function getCurrentWeekStats(runs, goal) {
  if (runs.length === 0) {
    return {
      goal,
      runsCompleted: 0,
      totalDuration: 0,
      totalDistance: 0,
      startDate: null,
      endDate: null
    };
  }

  const lastRunDate = new Date(runs[runs.length - 1].date);

  const startOfWeek = new Date(lastRunDate);
  startOfWeek.setDate(lastRunDate.getDate() - lastRunDate.getDay() + 1);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  const weeklyRuns = runs.filter((run) => {
    const date = new Date(run.date);
    return date >= startOfWeek && date <= endOfWeek;
  });

  const runsCompleted = weeklyRuns.length;
  const totalDuration = weeklyRuns.reduce((sum, run) => sum + run.duration, 0);
  const totalDistance = weeklyRuns.reduce((sum, run) => sum + run.distance, 0);

  const formatDate = (d) =>
    `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;

  return {
    goal,
    runsCompleted,
    totalDuration,
    totalDistance,
    startDate: formatDate(startOfWeek),
    endDate: formatDate(endOfWeek)
  };
}

// Calcule automatiquement les jours de repos
function getRestDays(runs) {
  if (runs.length === 0) return 0;

  const sorted = runs
    .map(run => new Date(run.date))
    .sort((a, b) => a - b);

  const first = sorted[0];
  const last = sorted[sorted.length - 1];

  const totalDays =
    Math.floor((last - first) / (1000 * 60 * 60 * 24)) + 1;

  const runningDays = runs.length;

  return totalDays - runningDays;
}

module.exports = {
  getLastFourWeeks,
  getWeeklyHeartRate,
  getCurrentWeekStats,
  getRestDays
};
