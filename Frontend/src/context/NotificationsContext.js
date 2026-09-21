"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { apiRequest, markNotificationAsRead } from "@/lib/api";

const NotificationsContext = createContext();

export function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // load the notifications, and load them again every minute
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const data = await apiRequest("/notifications");
        setNotifications(data.notifications || []);
        setError("");
      } catch (err) {
        setError(err.message || "Failed to load notifications");
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();

    const timer = setInterval(loadNotifications, 60000);
    return () => clearInterval(timer);
  }, []);

  const markAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);

      setNotifications((current) =>
        current.map((item) =>
          item._id === id ? { ...item, read: true } : item,
        ),
      );
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiRequest("/notifications/read-all", { method: "PATCH" });

      setNotifications((current) =>
        current.map((item) => ({ ...item, read: true })),
      );
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
    }
  };

  const unreadCount = notifications.filter((item) => !item.read).length;

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        error,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationsContext);
}
