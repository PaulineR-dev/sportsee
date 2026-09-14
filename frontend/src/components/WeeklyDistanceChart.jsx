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
import propertynav1 from "../assets/propertynav1.png";

export default function WeeklyDistanceChart({ data }) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <p>Aucune donnée de distance disponible.</p>;
  }

  const windowSize = 4;

  const [windowStart, setWindowStart] = useState(
    Math.max(data.length - windowSize, 0)
  );

  const windowEnd = windowStart + windowSize;
  const visibleData = data.slice(windowStart, windowEnd);

  const handlePrev = () => {
    setWindowStart((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setWindowStart((prev) =>
      Math.min(prev + 1, data.length - windowSize)
    );
  };

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

  // --- TOOLTIP CUSTOM ---
  function CustomTooltip({ active, payload, coordinate }) {
    if (!active || !payload || !payload.length) return null;

    const item = payload[0].payload;

    const { start, end } = getWeekBounds(item.date);

    const startStr = start.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit"
    });

    const endStr = end.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit"
    });

    return (
      <div
        style={{
          position: "absolute",
          left: coordinate.x - 55,
          top: coordinate.y - 45,
          background: "rgba(0,0,0,0.9)",
          borderRadius: "6px",
          padding: "20px 10px",
          fontFamily: "Inter",
          display: "flex",
          flexDirection: "column",
          gap: "0px",
          color: "#FFF",
          minWidth: "100px",
          pointerEvents: "none"
        }}
      >
        <div
          style={{
            fontSize: "12px",
            fontWeight: 500,
            textAlign: "left",
            whiteSpace: "nowrap"
          }}
        >
          {startStr} au {endStr}
        </div>

        <div
          style={{
            fontSize: "16px",
            fontWeight: 700,
            textAlign: "left",
            marginTop: "0px" 
          }}
        >
          {item.km} km
        </div>
      </div>
    );
  }

  return (
    <div className="chart-wrapper">

      {/* --- Ligne 1 : km moyen + flèches + dates --- */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "18px",
          paddingTop: "26.5px",
          paddingLeft: "40px",
          paddingRight: "40px",
        }}
      >
        <h2
          className="chart-title"
          style={{
            margin: 0,
            whiteSpace: "nowrap"
          }}
        >
          {Math.round(averageKm)} km en moyenne
        </h2>

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
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0
              }}
            >
              <img
                src={propertynav1}
                alt="Précédent"
                style={{
                  width: "24px",
                  height: "24px",
                  transform: "rotate(180deg)"
                }}
              />
            </button>
          )}

          <div
            style={{
              width: "88px",
              height: "15px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontFamily: "Inter",
                fontWeight: 400,
                fontStyle: "normal",
                fontSize: "12px",
                lineHeight: "100%",
                letterSpacing: "0px",
                textAlign: "right",
                color: "#111111",
                width: "100%",
                whiteSpace: "nowrap"
              }}
            >
              {periodStart} – {periodEnd}
            </span>
          </div>

          {canGoNext && (
            <button
              onClick={handleNext}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0
              }}
            >
              <img
                src={propertynav1}
                alt="Suivant"
                style={{
                  width: "24px",
                  height: "24px"
                }}
              />
            </button>
          )}
        </div>
      </div>

      {/* --- Ligne 2 : sous-titre --- */}
      <p
        style={{
          margin: 0,
          paddingLeft: "40px",
          paddingRight: "40px",
          fontFamily: "Inter",
          fontWeight: 400,
          fontStyle: "normal",
          fontSize: "12px",
          lineHeight: "100%",
          letterSpacing: "0px",
          color: "#707070",
          textAlign: "left",
          marginBottom: "10px"
        }}
      >
        Total des kilomètres sur les 4 dernières semaines
      </p>

      {/* --- Graphique --- */}
      <div
        className="chart-container"
        style={{
          width: "370px",
          height: "337px",
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "flex-start"
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={visibleData}
            margin={{
              top: 0, 
              right: 0, 
              bottom: 24,
              left: 8
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />

            <XAxis
              dataKey="week"
              tick={{
                fill: "#707070",
                fontFamily: "Inter",
                fontWeight: 400,
                fontStyle: "normal",
                fontSize: 12,
                lineHeight: "100%",
                letterSpacing: 0,
                textAnchor: "middle"
              }}
              tickLine={false}
              tickMargin={24}
            />

            <YAxis
              tick={{
                fill: "#707070",
                fontFamily: "Inter",
                fontWeight: 400,
                fontStyle: "normal",
                fontSize: 10,
                lineHeight: "100%",
                letterSpacing: 0
              }}
              domain={[0, ticks[ticks.length - 1]]}
              ticks={ticks}
              tickLine={false}
              tickMargin={8}
            />

            <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />

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
          textAlign: "left",
          color: "#707070",
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: "6px",
          paddingLeft: "40px" 
        }}
      >
        <div
          style={{
            width: "8px",
            height: "8px",
            backgroundColor: "#7987FF",
            borderRadius: "50%",
          }}
        ></div>

        <span
          style={{
            fontFamily: "Inter",
            fontWeight: 400,
            fontStyle: "normal",
            fontSize: "12px",
            lineHeight: "100%",
            letterSpacing: "0px",
            color: "#707070"
          }}
        >
          Km
        </span>
      </div>
    </div>
  );
}
