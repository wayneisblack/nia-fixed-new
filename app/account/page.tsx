import { redirect } from "next/navigation";
import { auth } from "../../auth";
import { getUserById } from "../../lib/users";
import { SiteNav } from "../../components/site-nav";
import { SiteFooter } from "../../components/site-footer";
import { Reveal } from "../../components/reveal";
import { AccountClient } from "./account-client";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await getUserById(session.user.id);
  if (!user) redirect("/login");

  return (
    <main className="min-h-screen bg-zinc-50">
      <SiteNav />
      <div className="mx-auto max-w-2xl px-6 py-14">
        <Reveal>
          <p className="eyebrow text-zinc-500">Account</p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.05em]">Account &amp; security</h1>
          <p className="mt-2 text-zinc-500">Manage your sign-in details separately from your public profile.</p>
        </Reveal>

        <div className="mt-10">
          <AccountClient
            email={user.email ?? ""}
            emailVerified={Boolean(user.emailVerified)}
            phone={user.phone}
          />
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
