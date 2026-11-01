"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  User,
  Palette,
  Bell,
  ShieldCheck,
  Camera,
  Pencil,
  Calendar,
  Lock,
  Trash2,
  ChevronRight,
  BookOpen,
  Check,
  Sparkles,
  ShieldAlert,
  Eye,
  EyeOff,
  UploadCloud,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { authClient } from "@/lib/auth-client";
import { api } from "@/lib/api/client";
import { useAccentStore, ACCENT_THEMES } from "@/store/accent-store";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

// Navigation tabs in left sidebar (filtered as requested)
type SettingsTabId = "account" | "appearance" | "notifications" | "privacy";

interface NavTabItem {
  id: SettingsTabId;
  label: string;
  icon: React.ElementType;
}

const navTabs: NavTabItem[] = [
  { id: "account", label: "Account", icon: User },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "privacy", label: "Privacy & Security", icon: ShieldCheck },
];

export default function SettingsPage() {
  const { user, checkSession } = useAuthStore();
  const { accent: selectedAccent, setAccent } = useAccentStore();

  // Active Tab
  const [activeTab, setActiveTab] = React.useState<SettingsTabId>("account");

  // Account Information State
  const [fullName, setFullName] = React.useState(user?.name || "Mubarek Hassen");
  const [emailAddress, setEmailAddress] = React.useState(user?.email || "mubid@gmail.com");
  const [username, setUsername] = React.useState(
    user?.email ? `@${user.email.split("@")[0]}` : "@mubid"
  );
  const [, setIsSavingProfile] = React.useState(false);

  // Sync when user loads
  React.useEffect(() => {
    if (user?.name) setFullName(user.name);
    if (user?.email) {
      setEmailAddress(user.email);
      setUsername(`@${user.email.split("@")[0]}`);
    }
  }, [user]);

  // Clean up any residual dark mode class
  React.useEffect(() => {
    try {
      localStorage.removeItem("folio-theme");
      document.documentElement.classList.remove("dark");
    } catch {}
  }, []);

  // Notifications Toggle State
  const [notifications, setNotifications] = React.useState({
    studyReminders: true,
    quizResults: true,
    streakMilestones: true,
    newFeatures: true,
  });

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("folio-notifications");
      if (saved) {
        setNotifications(JSON.parse(saved));
      }
    } catch {}
  }, []);

  const handleSaveNotifications = async () => {
    try {
      localStorage.setItem("folio-notifications", JSON.stringify(notifications));
      window.dispatchEvent(
        new CustomEvent("folio-notifications-changed", { detail: notifications })
      );

      // Request browser notification permission if available and not denied
      if (typeof window !== "undefined" && "Notification" in window) {
        if (Notification.permission === "default") {
          await Notification.requestPermission();
        }
      }
      toast.success("Notification preferences saved successfully!");
    } catch {
      toast.error("Failed to save notification preferences.");
    }
  };

  // Modal dialog states
  const [passwordModalOpen, setPasswordModalOpen] = React.useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [photoModalOpen, setPhotoModalOpen] = React.useState(false);

  // Avatar upload states
  const [avatarFile, setAvatarFile] = React.useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = React.useState(false);
  const [isRemovingAvatar, setIsRemovingAvatar] = React.useState(false);

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPEG, PNG, or WEBP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Avatar image must be under 5MB");
      return;
    }

    setAvatarFile(file);
    const objectUrl = URL.createObjectURL(file);
    setAvatarPreview(objectUrl);
  };

  const handleUploadAvatar = async () => {
    if (!avatarFile) {
      toast.error("Please select an image file first");
      return;
    }

    setIsUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append("avatar", avatarFile);
      const res = await api.upload("/user/avatar", formData);

      if (res?.imageUrl) {
        await checkSession();
        toast.success("Profile photo updated successfully!");
        setPhotoModalOpen(false);
        setAvatarFile(null);
        if (avatarPreview) {
          URL.revokeObjectURL(avatarPreview);
          setAvatarPreview(null);
        }
      } else {
        toast.error("Failed to update profile photo");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Failed to upload avatar");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = async () => {
    setIsRemovingAvatar(true);
    try {
      await api.delete("/user/avatar");
      await checkSession();
      toast.success("Profile photo removed successfully");
      setPhotoModalOpen(false);
      setAvatarFile(null);
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
        setAvatarPreview(null);
      }
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Failed to remove avatar");
    } finally {
      setIsRemovingAvatar(false);
    }
  };

  // Password fields & status
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isChangingPassword, setIsChangingPassword] = React.useState(false);

  // References for scrolling
  const appearanceRef = React.useRef<HTMLDivElement>(null);
  const notificationsRef = React.useRef<HTMLDivElement>(null);

  // Handle Tab Click
  const handleTabClick = (tabId: SettingsTabId) => {
    setActiveTab(tabId);
    if (tabId === "appearance") {
      appearanceRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    } else if (tabId === "notifications") {
      notificationsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    } else if (tabId === "privacy") {
      setPasswordModalOpen(true);
    }
  };

  // Save profile updates
  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    try {
      await authClient.updateUser({ name: fullName });
      try {
        await api.patch("/user/profile", { name: fullName });
      } catch (e) {
        console.warn("Backend profile sync note:", e);
      }
      await checkSession();
      toast.success("Account information saved successfully!");
    } catch {
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Real Password Change Handler
  const handleChangePassword = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!currentPassword) {
      toast.error("Please enter your current password.");
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long.");
      return;
    }
    if (confirmPassword && newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    if (currentPassword === newPassword) {
      toast.error("New password must be different from current password.");
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await authClient.changePassword({
        newPassword,
        currentPassword,
        revokeOtherSessions: true,
      });

      if (res?.error) {
        toast.error(
          res.error.message || "Failed to update password. Please check your current password."
        );
      } else {
        toast.success("Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setPasswordModalOpen(false);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update password.";
      toast.error(message);
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Format date helper
  const formattedMemberSince = React.useMemo(() => {
    if (user?.createdAt) {
      try {
        const d = new Date(user.createdAt);
        return d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      } catch {
        return "Oct 12, 2026";
      }
    }
    return "Oct 12, 2026";
  }, [user?.createdAt]);

  const initialLetter = (fullName?.trim()?.charAt(0) || "M").toUpperCase();

  return (
    <div className="space-y-6 sm:space-y-8 pb-16 font-sans">
      {/* 1. TOP HERO SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-1">
        {/* Left: Settings Title & Description */}
        <div className="max-w-xl">
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-slate-400 mb-1.5 block">
            SETTINGS
          </span>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#11231B] leading-[1.12] tracking-tight">
            Make Folio feel<br />
            just right for you.
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed max-w-md mt-2">
            Customize your experience, manage your account, and set up how you learn best.
          </p>
        </div>

        {/* Right: Folio Quote & Engraving Statue */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8 mr-2 xl:mr-8 select-none">
          <div className="text-right">
            <p className="font-handwriting text-2xl xl:text-3xl text-[#1B4332] leading-tight -rotate-3 select-none">
              &ldquo; Better settings.<br />
              Smoother learning. &rdquo;
            </p>
            <p className="font-handwriting text-base xl:text-lg text-slate-400 mt-1 -rotate-3 select-none">
              — Folio
            </p>
          </div>

          <div className="relative w-36 h-40 xl:w-44 xl:h-48 shrink-0 pointer-events-none">
            <Image
              src="/images/folio.png"
              alt="Folio Statue"
              fill
              className="object-contain object-bottom drop-shadow-xs"
              priority
            />
          </div>
        </div>
      </div>

      {/* 2. MAIN 2-COLUMN LAYOUT: LEFT NAV + RIGHT CONTENT */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* LEFT COLUMN: Section Navigation Tabs */}
        <aside className="w-full lg:w-[220px] xl:w-[235px] shrink-0">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabClick(tab.id)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm transition-all whitespace-nowrap text-left w-full cursor-pointer ${
                    isActive
                      ? "bg-[#E8F2EC] text-[#0D382B] font-bold shadow-2xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/80 font-medium"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? "text-[#0D382B]" : "text-slate-400"
                    }`}
                  />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* RIGHT COLUMN: Settings Content Cards */}
        <div className="flex-1 min-w-0 w-full space-y-5">
          {/* ROW 1: Account Information (Left ~60%) + Quick Actions (Right ~40%) */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
            {/* Card 1: Account Information */}
            <div className="xl:col-span-7 bg-white rounded-2xl border border-[#E5EAE7] p-5 sm:p-6 shadow-2xs space-y-5 flex flex-col justify-between">
              <div>
                {/* Header: Title + Change Photo Button */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 tracking-tight">
                      Account Information
                    </h3>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                      Manage your personal details and account settings.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setPhotoModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-all shadow-2xs shrink-0 cursor-pointer active:scale-95"
                  >
                    <Camera className="w-3.5 h-3.5 text-slate-500" />
                    <span>Change Photo</span>
                  </button>
                </div>

                {/* Avatar with Edit Badge */}
                <div className="mb-4">
                  <div className="relative inline-block">
                    {user?.image ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={user.image}
                        alt={fullName}
                        className="w-14 h-14 rounded-full object-cover border-2 border-[#0D382B]/20 shadow-xs"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-[#11231B] text-white flex items-center justify-center font-bold text-xl shadow-xs select-none">
                        {initialLetter}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => setPhotoModalOpen(true)}
                      className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
                      title="Edit photo"
                    >
                      <Pencil className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>

                {/* 3 Input Fields: Full Name, Email Address, Username */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Full Name */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 mb-1 block">
                      Full Name
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        onBlur={handleSaveProfile}
                        className="w-full pr-7 py-2 px-3 text-xs font-semibold text-slate-800 bg-white rounded-xl border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0D382B] focus:border-[#0D382B] transition-all"
                      />
                      <Pencil className="absolute right-2.5 w-3 h-3 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 mb-1 block">
                      Email Address
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type="email"
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                        className="w-full pr-7 py-2 px-3 text-xs font-semibold text-slate-800 bg-white rounded-xl border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0D382B] focus:border-[#0D382B] transition-all"
                      />
                      <Pencil className="absolute right-2.5 w-3 h-3 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Username */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 mb-1 block">
                      Username
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full pr-7 py-2 px-3 text-xs font-semibold text-slate-800 bg-white rounded-xl border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0D382B] focus:border-[#0D382B] transition-all"
                      />
                      <Pencil className="absolute right-2.5 w-3 h-3 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Meta Row: Account Type & Member Since */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-2">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Account Type
                  </span>
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full bg-[#E8F2EC] text-[#0D382B] text-xs font-bold">
                    Student
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Member Since
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-slate-700 font-semibold">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {formattedMemberSince}
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: Quick Actions (Filtered to Change Password & Delete Account) */}
            <div className="xl:col-span-5 bg-white rounded-2xl border border-[#E5EAE7] p-5 sm:p-6 shadow-2xs space-y-3.5 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 tracking-tight">
                  Quick Actions
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  Shortcuts to help you get things done.
                </p>
              </div>

              {/* Action Rows */}
              <div className="space-y-2.5 my-auto">
                {/* 1. Change Password */}
                <button
                  type="button"
                  onClick={() => setPasswordModalOpen(true)}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/70 transition-all text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[#E8F2EC] text-[#0D382B] flex items-center justify-center shrink-0">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 group-hover:text-[#0D382B] transition-colors">
                        Change Password
                      </p>
                      <p className="text-[11px] text-slate-400 font-medium truncate">
                        Keep your account secure
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>

                {/* 2. Delete Account */}
                <button
                  type="button"
                  onClick={() => setDeleteModalOpen(true)}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-rose-100 hover:bg-rose-50/40 transition-all text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[#E8F2EC] text-[#0D382B] group-hover:bg-rose-50 group-hover:text-rose-600 flex items-center justify-center shrink-0 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                        Delete Account
                      </p>
                      <p className="text-[11px] text-slate-400 font-medium truncate">
                        Permanently remove your account
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-rose-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>
              </div>

              <div className="pt-2 text-[11px] text-slate-400 text-center font-medium">
                Folio Security & Privacy Center
              </div>
            </div>
          </div>

          {/* ROW 2: 3 CARDS (Appearance, Notifications, Folio Showcase) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
            {/* CARD 1: Appearance (Global Accent Color Selection) */}
            <div
              ref={appearanceRef}
              className="bg-white rounded-2xl border border-[#E5EAE7] p-5 shadow-2xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-md bg-[#E8F2EC] text-[#0D382B] flex items-center justify-center shrink-0">
                    <Palette className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">
                    Appearance
                  </h4>
                </div>
                <p className="text-xs text-slate-400 font-medium pl-8">
                  Customize your accent color across all Folio pages.
                </p>

                {/* Accent Color Selection (Global Across App) */}
                <div className="space-y-3 pt-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-600">
                      Accent Color
                    </label>
                    <span className="text-[11px] font-semibold text-[#0D382B] bg-[#E8F2EC] px-2 py-0.5 rounded-full capitalize">
                      {ACCENT_THEMES.find((c) => c.id === selectedAccent)?.label || "Folio Forest"}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-snug">
                    Select a theme palette for buttons, badges, highlights, and navigation.
                  </p>

                  <div className="flex items-center justify-between gap-1.5 pt-1">
                    {ACCENT_THEMES.map((color) => {
                      const isSelected = selectedAccent === color.id;
                      return (
                        <button
                          key={color.id}
                          type="button"
                          onClick={() => {
                            setAccent(color.id);
                            toast.success(`Accent color updated to ${color.label}!`);
                          }}
                          style={{ backgroundColor: color.bg }}
                          title={color.label}
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                            isSelected
                              ? "ring-2 ring-offset-2 ring-[#0D382B] scale-110 shadow-xs"
                              : "hover:scale-105 opacity-90"
                          }`}
                        >
                          {isSelected && <Check className="w-4 h-4 text-white stroke-[3]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Bottom Action: Update Appearance */}
              <button
                type="button"
                onClick={() => {
                  toast.success("Appearance settings updated!");
                }}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#0D382B] hover:bg-[#07251C] text-white text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer mt-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Update Appearance</span>
              </button>
            </div>

            {/* CARD 2: Notifications */}
            <div
              ref={notificationsRef}
              className="bg-white rounded-2xl border border-[#E5EAE7] p-5 shadow-2xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-md bg-[#E8F2EC] text-[#0D382B] flex items-center justify-center shrink-0">
                    <Bell className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">
                    Notifications
                  </h4>
                </div>
                <p className="text-xs text-slate-400 font-medium pl-8">
                  Choose what you want to be notified about.
                </p>

                {/* 4 Toggle Rows */}
                <div className="space-y-3 pt-3">
                  {/* 1. Study reminders */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-800 leading-tight">
                        Study reminders
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Daily study session reminders
                      </p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={notifications.studyReminders}
                      onClick={() =>
                        setNotifications((p) => ({
                          ...p,
                          studyReminders: !p.studyReminders,
                        }))
                      }
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        notifications.studyReminders ? "bg-[#0D382B]" : "bg-slate-200"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
                          notifications.studyReminders ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* 2. Quiz results */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-800 leading-tight">
                        Quiz results
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Get notified after completing quizzes
                      </p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={notifications.quizResults}
                      onClick={() =>
                        setNotifications((p) => ({
                          ...p,
                          quizResults: !p.quizResults,
                        }))
                      }
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        notifications.quizResults ? "bg-[#0D382B]" : "bg-slate-200"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
                          notifications.quizResults ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* 3. Streak milestones */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-800 leading-tight">
                        Streak milestones
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Celebrate your achievements
                      </p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={notifications.streakMilestones}
                      onClick={() =>
                        setNotifications((p) => ({
                          ...p,
                          streakMilestones: !p.streakMilestones,
                        }))
                      }
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        notifications.streakMilestones ? "bg-[#0D382B]" : "bg-slate-200"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
                          notifications.streakMilestones ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* 4. New features */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-800 leading-tight">
                        New features
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Updates and product news
                      </p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={notifications.newFeatures}
                      onClick={() =>
                        setNotifications((p) => ({
                          ...p,
                          newFeatures: !p.newFeatures,
                        }))
                      }
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        notifications.newFeatures ? "bg-[#0D382B]" : "bg-slate-200"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
                          notifications.newFeatures ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Action: Save Preferences */}
              <button
                type="button"
                onClick={handleSaveNotifications}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#0D382B] hover:bg-[#07251C] text-white text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer mt-2"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Preferences</span>
              </button>
            </div>

            {/* CARD 3: Folio Quote Showcase Card */}
            <div className="relative overflow-hidden rounded-2xl bg-[#0D382B] text-white p-5 shadow-sm flex flex-col justify-between min-h-[240px]">
              {/* Top: Folio Logo */}
              <div className="relative z-10 flex items-center gap-1.5 text-white font-bold text-sm tracking-tight">
                <BookOpen className="w-4 h-4 text-emerald-200" />
                <span>Folio</span>
              </div>

              {/* Center: Quote */}
              <div className="relative z-10 my-auto py-2">
                <p className="font-handwriting text-xl sm:text-2xl text-emerald-100 leading-snug">
                  &ldquo; Small<br />
                  changes<br />
                  build big<br />
                  results. &rdquo;
                </p>
                <p className="font-handwriting text-sm text-emerald-300/80 mt-1">
                  — Folio
                </p>
              </div>

              {/* Peeking Folio Character Illustration on Bottom Right */}
              <div className="absolute -right-3 -bottom-2 w-32 h-36 opacity-95 pointer-events-none select-none z-0">
                <Image
                  src="/images/folio.png"
                  alt="Folio Peeking"
                  fill
                  className="object-contain object-bottom drop-shadow-md"
                />
              </div>

              {/* Bottom Action: Keep learning */}
              <Link
                href="/dashboard/buddies"
                className="relative z-10 w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-full bg-white text-[#0D382B] hover:bg-slate-100 text-xs font-bold transition-all shadow-xs active:scale-95 text-center cursor-pointer mt-2"
              >
                <span>Keep learning</span>
                <span className="font-bold">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 3. INTERACTIVE DIALOGS */}

      {/* Change Password Dialog */}
      <Dialog open={passwordModalOpen} onOpenChange={setPasswordModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl bg-white border border-[#E5EAE7] p-6 shadow-xl">
          <DialogHeader>
            <div className="w-10 h-10 rounded-xl bg-[#E8F2EC] text-[#0D382B] flex items-center justify-center mx-auto mb-2">
              <Lock className="w-5 h-5" />
            </div>
            <DialogTitle className="text-center text-lg font-bold text-slate-900">
              Change Your Password
            </DialogTitle>
            <DialogDescription className="text-center text-xs text-slate-500">
              Choose a strong password with at least 8 characters.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleChangePassword} className="space-y-3.5 py-2">
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">
                Current Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0D382B] transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">
                New Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={8}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0D382B] transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">
                Confirm New Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0D382B] transition-all"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="inline-flex items-center gap-1 hover:text-slate-800 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showPassword ? "Hide" : "Show"} password</span>
              </button>
            </div>

            <DialogFooter className="flex sm:justify-end gap-2 pt-2">
              <button
                type="button"
                disabled={isChangingPassword}
                onClick={() => setPasswordModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isChangingPassword}
                className="px-4 py-2 rounded-xl bg-[#0D382B] text-white text-xs font-bold hover:bg-[#07251C] transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
              >
                {isChangingPassword ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <span>Update Password</span>
                )}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl bg-white border border-rose-100 p-6 shadow-xl">
          <DialogHeader>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-2">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <DialogTitle className="text-center text-lg font-bold text-slate-900">
              Permanently Delete Account?
            </DialogTitle>
            <DialogDescription className="text-center text-xs text-slate-500 leading-relaxed">
              This action cannot be undone. All your study buddies, uploaded documents,
              flashcard decks, quizzes, and learning statistics will be removed.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex sm:justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                setDeleteModalOpen(false);
                toast.error("Account deletion requested. Support will confirm via email.");
              }}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all cursor-pointer"
            >
              Yes, Delete Account
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Photo Dialog */}
      <Dialog
        open={photoModalOpen}
        onOpenChange={(open) => {
          setPhotoModalOpen(open);
          if (!open) {
            setAvatarFile(null);
            if (avatarPreview) {
              URL.revokeObjectURL(avatarPreview);
              setAvatarPreview(null);
            }
          }
        }}
      >
        <DialogContent className="sm:max-w-md rounded-3xl bg-white border border-[#E5EAE7] p-6 shadow-xl">
          <DialogHeader>
            <div className="w-10 h-10 rounded-xl bg-[#E8F2EC] text-[#0D382B] flex items-center justify-center mx-auto mb-2">
              <Camera className="w-5 h-5" />
            </div>
            <DialogTitle className="text-center text-lg font-bold text-slate-900">
              Update Profile Avatar
            </DialogTitle>
            <DialogDescription className="text-center text-xs text-slate-500">
              Upload a clear photo to personalize your Folio account.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Current / Preview Avatar Display */}
            <div className="flex flex-col items-center justify-center">
              {avatarPreview ? (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={avatarPreview}
                    alt="Preview"
                    className="w-24 h-24 rounded-full object-cover border-3 border-[#0D382B] shadow-md"
                  />
                  <span className="absolute bottom-0 right-0 px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#0D382B] text-white">
                    New
                  </span>
                </div>
              ) : user?.image ? (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={user.image}
                    alt={fullName}
                    className="w-24 h-24 rounded-full object-cover border-2 border-slate-200 shadow-md"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-[#11231B] text-white flex items-center justify-center font-bold text-3xl shadow-md">
                  {initialLetter}
                </div>
              )}
            </div>

            {/* File Input / Dropzone */}
            <label className="border-2 border-dashed border-slate-200 hover:border-[#0D382B] rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-slate-50/50 hover:bg-slate-50">
              <UploadCloud className="w-6 h-6 text-slate-400 mb-1" />
              <span className="text-xs font-bold text-slate-700">
                {avatarFile ? avatarFile.name : "Choose an image from your computer"}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5">
                PNG, JPG, or WEBP up to 5MB
              </span>
              <input
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={handleAvatarFileChange}
                className="hidden"
              />
            </label>
          </div>

          <DialogFooter className="flex sm:justify-between items-center gap-2 pt-2 border-t border-slate-100">
            {user?.image ? (
              <button
                type="button"
                disabled={isRemovingAvatar || isUploadingAvatar}
                onClick={handleRemoveAvatar}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                {isRemovingAvatar ? "Removing..." : "Remove Photo"}
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPhotoModalOpen(false)}
                disabled={isUploadingAvatar || isRemovingAvatar}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!avatarFile || isUploadingAvatar || isRemovingAvatar}
                onClick={handleUploadAvatar}
                className="px-4 py-2 rounded-xl bg-[#0D382B] hover:bg-[#07251C] text-white text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                {isUploadingAvatar ? "Uploading..." : "Save Avatar"}
              </button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
