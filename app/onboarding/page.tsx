import { redirect } from "next/navigation";
import { auth } from "../../auth";
import { getUserById } from "../../lib/users";
import { firstStepId } from "../../lib/onboarding";
import { OnboardingClient } from "./onboarding-client";

export default async function OnboardingPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await getUserById(session.user.id);
  if (!user) redirect("/login");

  if (user.onboardingComplete) redirect("/dashboard");

  return (
    <OnboardingClient
      role={user.role === "employer" ? "employer" : "talent"}
      name={user.name ?? session.user.name ?? ""}
      companyName={user.companyName}
      initialStepId={user.onboardingStep ?? firstStepId(user.role)}
      initialProfile={{
        about: user.about ?? "",
        categories: user.categories ?? [],
        skills: user.skills ?? [],
        location: user.location ?? { country: "", region: "", city: "" },
        industry: user.industry ?? "",
        companySize: user.companySize ?? "",
        website: user.website ?? "",
        experience: user.experience ?? [],
        education: user.education ?? [],
      }}
    />
  );
}
