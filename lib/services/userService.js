import { USE_LARAVEL_API } from "@/lib/config";
import { fetchLaravelAdmin } from "@/lib/laravelClient";
import { userListAdmin } from "@/lib/data/mockAdminData";

export async function getUsers({ q = "", status = "", page = 1, perPage = 5 } = {}) {
  if (USE_LARAVEL_API) {
    const params = new URLSearchParams({ per_page: String(perPage), page: String(page) });
    if (q) params.set("q", q);
    if (status) params.set("status", status);

    const json = await fetchLaravelAdmin(`/admin/users?${params.toString()}`);
    return {
      users: json.data,
      total: json.total,
      aktif: json.aktif,
      nonaktif: json.nonaktif,
      baru7Hari: json.baru_7_hari,
      filteredTotal: json.filtered_total,
      page: json.page,
      lastPage: json.last_page,
    };
  }

  return {
    users: userListAdmin, total: 8245, aktif: 2145, baru7Hari: 324, nonaktif: 125,
    filteredTotal: userListAdmin.length, page: 1, lastPage: 1,
  };
}
