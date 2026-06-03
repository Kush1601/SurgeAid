import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const [
      { data: severityRows },
      { data: statusRows },
      { data: disasterDates },
      { data: volunteerDates },
      { data: latencyRows },
    ] = await Promise.all([
      // Pushed to DB — no full-table fetch needed for these counts
      supabaseAdmin.rpc("count_by_severity"),
      supabaseAdmin.rpc("count_by_status"),
      // Time-series still needs created_at per row
      supabaseAdmin
        .from("disasters")
        .select("created_at")
        .order("created_at", { ascending: true }),
      supabaseAdmin
        .from("volunteers")
        .select("created_at")
        .order("created_at", { ascending: true }),
      // AI classify latency — only rows where we measured it
      supabaseAdmin
        .from("disasters")
        .select("classify_ms")
        .not("classify_ms", "is", null),
    ]);

    // Severity distribution — from DB GROUP BY
    const severityCounts: Record<string, number> = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0, UNKNOWN: 0 };
    for (const row of severityRows ?? []) {
      severityCounts[row.severity ?? "UNKNOWN"] = Number(row.count);
    }

    // Status distribution — from DB GROUP BY
    const statusCounts: Record<string, number> = { ACTIVE: 0, RESOLVED: 0, FALSE_ALARM: 0 };
    for (const row of statusRows ?? []) {
      statusCounts[row.status ?? "ACTIVE"] = Number(row.count);
    }

    // Volunteer signups by day (last 14 days)
    const now = new Date();
    const signupsByDay: Record<string, number> = {};
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      signupsByDay[d.toISOString().slice(0, 10)] = 0;
    }
    for (const v of volunteerDates ?? []) {
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
    for (const d of disasterDates ?? []) {
      const day = (d.created_at as string).slice(0, 10);
      if (day in incidentsByDay) incidentsByDay[day]++;
    }

    // Incidents by hour of day (0–23)
    const byHour: number[] = Array(24).fill(0);
    for (const d of disasterDates ?? []) {
      const h = new Date(d.created_at as string).getHours();
      byHour[h]++;
    }

    const totalDisasters = Object.values(severityCounts).reduce((a, b) => a + b, 0);
    const totalVolunteers = (volunteerDates ?? []).length;

    // AI classify latency stats
    const latencyValues = (latencyRows ?? [])
      .map((r) => r.classify_ms as number)
      .sort((a, b) => a - b);
    const latencyP50 = latencyValues.length > 0
      ? latencyValues[Math.floor(latencyValues.length * 0.5)]
      : null;
    const latencyP95 = latencyValues.length > 0
      ? latencyValues[Math.floor(latencyValues.length * 0.95)]
      : null;

    return Response.json({
      severityCounts,
      statusCounts,
      signupsByDay,
      incidentsByDay,
      byHour,
      totals: {
        disasters: totalDisasters,
        volunteers: totalVolunteers,
      },
      latency: {
        p50: latencyP50,
        p95: latencyP95,
        sampleSize: latencyValues.length,
      },
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    return Response.json({}, { status: 500 });
  }
}
