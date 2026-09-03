"use client";
import "@/lib/chartSetup";
import { Line } from "react-chartjs-2";

export default function LineTrendChart({ labels, series, height = 240 }) {
  const data = {
    labels,
    datasets: series.map((s) => ({
      label: s.name,
      data: s.data,
      borderColor: s.color,
      backgroundColor: s.color,
      tension: 0.35,
      pointRadius: s.showDots ? 3 : 0,
      borderWidth: 2,
    })),
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
      <Line data={data} options={options} />
    </div>
  );
}
