"use client";
import "@/lib/chartSetup";
import { Doughnut } from "react-chartjs-2";

export default function DonutStatChart({ segments, centerValue, centerLabel, size = 160 }) {
  const data = {
    labels: segments.map((s) => s.name),
    datasets: [{ data: segments.map((s) => s.value), backgroundColor: segments.map((s) => s.color), borderWidth: 0 }],
  };
  const options = { responsive: true, maintainAspectRatio: false, cutout: "68%", plugins: { legend: { display: false } } };
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <Doughnut data={data} options={options} />
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="font-display font-bold text-xl text-ink-900">{centerValue}</span>
        <span className="text-[0.6rem] text-ink-500">{centerLabel}</span>
      </div>
    </div>
  );
}
