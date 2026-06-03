import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { endpoint, keys } = await req.json();

    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return Response.json({ error: "Invalid subscription object" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("push_subscriptions")
      .upsert(
        { endpoint, p256dh: keys.p256dh, auth: keys.auth },
        { onConflict: "endpoint" }
      );

    if (error) throw error;

    return Response.json({ ok: true });
  } catch (err) {
    console.error("Subscribe error:", err);
    return Response.json({ error: "Failed to save subscription" }, { status: 500 });
  }
}
