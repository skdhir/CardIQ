"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, CreditCard, Trash2, CheckCircle, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

type Section = "name" | "email" | "password" | null;

export default function ProfilePage() {
  const router = useRouter();

  // Profile state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Edit state
  const [openSection, setOpenSection] = useState<Section>(null);

  // Name edit
  const [newName, setNewName] = useState("");
  const [savingName, setSavingName] = useState(false);

  // Email edit
  const [newEmail, setNewEmail] = useState("");
  const [savingEmail, setSavingEmail] = useState(false);

  // Password edit
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  // Membership
  const [membershipAction, setMembershipAction] = useState<string | null>(null);

  // Delete
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  // Feedback
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data.name) {
          setName(data.name);
          setEmail(data.email);
          setCreatedAt(data.createdAt);
          setNewName(data.name);
          setNewEmail(data.email);
        }
      })
      .finally(() => setLoadingProfile(false));
  }, []);

  function showFeedback(type: "success" | "error", message: string) {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  }

  function toggleSection(section: Section) {
    setOpenSection((prev) => (prev === section ? null : section));
    setFeedback(null);
  }

  async function saveName() {
    if (!newName.trim()) return;
    setSavingName(true);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName }),
    });
    const data = await res.json();
    setSavingName(false);
    if (res.ok) {
      setName(newName.trim());
      setOpenSection(null);
      showFeedback("success", "Name updated successfully.");
    } else {
      showFeedback("error", data.error ?? "Failed to update name.");
    }
  }

  async function saveEmail() {
    if (!newEmail.trim()) return;
    setSavingEmail(true);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: newEmail }),
    });
    const data = await res.json();
    setSavingEmail(false);
    if (res.ok) {
      setEmail(newEmail.trim().toLowerCase());
      setOpenSection(null);
      showFeedback("success", "Email updated successfully.");
    } else {
      showFeedback("error", data.error ?? "Failed to update email.");
    }
  }

  async function savePassword() {
    if (newPassword !== confirmPassword) {
      showFeedback("error", "New passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      showFeedback("error", "Password must be at least 8 characters.");
      return;
    }
    setSavingPassword(true);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await res.json();
    setSavingPassword(false);
    if (res.ok) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setOpenSection(null);
      showFeedback("success", "Password changed successfully.");
    } else {
      showFeedback("error", data.error ?? "Failed to change password.");
    }
  }

  async function deleteAccount() {
    setDeletingAccount(true);
    await fetch("/api/profile", { method: "DELETE" });
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  if (loadingProfile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const memberCreated = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "";

  return (
    <div className="max-w-xl">
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your account details and membership.</p>
      </div>

      {/* Feedback banner */}
      {feedback && (
        <div
          className={cn(
            "flex items-center gap-2 px-4 py-3 rounded-xl text-sm mb-5",
            feedback.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-100"
          )}
        >
          {feedback.type === "success" ? (
            <CheckCircle className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          {feedback.message}
        </div>
      )}

      {/* Account info card */}
      <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100 mb-5">
        {/* Name */}
        <div>
          <button
            onClick={() => toggleSection("name")}
            className="flex items-center justify-between w-full px-5 py-4 text-left hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Name</p>
                <p className="text-sm font-medium text-gray-900">{name}</p>
              </div>
            </div>
            {openSection === "name" ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>
          {openSection === "name" && (
            <div className="px-5 pb-4 space-y-3">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="input w-full"
                placeholder="Your full name"
              />
              <div className="flex gap-2">
                <button
                  onClick={saveName}
                  disabled={savingName || !newName.trim()}
                  className="btn-primary px-4 py-2 text-sm disabled:opacity-50"
                >
                  {savingName ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => { setOpenSection(null); setNewName(name); }}
                  className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Email */}
        <div>
          <button
            onClick={() => toggleSection("email")}
            className="flex items-center justify-between w-full px-5 py-4 text-left hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Email</p>
                <p className="text-sm font-medium text-gray-900">{email}</p>
              </div>
            </div>
            {openSection === "email" ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>
          {openSection === "email" && (
            <div className="px-5 pb-4 space-y-3">
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="input w-full"
                placeholder="you@example.com"
              />
              <div className="flex gap-2">
                <button
                  onClick={saveEmail}
                  disabled={savingEmail || !newEmail.trim()}
                  className="btn-primary px-4 py-2 text-sm disabled:opacity-50"
                >
                  {savingEmail ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => { setOpenSection(null); setNewEmail(email); }}
                  className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Password */}
        <div>
          <button
            onClick={() => toggleSection("password")}
            className="flex items-center justify-between w-full px-5 py-4 text-left hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Lock className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Password</p>
                <p className="text-sm font-medium text-gray-900">........</p>
              </div>
            </div>
            {openSection === "password" ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>
          {openSection === "password" && (
            <div className="px-5 pb-4 space-y-3">
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="input w-full"
                placeholder="Current password"
              />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="input w-full"
                placeholder="New password (min. 8 characters)"
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input w-full"
                placeholder="Confirm new password"
              />
              <div className="flex gap-2">
                <button
                  onClick={savePassword}
                  disabled={savingPassword || !currentPassword || !newPassword || !confirmPassword}
                  className="btn-primary px-4 py-2 text-sm disabled:opacity-50"
                >
                  {savingPassword ? "Saving..." : "Change password"}
                </button>
                <button
                  onClick={() => {
                    setOpenSection(null);
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                  className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Member since */}
        {memberCreated && (
          <div className="px-5 py-4 flex items-center gap-3">
            <CreditCard className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Member since</p>
              <p className="text-sm font-medium text-gray-900">{memberCreated}</p>
            </div>
          </div>
        )}
      </div>

      {/* Membership */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-1">Membership</h2>
        <p className="text-xs text-gray-500 mb-4">
          You&apos;re on the <span className="font-medium text-brand-600">Free plan</span>.
          Upgrade to unlock advanced analytics and priority support.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setMembershipAction("upgrade")}
            className="btn-primary px-4 py-2 text-sm"
          >
            Upgrade to Pro
          </button>
          <button
            onClick={() => setMembershipAction("skip")}
            className="px-4 py-2 text-sm rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Skip a month
          </button>
          <button
            onClick={() => setMembershipAction("cancel")}
            className="px-4 py-2 text-sm rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel plan
          </button>
        </div>
        {membershipAction && (
          <div className="mt-3 px-4 py-3 bg-brand-50 rounded-xl text-sm text-brand-700">
            {membershipAction === "upgrade" &&
              "Upgrade to Pro is coming soon! We'll notify you when it's available."}
            {membershipAction === "skip" &&
              "Skip a month is available for Pro members. Upgrade first to access this feature."}
            {membershipAction === "cancel" &&
              "You're on the free plan — there's nothing to cancel. Your account remains active."}
            <button
              onClick={() => setMembershipAction(null)}
              className="ml-2 text-brand-500 underline text-xs"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* Danger zone */}
      <div className="bg-white rounded-2xl border border-red-100 p-5">
        <h2 className="text-sm font-semibold text-red-700 mb-1">Danger zone</h2>
        <p className="text-xs text-gray-500 mb-4">
          Permanently delete your account and all data. This cannot be undone.
        </p>
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete account
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-red-700 font-medium">
              Are you sure? This will permanently delete your account and all your data.
            </p>
            <div className="flex gap-2">
              <button
                onClick={deleteAccount}
                disabled={deletingAccount}
                className="px-4 py-2 text-sm rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deletingAccount ? "Deleting..." : "Yes, delete my account"}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
