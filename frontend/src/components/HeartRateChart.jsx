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

  // Afficher la dernière semaine enregistrée
  const [windowStart, setWindowStart] = useState(
    Math.max(data.length - 7, 0)
  );

  const windowSize = 7;
  const windowEnd = windowStart + windowSize;
  const visibleData = data.slice(windowStart, windowEnd);

  // Fonction de formatage identique à WeeklyDistanceChart
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

  // Dates correctes
  const periodStart = formatDate(visibleData[0]?.day);
  const periodEnd = formatDate(visibleData[visibleData.length - 1]?.day);

  // Moyenne BPM
  const averageBPM = useMemo(() => {
    return Math.round(
      visibleData.reduce((sum, d) => sum + d.avg, 0) / visibleData.length
    );
  }, [visibleData]);

  // Axe vertical avec valeurs dynamiques
  const rawMax = Math.max(...visibleData.map((d) => d.max));
  const yMax = rawMax + 2;
  const ticks = [130, 145, 160, yMax];

  // Navigation
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

  // Axe horizontal avec les jours de la semaine
  const dayLabels = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
  const formattedData = visibleData.map((d, i) => ({
    ...d,
    day: dayLabels[i] || d.day
  }));

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
        <XAxis dataKey="day" tick={{ fill: "#777" }} />
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
