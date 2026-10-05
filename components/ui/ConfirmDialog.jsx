"use client";

import Modal from "./Modal";
import { Button } from "./FormControls";

export default function ConfirmDialog({ open, title, message, confirmLabel = "Hapus", busy, error, onConfirm, onClose }) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={busy}>Batal</Button>
          <Button variant="danger" onClick={onConfirm} disabled={busy}>{busy ? "Memproses..." : confirmLabel}</Button>
        </>
      }
    >
      <p className="text-sm text-ink-700">{message}</p>
      {error && <p className="text-sm text-alert-600 mt-3">{error}</p>}
    </Modal>
  );
}
