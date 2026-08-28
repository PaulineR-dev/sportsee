import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const data = [
  { week: "S1", km: 20 },
  { week: "S2", km: 25 },
  { week: "S3", km: 15 },
  { week: "S4", km: 30 },
];

export default function WeeklyDistanceChart() {
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
      <h2 style={{ color: "#4E6AF3", marginBottom: "10px" }}>18 km en moyenne</h2>
      <p style={{ color: "#777", marginBottom: "20px" }}>
        Total des kilomètres 4 dernières semaines
      </p>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="week" tick={{ fill: "#777" }} />
          <YAxis tick={{ fill: "#777" }} />
          <Tooltip />
          <Bar dataKey="km" fill="#4E6AF3" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <div style={{ textAlign: "center", marginTop: "10px", color: "#4E6AF3" }}>
        Km
      </div>
    </div>
  );
}