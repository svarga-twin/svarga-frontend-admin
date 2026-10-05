// Whitelist resource yang boleh dimutasi dari browser lewat
// app/api/admin/proxy/* — mencegah route ini dipakai untuk meneruskan
// request ke endpoint Laravel sembarangan.
export const ADMIN_RESOURCES = {
  users: "/admin/users",
  geofences: "/geofences",
  festivals: "/festivals",
};
