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
import propertynav1 from "../assets/propertynav1.png";

export default function HeartRateChart({ data }) {
  console.log("HEART RATE DATA =", data);

  if (!data || !Array.isArray(data) || data.length === 0) {
    return <p>Aucune donnée de fréquence cardiaque disponible.</p>;
  }

  const [isHoveringLine, setIsHoveringLine] = useState(false);

  const windowSize = 7;
  const [windowStart, setWindowStart] = useState(
    Math.max(data.length - windowSize, 0)
  );

  const windowEnd = windowStart + windowSize;
  const visibleData = data.slice(windowStart, windowEnd);

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

  const formattedData = visibleData.map((d) => {
    const dateObj = new Date(d.day);
    const label = dateObj.toLocaleDateString("fr-FR", { weekday: "short" });
    return {
      ...d,
      dayLabel: label.charAt(0).toUpperCase() + label.slice(1)
    };
  });

  const averageBPM = useMemo(() => {
    return Math.round(
      visibleData.reduce((sum, d) => sum + d.avg, 0) / visibleData.length
    );
  }, [visibleData]);

  const rawMax = Math.max(...visibleData.map((d) => d.max));
  const rawMin = Math.min(...visibleData.map((d) => d.min));

  const yMax = rawMax + 2;
  const yMin = rawMin > 120 ? 120 : rawMin - 3;

  const ticks = [yMin, 130, 145, 160, yMax];

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
        paddingTop: "20px",
        paddingRight: "40px", 
        paddingBottom: "20px",
        paddingLeft: "40px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start"
      }}
    >
      {/* Titre */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          marginBottom: "10px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <h2 style={{ color: "#E60000", margin: 0 }}>{averageBPM} BPM</h2>
          <p style={{ color: "#777", fontSize: "14px", margin: 0 }}>
            Fréquence cardiaque moyenne
          </p>
        </div>

        {/* Flèches + dates */}
        <div
          style={{
            width: "156px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
          }}
        >
          {canGoPrev && (
            <button
              onClick={handlePrev}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              <img
                src={propertynav1}
                alt="Précédent"
                style={{ width: "24px", height: "24px", transform: "rotate(180deg)" }}
              />
            </button>
          )}

          <div style={{ width: "88px", height: "15px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span
              style={{
                fontFamily: "Inter",
                fontWeight: 400,
                fontSize: "12px",
                color: "#111",
                whiteSpace: "nowrap"
              }}
            >
              {periodStart} – {periodEnd}
            </span>
          </div>

          {canGoNext && (
            <button
              onClick={handleNext}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              <img src={propertynav1} alt="Suivant" style={{ width: "24px", height: "24px" }} />
            </button>
          )}
        </div>
      </div>

      {/* --- Graphique  --- */}
      <div
        style={{
          width: "503px",
          height: "307px",
          marginLeft: "-36px"
        }}
      >
        <BarChart
          width={503}
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
              fontSize: 12,
              textAnchor: "middle",
            }}
            tickLine={false}
            axisLine={false}
            tickMargin={22}
          />

          <YAxis
            tick={{
              fill: "#707070",
              fontFamily: "Inter",
              fontWeight: 400,
              fontSize: 10,
            }}
            domain={[yMin, yMax]}
            ticks={ticks}
            tickLine={false}
            axisLine={false}
            tickMargin={7}
          />

          <Tooltip content={<EmptyTooltip />} cursor={{ fill: "transparent" }} />

          <Bar dataKey="min" fill="#FCC1B6" radius={[10, 10, 0, 0]} barSize={14} />
          <Bar dataKey="max" fill="#F4320B" radius={[10, 10, 0, 0]} barSize={14} />

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
          marginTop: "16px",
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: "16px",
          fontFamily: "Inter",
          fontWeight: 400,
          fontSize: "12px",
          color: "#707070",
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
