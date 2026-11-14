import { useState } from "react";
import { CheckCircle2, FlaskConical, RefreshCw, Sparkles, XCircle } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { Card, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Tabs } from "../components/ui/Tabs";
import { StatCard } from "../components/ui/StatCard";
import { Field, Input, Select } from "../components/ui/Field";
import { EmptyState, ErrorState, Skeleton } from "../components/ui/States";
import { useAsync } from "../hooks/useAsync";
import { useToast } from "../context/ToastContext";
import { engine } from "../services/jejakwangi";
import { fmtNum, formatTanggalJam } from "../lib/format";

const TABS = [
  { value: "usulan", label: "Usulan Asisten" },
  { value: "simulator", label: "Simulator Skenario" },
  { value: "baseline", label: "Baseline & Target" },
  { value: "rapor", label: "Rapor Koridor" },
  { value: "ekonomi", label: "Nilai Ekonomi Hijau" },
  { value: "jadwal", label: "Sampah: Jadwal & Pemilahan" },
  { value: "sumber", label: "Sumber Data" },
];
const rp = (n) => `Rp ${fmtNum(n)}`;
const KATEGORI = { pohon: "Pohon", kendaraan: "Kendaraan", ac: "AC toko", udara: "Udara", suhu: "Suhu", sampah: "Sampah", pangan: "Pangan" };
const STATUS_TONE = { menunggu: "warn", disetujui: "ok", ditolak: "danger", terjadwal: "info", berjalan: "warn", selesai: "ok", batal: "muted" };

/** Dashboard pengelola pasar & DLH — sisi "Tindak Lanjut" pada flowchart. */
export default function TindakLanjutPage() {
  const [tab, setTab] = useState("usulan");
  return (
    <>
      <PageHeader title="Tindak Lanjut" subtitle="Dashboard pengelola pasar dan DLH: putuskan usulan Asisten Laporan, jalankan simulasi, pantau target, dan jadwalkan penanganan sampah." />
      <Tabs tabs={TABS} value={tab} onChange={setTab} className="mb-5" />
      {tab === "usulan" && <Usulan />}
      {tab === "simulator" && <Simulator />}
      {tab === "baseline" && <BaselineTab />}
      {tab === "rapor" && <Rapor />}
      {tab === "ekonomi" && <Ekonomi />}
      {tab === "jadwal" && <Jadwal />}
      {tab === "sumber" && <Sumber />}
    </>
  );
}

