"use client";
import { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from "firebase/firestore";
import { AlertTriangle, MapPin, FileText, Clock, Target, Zap, Send, CheckCircle } from 'lucide-react';

export default function ReportPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  useEffect(() => {
    setIsVisible(true);
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
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude.toFixed(6));
        setLng(pos.coords.longitude.toFixed(6));
        setLocationLoading(false);
      },
      (err) => {
        alert("Could not get location: " + err.message);
        setLocationLoading(false);
      }
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

  const formatTimeAgo = (timestamp) => {
    if (!timestamp?.toDate) return "";
    const now = new Date();
    const reportTime = timestamp.toDate();
    const diffInMinutes = Math.floor((now - reportTime) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const hours = Math.floor(diffInMinutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white -mx-4 -my-4">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className={`text-center mb-8 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="relative">
              <AlertTriangle className="w-8 h-8 text-red-400 animate-bounce" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
            </div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
              Emergency Report
            </h1>
          </div>

          <p className="text-gray-300 text-sm mb-6 leading-relaxed">
            Report emergencies and incidents in your area. Every second counts—help us mobilize volunteers quickly.
          </p>

          <div className="bg-gradient-to-r from-red-600/20 to-orange-600/20 backdrop-blur-lg rounded-xl p-4 border border-red-500/30 mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Target className="w-4 h-4 text-yellow-400" />
              <span className="text-red-400 font-semibold text-sm">RAPID RESPONSE</span>
              <Target className="w-4 h-4 text-yellow-400" />
            </div>
            <p className="text-white text-xs">
              Reports reach <span className="text-yellow-400 font-bold">150+ volunteers</span> in under 60 seconds
            </p>
          </div>
        </div>

        {/* Report Form */}
        <div className={`mb-8 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Title Field */}
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <AlertTriangle className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  value={title}
                  onChange={e=>setTitle(e.target.value)}
                  placeholder="Emergency title (e.g., 'House fire on Main St')"
                  className="w-full pl-11 pr-4 py-3 bg-white/10 backdrop-blur border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-red-400 focus:outline-none transition-colors"
                  required
                />
              </div>

              {/* Description Field */}
              <div className="relative">
                <div className="absolute left-3 top-4">
                  <FileText className="w-5 h-5 text-gray-400" />
                </div>
                <textarea
                  value={description}
                  onChange={e=>setDescription(e.target.value)}
                  placeholder="Describe the situation, resources needed, and any immediate dangers..."
                  rows={4}
                  className="w-full pl-11 pr-4 py-3 bg-white/10 backdrop-blur border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-red-400 focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* Location Fields */}
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                    </div>
                    <input
                      value={lat}
                      onChange={e=>setLat(e.target.value)}
                      placeholder="Latitude"
                      className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-red-400 focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="relative flex-1">
                    <input
                      value={lng}
                      onChange={e=>setLng(e.target.value)}
                      placeholder="Longitude"
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-red-400 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={useGeolocation}
                  disabled={locationLoading}
                  className="w-full py-3 bg-purple-600/30 hover:bg-purple-600/50 border border-purple-400/30 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {locationLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Getting location...
                    </>
                  ) : (
                    <>
                      <Target className="w-4 h-4" />
                      Use my current location
                    </>
                  )}
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="group w-full relative overflow-hidden bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-700 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <span className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Alerting volunteers...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Report Emergency
                    </>
                  )}
                </span>
              </button>
            </form>
          </div>
        </div>

        {/* Recent Reports */}
        <div className={`transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-blue-400" />
              <h3 className="font-semibold text-white">Live Incident Feed</h3>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-ping ml-auto"></div>
            </div>

            {reports.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3 opacity-50" />
                <p className="text-gray-400 text-sm">No active incidents reported</p>
                <p className="text-gray-500 text-xs mt-1">Your community is safe right now</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {reports.map(r => (
                  <div key={r.id} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-white/20 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <h4 className="font-semibold text-white text-sm">{r.title}</h4>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        {formatTimeAgo(r.createdAt)}
                      </div>
                    </div>

                    {r.description && (
                      <p className="text-gray-300 text-sm mb-2 leading-relaxed">{r.description}</p>
                    )}

                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {r.lat && r.lng ? `${r.lat}, ${r.lng}` : "Location not provided"}
                      </div>
                      <div className="flex items-center gap-1">
                        <Zap className="w-3 h-3 text-yellow-400" />
                        <span className="text-yellow-400">Active</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
