import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import { useState, useMemo } from "react";

export default function WeeklyDistanceChart({ data }) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <p>Aucune donnée de distance disponible.</p>;
  }

  const windowSize = 4;

  // On commence l'affichage sur les 4 semaines les plus récentes
  const [windowStart, setWindowStart] = useState(
    Math.max(data.length - windowSize, 0)
  );

  const windowEnd = windowStart + windowSize;
  const visibleData = data.slice(windowStart, windowEnd);

  // Navigation semaine par semaine
  const handlePrev = () => {
    setWindowStart((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setWindowStart((prev) =>
      Math.min(prev + 1, data.length - windowSize)
    );
  };

  // Conditions pour cacher les flèches
  const canGoPrev = windowStart > 0;
  const canGoNext = windowStart < data.length - windowSize;

  const averageKm = useMemo(() => {
    return visibleData.reduce((sum, d) => sum + d.km, 0) / visibleData.length;
  }, [visibleData]);

  function getWeekBounds(dateStr) {
    const d = new Date(dateStr);
    const dayNum = (d.getDay() + 6) % 7;
    const monday = new Date(d);
    monday.setDate(d.getDate() - dayNum);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return { start: monday, end: sunday };
  }

  function formatDate(date) {
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short"
    });
  }

  const firstWeekBounds = getWeekBounds(visibleData[0].date);
  const lastWeekBounds = getWeekBounds(
    visibleData[visibleData.length - 1].date
  );

  const periodStart = formatDate(firstWeekBounds.start);
  const periodEnd = formatDate(lastWeekBounds.end);

  const rawMax = Math.max(...visibleData.map((d) => d.km));
  const maxRounded = Math.ceil(rawMax / 10) * 10;
  const ticks = rawMax < 5 ? [0, 2.5, 5, 7.5] : [
    0,
    Math.ceil(maxRounded / 3),
    Math.ceil((maxRounded * 2) / 3),
    maxRounded
  ];

  return (
    <div className="chart-wrapper">

      {/* --- Titre + période + FLÈCHES AUTOUR DE LA DATE --- */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <div>
          <h2 className="chart-title" style={{ margin: 0 }}>
            {Math.round(averageKm)} km en moyenne
          </h2>
          <p className="chart-subtitle" style={{ margin: 0 }}>
            Total des kilomètres sur les 4 dernières semaines
          </p>
        </div>

        {/* --- Flèches autour de la date --- */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          {/* ← flèche gauche */}
          {canGoPrev && (
            <button
              onClick={handlePrev}
              style={{
                background: "none",
                border: "none",
                color: "#4E6AF3",
                fontSize: "22px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              ←
            </button>
          )}

          {/* Date */}
          <span style={{ color: "#777", fontSize: "14px" }}>
            {periodStart} – {periodEnd}
          </span>

          {/* → flèche droite */}
          {canGoNext && (
            <button
              onClick={handleNext}
              style={{
                background: "none",
                border: "none",
                color: "#4E6AF3",
                fontSize: "22px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              →
            </button>
          )}
        </div>
      </div>

      {/* --- Graphique --- */}
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={visibleData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="week" tick={{ fill: "#777" }} />
            <YAxis tick={{ fill: "#777" }} domain={[0, ticks[ticks.length - 1]]} ticks={ticks} />
            <Tooltip />
            <Bar
              dataKey="km"
              fill="#B6BDFC"
              radius={[10, 10, 0, 0]}
              barSize={14}
              activeBar={{ fill: "#0B23F4", stroke: "none" }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* --- Légende --- */}
      <div
        className="chart-legend"
        style={{
          textAlign: "center",
          marginTop: "10px",
          color: "#4E6AF3",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "6px"
        }}
      >
        <div
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            backgroundColor: "#B6BDFC"
          }}
        ></div>
        <span>Km</span>
      </div>
    </div>
  );
}
