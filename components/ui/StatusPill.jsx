const tones = {
  aktif: "bg-canopy-100 text-canopy-700",
  baik: "bg-canopy-100 text-canopy-700",
  nyaman: "bg-info-100 text-info-600",
  sedang: "bg-ochre-100 text-ochre-600",
  siaga: "bg-ochre-100 text-ochre-600",
  nonaktif: "bg-alert-100 text-alert-600",
  offline: "bg-alert-100 text-alert-600",
  urgent: "bg-alert-100 text-alert-600",
  "tidak sehat": "bg-alert-100 text-alert-600",
};

export default function StatusPill({ children }) {
  const tone = tones[String(children).toLowerCase()] ?? "bg-sand-200 text-ink-700";
  return <span className={`text-xs font-medium rounded-full px-2.5 py-1 ${tone}`}>{children}</span>;
}
