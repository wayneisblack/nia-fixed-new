import { auth } from "../../../../auth";
import { suggestCustomSkill } from "../../../../lib/store";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Authentication is required." }, { status: 401 });

  const body = await request.json();
  const skill = typeof body?.skill === "string" ? body.skill.trim() : "";
  if (!skill) return Response.json({ error: "skill is required." }, { status: 400 });

  try {
    await suggestCustomSkill(session.user.id, skill);
    return Response.json({ data: { skill } });
  } catch {
    // Non-critical — the user's selection still works locally even if we
    // couldn't log the suggestion for later review.
    return Response.json({ data: { skill }, warning: "Couldn't record this for review, but it's been added to your profile." });
  }
}
