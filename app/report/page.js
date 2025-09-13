"use client";
import { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from "firebase/firestore";

export default function ReportPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "disasters"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setReports(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  function useGeolocation() {
    if (!navigator.geolocation) {
      alert("Geolocation not supported.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude.toFixed(6));
        setLng(pos.coords.longitude.toFixed(6));
      },
      (err) => { alert("Could not get location: " + err.message); }
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) { alert("Please add a short title."); return; }
    setLoading(true);
    try {
      await addDoc(collection(db, "disasters"), {
        title,
        description,
        lat: lat ? parseFloat(lat) : null,
        lng: lng ? parseFloat(lng) : null,
        createdAt: serverTimestamp(),
      });
      setTitle(""); setDescription(""); setLat(""); setLng("");
    } catch (err) {
      console.error(err);
      alert("Error saving report");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-2">Report an Incident</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Short title" className="w-full px-3 py-2 border rounded" required />
          <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Description" className="w-full px-3 py-2 border rounded" rows={3} />
          <div className="flex gap-2">
            <input value={lat} onChange={e=>setLat(e.target.value)} placeholder="Latitude (optional)" className="flex-1 px-3 py-2 border rounded" />
            <input value={lng} onChange={e=>setLng(e.target.value)} placeholder="Longitude (optional)" className="flex-1 px-3 py-2 border rounded" />
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={useGeolocation} className="flex-1 py-2 bg-gray-100 rounded">Use my location</button>
            <button type="submit" disabled={loading} className="flex-1 py-2 bg-blue-600 text-white rounded">{loading ? "Reporting..." : "Report Incident"}</button>
          </div>
        </form>
      </div>

      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="font-semibold mb-2">Recent Reports</h3>
        {reports.length === 0 ? <p className="text-sm text-gray-500">No reports yet.</p> : (
          <ul className="space-y-3">
            {reports.map(r => (
              <li key={r.id} className="p-3 bg-gray-50 rounded">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold">{r.title}</div>
                    <div className="text-sm text-gray-600">{r.description}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {r.lat && r.lng ? `Location: ${r.lat}, ${r.lng}` : "Location: not provided"}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {r.createdAt?.toDate ? new Date(r.createdAt.toDate()).toLocaleString() : ""}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
