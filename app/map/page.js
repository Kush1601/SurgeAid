"use client"; // 👈 mark this as client component

import dynamic from "next/dynamic";

// dynamically import MapDisasters, disable SSR
const MapDisasters = dynamic(() => import("../components/MapDisasters"), {
  ssr: false,
});

export default function MapPage() {
  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="font-semibold">Nearby Disasters (USGS feed + Reports)</h2>
        <p className="text-sm text-gray-500 mt-1">
          Blue markers = public USGS events • Red markers = community reports
        </p>
      </div>

      <MapDisasters center={[39.2904, -76.6122]} zoom={6} />
    </div>
  );
}
