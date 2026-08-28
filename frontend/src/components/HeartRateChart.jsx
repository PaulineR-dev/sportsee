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

const data = [
  { day: "Lun", min: 132, max: 185, avg: 163 },
  { day: "Mar", min: 140, max: 187, avg: 165 },
  { day: "Mer", min: 135, max: 180, avg: 160 },
  { day: "Jeu", min: 130, max: 175, avg: 158 },
  { day: "Ven", min: 145, max: 182, avg: 166 },
  { day: "Sam", min: 138, max: 170, avg: 155 },
  { day: "Dim", min: 133, max: 177, avg: 162 },
];

const HeartRateChart = () => {
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
};

export default HeartRateChart;