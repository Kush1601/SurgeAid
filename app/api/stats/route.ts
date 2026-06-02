import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const [{ count: volunteers, error: e1 }, { count: incidents, error: e2 }] = await Promise.all([
      supabaseAdmin.from("volunteers").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("disasters").select("*", { count: "exact", head: true }),
    ]);

    if (e1 || e2) {
      console.error("Stats error:", e1 ?? e2);
      return Response.json({ volunteers: 0, incidents: 0 }, { status: 500 });
    }

    return Response.json({
      volunteers: volunteers ?? 0,
      incidents: incidents ?? 0,
    });
  } catch (err) {
    console.error("Stats error:", err);
    return Response.json({ volunteers: 0, incidents: 0 }, { status: 500 });
  }
}
