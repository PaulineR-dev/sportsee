import { PieChart, Pie, Cell } from "recharts";

// Couleurs du donut
const COLORS = {
  completed: "#0B23F4",
  remaining: "#B6BDFC"
};

export default function WeeklyGoalChart({ weeklyStats }) {

  // Si pas de données
  if (!weeklyStats) return <p>Aucune donnée d'objectif disponible.</p>;

  // Valeurs objectif
  const completed = weeklyStats.runsCompleted ?? 0;
  const goal = weeklyStats.weeklyGoal ?? 0;
  const remaining = Math.max(goal - completed, 0);

  // Données du donut
  const data = [
    { name: "Restantes", value: remaining, color: COLORS.remaining },
    { name: "Réalisées", value: completed, color: COLORS.completed }
  ];

  return (
    <div
      style={{
        width: "450px",
        height: "342px",
        padding: "23px 38px 32px 38px",
        boxSizing: "border-box",
        borderRadius: "10px",
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        alignItems: "flex-start"
      }}
    >
      {/* Titre + sous-titre */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
        
        {/* Ligne xNb / objectif */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span
            style={{
              fontFamily: "Inter",
              fontWeight: 600,
              fontSize: "28px",
              lineHeight: "100%",
              color: "#0B23F4"
            }}
          >
            x{completed}
          </span>

          <span
            style={{
              fontFamily: "Inter",
              fontWeight: 500,
              fontSize: "16px",
              lineHeight: "100%",
              color: "#B6BDFC"
            }}
          >
            sur objectif de {goal}
          </span>
        </div>

        {/* Texte sous le titre */}
        <span
          style={{
            marginTop: "7px",
            fontFamily: "Inter",
            fontWeight: 400,
            fontSize: "14px",
            lineHeight: "100%",
            color: "#707070"
          }}
        >
          Courses hebdomadaires réalisées
        </span>
      </div>

      {/* Donut + légendes */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "240px",
          marginTop: "8px"
        }}
      >
        {/* Légende haut droite */}
        <div
          style={{
            position: "absolute",
            top: "37px",
            right: "56px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            lineHeight: "48px"
          }}
        >
          <div
            style={{
              width: "6.54px",
              height: "6.54px",
              borderRadius: "50%",
              backgroundColor: COLORS.remaining
            }}
          ></div>

          <span
            style={{
              fontFamily: "Inter",
              fontWeight: 400,
              fontSize: "10px",
              lineHeight: "100%",
              color: "#707070"
            }}
          >
            {remaining} restantes
          </span>
        </div>

        {/* Donut */}
        <div
          style={{
            position: "absolute",
            top: "13.68px",
            left: "84.45px"
          }}
        >
          <PieChart width={200} height={200}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={42}
              outerRadius={81}
              paddingAngle={0}
              dataKey="value"
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.color}
                  stroke={entry.color}
                  strokeWidth={2.45}
                />
              ))}
            </Pie>
          </PieChart>
        </div>

        {/* Légende bas gauche */}
        <div
          style={{
            position: "absolute",
            bottom: "38.7px",
            left: "47px",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          <div
            style={{
              width: "6.54px",
              height: "6.54px",
              borderRadius: "50%",
              backgroundColor: COLORS.completed
            }}
          ></div>

          <span
            style={{
              fontFamily: "Inter",
              fontWeight: 400,
              fontSize: "10px",
              lineHeight: "100%",
              color: "#707070"
            }}
          >
            {completed} réalisées
          </span>
        </div>
      </div>
    </div>
  );
}
