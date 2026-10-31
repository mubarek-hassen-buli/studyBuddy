"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bell,
  Flame,
  Brain,
  Clock,
  Sparkles,
  Check,
  CheckCheck,
  X,
  Settings as SettingsIcon,
} from "lucide-react";

export interface NotificationItem {
  id: string;
  category: "studyReminders" | "quizResults" | "streakMilestones" | "newFeatures";
  title: string;
  description: string;
  time: string;
  icon: React.ElementType;
}

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-streak",
    category: "streakMilestones",
    title: "3-Day Study Streak! 🔥",
    description: "You're building unstoppable momentum. Keep studying daily!",
    time: "15m ago",
    icon: Flame,
  },
  {
    id: "notif-quiz",
    category: "quizResults",
    title: "Quiz Completed: Cell Biology",
    description: "Great result! You achieved 92% mastery on your recent quiz.",
    time: "2h ago",
    icon: Brain,
  },
  {
    id: "notif-reminder",
    category: "studyReminders",
    title: "Daily Study Session Reminder",
    description: "Your scheduled study session starts today at 7:00 PM.",
    time: "5h ago",
    icon: Clock,
  },
  {
    id: "notif-feature",
    category: "newFeatures",
    title: "Desk Themes & Accents Live",
    description: "You can now customize Folio's accent color across all pages.",
    time: "1d ago",
    icon: Sparkles,
  },
];

export function NotificationBell() {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Preference toggles
  const [preferences, setPreferences] = React.useState({
    studyReminders: true,
    quizResults: true,
    streakMilestones: true,
    newFeatures: true,
  });

  // Track read IDs
  const [readIds, setReadIds] = React.useState<string[]>([]);
  // Dismissed IDs
  const [dismissedIds, setDismissedIds] = React.useState<string[]>([]);

  // Load preferences and read IDs on mount
  React.useEffect(() => {
    try {
      const savedPrefs = localStorage.getItem("folio-notifications");
      if (savedPrefs) {
        setPreferences(JSON.parse(savedPrefs));
      }

      const savedRead = localStorage.getItem("folio-read-notifications");
      if (savedRead) {
        setReadIds(JSON.parse(savedRead));
      }

      const savedDismissed = localStorage.getItem("folio-dismissed-notifications");
      if (savedDismissed) {
        setDismissedIds(JSON.parse(savedDismissed));
      }
    } catch {
      // Ignore parse error
    }

    // Listen for preference updates from Settings page
    const handlePrefsChange = (e: CustomEvent<typeof preferences>) => {
      if (e.detail) {
        setPreferences(e.detail);
      }
    };

    window.addEventListener(
      "folio-notifications-changed",
      handlePrefsChange as EventListener
    );

    return () => {
      window.removeEventListener(
        "folio-notifications-changed",
        handlePrefsChange as EventListener
      );
    };
  }, []);

  // Close when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Active notifications filtered by user preferences & dismissals
  const activeNotifications = React.useMemo(() => {
    return DEFAULT_NOTIFICATIONS.filter((item) => {
      if (dismissedIds.includes(item.id)) return false;
      return preferences[item.category];
    });
  }, [preferences, dismissedIds]);

  const unreadCount = React.useMemo(() => {
    return activeNotifications.filter((item) => !readIds.includes(item.id)).length;
  }, [activeNotifications, readIds]);

  const markAllAsRead = () => {
    const allIds = activeNotifications.map((n) => n.id);
    const updated = Array.from(new Set([...readIds, ...allIds]));
    setReadIds(updated);
    try {
      localStorage.setItem("folio-read-notifications", JSON.stringify(updated));
    } catch {}
  };

  const markSingleAsRead = (id: string) => {
    if (!readIds.includes(id)) {
      const updated = [...readIds, id];
      setReadIds(updated);
      try {
        localStorage.setItem("folio-read-notifications", JSON.stringify(updated));
      } catch {}
    }
  };

  const dismissNotification = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = [...dismissedIds, id];
    setDismissedIds(updated);
    try {
      localStorage.setItem(
        "folio-dismissed-notifications",
        JSON.stringify(updated)
      );
    } catch {}
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative h-9 w-9 rounded-full hover:bg-slate-200/50 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
        title="Notifications"
        aria-label="Open notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500 border-2 border-white" />
          </span>
        )}
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-[#E5EAE7] shadow-xl z-50 overflow-hidden font-sans animate-in fade-in-0 zoom-in-95 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-[#FAFCFB]">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-slate-900 tracking-tight">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#E8F2EC] text-[#0D382B] text-[10px] font-bold">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-[11px] font-semibold text-[#0D382B] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[340px] overflow-y-auto divide-y divide-slate-100">
            {activeNotifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2">
                  <Check className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-700">All caught up!</p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-[200px] mx-auto">
                  No active notifications. You can adjust your preferences in Settings.
                </p>
              </div>
            ) : (
              activeNotifications.map((notif) => {
                const Icon = notif.icon;
                const isRead = readIds.includes(notif.id);
                return (
                  <div
                    key={notif.id}
                    onClick={() => markSingleAsRead(notif.id)}
                    className={`flex items-start gap-3 p-3.5 transition-colors cursor-pointer group ${
                      isRead ? "bg-white hover:bg-slate-50/70" : "bg-[#F7FAF8] hover:bg-[#EEF5F1]"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        isRead
                          ? "bg-slate-100 text-slate-500"
                          : "bg-[#E8F2EC] text-[#0D382B]"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p
                          className={`text-xs truncate ${
                            isRead ? "font-semibold text-slate-700" : "font-bold text-slate-900"
                          }`}
                        >
                          {notif.title}
                        </p>
                        <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                          {notif.time}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-0.5 line-clamp-2">
                        {notif.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => dismissNotification(e, notif.id)}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-600 transition-opacity p-0.5 cursor-pointer"
                      title="Dismiss"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 bg-[#FAFCFB] border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-medium">Folio Notifications</span>
            <Link
              href="/dashboard/settings"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center gap-1 font-semibold text-[#0D382B] hover:underline"
            >
              <SettingsIcon className="w-3 h-3" />
              <span>Settings</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

