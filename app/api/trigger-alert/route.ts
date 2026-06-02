import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { title, description, lat, lng, severity } = await req.json();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    const res = await fetch(`${supabaseUrl}/realtime/v1/api/broadcast`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${serviceRoleKey}`,
        "apikey": serviceRoleKey,
      },
      body: JSON.stringify({
        messages: [
          {
            topic: "surgeaid-alerts",
            event: "new-incident",
            payload: {
              title,
              description,
              lat,
              lng,
              severity: severity ?? "UNKNOWN",
              timestamp: new Date().toISOString(),
            },
          },
        ],
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Broadcast error:", text);
      return Response.json({ error: "Failed to publish alert" }, { status: 500 });
    }

    return Response.json({ message: "Alert published to all connected volunteers" });
  } catch (err) {
    console.error("Broadcast error:", err);
    return Response.json({ error: "Failed to publish alert" }, { status: 500 });
  }
}
