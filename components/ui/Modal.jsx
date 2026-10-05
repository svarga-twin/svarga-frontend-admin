"use client";

import { useEffect } from "react";
import { X } from "@/components/ui/AppIcon";

// Dialog sederhana: tutup dengan Esc, klik latar, atau tombol X.
export default function Modal({ open, title, onClose, children, footer, wide = false }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-canopy-950/40 p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className={`bg-white rounded-2xl shadow-xl w-full ${wide ? "max-w-2xl" : "max-w-lg"} max-h-[90vh] flex flex-col`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-canopy-800/10">
          <h2 className="font-display font-bold text-lg text-canopy-950">{title}</h2>
          <button onClick={onClose} aria-label="Tutup" className="text-ink-500 hover:text-ink-900">
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-5 overflow-y-auto">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-canopy-800/10 flex justify-end gap-2.5">{footer}</div>}
      </div>
    </div>
  );
}
