import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Line
} from "recharts";
import { useState, useMemo } from "react";

export default function HeartRateChart({ data }) {
  console.log("HEART RATE DATA =", data);

  if (!data || !Array.isArray(data) || data.length === 0) {
    return <p>Aucune donnée de fréquence cardiaque disponible.</p>;
  }

  // --- 7 dernières valeurs ---
  const windowSize = 7;
  const [windowStart, setWindowStart] = useState(
    Math.max(data.length - windowSize, 0)
  );

  const windowEnd = windowStart + windowSize;
  const visibleData = data.slice(windowStart, windowEnd);

  // --- Dates affichées en haut ---
  function formatDate(dateStr) {
    const d = new Date(dateStr);
    if (isNaN(d)) return "—";
    return d.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short"
    });
  }

  const periodStart = formatDate(visibleData[0]?.day);
  const periodEnd = formatDate(visibleData[visibleData.length - 1]?.day);

  // --- Labels dynamiques basés sur la vraie date ---
  const formattedData = visibleData.map((d) => {
    const dateObj = new Date(d.day);
    const label = dateObj.toLocaleDateString("fr-FR", { weekday: "short" });
    return {
      ...d,
      dayLabel: label.charAt(0).toUpperCase() + label.slice(1)
    };
  });

  // --- Moyenne BPM ---
  const averageBPM = useMemo(() => {
    return Math.round(
      visibleData.reduce((sum, d) => sum + d.avg, 0) / visibleData.length
    );
  }, [visibleData]);

  // --- Axe vertical dynamique ---
  const rawMax = Math.max(...visibleData.map((d) => d.max));
  const yMax = rawMax + 2;
  const ticks = [130, 145, 160, yMax];

  // --- Navigation ---
  const canGoPrev = windowStart > 0;
  const canGoNext = windowEnd < data.length;

  const handlePrev = () => {
    if (canGoPrev) setWindowStart(windowStart - 1);
  };

  const handleNext = () => {
    if (canGoNext) setWindowStart(windowStart + 1);
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
        <div>
          <h2 style={{ color: "#E60000", margin: 0 }}>{averageBPM} BPM</h2>
          <p style={{ color: "#777", fontSize: "14px", margin: 0 }}>
            Fréquence cardiaque moyenne
          </p>
        </div>

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

      {/* Graphique */}
      <BarChart
        style={{
          width: "100%",
          maxWidth: "700px",
          maxHeight: "70vh",
          aspectRatio: 1.618,
        }}
        responsive
        data={formattedData}
        margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="dayLabel" tick={{ fill: "#777" }} />
        <YAxis tick={{ fill: "#777" }} domain={[130, yMax]} ticks={ticks} />
        <Tooltip />
        <Bar dataKey="min" name="Min BPM" fill="#FDCACB" radius={[10, 10, 0, 0]} />
        <Bar dataKey="max" name="Max BPM" fill="#E60000" radius={[10, 10, 0, 0]} />
        <Line
          type="monotone"
          dataKey="avg"
          name="Moyenne"
          stroke="#4E6AF3"
          strokeWidth={2}
          dot={{ fill: "#4E6AF3", r: 4 }}
        />
      </BarChart>

      {/* Légende */}
      <div
        style={{
          textAlign: "center",
          marginTop: "10px",
          color: "#4E6AF3",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            backgroundColor: "#FDCACB",
          }}
        ></div>
        <span style={{ color: "#777" }}>Min</span>

        <div
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            backgroundColor: "#E60000",
          }}
        ></div>
        <span style={{ color: "#777" }}>Max BPM</span>

        <div
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            backgroundColor: "#4E6AF3",
          }}
        ></div>
        <span style={{ color: "#777" }}>Moyenne</span>
      </div>
    </div>
  );
}
