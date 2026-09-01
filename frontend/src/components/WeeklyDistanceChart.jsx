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
  const [windowStart, setWindowStart] = useState(
    Math.max(data.length - 4, 0)
  );

  if (!data || !Array.isArray(data) || data.length === 0) {
    return <p>Aucune donnée de distance disponible.</p>;
  }

  const windowSize = 4;
  const windowEnd = windowStart + windowSize;
  const visibleData = data.slice(windowStart, windowEnd);

  console.log("VISIBLE DATA:", visibleData);

  const averageKm = useMemo(() => {
    return visibleData.reduce((sum, d) => sum + d.km, 0) / visibleData.length;
  }, [visibleData]);

  function formatDate(dateStr) {
    if (!dateStr) return "—";

    let date = new Date(dateStr);

    if (isNaN(date)) {
      const parts = dateStr.split("/");
      if (parts.length === 3) {
        const [d, m, y] = parts;
        date = new Date(`${y}-${m}-${d}`);
      }
    }

    if (isNaN(date)) return "—";

    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short"
    });
  }

  const periodStart = formatDate(visibleData[0].date);
  const periodEnd = formatDate(visibleData[visibleData.length - 1].date);

  // --- ÉCHELLE DYNAMIQUE TOUJOURS EN 3 SEGMENTS ---
  const rawMax = Math.max(...visibleData.map((d) => d.km));

  let ticks;

  if (rawMax < 5) {
    ticks = [0, 2.5, 5, 7.5];
  } 
 
  else {
    const maxRounded = Math.ceil(rawMax / 10) * 10;

    ticks = [
      0,
      Math.ceil(maxRounded / 3),
      Math.ceil((maxRounded * 2) / 3),
      maxRounded
    ];
  }

  const canGoPrev = windowStart > 0;
  const canGoNext = windowStart + windowSize < data.length;

  const handlePrev = () => {
    if (!canGoPrev) return;
    setWindowStart(Math.max(windowStart - windowSize, 0));
  };

  const handleNext = () => {
    if (!canGoNext) return;
    const maxStart = Math.max(data.length - windowSize, 0);
    setWindowStart(Math.min(windowStart + windowSize, maxStart));
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "700px",
        backgroundColor: "#fff",
        borderRadius: "10px",
        padding: "20px",
      }}
    >
      {/* Titre + période + flèches */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <h2 style={{ color: "#0B23F4", margin: 0 }}>
          {Math.round(averageKm)} km en moyenne
        </h2>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {canGoPrev && (
            <button
              onClick={handlePrev}
              style={{
                background: "none",
                border: "none",
                color: "#4E6AF3",
                fontSize: "18px",
                cursor: "pointer",
              }}
            >
              ←
            </button>
          )}

          <span style={{ color: "#777", fontSize: "14px" }}>
            {periodStart} – {periodEnd}
          </span>

          {canGoNext && (
            <button
              onClick={handleNext}
              style={{
                background: "none",
                border: "none",
                color: "#4E6AF3",
                fontSize: "18px",
                cursor: "pointer",
              }}
            >
              →
            </button>
          )}
        </div>
      </div>

      <p style={{ color: "#777", marginBottom: "20px" }}>
        Total des kilomètres 4 dernières semaines
      </p>

      {/* Graphique */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={visibleData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />

          <XAxis
            dataKey="week"
            tick={{ fill: "#777" }}
            tickFormatter={(value) => {
              const num = parseInt(value.replace(/\D+/g, ""), 10);
              return `S${num}`;
            }}
          />

          <YAxis
            tick={{ fill: "#777" }}
            domain={[0, ticks[ticks.length - 1]]}
            ticks={ticks}
          />

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

      {/* Légende */}
      <div
        style={{
          textAlign: "center",
          marginTop: "10px",
          color: "#4E6AF3",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <div
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            backgroundColor: "#B6BDFC",
          }}
        ></div>
        <span>Km</span>
      </div>
    </div>
  );
}
