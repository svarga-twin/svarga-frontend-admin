export default function AdminCard({ title, badge, action, className = "", children }) {
  return (
    <div className={`bg-white rounded-2xl border border-canopy-800/10 p-5 ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            {title && <h2 className="font-semibold text-ink-900">{title}</h2>}
            {badge}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}
