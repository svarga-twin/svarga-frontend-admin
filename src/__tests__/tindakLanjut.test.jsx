import { act, createElement } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
const mounted = [];
let host;
async function render(Page) {
  const { ToastProvider } = await import("../context/ToastContext");
  host = document.createElement("div");
  document.body.appendChild(host);
  const root = createRoot(host);
  mounted.push(root);
  await act(async () => root.render(createElement(ToastProvider, null, createElement(MemoryRouter, null, createElement(Page)))));
}
const flush = () => act(async () => { await new Promise((r) => setTimeout(r, 40)); });
const byText = (re, tag = "button") => [...host.querySelectorAll(tag)].find((n) => re.test(n.textContent));

beforeEach(() => { localStorage.clear(); vi.resetModules(); });
afterEach(async () => { while (mounted.length) await act(async () => mounted.pop().unmount()); host?.remove(); vi.unstubAllGlobals(); });

const USULAN = { id: 11, kategori: "pohon", status: "menunggu", temuan: "RTH Sritanjung hanya menyerap 27% dari emisinya.", usulan: "Tanam 40 pohon mahoni.", dampak: { co2_kg_per_hari: 32.4 }, parameter: { tambah_pohon: { jenis: "mahoni", jumlah: 40 } } };

describe("Tindak Lanjut", () => {
  it("usulan: buat 3 temuan/usulan, setujui, dan tolak memunculkan perbaikan dampak", async () => {
    let status = "menunggu";
    const calls = [];
    vi.stubGlobal("fetch", vi.fn(async (url, init = {}) => {
      const u = String(url);
      calls.push(`${init.method ?? "GET"} ${u.replace(/^.*\/api/, "")}`);
      if (u.endsWith("/admin/asisten/laporan")) return json({ data: { id: 1, teks: "Ringkasan minggu ini", sumber: "template", temuan: [], usulan: [USULAN] } }, 201);
      if (u.endsWith("/admin/proposals/11/setuju")) { status = "disetujui"; return json({ data: { ...USULAN, status }, tindakan: [{}] }); }
      if (u.endsWith("/admin/proposals/11/tolak")) { status = "ditolak"; return json({ data: { ...USULAN, status }, perbaikan: { hasil: { selisih: { emisi_bersih_turun_kg_hari: 41.2 } } } }); }
      if (u.includes("/admin/proposals")) return json({ data: [{ ...USULAN, status }], menunggu: status === "menunggu" ? 1 : 0 });
      return json({});
    }));
    const { default: Page } = await import("../pages/TindakLanjutPage");
    await render(Page);
    await flush();
    expect(host.textContent).toContain("Tanam 40 pohon mahoni");
    await act(async () => byText(/Buat 3 temuan/).click());
    await flush();
    expect(host.querySelector("[data-testid=laporan-teks]").textContent).toContain("Ringkasan minggu ini");

    await act(async () => byText(/^Tolak$/).click());
    await flush();
    expect(host.textContent).toContain("41,2");
    expect(byText(/Perbaiki dampak/)).toBeTruthy();
    expect(calls).toContain("POST /admin/proposals/11/tolak");
  });

  it("usulan: setujui memanggil endpoint dan menghilangkan tombol keputusan", async () => {
    let status = "menunggu";
    vi.stubGlobal("fetch", vi.fn(async (url, init = {}) => {
      const u = String(url);
      if (u.endsWith("/admin/proposals/11/setuju")) { status = "disetujui"; return json({ data: { ...USULAN, status }, tindakan: [{}] }); }
      if (u.includes("/admin/proposals")) return json({ data: [{ ...USULAN, status }], menunggu: status === "menunggu" ? 1 : 0 });
      return json({});
    }));
    const { default: Page } = await import("../pages/TindakLanjutPage");
    await render(Page);
    await flush();
    await act(async () => byText(/^Setujui$/).click());
    await flush();
    expect(byText(/^Setujui$/)).toBeFalsy();
    expect(host.textContent).toContain("disetujui");
  });

  it("sumber data: menandai data seder dan sumber kosong", async () => {
    vi.stubGlobal("fetch", vi.fn(async (url) => {
      const u = String(url);
      if (u.includes("/admin/engine/sumber")) return json({ data: [{ kunci: "surya", nama: "Sensor energi Solar Bench", asal: "seder", terakhir: new Date().toISOString(), jumlah: 120 }, { kunci: "yolo", nama: "Kamera YOLO koridor pasar", asal: "kosong", terakhir: null, jumlah: 0 }], baris_per_jam: 343, jam_terakhir: null });
      if (u.includes("/admin/proposals")) return json({ data: [], menunggu: 0 });
      return json({});
    }));
    const { default: Page } = await import("../pages/TindakLanjutPage");
    await render(Page);
    await flush();
    await act(async () => byText(/Sumber Data/).click());
    await flush();
    expect(host.textContent).toContain("Seder (data pengganti)");
    expect(host.textContent).toContain("Belum ada data");
    expect(host.textContent).toContain("343 baris");
  });
});
