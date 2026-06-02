import { createClient } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const page = Math.max(0, parseInt(searchParams.get("page") ?? "0", 10));
  const pageSize = 10;

  try {
    let query = supabaseAdmin
      .from("disasters")
      .select("id,title,description,severity,status,recommended_skills,lat,lng,created_at", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(page * pageSize, page * pageSize + pageSize - 1);

    if (q) {
      // Use Postgres full-text search via the existing GIN index
      query = query.textSearch("title", q, { type: "websearch", config: "english" });
    }

    const { data, count, error } = await query;
    if (error) throw error;

    return Response.json({ results: data ?? [], total: count ?? 0, page, pageSize });
  } catch (err) {
    console.error("Search error:", err);
    return Response.json({ results: [], total: 0, page, pageSize }, { status: 500 });
  }
}
