export async function GET() {
  const url =
    "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

  try {
    const res = await fetch(url);
    const json = await res.json();

    return Response.json(json);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to fetch disasters" }, { status: 500 });
  }
}
