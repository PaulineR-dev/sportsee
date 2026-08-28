import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line
} from "recharts";

export default function HeartRateChart({ data }) {
  console.log("HEART RATE DATA =", data);

  if (!data || !Array.isArray(data) || data.length === 0) {
    return <p>Aucune donnée de fréquence cardiaque disponible.</p>;
  }

  return (
    <BarChart
      style={{
        width: "100%",
        maxWidth: "700px",
        maxHeight: "70vh",
        aspectRatio: 1.618,
      }}
      responsive
      data={data}
      margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
    >
      <CartesianGrid strokeDasharray="3 3" vertical={false} />
      <XAxis dataKey="day" tick={{ fill: "#777" }} />
      <YAxis domain={[130, 190]} tick={{ fill: "#777" }} />
      <Tooltip />
      <Legend />
      <Bar dataKey="min" name="Min BPM" fill="#FDCACB" radius={[10, 10, 0, 0]} />
      <Bar dataKey="max" name="Max BPM" fill="#E60000" radius={[10, 10, 0, 0]} />
      <Line
        type="monotone"
        dataKey="avg"
        name="Moyenne"
        stroke="#4E6AF3"
        strokeWidth={2}
        dot={{ fill: "#4E6AF3", r: 4 }}
      />
    </BarChart>
  );
}
