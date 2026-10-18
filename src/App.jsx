import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import MonitoringPage from "./pages/MonitoringPage";
import SmartGreenRoutePage from "./pages/SmartGreenRoutePage";
import FestivalPage from "./pages/FestivalPage";
import SensorIotPage from "./pages/SensorIotPage";
import MoodPage from "./pages/MoodPage";
import GeofencingPage from "./pages/GeofencingPage";
import ReportsPage from "./pages/ReportsPage";
import UsersPage from "./pages/UsersPage";
import NotificationsPage from "./pages/NotificationsPage";
import SettingsPage from "./pages/SettingsPage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="monitoring" element={<MonitoringPage />} />
        <Route path="smart-green-route" element={<SmartGreenRoutePage />} />
        <Route path="kalender-festival" element={<FestivalPage />} />
        <Route path="sensor-iot" element={<SensorIotPage />} />
        <Route path="mood-wellbeing" element={<MoodPage />} />
        <Route path="geofencing" element={<GeofencingPage />} />
        <Route path="laporan" element={<ReportsPage />} />
        <Route path="pengguna" element={<UsersPage />} />
        <Route path="notifikasi" element={<NotificationsPage />} />
        <Route path="pengaturan" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
