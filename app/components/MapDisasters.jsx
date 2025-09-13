"use client";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { db } from "../../lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";

// Setup default marker icons using CDN (avoids bundler require issues)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function MapDisasters({ center = [39.3299, -76.6205], zoom = 6 }) {
  const [usgsFeatures, setUsgsFeatures] = useState([]);
  const [localReports, setLocalReports] = useState([]);

  useEffect(() => {
    fetch("/api/disasters")
      .then(r => r.json())
      .then(j => setUsgsFeatures(j.features || []))
      .catch(() => setUsgsFeatures([]));
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "disasters"), snap => {
      setLocalReports(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  return (
    <div className="w-full h-[60vh] rounded overflow-hidden shadow">
      <MapContainer center={center} zoom={zoom} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
          subdomains={["a", "b", "c", "d"]}
        />
        {usgsFeatures.map(f => {
          const [lng, lat] = f.geometry.coordinates;
          return (
            <Marker key={f.id} position={[lat, lng]}>
              <Popup>
                <div className="text-sm">
                  <strong>{f.properties.place}</strong><br/>
                  Mag: {f.properties.mag}<br/>
                  {new Date(f.properties.time).toLocaleString()}
                </div>
              </Popup>
            </Marker>
          );
        })}
        {localReports.filter(r => r.lat && r.lng).map(r => (
          <Marker key={r.id} position={[r.lat, r.lng]}>
            <Popup>
              <div className="text-sm">
                <strong>{r.title}</strong><br/>
                {r.description}<br/>
                {r.createdAt?.toDate ? new Date(r.createdAt.toDate()).toLocaleString() : ""}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
