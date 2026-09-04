// -------------------------------------------------------------
// Transforme les sessions en données pour le graphique de distance hebdomadaire
// -------------------------------------------------------------
export function buildWeeklyDistance(sessions) {
  if (!sessions) return [];

  const sessionArray = Array.isArray(sessions)
    ? sessions
    : Object.values(sessions);

  if (sessionArray.length === 0) return [];

  const weeks = {};

  sessionArray.forEach((s) => {
    const d = new Date(s.date);

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
      weeks[key] = {
        isoWeek: key,
        km: 0,
        dates: []
      };
    }

    weeks[key].km += s.distance;
    weeks[key].dates.push(s.date);
  });

  // Ajoute la semaine actuelle si absente
  const today = new Date();
  const dayNumToday = (today.getDay() + 6) % 7;
  today.setDate(today.getDate() - dayNumToday + 3);

  const currentYear = today.getFullYear();
  const week1Current = new Date(currentYear, 0, 4);

  const currentWeek =
    1 +
    Math.round(
      ((today - week1Current) / 86400000 - 3 + ((week1Current.getDay() + 6) % 7)) / 7
    );

  const currentKey = `${currentYear}-W${currentWeek}`;

  if (!weeks[currentKey]) {
    weeks[currentKey] = {
      isoWeek: currentKey,
      km: 0,
      dates: [today.toISOString().split("T")[0]]
    };
  }

  const weeklyArray = Object.values(weeks).sort(
    (a, b) => new Date(a.dates[0]) - new Date(b.dates[0])
  );

  return weeklyArray.map((w, index) => ({
    week: `S${index + 1}`,
    km: w.km,
    date: w.dates[0],
    isoWeek: w.isoWeek
  }));
}


// -------------------------------------------------------------
// Transforme les sessions en données pour le graphique de fréquence cardiaque
// -------------------------------------------------------------
export function buildHeartRate(sessions) {
  if (!sessions) return [];

  return sessions.map((session) => ({
    day: session.date,
    min: session.heartRate.min,
    max: session.heartRate.max,
    avg: session.heartRate.average
  }));
}


// -------------------------------------------------------------
// Construit les statistiques de la semaine en cours (lundi → aujourd’hui)
// -------------------------------------------------------------
export function buildWeeklyStats(statistics, sessions) {
  if (!statistics) {
    return {
      weeklyGoal: null,
      runsCompleted: 0,
      totalDistance: 0,
      totalDuration: 0,
      startDate: "",
      endDate: ""
    };
  }

  if (!sessions || sessions.length === 0) {
    return {
      weeklyGoal: statistics.weeklyGoal ?? null,
      runsCompleted: 0,
      totalDistance: 0,
      totalDuration: 0,
      startDate: "",
      endDate: ""
    };
  }

  // Lundi de la semaine courante
  const today = new Date();
  const dayNum = (today.getDay() + 6) % 7;
  const monday = new Date(today);
  monday.setDate(today.getDate() - dayNum);

  // Sessions de la semaine courante
  const weekSessions = sessions.filter((s) => {
    const d = new Date(s.date);
    return d >= monday && d <= today;
  });

  const runsCompleted = weekSessions.length;
  const totalDistance = weekSessions.reduce((sum, s) => sum + s.distance, 0);
  const totalDuration = weekSessions.reduce((sum, s) => sum + s.duration, 0);

  return {
    weeklyGoal: statistics.weeklyGoal ?? null,
    runsCompleted,
    totalDistance,
    totalDuration,
    startDate: monday.toISOString().split("T")[0],
    endDate: today.toISOString().split("T")[0]
  };
}
