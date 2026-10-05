"use client";

const inputBase =
  "w-full rounded-lg border border-canopy-800/15 bg-white px-3 py-2 text-sm text-ink-900 outline-none focus:border-canopy-600 disabled:bg-sand-100 disabled:text-ink-500";

export function Field({ label, error, hint, children }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-ink-700 mb-1">{label}</span>
      {children}
      {hint && !error && <span className="block text-[0.7rem] text-ink-400 mt-1">{hint}</span>}
      {error && <span className="block text-[0.7rem] text-alert-600 mt-1">{error}</span>}
    </label>
  );
}

export function TextInput({ label, error, hint, ...props }) {
  return (
    <Field label={label} error={error} hint={hint}>
      <input className={inputBase} {...props} />
    </Field>
  );
}

export function TextArea({ label, error, hint, ...props }) {
  return (
    <Field label={label} error={error} hint={hint}>
      <textarea rows={3} className={inputBase} {...props} />
    </Field>
  );
}

export function SelectInput({ label, error, hint, options, ...props }) {
  return (
    <Field label={label} error={error} hint={hint}>
      <select className={inputBase} {...props}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </Field>
  );
}

export function CheckInput({ label, ...props }) {
  return (
    <label className="flex items-center gap-2 text-sm text-ink-700">
      <input type="checkbox" className="h-4 w-4 accent-canopy-700" {...props} />
      {label}
    </label>
  );
}

export function Button({ variant = "primary", className = "", ...props }) {
  const styles = {
    primary: "bg-canopy-700 text-white hover:bg-canopy-800",
    ghost: "bg-white text-ink-700 border border-canopy-800/15 hover:bg-sand-100",
    danger: "bg-alert-600 text-white hover:opacity-90",
  };
  return (
    <button
      className={`rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-50 ${styles[variant]} ${className}`}
      {...props}
    />
  );
}
