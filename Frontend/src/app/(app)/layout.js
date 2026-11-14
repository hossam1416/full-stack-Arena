import ProtectedRoute from "../../components/auth/ProtectedRoute";
import AppHeader from "../../components/layout/AppHeader";
import { NotificationsProvider } from "@/context/NotificationsContext";

import "../arena-background.css";

export default function AppLayout({ children }) {
  return (
    <ProtectedRoute>
      <NotificationsProvider>
        <div className="arena-background">
          <AppHeader />
          <main>{children}</main>
        </div>
      </NotificationsProvider>
    </ProtectedRoute>
  );
}
