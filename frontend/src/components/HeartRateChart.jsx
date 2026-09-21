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

  // Sécurité : si aucune donnée → message
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <p>Aucune donnée de fréquence cardiaque disponible.</p>;
  }

  // État : savoir si la ligne moyenne est survolée (hover)
  const [isHoveringLine, setIsHoveringLine] = useState(false);

  // Fenêtre glissante : 7 jours visibles
  const windowSize = 7;
  const [windowStart, setWindowStart] = useState(
    Math.max(data.length - windowSize, 0)
  );
  const windowEnd = windowStart + windowSize;

  // Données visibles
  const visibleData = data.slice(windowStart, windowEnd);

  // Formatage des dates (JJ MMM)
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

  // Période affichée
  const formattedData = visibleData.map((d) => {
    const dateObj = new Date(d.day);
    const label = dateObj.toLocaleDateString("fr-FR", { weekday: "short" });
    return {
      ...d,
      dayLabel: label.charAt(0).toUpperCase() + label.slice(1)
    };
  });

  // Moyenne BPM calculée sur les 7 jours visibles
  const averageBPM = useMemo(() => {
    return Math.round(
      visibleData.reduce((sum, d) => sum + d.avg, 0) / visibleData.length
    );
  }, [visibleData]);

  // Calcul des bornes Y dynamiques
  const rawMax = Math.max(...visibleData.map((d) => d.max));
  const rawMin = Math.min(...visibleData.map((d) => d.min));

  const yMax = rawMax + 2;
  const tickBas = rawMin < 130 ? rawMin - 2 : 130;
  const ticks = [tickBas, 145, 160, yMax];

  // Navigation
  const canGoPrev = windowStart > 0;
  const canGoNext = windowEnd < data.length;

  const handlePrev = () => {
    if (canGoPrev) setWindowStart(windowStart - 1);
  };

  const handleNext = () => {
    if (canGoNext) setWindowStart(windowStart + 1);
  };

  function EmptyTooltip() {
    return null;
  }

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "700px",
        backgroundColor: "#fff",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        position: "relative",
      }}
    >

      {/* Ligne BPM + flèches/dates */}
      <div
        style={{
          width: "503px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: "40px",
          paddingRight: "40px",
          paddingTop: "26.5px"
        }}
      >
        <h2
          style={{
            margin: 0,
            whiteSpace: "nowrap",
            fontFamily: "Inter",
            fontWeight: 500,
            fontSize: "22px",
            color: "#E60000"
          }}
        >
          {averageBPM} BPM
        </h2>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px"
          }}
        >
          {canGoPrev && (
            <button onClick={handlePrev} className="chart-arrow prev"></button>
          )}

          <div
            style={{
              minWidth: "88px",
              height: "15px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <span
              style={{
                fontFamily: "Inter",
                fontWeight: 400,
                fontSize: "12px",
                color: "#111111",
                whiteSpace: "nowrap"
              }}
            >
              {periodStart} – {periodEnd}
            </span>
          </div>

          {canGoNext && (
            <button onClick={handleNext} className="chart-arrow next"></button>
          )}
        </div>
      </div>

      {/* Texte sous le titre */}
      <p
        style={{
          margin: 0,
          fontFamily: "Inter",
          fontSize: "12px",
          color: "#707070",
          marginTop: "10.5px",
          paddingLeft: "40px",
          marginBottom: "40px",
          lineHeight: "15px"
        }}
      >
        Fréquence cardiaque moyenne
      </p>

      {/* Graphique EXACTEMENT */}
      <div
        style={{
          width: "543px",
          height: "307px",
        }}
      >
        <BarChart
          width={543}
          height={307}
          data={formattedData}
          margin={{
            top: 0,
            right: 0,
            bottom: 22,
            left: 8
          }}
          onMouseMove={() => setIsHoveringLine(true)}
          onMouseLeave={() => setIsHoveringLine(false)}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />

          <XAxis
            dataKey="dayLabel"
            tick={{
              fill: "#707070",
              fontFamily: "Inter",
              fontWeight: 400,
              fontSize: 12
            }}
            tickLine={false}
            axisLine={true}
            tickMargin={22}
          />

          <YAxis
            tick={{
              fill: "#707070",
              fontFamily: "Inter",
              fontWeight: 400,
              fontSize: 10
            }}
            domain={[tickBas, yMax]}
            ticks={ticks}
            tickLine={false}
            axisLine={true}
            tickMargin={7}
          />

          <Tooltip content={<EmptyTooltip />} cursor={{ fill: "transparent" }} />

          <Bar dataKey="min" fill="#FCC1B6" radius={[10, 10, 10, 10]} barSize={14} />
          <Bar dataKey="max" fill="#F4320B" radius={[10, 10, 10, 10]} barSize={14} />

          <Line
            type="monotone"
            dataKey="avg"
            stroke={isHoveringLine ? "#0B23F4" : "#F2F3FF"}
            strokeWidth={2}
            dot={{
              fill: "#0B23F4",
              stroke: isHoveringLine ? "#0B23F4" : "#F2F3FF",
              strokeWidth: 0.5,
              r: 4
            }}
            activeDot={false}
          />
        </BarChart>
      </div>

      {/* Légende */}
      <div
        style={{
          position: "absolute",
          bottom: "24px",
          left: "40px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          fontFamily: "Inter",
          fontSize: "12px",
          color: "#707070"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#FCC1B6" }}></div>
          <span>Min</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#F4320B" }}></div>
          <span>Max BPM</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <div style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "#0B23F4" }}></div>
          <span>Moyenne</span>
        </div>
      </div>
    </div>
  );
}
