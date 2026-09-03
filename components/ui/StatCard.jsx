import * as Icons from "lucide-react";

const toneClasses = {
  neutral: "bg-canopy-100 text-canopy-700",
  info: "bg-info-100 text-info-600",
  warn: "bg-ochre-100 text-ochre-600",
  danger: "bg-alert-100 text-alert-600",
};

export default function StatCard({ icon, label, value, badge, badgeTone = "neutral", note }) {
  const IconCmp = icon ? Icons[icon] : null;
  return (
    <div className="bg-white rounded-2xl border border-canopy-800/10 p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-500">{label}</p>
        {IconCmp && <IconCmp size={16} className="text-ink-500" />}
      </div>
      <div className="flex items-center gap-2 mt-1.5">
        <p className="font-display font-bold text-2xl text-ink-900">{value}</p>
        {badge && (
          <span className={`text-xs font-medium rounded-full px-2 py-0.5 ${toneClasses[badgeTone]}`}>{badge}</span>
        )}
      </div>
      {note && <p className="text-xs text-ink-500 mt-1.5">{note}</p>}
    </div>
  );
}
