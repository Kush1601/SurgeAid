import type { NextRequest } from "next/server";
import webpush from "web-push";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    webpush.setVapidDetails(
      process.env.VAPID_SUBJECT!,
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
      process.env.VAPID_PRIVATE_KEY!
    );

    const { title, description, lat, lng, severity } = await req.json();

    const payload = {
      title,
      description,
      lat,
      lng,
      severity: severity ?? "UNKNOWN",
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

    // Channel 2: Web Push (closed browsers / phones)
    const { data: subscriptions, error } = await supabaseAdmin
      .from("push_subscriptions")
      .select("endpoint, p256dh, auth");

    if (error) {
      console.error("Failed to fetch push subscriptions:", error);
    } else if (subscriptions && subscriptions.length > 0) {
      const pushPayload = JSON.stringify(payload);
      const results = await Promise.allSettled(
        subscriptions.map((sub) =>
          webpush.sendNotification(
            { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
            pushPayload
          )
        )
      );

      // Remove subscriptions that are gone (410 Gone = unsubscribed device)
      const expired = subscriptions.filter((_, i) => {
        const r = results[i];
        return r.status === "rejected" && (r.reason as { statusCode?: number })?.statusCode === 410;
      });

      if (expired.length > 0) {
        await supabaseAdmin
          .from("push_subscriptions")
          .delete()
          .in("endpoint", expired.map((s) => s.endpoint));
      }

      const sent = results.filter((r) => r.status === "fulfilled").length;
      console.log(`Web Push: ${sent}/${subscriptions.length} delivered`);
    }

    return Response.json({ message: "Alert published to all connected volunteers" });
  } catch (err) {
    console.error("Broadcast error:", err);
    return Response.json({ error: "Failed to publish alert" }, { status: 500 });
  }
}
