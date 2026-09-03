"use client";
import "@/lib/chartSetup";
import { Bar } from "react-chartjs-2";

export default function BarCompareChart({ labels, series, height = 230 }) {
  const data = {
    labels,
    datasets: series.map((s) => ({ label: s.name, data: s.data, backgroundColor: s.color, borderRadius: 4, barThickness: 14 })),
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: "#6b7a70", font: { size: 11 } } },
      y: { grid: { color: "#e7ece8" }, ticks: { color: "#6b7a70", font: { size: 11 } } },
    },
  };
  return (
    <div style={{ height }}>
      <Bar data={data} options={options} />
    </div>
  );
}