function Usulan() {
  const toast = useToast();
  const list = useAsync(() => engine.proposals(), []);
  const [busy, setBusy] = useState(null);
  const [perbaikan, setPerbaikan] = useState({});
  const [lap, setLap] = useState(null);

  async function buat() {
    setBusy("buat");
    try { const r = await engine.laporanBaru(); setLap(r); await list.reload({ silent: true }); toast.success("3 temuan dan 3 usulan dibuat."); }
    catch (e) { toast.error(e.message); } finally { setBusy(null); }
  }
  async function aksi(p, jenis) {
    setBusy(`${jenis}${p.id}`);
    try {
      if (jenis === "setuju") { await engine.setuju(p.id); toast.success("Usulan disetujui — tindak lanjut dibuat."); }
      if (jenis === "tolak") { const r = await engine.tolak(p.id); setPerbaikan((s) => ({ ...s, [p.id]: r.perbaikan })); toast.success("Usulan ditolak. Simulator menyiapkan perbaikan dampak."); }
      if (jenis === "revisi") { await engine.revisi(p.id); toast.success("Usulan revisi diajukan kembali."); }
      await list.reload({ silent: true });
    } catch (e) { toast.error(e.message); } finally { setBusy(null); }
  }
  const rows = list.data?.data ?? [];
  return (
    <div className="space-y-5">
      <Card className="p-5">
        <CardTitle right={<Button icon={Sparkles} loading={busy === "buat"} onClick={buat}>Buat 3 temuan & 3 usulan</Button>}>Asisten Laporan AI</CardTitle>
        <p className="text-sm text-muted mt-2">Dihitung dari Database per jam dan timbangan sisa pangan. Temuan disusun aturan server dari angka nyata; AI hanya menjelaskan. Keputusan tetap di pengelola.</p>
        {lap && <p className="mt-3 text-[13px] text-ink whitespace-pre-line rounded-xl bg-canvas p-4" data-testid="laporan-teks">{lap.teks}<span className="block mt-2 text-xs text-brand-700">{lap.sumber === "ai" ? "Dijelaskan AI" : "Ringkasan otomatis"}</span></p>}
      </Card>
      <Card className="p-5">
        <CardTitle right={<Badge tone="warn">{list.data?.menunggu ?? 0} menunggu keputusan</Badge>}>Usulan disetujui?</CardTitle>
        {list.loading && !list.data ? <Skeleton className="h-40 mt-4" /> : list.error ? <ErrorState error={list.error} onRetry={list.reload} compact /> : rows.length === 0 ? <EmptyState title="Belum ada usulan" message="Tekan “Buat 3 temuan & 3 usulan”." /> : (
          <ul className="divide-y divide-brand-200 mt-2">
            {rows.map((p) => (
              <li key={p.id} className="py-4">
                <div className="flex flex-wrap items-center gap-2 mb-1.5"><Badge tone="brand">{KATEGORI[p.kategori] ?? p.kategori}</Badge><Badge tone={STATUS_TONE[p.status]}>{p.status}</Badge>{p.parent_id && <Badge tone="info">revisi #{p.parent_id}</Badge>}</div>
                <p className="text-sm text-brand-700"><b>Temuan:</b> {p.temuan}</p>
                <p className="text-sm text-brand-700"><b>Usulan:</b> {p.usulan}</p>
                {p.dampak?.co2_kg_per_hari != null && <p className="text-xs text-muted mt-1">Estimasi dampak: −{fmtNum(p.dampak.co2_kg_per_hari, 2)} kg CO₂/hari</p>}
                {p.status === "menunggu" && (
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" icon={CheckCircle2} loading={busy === `setuju${p.id}`} onClick={() => aksi(p, "setuju")}>Setujui</Button>
                    <Button size="sm" variant="secondary" icon={XCircle} loading={busy === `tolak${p.id}`} onClick={() => aksi(p, "tolak")}>Tolak</Button>
                  </div>
                )}
                {p.status === "ditolak" && (
                  <div className="mt-3 rounded-xl bg-canvas p-3 text-[13px] text-brand-700">
                    {(perbaikan[p.id] ?? null) ? <>Simulator: estimasi turun <b>{fmtNum(perbaikan[p.id].hasil.selisih.emisi_bersih_turun_kg_hari, 2)} kg CO₂/hari</b> dengan parameter diperbaiki. </> : <>Simulator sudah menyimpan skenario perbaikan. </>}
                    <Button size="sm" variant="soft" icon={RefreshCw} loading={busy === `revisi${p.id}`} className="ml-2" onClick={() => aksi(p, "revisi")}>Perbaiki dampak & ajukan lagi</Button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

function Simulator() {
  const toast = useToast();
  const kor = useAsync(async () => (await engine.rapor(7)).koridor, []);
  const [f, setF] = useState({ koridor_id: "", jumlah: 20, motor: 10, ac: 15, solar: 2 });
  const [hasil, setHasil] = useState(null);
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));
  async function jalan(simpan) {
    if (!f.koridor_id) return toast.error("Pilih koridor dulu.");
    setBusy(true);
    try {
      setHasil(await engine.simulasi({ koridor_id: Number(f.koridor_id), tambah_pohon: { jenis: "mahoni", jumlah: Number(f.jumlah) }, persen_motor_jalan_kaki: Number(f.motor), persen_hemat_ac: Number(f.ac), tambah_solar_bench: Number(f.solar), simpan }));
      if (simpan) toast.success("Skenario disimpan.");
    } catch (e) { toast.error(e.message); } finally { setBusy(false); }
  }
  return (
    <div className="grid gap-5 xl:grid-cols-[360px_1fr] items-start">
      <Card className="p-5 space-y-4">
        <CardTitle>Parameter skenario</CardTitle>
        <Field label="Koridor"><Select value={f.koridor_id} onChange={set("koridor_id")}><option value="">Pilih koridor…</option>{(kor.data ?? []).map((k) => <option key={k.koridor_id} value={k.koridor_id}>{k.koridor}</option>)}</Select></Field>
        <Field label="Tambah pohon mahoni"><Input type="number" min="0" value={f.jumlah} onChange={set("jumlah")} /></Field>
        <Field label="% pengendara motor beralih jalan kaki"><Input type="number" min="0" max="100" value={f.motor} onChange={set("motor")} /></Field>
        <Field label="% hemat listrik AC toko"><Input type="number" min="0" max="100" value={f.ac} onChange={set("ac")} /></Field>
        <Field label="Tambah unit Solar Bench"><Input type="number" min="0" value={f.solar} onChange={set("solar")} /></Field>
        <div className="flex gap-2"><Button icon={FlaskConical} loading={busy} onClick={() => jalan(false)}>Jalankan</Button><Button variant="secondary" disabled={busy} onClick={() => jalan(true)}>Simpan skenario</Button></div>
      </Card>
      <Card className="p-5">
        <CardTitle>Hasil simulasi{hasil ? ` — ${hasil.koridor}` : ""}</CardTitle>
        {!hasil ? <EmptyState title="Belum ada simulasi" message="Atur parameter lalu tekan Jalankan." /> : (
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <StatCard label="Emisi bersih awal" value={fmtNum(hasil.awal.bersih, 1)} unit=" kg/hari" />
            <StatCard label="Setelah skenario" value={fmtNum(hasil.sesudah.bersih, 1)} unit=" kg/hari" badge={hasil.selisih.menjadi_netral ? { text: "Netral", tone: "ok" } : undefined} />
            <StatCard label="Turun" value={fmtNum(hasil.selisih.emisi_bersih_turun_kg_hari, 1)} unit=" kg/hari" sub={`${fmtNum(hasil.selisih.emisi_bersih_turun_kg_tahun)} kg/tahun · setara ${fmtNum(hasil.selisih.setara_pohon_mahoni)} pohon mahoni`} subTone="ok" />
            <p className="md:col-span-3 text-xs text-muted">Nilai karbon/tahun ≈ {rp(hasil.ekonomi_tahun.nilai_karbon_rupiah)} · biaya bibit {rp(hasil.ekonomi_tahun.biaya_bibit_rupiah)}. {hasil.ekonomi_tahun.catatan}</p>
          </div>
        )}
      </Card>
    </div>
  );
}

function BaselineTab() {
  const toast = useToast();
  const list = useAsync(() => engine.baseline(), []);
  const kor = useAsync(async () => (await engine.rapor(7)).koridor, []);
  const [f, setF] = useState({ koridor_id: "", target_persen: 15 });
  async function simpan() {
    try { await engine.setBaseline({ koridor_id: Number(f.koridor_id), target_persen: Number(f.target_persen) }); toast.success("Baseline & target ditetapkan."); list.reload({ silent: true }); } catch (e) { toast.error(e.message); }
  }
  return (
    <div className="space-y-5">
      <Card className="p-5"><CardTitle>Tetapkan baseline & target mitigasi</CardTitle>
        <div className="grid gap-3 md:grid-cols-[1fr_200px_auto] items-end mt-3">
          <Field label="Koridor"><Select value={f.koridor_id} onChange={(e) => setF({ ...f, koridor_id: e.target.value })}><option value="">Pilih…</option>{(kor.data ?? []).map((k) => <option key={k.koridor_id} value={k.koridor_id}>{k.koridor}</option>)}</Select></Field>
          <Field label="Target turun (%)"><Input type="number" min="1" max="90" value={f.target_persen} onChange={(e) => setF({ ...f, target_persen: e.target.value })} /></Field>
          <Button disabled={!f.koridor_id} onClick={simpan}>Tetapkan</Button>
        </div>
        <p className="text-xs text-muted mt-2">Baseline = rata-rata emisi bersih (emisi − serapan − terhindar) 7 hari terakhir dari Database per jam.</p>
      </Card>
      <Card className="p-5"><CardTitle>Progres target</CardTitle>
        {list.loading && !list.data ? <Skeleton className="h-32 mt-3" /> : (list.data ?? []).length === 0 ? <EmptyState title="Belum ada target" message="Setujui usulan koridor atau tetapkan manual di atas." /> : (
          <div className="overflow-x-auto mt-3"><table className="w-full text-sm"><thead><tr className="text-left text-muted text-xs"><th className="py-2">Koridor</th><th>Baseline</th><th>Target</th><th>Kini</th><th>Capaian</th><th>Status</th></tr></thead>
            <tbody>{list.data.map((t) => <tr key={t.id} className="border-t border-brand-100"><td className="py-2.5 font-semibold text-brand-700">{t.koridor}</td><td>{fmtNum(t.baseline_kg_hari, 1)}</td><td>{fmtNum(t.target_kg_hari, 1)} <span className="text-muted">(−{t.target_persen}%)</span></td><td>{fmtNum(t.kini_kg_hari, 1)}</td><td>{t.capaian_persen != null ? `${fmtNum(t.capaian_persen)}%` : "—"}</td><td><Badge tone={t.tercapai ? "ok" : "warn"}>{t.tercapai ? "Tercapai" : "Berjalan"}</Badge></td></tr>)}</tbody></table></div>
        )}
      </Card>
    </div>
  );
}

function Rapor() {
  const r = useAsync(() => engine.rapor(7), []);
  const gradeTone = { A: "ok", B: "ok", C: "warn", D: "warn", E: "danger" };
  return (
    <Card className="p-5"><CardTitle>Rapor serapan koridor (7 hari)</CardTitle>
      {r.loading && !r.data ? <Skeleton className="h-48 mt-3" /> : r.error ? <ErrorState error={r.error} onRetry={r.reload} compact /> : (
        <div className="overflow-x-auto mt-3"><table className="w-full text-sm"><thead><tr className="text-left text-muted text-xs"><th className="py-2">#</th><th>Koridor</th><th>Serapan (kg)</th><th>Emisi (kg)</th><th>Terhindar (kg)</th><th>Rasio</th><th>Nilai</th><th>ISPU</th><th>Selisih suhu</th><th>Pohon utk netral</th></tr></thead>
          <tbody>{r.data.koridor.map((k) => <tr key={k.koridor_id} className="border-t border-brand-100"><td className="py-2.5">{k.prioritas}</td><td className="font-semibold text-brand-700">{k.koridor}{k.sumber !== "database_per_jam" && <span className="block text-[11px] text-warn font-normal">dari survei, belum ada data per jam</span>}</td><td>{fmtNum(k.serapan_kg, 1)}</td><td>{fmtNum(k.emisi_kg, 1)}</td><td>{fmtNum(k.terhindar_kg, 1)}</td><td>{k.rasio_persen != null ? `${fmtNum(k.rasio_persen, 1)}%` : "—"}</td><td><Badge tone={gradeTone[k.grade] ?? "muted"}>{k.grade}</Badge></td><td>{k.ispu_rata ?? "—"}</td><td>{k.selisih_suhu_rata != null ? `${k.selisih_suhu_rata} °C` : "—"}</td><td>{k.pohon_tambahan_untuk_netral != null ? fmtNum(k.pohon_tambahan_untuk_netral) : "—"}</td></tr>)}</tbody></table></div>
      )}
      <p className="text-xs text-muted mt-3">Rasio = (serapan + terhindar) ÷ emisi. A ≥100%, B ≥75%, C ≥50%, D ≥25%, E &lt;25%. Prioritas 1 = paling butuh intervensi.</p>
    </Card>
  );
}

function Ekonomi() {
  const [days, setDays] = useState(30);
  const e = useAsync(() => engine.ekonomi(days), [days]);
  return (
    <div className="space-y-5">
      <Card className="p-5"><CardTitle right={<Select value={days} onChange={(ev) => setDays(Number(ev.target.value))} className="!w-40"><option value={7}>7 hari</option><option value={30}>30 hari</option><option value={90}>90 hari</option></Select>}>Nilai ekonomi hijau</CardTitle>
        {e.loading && !e.data ? <Skeleton className="h-32 mt-3" /> : e.error ? <ErrorState error={e.error} onRetry={e.reload} compact /> : (
          <>
            <p className="text-[32px] font-bold text-brand-700 mt-3">{rp(e.data.total_rupiah)}</p>
            <div className="grid gap-3 md:grid-cols-3 mt-4">
              {Object.values(e.data.komponen).map((k) => <div key={k.label} className="rounded-xl bg-canvas p-4"><p className="text-xs font-semibold text-brand-700">{k.label}</p><p className="text-xl font-bold text-brand-700 my-1">{rp(k.rupiah)}</p><p className="text-xs text-muted">{fmtNum(k.jumlah, 1)} {k.satuan}</p></div>)}
            </div>
            <p className="text-xs text-warn mt-4">{e.data.asumsi.catatan} Harga karbon: {rp(e.data.asumsi.harga_karbon_per_ton)}/ton.</p>
          </>
        )}
      </Card>
    </div>
  );
}

function Jadwal() {
  const toast = useToast();
  const list = useAsync(() => engine.followUps(), []);
  const [f, setF] = useState({ kind: "jadwal_penjemputan", judul: "", tanggal: "", target_kg: "" });
  async function tambah() {
    try { await engine.addFollowUp({ ...f, tanggal: f.tanggal || null, target_kg: f.target_kg || null }); setF({ ...f, judul: "" }); list.reload({ silent: true }); toast.success("Ditambahkan."); } catch (e) { toast.error(e.message); }
  }
  async function status(a, s) { try { await engine.setFollowUp(a.id, { status: s }); list.reload({ silent: true }); } catch (e) { toast.error(e.message); } }
  return (
    <div className="space-y-5">
      <Card className="p-5"><CardTitle>Tambah jadwal / program</CardTitle>
        <div className="grid gap-3 md:grid-cols-[200px_1fr_160px_130px_auto] items-end mt-3">
          <Field label="Jenis"><Select value={f.kind} onChange={(e) => setF({ ...f, kind: e.target.value })}><option value="jadwal_penjemputan">Jadwal penjemputan</option><option value="pemilahan_mandiri">Pemilahan mandiri</option></Select></Field>
          <Field label="Judul"><Input value={f.judul} onChange={(e) => setF({ ...f, judul: e.target.value })} placeholder="mis. Penjemputan organik pasar" /></Field>
          <Field label="Tanggal"><Input type="date" value={f.tanggal} onChange={(e) => setF({ ...f, tanggal: e.target.value })} /></Field>
          <Field label="Target (kg)"><Input type="number" min="0" value={f.target_kg} onChange={(e) => setF({ ...f, target_kg: e.target.value })} /></Field>
          <Button disabled={!f.judul} onClick={tambah}>Tambah</Button>
        </div>
      </Card>
      <Card className="p-5"><CardTitle>Jadwal penjemputan sampah & pemilahan sampah mandiri</CardTitle>
        {list.loading && !list.data ? <Skeleton className="h-32 mt-3" /> : (list.data ?? []).length === 0 ? <EmptyState title="Belum ada jadwal" message="Muncul otomatis saat usulan sampah/pangan disetujui." /> : (
          <ul className="divide-y divide-brand-200 mt-2">{list.data.map((a) => (
            <li key={a.id} className="py-3 flex flex-wrap items-center justify-between gap-3">
              <div><p className="font-semibold text-sm text-brand-700">{a.judul}</p><p className="text-xs text-muted">{a.kind === "jadwal_penjemputan" ? "Penjemputan" : "Pemilahan mandiri"} · {a.tanggal ?? "tanpa tanggal"}{a.jam ? ` · ${a.jam}` : ""}{a.target_kg ? ` · target ${fmtNum(a.target_kg, 1)} kg` : ""}</p></div>
              <div className="flex items-center gap-2"><Badge tone={STATUS_TONE[a.status]}>{a.status}</Badge>{a.status !== "selesai" && a.status !== "batal" && <Button size="sm" variant="soft" onClick={() => status(a, "selesai")}>Tandai selesai</Button>}</div>
            </li>))}</ul>
        )}
      </Card>
    </div>
  );
}

const ASAL = { sensor: ["Sensor nyata", "ok"], api: ["API", "info"], seder: ["Seder (data pengganti)", "warn"], survei: ["Survei", "ok"], aplikasi: ["Aplikasi warga", "ok"], timbangan: ["Timbangan", "ok"], kalender: ["Kalender", "ok"], kosong: ["Belum ada data", "danger"] };

function Sumber() {
  const toast = useToast();
  const s = useAsync(() => engine.sumber(), []);
  const [busy, setBusy] = useState(false);
  async function hitung() {
    setBusy(true);
    try { const r = await engine.recompute(); toast.success(`Open-Meteo ${r.open_meteo_baris} bacaan · ${r.baris_dihitung} baris dihitung.`); s.reload({ silent: true }); } catch (e) { toast.error(e.message); } finally { setBusy(false); }
  }
  return (
    <Card className="p-5"><CardTitle right={<Button icon={RefreshCw} loading={busy} onClick={hitung}>Tarik & hitung sekarang</Button>}>Sumber data → Database per jam</CardTitle>
      {s.loading && !s.data ? <Skeleton className="h-48 mt-3" /> : s.error ? <ErrorState error={s.error} onRetry={s.reload} compact /> : (
        <>
          <ul className="divide-y divide-brand-200 mt-2">{s.data.data.map((r) => { const [label, tone] = ASAL[r.asal] ?? ["—", "muted"]; return (
            <li key={r.kunci} className="py-3 flex items-center justify-between gap-3"><div><p className="font-semibold text-sm text-brand-700">{r.nama}</p><p className="text-xs text-muted">{r.jumlah != null ? `${fmtNum(r.jumlah)} data` : ""}{r.terakhir ? ` · terakhir ${formatTanggalJam(r.terakhir)}` : ""}</p></div><Badge tone={tone}>{label}</Badge></li>); })}</ul>
          <p className="text-xs text-muted mt-3">{fmtNum(s.data.baris_per_jam)} baris di Database per jam{s.data.jam_terakhir ? ` · jam terakhir ${formatTanggalJam(s.data.jam_terakhir)}` : ""}. Data bertanda “Seder” akan tergantikan otomatis saat sensor nyata mengirim.</p>
        </>
      )}
    </Card>
  );
}
