import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const [{ data: disasters }, { data: volunteers }] = await Promise.all([
      supabaseAdmin
        .from("disasters")
        .select("severity, status, created_at")
        .order("created_at", { ascending: true }),
      supabaseAdmin
        .from("volunteers")
        .select("created_at")
        .order("created_at", { ascending: true }),
    ]);

    // Severity distribution
    const severityCounts: Record<string, number> = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0, UNKNOWN: 0 };
    for (const d of disasters ?? []) {
      const s = d.severity ?? "UNKNOWN";
      severityCounts[s] = (severityCounts[s] ?? 0) + 1;
    }

    // Status distribution
    const statusCounts: Record<string, number> = { ACTIVE: 0, RESOLVED: 0, FALSE_ALARM: 0 };
    for (const d of disasters ?? []) {
      const s = d.status ?? "ACTIVE";
      statusCounts[s] = (statusCounts[s] ?? 0) + 1;
    }

    // Volunteer signups by day (last 14 days)
    const now = new Date();
    const signupsByDay: Record<string, number> = {};
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      signupsByDay[d.toISOString().slice(0, 10)] = 0;
    }
    for (const v of volunteers ?? []) {
      const day = (v.created_at as string).slice(0, 10);
      if (day in signupsByDay) signupsByDay[day]++;
    }

    // Incidents by day (last 14 days)
    const incidentsByDay: Record<string, number> = {};
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      incidentsByDay[d.toISOString().slice(0, 10)] = 0;
    }
    for (const d of disasters ?? []) {
      const day = (d.created_at as string).slice(0, 10);
      if (day in incidentsByDay) incidentsByDay[day]++;
    }

    // Incidents by hour of day (0–23)
    const byHour: number[] = Array(24).fill(0);
    for (const d of disasters ?? []) {
      const h = new Date(d.created_at as string).getHours();
      byHour[h]++;
    }

    return Response.json({
      severityCounts,
      statusCounts,
      signupsByDay,
      incidentsByDay,
      byHour,
      totals: {
        disasters: (disasters ?? []).length,
        volunteers: (volunteers ?? []).length,
      },
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    return Response.json({}, { status: 500 });
  }
}
