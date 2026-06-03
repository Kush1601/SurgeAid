import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { title, description, lat, lng, severity } = await req.json();

    const sev = severity ?? "UNKNOWN";
    const payload = {
      title,
      description,
      lat,
      lng,
      severity: sev,
      timestamp: new Date().toISOString(),
    };

    // Channel 1: Supabase Realtime broadcast (open browser tabs)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    const broadcastRes = await fetch(`${supabaseUrl}/realtime/v1/api/broadcast`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${serviceRoleKey}`,
        "apikey": serviceRoleKey,
      },
      body: JSON.stringify({
        messages: [{ topic: "surgeaid-alerts", event: "new-incident", payload }],
      }),
    });

    if (!broadcastRes.ok) {
      console.error("Realtime broadcast error:", await broadcastRes.text());
    }

    // Channel 2: ntfy push notification (phones, all platforms, no browser required)
    const topic = process.env.NTFY_TOPIC;
    if (topic) {
      const priorityMap: Record<string, string> = {
        CRITICAL: "urgent",
        HIGH: "high",
        MEDIUM: "default",
        LOW: "low",
        UNKNOWN: "default",
      };

      const ntfyRes = await fetch(`https://ntfy.sh/${topic}`, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
          "Title": `[${sev}] ${title}`,
          "Priority": priorityMap[sev] ?? "default",
          "Tags": sev === "CRITICAL" ? "rotating_light,sos" : sev === "HIGH" ? "warning" : "bell",
          "Click": "https://surge-aid.vercel.app/map",
        },
        body: description ?? "",
      });

      if (!ntfyRes.ok) {
        console.error("ntfy publish error:", await ntfyRes.text());
      } else {
        console.log(`ntfy: published [${sev}] to topic '${topic}'`);
      }
    }

    return Response.json({ message: "Alert published to all connected volunteers" });
  } catch (err) {
    console.error("Broadcast error:", err);
    return Response.json({ error: "Failed to publish alert" }, { status: 500 });
  }
}
