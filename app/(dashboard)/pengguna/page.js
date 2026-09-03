import AdminShell from "@/components/layout/AdminShell";
import AdminCard from "@/components/ui/AdminCard";
import StatCard from "@/components/ui/StatCard";
import StatusPill from "@/components/ui/StatusPill";
import { getUsers } from "@/lib/services/userService";
import { Search, Plus, Eye, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PenggunaPage() {
  const { users, total, aktif, baru7Hari, nonaktif } = await getUsers();

  return (
    <AdminShell
      title="Pengguna"
      badge="Semua User"
      description="Manajemen akun pengguna, verifikasi peran, dan pemantauan keaktifan masyarakat Svarga."
      actions={
        <>
          <span className="text-sm bg-white border border-canopy-800/10 rounded-full px-4 py-2 text-ink-700">Banyuwangi Mandiri</span>
          <span className="text-sm bg-white border border-canopy-800/10 rounded-full px-4 py-2 text-ink-700 flex items-center gap-1.5">
            <Search size={13} /> Cari pengguna...
          </span>
          <button className="text-sm bg-canopy-700 text-sand-50 rounded-full px-4 py-2 flex items-center gap-1.5">
            <Plus size={14} /> Tambah Pengguna
          </button>
        </>
      }
    >
      <div className="grid grid-cols-4 gap-4">
        <StatCard icon="Users" label="Total Pengguna" value={total.toLocaleString("id-ID")} badge="+124" badgeTone="info" note="Total terdaftar dalam sistem" />
        <StatCard icon="Activity" label="Pengguna Aktif" value={aktif.toLocaleString("id-ID")} badge={`${Math.round((aktif / total) * 100)}%`} badgeTone="info" note="Aktif beraktivitas hari ini" />
        <StatCard icon="UserPlus" label="Pengguna Baru (7 Hari)" value={baru7Hari} badge="+18%" badgeTone="info" note="Pendaftaran seminggu terakhir" />
        <StatCard icon="UserX" label="Pengguna NonAktif" value={nonaktif} badge="1.5%" badgeTone="danger" note="Akun dinonaktifkan sementara" />
      </div>

      <AdminCard title="Daftar Akun Pengguna Svarga" className="mt-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-ink-500 uppercase border-b border-canopy-800/10">
              <th className="pb-2.5 font-medium">Nama</th>
              <th className="pb-2.5 font-medium">Email</th>
              <th className="pb-2.5 font-medium">Peran</th>
              <th className="pb-2.5 font-medium">Status</th>
              <th className="pb-2.5 font-medium">Bergabung</th>
              <th className="pb-2.5 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-canopy-800/5 last:border-0">
                <td className="py-3">
                  <div className="flex items-center gap-2.5">
                    <span className="h-7 w-7 rounded-full bg-canopy-100 text-canopy-700 flex items-center justify-center text-xs font-medium">
                      {u.nama.charAt(0)}
                    </span>
                    <span className="font-medium text-canopy-700">{u.nama}</span>
                  </div>
                </td>
                <td className="py-3 text-ink-700">{u.email}</td>
                <td className="py-3 text-ink-700">{u.peran}</td>
                <td className="py-3"><StatusPill>{u.status}</StatusPill></td>
                <td className="py-3 text-ink-500">{u.bergabung}</td>
                <td className="py-3 flex items-center gap-2.5 text-canopy-700">
                  <Eye size={15} /><Pencil size={14} /><Trash2 size={14} className="text-alert-600" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between mt-4 text-sm text-ink-500">
          <span>Menampilkan 1-{users.length} dari {total.toLocaleString("id-ID")} pengguna</span>
          <div className="flex items-center gap-1.5">
            <button className="h-8 w-8 rounded-lg border border-canopy-800/10 flex items-center justify-center"><ChevronLeft size={14} /></button>
            <button className="h-8 w-8 rounded-lg bg-canopy-700 text-sand-50">1</button>
            <button className="h-8 w-8 rounded-lg border border-canopy-800/10">2</button>
            <button className="h-8 w-8 rounded-lg border border-canopy-800/10 flex items-center justify-center"><ChevronRight size={14} /></button>
          </div>
        </div>
      </AdminCard>
    </AdminShell>
  );
}
