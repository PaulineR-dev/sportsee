// Transforme les sessions en données pour le graphique de distance hebdomadaire
export function buildWeeklyDistance(sessions) {
  return sessions.map((session, index) => ({
    week: `S${index + 1}`,
    km: session.distance,
    date: session.date
  }));
}

// Transforme les sessions en données pour le graphique de fréquence cardiaque
export function buildHeartRate(sessions) {
  return sessions.map((session) => ({
    day: session.date,
    min: session.heartRate.min,
    max: session.heartRate.max,
    avg: session.heartRate.average
  }));
}

// Construit les statistiques de la dernière semaine enregistrée (semaine calendrier)
export function buildWeeklyStats(statistics, sessions) {
  if (!sessions || sessions.length === 0) {
    return {
      goal: statistics.weeklyGoal || 6,
      runsCompleted: 0,
      totalDistance: 0,
      totalDuration: 0,
      startDate: "",
      endDate: ""
    };
  }

  // Regrouper par semaine ISO (année + numéro de semaine)
  const weeks = {};

  sessions.forEach((s) => {
    const d = new Date(s.date);

    // calcul clé de semaine ISO
    const dayNum = (d.getDay() + 6) % 7; // 0 = lundi
    d.setDate(d.getDate() - dayNum + 3);
    const weekYear = d.getFullYear();
    const week1 = new Date(weekYear, 0, 4);
    const week =
      1 +
      Math.round(
        ((d - week1) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7
      );

    const key = `${weekYear}-W${week}`;

    if (!weeks[key]) {
      weeks[key] = [];
    }
    weeks[key].push(s);
  });

  // Dernière semaine
  const keys = Object.keys(weeks).sort();
  const lastKey = keys[keys.length - 1];
  const lastWeekSessions = weeks[lastKey];

  const runsCompleted = lastWeekSessions.length;
  const totalDistance = lastWeekSessions.reduce(
    (sum, s) => sum + s.distance,
    0
  );
  const totalDuration = lastWeekSessions.reduce(
    (sum, s) => sum + s.duration,
    0
  );

  // Dates min / max de cette semaine
  const sortedWeek = [...lastWeekSessions].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
  const startDate = sortedWeek[0].date;
  const endDate = sortedWeek[sortedWeek.length - 1].date;

  return {
    goal: statistics.weeklyGoal || 6,
    runsCompleted,
    totalDistance,
    totalDuration,
    startDate,
    endDate
  };
}
