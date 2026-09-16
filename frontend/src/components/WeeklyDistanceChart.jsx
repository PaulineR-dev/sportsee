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

  // Si pas de données
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <p>Aucune donnée de distance disponible.</p>;
  }

  // Nombre de semaines visibles
  const windowSize = 4;

  // Index de départ de la fenêtre
  const [windowStart, setWindowStart] = useState(
    Math.max(data.length - windowSize, 0)
  );

  // Fin de la fenêtre
  const windowEnd = windowStart + windowSize;

  // Données affichées
  const visibleData = data.slice(windowStart, windowEnd);

  // Flèche gauche
  const handlePrev = () => {
    setWindowStart((prev) => Math.max(prev - 1, 0));
  };

  // Flèche droite
  const handleNext = () => {
    setWindowStart((prev) =>
      Math.min(prev + 1, data.length - windowSize)
    );
  };

  // Activation des flèches
  const canGoPrev = windowStart > 0;
  const canGoNext = windowStart < data.length - windowSize;

  // Moyenne des km
  const averageKm = useMemo(() => {
    return visibleData.reduce((sum, d) => sum + d.km, 0) / visibleData.length;
  }, [visibleData]);

  // Bornes de semaine (lundi → dimanche)
  function getWeekBounds(dateStr) {
    const d = new Date(dateStr);
    const dayNum = (d.getDay() + 6) % 7;
    const monday = new Date(d);
    monday.setDate(d.getDate() - dayNum);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return { start: monday, end: sunday };
  }

  // Format date pour titre
  function formatDate(date) {
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short"
    });
  }

  // Format date tooltip
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

  // Échelle Y dynamique
  const rawMax = Math.max(...visibleData.map((d) => d.km));
  const maxRounded = Math.ceil(rawMax / 10) * 10;
  const ticks = rawMax < 5 ? [0, 2.5, 5, 7.5] : [
    0,
    Math.ceil(maxRounded / 3),
    Math.ceil((maxRounded * 2) / 3),
    maxRounded
  ];

  // Tooltip personnalisé
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
          top: coordinate.y - 86,

          width: "108px",
          height: "82px",
          paddingTop: "23px",
          paddingLeft: "13px",
          paddingRight: "13px",
          paddingBottom: "23px",
          boxSizing: "border-box",

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
        {/* Dates */}
        <div
          style={{
            fontFamily: "Inter",
            fontWeight: 400,
            fontSize: "12px",
            lineHeight: "100%",
            color: "#E7E7E7"
          }}
        >
          {startStr} au {endStr}
        </div>

        {/* Km */}
        <div
          style={{
            fontFamily: "Inter",
            fontWeight: 500,
            fontSize: "16px",
            lineHeight: "100%",
            color: "#E7E7E7",
            paddingLeft: "13px"
          }}
        >
          {item.km} km
        </div>
      </div>
    );
  }

  return (
    <div className="chart-wrapper">

      {/* Ligne du haut */}
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

      {/* Sous-titre */}
      <p
        style={{
          margin: 0,
          paddingLeft: "40px",
          paddingRight: "40px",
          fontFamily: "Inter",
          fontSize: "12px",
          color: "#707070",
          marginBottom: "10px"
        }}
      >
        Total des kilomètres sur les 4 dernières semaines
      </p>

      {/* Graphique */}
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
                fontSize: 12
              }}
              tickLine={false}
              tickMargin={24}
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
              radius={[10, 10, 0, 0]}
              barSize={14}
              activeBar={{ fill: "#0B23F4" }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Légende */}
      <div
        className="chart-legend"
        style={{
          textAlign: "left",
          color: "#707070",
          display: "flex",
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
            fontSize: "12px",
            color: "#707070"
          }}
        >
          Km
        </span>
      </div>
    </div>
  );
}
