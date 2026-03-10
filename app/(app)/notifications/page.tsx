"use client";

import { useEffect, useState } from "react";
import type { Notification } from "@/types";
import { formatRelativeTime } from "@/lib/utils";
import { Bell, AlertCircle, Sparkles, Calendar, CreditCard, ChevronRight, Loader2 } from "lucide-react";

const TYPE_CONFIG: Record<
  string,
  { icon: React.ReactNode; color: string; label: string }
> = {
  "expiring-credit": {
    icon: <AlertCircle className="w-4 h-4" />,
    color: "text-red-500 bg-red-50",
    label: "Expiring",
  },
  "card-recommendation": {
    icon: <Sparkles className="w-4 h-4" />,
    color: "text-brand-600 bg-brand-50",
    label: "Tip",
  },
  "weekly-digest": {
    icon: <Bell className="w-4 h-4" />,
    color: "text-gray-500 bg-gray-100",
    label: "Digest",
  },
  "category-activation": {
    icon: <Calendar className="w-4 h-4" />,
    color: "text-yellow-600 bg-yellow-50",
    label: "Action",
  },
  "annual-fee": {
    icon: <CreditCard className="w-4 h-4" />,
    color: "text-purple-600 bg-purple-50",
    label: "Annual Fee",
  },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  useEffect(() => {
    fetch("/api/notifications")
      .then((r) => r.json())
      .then(({ notifications: n }) => {
        setNotifications(n ?? []);
        setLoading(false);
      });
  }, []);

  function markRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, readAt: new Date().toISOString() } : n))
    );
    fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  }

  const unreadCount = notifications.filter((n) => !n.readAt).length;
  const types = ["all", "expiring-credit", "card-recommendation", "weekly-digest", "category-activation", "annual-fee"];

  const displayed =
    activeFilter === "all"
      ? notifications
      : notifications.filter((n) => n.type === activeFilter);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() =>
              setNotifications((prev) =>
                prev.map((n) => ({ ...n, readAt: n.readAt ?? new Date().toISOString() }))
              )
            }
            className="btn-secondary text-xs"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {types.map((type) => {
          const count = type === "all"
            ? notifications.length
            : notifications.filter((n) => n.type === type).length;
          if (count === 0 && type !== "all") return null;
          return (
            <button
              key={type}
              onClick={() => setActiveFilter(type)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium capitalize transition-colors ${
                activeFilter === type
                  ? "bg-brand-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {type === "all" ? "All" : TYPE_CONFIG[type]?.label ?? type} {count > 0 && `(${count})`}
            </button>
          );
        })}
      </div>

      {/* Notifications list */}
      <div className="space-y-3">
        {displayed.length === 0 && (
          <div className="card text-center py-12 text-gray-400 text-sm">
            No notifications in this category.
          </div>
        )}
        {displayed.map((notif) => {
          const config = TYPE_CONFIG[notif.type] ?? TYPE_CONFIG["weekly-digest"];
          const isUnread = !notif.readAt;

          return (
            <div
              key={notif.id}
              className={`card cursor-pointer hover:shadow-md transition-shadow ${
                isUnread ? "border-brand-200 border" : ""
              }`}
              onClick={() => markRead(notif.id)}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${config.color}`}>
                  {config.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className={`text-sm font-semibold ${isUnread ? "text-gray-900" : "text-gray-700"}`}>
                      {notif.title}
                    </p>
                    {isUnread && (
                      <span className="w-1.5 h-1.5 bg-brand-600 rounded-full shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">{notif.body}</p>
                  <p className="text-xs text-gray-400 mt-1.5">{formatRelativeTime(notif.createdAt)}</p>
                </div>

                <ChevronRight className="w-4 h-4 text-gray-300 shrink-0 mt-1" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
