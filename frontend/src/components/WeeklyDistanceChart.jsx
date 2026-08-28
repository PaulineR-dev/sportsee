import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function WeeklyDistanceChart({ data }) {
  console.log("WEEKLY DISTANCE DATA", data);

  if (!data || !Array.isArray(data) || data.length === 0) {
    return <p>Aucune donnée de distance disponible.</p>;
  }

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
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="week" tick={{ fill: "#777" }} />
          <YAxis tick={{ fill: "#777" }} />
          <Tooltip />
          <Bar dataKey="km" fill="#4E6AF3" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
