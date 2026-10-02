"use client";

import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { FormEvent, useState } from "react";
import { apiFetch, clearApiToken } from "../../lib/api";
import { PhoneEditor } from "../../components/profile/phone-editor";
import type { PhoneValue } from "../../components/phone-input";

function Card({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[1.5rem] border border-black/10 bg-white p-6">
      <h2 className="text-sm font-semibold">{title}</h2>
      {description ? <p className="mt-1 text-xs text-zinc-500">{description}</p> : null}
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function AccountClient({
  email,
  emailVerified,
  phone,
}: {
  email: string;
  emailVerified: boolean;
  phone: PhoneValue | undefined;
}) {
  return (
    <div className="space-y-6">
      <EmailCard initialEmail={email} initialVerified={emailVerified} />

      <Card title="Phone number">
        <PhoneEditor initialPhone={phone} />
      </Card>

      <PasswordCard />

      <Card title="Active sessions" description="Session/device management isn't available in this environment yet.">
        <p className="text-sm text-zinc-400">Not available.</p>
      </Card>

      <DeleteAccountCard />
    </div>
  );
}

function EmailCard({ initialEmail, initialVerified }: { initialEmail: string; initialVerified: boolean }) {
  const router = useRouter();
  const { update } = useSession();
  const [editing, setEditing] = useState(false);
  const [email, setEmail] = useState(initialEmail);
  const [verified, setVerified] = useState(initialVerified);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const response = await apiFetch("/api/account/email", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) throw new Error(result?.error ?? "Couldn't update your email.");
      setVerified(Boolean(result?.data?.emailVerified));
      await update({});
      router.refresh();
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card title="Email">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-sm text-zinc-700">{email}</p>
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${verified ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
          {verified ? "Verified" : "Not verified"}
        </span>
      </div>
      {!verified ? (
        <p className="mt-2 text-xs text-zinc-400">
          Verification emails aren&apos;t wired up in this environment yet — this status just reflects the database flag.
        </p>
      ) : null}

      {editing ? (
        <form onSubmit={handleSave} className="mt-4 space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-black/10 bg-zinc-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-black/30"
          />
          {error ? <p className="text-xs text-red-600">{error}</p> : null}
          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="btn-primary px-4 py-2 text-xs">
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail(initialEmail);
                setEditing(false);
                setError("");
              }}
              className="btn-secondary px-4 py-2 text-xs"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button onClick={() => setEditing(true)} className="mt-3 text-xs font-medium text-black underline underline-offset-2">
          Change email
        </button>
      )}
    </Card>
  );
}

function PasswordCard() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    setSaving(true);
    try {
      const response = await apiFetch("/api/account/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) throw new Error(result?.error ?? "Couldn't update your password.");
      setCurrentPassword("");
      setNewPassword("");
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card title="Password">
      <form onSubmit={handleSave} className="space-y-3">
        <input
          type="password"
          required
          placeholder="Current password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full rounded-xl border border-black/10 bg-zinc-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-black/30"
        />
        <input
          type="password"
          required
          minLength={8}
          placeholder="New password (8+ characters)"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full rounded-xl border border-black/10 bg-zinc-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-black/30"
        />
        {error ? <p className="text-xs text-red-600">{error}</p> : null}
        {success ? <p className="text-xs text-emerald-600">Password updated.</p> : null}
        <button type="submit" disabled={saving} className="btn-primary px-4 py-2 text-xs">
          {saving ? "Saving..." : "Update password"}
        </button>
      </form>
    </Card>
  );
}

function DeleteAccountCard() {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    setDeleting(true);
    setError("");
    try {
      const response = await apiFetch("/api/account", { method: "DELETE" });
      if (!response.ok) throw new Error("Couldn't delete your account. Please try again.");
      clearApiToken();
      await signOut({ callbackUrl: "/" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setDeleting(false);
    }
  }

  return (
    <Card title="Delete account" description="This permanently removes your account, applications, and saved opportunities.">
      {error ? <p className="mb-3 text-xs text-red-600">{error}</p> : null}
      {confirming ? (
        <div className="flex gap-2">
          <button onClick={handleDelete} disabled={deleting} className="rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:opacity-60">
            {deleting ? "Deleting..." : "Yes, delete my account"}
          </button>
          <button onClick={() => setConfirming(false)} className="btn-secondary px-4 py-2 text-xs">
            Cancel
          </button>
        </div>
      ) : (
        <button onClick={() => setConfirming(true)} className="text-xs font-medium text-red-600 underline underline-offset-2">
          Delete my account
        </button>
      )}
    </Card>
  );
}
