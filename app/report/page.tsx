"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { AlertTriangle, MapPin, FileText, Clock, Target, Zap, Send, CheckCircle, Users } from 'lucide-react';
import type { Disaster, IncidentStatus } from "../../lib/types";
import { useSupabaseAlerts } from "../hooks/useSupabaseAlerts";
import AlertToast from "../components/AlertToast";

export default function ReportPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState<Disaster[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const alerts = useSupabaseAlerts();

  useEffect(() => {
    setIsVisible(true);

    supabase
      .from("disasters")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setReports((data as Disaster[]) ?? []));

    const channel = supabase
      .channel("disasters-feed")
      .on("postgres_changes", { event: "*", schema: "public", table: "disasters" }, () => {
        supabase
          .from("disasters")
          .select("*")
          .order("created_at", { ascending: false })
          .then(({ data }) => setReports((data as Disaster[]) ?? []));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  function getGeolocation() {
    if (!navigator.geolocation) { alert("Geolocation not supported."); return; }
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => { setLat(pos.coords.latitude.toFixed(6)); setLng(pos.coords.longitude.toFixed(6)); setLocationLoading(false); },
      (err) => { alert("Could not get location: " + err.message); setLocationLoading(false); }
    );
  }

  const updateStatus = async (id: string, status: IncidentStatus) => {
    await supabase.from("disasters").update({ status }).eq("id", id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const classifyRes = await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });
      const { severity, action, recommended_skills } = await classifyRes.json() as { severity: string; action: string; recommended_skills: string };

      const { error: insertError } = await supabase.from("disasters").insert({
        title,
        description,
        lat: lat ? parseFloat(lat) : null,
        lng: lng ? parseFloat(lng) : null,
        severity,
        action,
        recommended_skills: recommended_skills ?? "",
        status: "ACTIVE",
      });

      if (insertError) throw insertError;

      await fetch("/api/trigger-alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, lat, lng, severity }),
      });

      setTitle(""); setDescription(""); setLat(""); setLng("");
    } catch (err) {
      console.error(err);
      alert("Error saving report");
    }
    setLoading(false);
  };

  const formatTimeAgo = (timestamp: string | null | undefined): string => {
    if (!timestamp) return "";
    const now = new Date();
    const reportTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - reportTime.getTime()) / (1000 * 60));
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const hours = Math.floor(diffInMinutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const severityColors: Record<string, string> = {
    CRITICAL: '#ff0000', HIGH: '#c1121f', MEDIUM: '#f59e0b', LOW: '#22c55e', UNKNOWN: '#9ca3af',
  };

  return (
    <div className="min-h-screen text-black" style={{ backgroundColor: '#fefbf3' }}>
      <AlertToast alerts={alerts} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

        {/* Header */}
        <div className={`text-center mb-8 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="relative flex-shrink-0">
              <AlertTriangle className="w-8 h-8 lg:w-10 lg:h-10 animate-bounce" style={{ color: '#c1121f' }} />
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-ping" style={{ backgroundColor: '#c1121f' }}></div>
            </div>
            <h1 className="text-3xl lg:text-4xl font-black" style={{ color: '#c1121f' }}>Emergency Report</h1>
          </div>
          <p className="text-black text-sm lg:text-base leading-relaxed max-w-xl mx-auto">
            Report emergencies and incidents in your area. Every second counts—help us mobilize volunteers quickly.
          </p>
        </div>

        {/* Two-column layout on md+ */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>

          {/* Left: Form */}
          <div>
            <div className="rounded-2xl p-6 border" style={{ backgroundColor: 'rgba(255,255,255,0.7)', borderColor: 'rgba(193,18,31,0.2)' }}>
              <div className="flex items-center gap-2 mb-5 p-3 rounded-xl" style={{ backgroundColor: 'rgba(193,18,31,0.08)' }}>
                <Target className="w-4 h-4 flex-shrink-0" style={{ color: '#fbbf24' }} />
                <span className="font-semibold text-sm" style={{ color: '#c1121f' }}>RAPID RESPONSE</span>
                <span className="text-xs text-black ml-auto">Alerts dispatched in &lt;60s</span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <AlertTriangle className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Emergency title (e.g., 'House fire on Main St')"
                    className="w-full pl-11 pr-4 py-3 bg-white/60 border border-gray-300 rounded-xl text-black placeholder-gray-500 focus:outline-none transition-colors"
                    onFocus={(e) => e.currentTarget.style.borderColor = '#c1121f'}
                    onBlur={(e) => e.currentTarget.style.borderColor = 'rgb(209 213 219)'}
                    required
                  />
                </div>

                <div className="relative">
                  <div className="absolute left-3 top-4">
                    <FileText className="w-5 h-5 text-gray-400" />
                  </div>
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Describe the situation, resources needed, and any immediate dangers..."
                    rows={4}
                    className="w-full pl-11 pr-4 py-3 bg-white/60 border border-gray-300 rounded-xl text-black placeholder-gray-500 focus:outline-none transition-colors resize-none"
                    onFocus={(e) => e.currentTarget.style.borderColor = '#c1121f'}
                    onBlur={(e) => e.currentTarget.style.borderColor = 'rgb(209 213 219)'}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                    </div>
                    <input
                      value={lat}
                      onChange={e => setLat(e.target.value)}
                      placeholder="Latitude"
                      className="w-full pl-10 pr-4 py-3 bg-white/60 border border-gray-300 rounded-xl text-black placeholder-gray-500 focus:outline-none transition-colors"
                      onFocus={(e) => e.currentTarget.style.borderColor = '#c1121f'}
                      onBlur={(e) => e.currentTarget.style.borderColor = 'rgb(209 213 219)'}
                    />
                  </div>
                  <input
                    value={lng}
                    onChange={e => setLng(e.target.value)}
                    placeholder="Longitude"
                    className="w-full px-4 py-3 bg-white/60 border border-gray-300 rounded-xl text-black placeholder-gray-500 focus:outline-none transition-colors"
                    onFocus={(e) => e.currentTarget.style.borderColor = '#c1121f'}
                    onBlur={(e) => e.currentTarget.style.borderColor = 'rgb(209 213 219)'}
                  />
                </div>

                <button
                  type="button"
                  onClick={getGeolocation}
                  disabled={locationLoading}
                  className="w-full py-3 bg-white/60 hover:bg-white/80 border border-gray-300 text-black rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                >
                  {locationLoading ? (
                    <><div className="w-4 h-4 border-2 border-gray-400 border-t-gray-700 rounded-full animate-spin"></div>Getting location...</>
                  ) : (
                    <><Target className="w-4 h-4" />Use my current location</>
                  )}
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="group w-full relative overflow-hidden text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
                  style={{ backgroundColor: loading ? '#9ca3af' : '#ca0013', boxShadow: loading ? 'none' : '0 4px 14px 0 rgba(202,0,19,0.39)' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <span className="relative flex items-center justify-center gap-2">
                    {loading ? (
                      <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>Alerting volunteers...</>
                    ) : (
                      <><Send className="w-5 h-5" />Report Emergency</>
                    )}
                  </span>
                </button>
              </form>
            </div>
          </div>

          {/* Right: Live Incident Feed */}
          <div className="flex flex-col">
            <div className="rounded-2xl p-6 border flex-1 flex flex-col" style={{ backgroundColor: 'rgba(255,255,255,0.7)', borderColor: 'rgba(193,18,31,0.2)' }}>
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-blue-400" />
                <h3 className="font-semibold text-black">Live Incident Feed</h3>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-ping ml-auto"></div>
              </div>

              {reports.length === 0 ? (
                <div className="text-center py-12 flex-1 flex flex-col items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3 opacity-50" />
                  <p className="text-gray-400 text-sm">No active incidents reported</p>
                  <p className="text-gray-500 text-xs mt-1">Your community is safe right now</p>
                </div>
              ) : (
                <div className="space-y-3 overflow-y-auto flex-1 pr-1" style={{ maxHeight: 'min(560px, 60vh)' }}>
                  {reports.map(r => {
                    const severityColor = severityColors[r.severity ?? 'UNKNOWN'] ?? '#9ca3af';
                    const isResolved = r.status === 'RESOLVED' || r.status === 'FALSE_ALARM';
                    const statusColors: Record<string, string> = {
                      ACTIVE: '#fbbf24', RESOLVED: '#22c55e', FALSE_ALARM: '#9ca3af',
                    };
                    const statusColor = statusColors[r.status ?? 'ACTIVE'] ?? '#fbbf24';
                    return (
                      <div
                        key={r.id}
                        className="rounded-xl p-4 border transition-colors"
                        style={{
                          backgroundColor: isResolved ? 'rgba(240,253,244,0.8)' : 'rgba(255,255,255,0.8)',
                          borderColor: isResolved ? 'rgba(34,197,94,0.3)' : 'rgba(193,18,31,0.2)',
                          opacity: isResolved ? 0.8 : 1,
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = isResolved ? 'rgba(34,197,94,0.5)' : 'rgba(193,18,31,0.4)'}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = isResolved ? 'rgba(34,197,94,0.3)' : 'rgba(193,18,31,0.2)'}
                      >
                        <div className="flex justify-between items-start mb-2 gap-2">
                          <div className="flex items-center gap-2 flex-wrap min-w-0">
                            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: statusColor, animation: isResolved ? 'none' : 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite' }}></div>
                            <h4 className="font-semibold text-black text-sm truncate">{r.title}</h4>
                            {r.severity && (
                              <span className="text-xs font-bold px-2 py-0.5 rounded text-white flex-shrink-0" style={{ backgroundColor: severityColor }}>
                                {r.severity}
                              </span>
                            )}
                            <span className="text-xs font-semibold px-2 py-0.5 rounded flex-shrink-0" style={{ backgroundColor: `${statusColor}22`, color: statusColor }}>
                              {r.status ?? 'ACTIVE'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-400 flex-shrink-0">
                            <Clock className="w-3 h-3" />
                            {formatTimeAgo(r.created_at)}
                          </div>
                        </div>

                        {r.description && (
                          <p className="text-gray-700 text-sm mb-2 leading-relaxed">{r.description}</p>
                        )}

                        {r.action && (
                          <p className="text-xs mb-2 px-2 py-1 rounded" style={{ backgroundColor: 'rgba(193,18,31,0.08)', color: '#780000' }}>
                            <span className="font-semibold">AI Action: </span>{r.action}
                          </p>
                        )}

                        {r.recommended_skills && (
                          <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                            <Users className="w-3 h-3 text-blue-500 flex-shrink-0" />
                            {r.recommended_skills.split(',').map(s => s.trim()).filter(Boolean).map(skill => (
                              <span key={skill} className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-4 text-xs text-gray-600">
                            <div className="flex items-center gap-1 min-w-0">
                              <MapPin className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{r.lat && r.lng ? `${r.lat}, ${r.lng}` : "Location not provided"}</span>
                            </div>
                            {!isResolved && (
                              <div className="flex items-center gap-1 flex-shrink-0">
                                <Zap className="w-3 h-3" style={{ color: '#fbbf24' }} />
                                <span style={{ color: '#fbbf24' }}>Active</span>
                              </div>
                            )}
                          </div>
                          {!isResolved && r.id && (
                            <div className="flex gap-1.5 flex-shrink-0">
                              <button
                                onClick={() => updateStatus(r.id!, 'RESOLVED')}
                                className="text-xs px-2 py-1 rounded-lg font-medium transition-colors bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
                              >
                                Resolve
                              </button>
                              <button
                                onClick={() => updateStatus(r.id!, 'FALSE_ALARM')}
                                className="text-xs px-2 py-1 rounded-lg font-medium transition-colors bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                              >
                                False Alarm
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
