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

// Composant interne : RoundedBar
// Permet d'avoir des barres arrondies (rx/ry = 10)
const RoundedBar = (props) => {
  const { x, y, width, height, fill } = props;
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      rx={10}
      ry={10}
      fill={fill}
    />
  );
};

export default function WeeklyDistanceChart({ data }) {

  // Sécurité : si aucune donnée → message
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <p>Aucune donnée de distance disponible.</p>;
  }

  // Fenêtre glissante : 4 semaines visibles
  const windowSize = 4;

  const [windowStart, setWindowStart] = useState(
    Math.max(data.length - windowSize, 0)
  );

  const windowEnd = windowStart + windowSize;

  // Données visibles
  const visibleData = data.slice(windowStart, windowEnd);

  // Navigation
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

  // Moyenne des km sur les 4 semaines visibles
  const averageKm = useMemo(() => {
    return visibleData.reduce((sum, d) => sum + d.km, 0) / visibleData.length;
  }, [visibleData]);

  // Calcul des bornes de semaine (lundi → dimanche)
  function getWeekBounds(dateStr) {
    const d = new Date(dateStr);
    const dayNum = (d.getDay() + 6) % 7;
    const monday = new Date(d);
    monday.setDate(d.getDate() - dayNum);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return { start: monday, end: sunday };
  }

  // Format date (JJ MMM)
  function formatDate(date) {
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short"
    });
  }

  // Format date tooltip (JJ.MM)
  function formatTooltipDate(date) {
    return date
      .toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit"
      })
      .replace("/", ".")
      .replace("/", ".");
  }

  // Période affichée
  const firstWeekBounds = getWeekBounds(visibleData[0].date);
  const lastWeekBounds = getWeekBounds(
    visibleData[visibleData.length - 1].date
  );

  const periodStart = formatDate(firstWeekBounds.start);
  const periodEnd = formatDate(lastWeekBounds.end);

// Calcul dynamique des ticks Y
const rawMax = Math.max(...visibleData.map((d) => d.km));
const maxRounded = Math.ceil(rawMax / 5) * 5;

let ticks;
if (rawMax < 5) {
  ticks = [0, 2.5, 5, 7.5];
} else {
  const step = maxRounded / 3;

  const tick2 = Math.ceil(step / 5) * 5;
  const tick3 = Math.ceil((2 * step) / 5) * 5;

  ticks = [0, tick2, tick3, maxRounded];
}

  // Tooltip personnalisé (période + km)
  function CustomTooltip({ active, payload, coordinate }) {
    if (!active || !payload || !payload.length) return null;

    const item = payload[0].payload;
    const { start, end } = getWeekBounds(item.date);

    const startStr = formatTooltipDate(start);
    const endStr = formatTooltipDate(end);

    return (
      <div
        style={{
          position: "absolute",
          left: coordinate.x - 53,
          top: coordinate.y - 40,

          minWidth: "108px",
          width: "auto",
          height: "auto",
          boxSizing: "border-box",

          paddingTop: "23px",
          paddingLeft: "13px",
          paddingRight: "13px",
          paddingBottom: "23px",

          display: "flex",
          flexDirection: "column",
          gap: "2px",

          background: "#000000",
          opacity: 0.94,
          borderRadius: "10px",
          boxShadow: "0px 4px 54px -18px #9DA7FB99",

          pointerEvents: "none"
        }}
      >

        <div
          style={{
            fontFamily: "Inter",
            fontWeight: 400,
            fontSize: "12px",
            lineHeight: "100%",
            color: "#E7E7E7",

            whiteSpace: "nowrap",
            textAlign: "left",
            paddingLeft: "13px",
            paddingRight: "13px",
            marginBottom: "2px"
          }}
        >
          {startStr} au {endStr}
        </div>

        <div
          style={{
            fontFamily: "Inter",
            fontWeight: 500,
            fontSize: "16px",
            lineHeight: "100%",
            color: "#E7E7E7",
            paddingLeft: "13px",
            textAlign: "left"
          }}
        >
          {item.km} km
        </div>
      </div>
    );
  }

  return (
    <div className="chart-wrapper">

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: "26.5px",
          paddingLeft: "40px",
          paddingRight: "40px",
          width: "365px"
        }}
      >
        <h2
          className="chart-title"
          style={{
            margin: 0,
            whiteSpace: "nowrap"
          }}
        >
          {Math.round(averageKm)}km en moyenne
        </h2>

        <div
          style={{
            width: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
          }}
        >
          {canGoPrev && (
            <button
              onClick={handlePrev}
              className="chart-arrow prev"
            ></button>
          )}

          <div
            style={{
              minWidth: "88px",
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
                fontSize: "12px",
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
              className="chart-arrow next"
            ></button>
          )}
        </div>
      </div>

      <p
        style={{
          margin: 0,
          paddingLeft: "40px",
          fontFamily: "Inter",
          fontSize: "12px",
          color: "#707070",
          marginBottom: "40px",
          textAlign: "left",
          marginTop: "10.5px",
          marginBottom: "40px"
        }}
      >
        Total des kilomètres 4 dernières semaines
      </p>

      <div
        className="chart-container"
        style={{
          width: "370px",
          height: "307px",
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
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
                fontSize: 12
              }}
              tickLine={false}
              tickMargin={22}
            />

            <YAxis
              tick={{
                fill: "#707070",
                fontFamily: "Inter",
                fontSize: 10
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
              barSize={14}

              activeBar={{ fill: "#0B23F4", radius: [10, 10, 10, 10] }}

              shape={<RoundedBar />}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div
        className="chart-legend"
        style={{
          position: "absolute",
          bottom: "40px",
          left: "40px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          color: "#707070",
          fontFamily: "Inter",
          fontSize: "12px",
          lineHeight: "15px"
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

        <span>Km</span>
      </div>
    </div>
  );
}
