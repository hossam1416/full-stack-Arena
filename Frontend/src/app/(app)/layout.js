import ProtectedRoute from "../../components/auth/ProtectedRoute";
import AppHeader from "../../components/layout/AppHeader";
import { NotificationsProvider } from "@/context/NotificationsContext";

export default function AppLayout({ children }) {
  return (
    <ProtectedRoute>
      <NotificationsProvider>
        <AppHeader />
        <main>{children}</main>
      </NotificationsProvider>
    </ProtectedRoute>
  );
}
