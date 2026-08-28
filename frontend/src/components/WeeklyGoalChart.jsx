import { PieChart, Pie, Cell, Tooltip } from "recharts";

const COLORS = ["#4E6AF3", "#A8C3FF"];

export default function WeeklyGoalChart({ weeklyStats }) {
  console.log("WEEKLY GOAL DATA =", weeklyStats);

  if (!weeklyStats) {
    return <p>Aucune donnée d'objectif disponible.</p>;
  }

  const completed = weeklyStats.runsCompleted;
  const goal = weeklyStats.goal;
  const remaining = goal - completed;

  const data = [
    { name: "Réalisées", value: completed },
    { name: "Restantes", value: remaining },
  ];

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "300px",
        textAlign: "center",
        backgroundColor: "#fff",
        borderRadius: "10px",
        padding: "20px",
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
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index]}
              stroke={COLORS[index]}
              strokeWidth={2}
            />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>

      <div style={{ marginTop: "10px", color: "#4E6AF3" }}>
        <strong>{completed} réalisées</strong> /{" "}
        <span style={{ color: "#A8C3FF" }}>{remaining} restantes</span>
      </div>
    </div>
  );
}
