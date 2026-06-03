import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { endpoint } = await req.json();

    if (!endpoint) {
      return Response.json({ error: "Missing endpoint" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("push_subscriptions")
      .delete()
      .eq("endpoint", endpoint);

    if (error) throw error;

    return Response.json({ ok: true });
  } catch (err) {
    console.error("Unsubscribe error:", err);
    return Response.json({ error: "Failed to remove subscription" }, { status: 500 });
  }
}
