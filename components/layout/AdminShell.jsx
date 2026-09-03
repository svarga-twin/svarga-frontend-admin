export default function AdminShell({ title, badge, description, actions, children }) {
  return (
    <div className="max-w-[1400px] mx-auto px-8 py-7">
      {(title || actions) && (
        <div className="flex items-start justify-between gap-4 mb-1 flex-wrap">
          <div className="flex items-center gap-2.5">
            {title && <h1 className="font-display font-bold text-2xl text-canopy-950">{title}</h1>}
            {badge && (
              <span className="text-xs font-medium bg-canopy-100 text-canopy-700 rounded-full px-2.5 py-1">
                {badge}
              </span>
            )}
          </div>
          {actions && <div className="flex items-center gap-2.5 shrink-0 flex-wrap">{actions}</div>}
        </div>
      )}
      {description && <p className="text-sm text-ink-500 mb-6">{description}</p>}
      {children}
    </div>
  );
}
