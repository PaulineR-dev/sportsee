import { PieChart, Pie, Cell } from "recharts";

const COLORS = {
  completed: "#4E6AF3",
  remaining: "#A8C3FF"
};

export default function WeeklyGoalChart({ weeklyStats }) {
  if (!weeklyStats) return <p>Aucune donnée d'objectif disponible.</p>;

  const completed = weeklyStats.runsCompleted;
  const goal = weeklyStats.goal;
  const remaining = Math.max(goal - completed, 0);

  const data = [
    { name: "Restantes", value: remaining, color: COLORS.remaining },
    { name: "Réalisées", value: completed, color: COLORS.completed }
  ];

  const labelCompleted = completed < 2 ? "réalisée" : "réalisées";
  const labelRemaining = remaining < 2 ? "restante" : "restantes";

  // LABELS DÉCALÉS VERS L’EXTÉRIEUR
  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    index
  }) => {
    const RADIAN = Math.PI / 180;

    // distance du centre pour placer le label
    const radius = outerRadius + 20; 

    // coordonnées du label
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    const item = data[index];
    const value = item.value;

    const label =
      item.name === "Réalisées"
        ? `${value} ${labelCompleted}`
        : `${value} ${labelRemaining}`;

    return (
      <g>
        {/* Petit rond */}
        <circle cx={x - 14} cy={y} r={6} fill={item.color} />

        {/* Texte en noir */}
        <text
          x={x + 2}
          y={y + 4}
          fill="#000"
          fontSize="14"
          textAnchor="start"
        >
          {label}
        </text>
      </g>
    );
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "300px",
        textAlign: "center",
        backgroundColor: "#fff",
        borderRadius: "10px",
        padding: "20px"
      }}
    >
      <h2 style={{ color: "#4E6AF3", marginBottom: "5px" }}>
        x{completed} sur objectif de {goal}
      </h2>

      <p style={{ color: "#777", marginBottom: "20px" }}>
        Courses hebdomadaires réalisées
      </p>

      <PieChart width={250} height={250}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={100}
          paddingAngle={0}
          dataKey="value"
          labelLine={false}
          label={renderCustomLabel}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.color}
              stroke={entry.color}
              strokeWidth={2}
            />
          ))}
        </Pie>
      </PieChart>
    </div>
  );
}
