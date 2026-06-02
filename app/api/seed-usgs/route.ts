import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST() {
  try {
    const res = await fetch(
      "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
    );
    const { features } = await res.json() as {
      features: Array<{
        id: string;
        geometry: { coordinates: [number, number, number] };
        properties: { place: string; mag: number; time: number; type: string };
      }>;
    };

    // Map magnitude to severity
    const toSeverity = (mag: number) => {
      if (mag >= 6.0) return "CRITICAL";
      if (mag >= 4.5) return "HIGH";
      if (mag >= 2.5) return "MEDIUM";
      return "LOW";
    };

    const rows = features.map((f) => {
      const [lng, lat] = f.geometry.coordinates;
      const mag = f.properties.mag ?? 0;
      const severity = toSeverity(mag);
      return {
        title: `M${mag.toFixed(1)} Earthquake — ${f.properties.place}`,
        description: `Magnitude ${mag} ${f.properties.type ?? "earthquake"} detected by USGS at ${f.properties.place}.`,
        lat,
        lng,
        severity,
        action: `Assess structural damage in affected area. Magnitude ${mag} — ${severity === "CRITICAL" || severity === "HIGH" ? "activate emergency protocols" : "monitor for aftershocks"}.`,
        recommended_skills: severity === "CRITICAL" || severity === "HIGH"
          ? "Search & Rescue, Medical, Structural Assessment"
          : "Community Support, First Aid",
        status: "ACTIVE",
        created_at: new Date(f.properties.time).toISOString(),
      };
    });

    // Upsert by title+created_at to avoid duplicates on re-run
    const { error } = await supabaseAdmin
      .from("disasters")
      .upsert(rows, { onConflict: "title,created_at", ignoreDuplicates: true });

    if (error) throw error;

    return Response.json({ seeded: rows.length, message: `Inserted up to ${rows.length} USGS earthquakes` });
  } catch (err) {
    console.error("Seed error:", err);
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
