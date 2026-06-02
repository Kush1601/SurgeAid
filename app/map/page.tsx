"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { MapPin, Zap, AlertTriangle, Users } from 'lucide-react';
import { useSupabaseAlerts } from "../hooks/useSupabaseAlerts";
import AlertToast from "../components/AlertToast";

const MapDisasters = dynamic(() => import("../components/MapDisasters"), { ssr: false });

interface LiveStats {
  volunteers: number;
  incidents: number;
}

export default function MapPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [liveStats, setLiveStats] = useState<LiveStats | null>(null);
  const alerts = useSupabaseAlerts();

  useEffect(() => {
    setIsVisible(true);
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data: LiveStats) => setLiveStats(data))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen text-black" style={{ backgroundColor: '#fefbf3' }}>
      <AlertToast alerts={alerts} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className={`text-center mb-8 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="relative flex-shrink-0">
              <MapPin className="w-8 h-8 animate-pulse" style={{ color: '#c1121f' }} />
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-ping" style={{ backgroundColor: '#c1121f' }}></div>
            </div>
            <h1 className="text-3xl lg:text-4xl font-black" style={{ color: '#c1121f' }}>
              Live Response Map
            </h1>
          </div>

          <p className="text-black text-sm mb-6 leading-relaxed">
            Real-time view of active incidents and volunteer responses in your area.
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border mb-6" style={{ backgroundColor: 'rgba(193,18,31,0.08)', borderColor: 'rgba(193,18,31,0.25)' }}>
            <Zap className="w-4 h-4 flex-shrink-0" style={{ color: '#fbbf24' }} />
            <span className="text-sm font-semibold" style={{ color: '#c1121f' }}>REAL-TIME TRACKING</span>
            <span className="text-xs text-gray-600 ml-1">· Blue = USGS · Red = community reports</span>
          </div>
        </div>

        <div className={`mb-6 transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="rounded-2xl p-3 sm:p-4 border" style={{ backgroundColor: 'rgba(255,255,255,0.7)', borderColor: 'rgba(193,18,31,0.2)' }}>
            <div className="bg-white rounded-xl overflow-hidden" style={{ height: 'clamp(320px, 55vh, 680px)' }}>
              <MapDisasters center={[39.2904, -76.6122]} zoom={6} />
            </div>
          </div>
        </div>

        <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="rounded-xl p-4 sm:p-6 border" style={{ backgroundColor: 'rgba(255,255,255,0.7)', borderColor: 'rgba(193,18,31,0.2)' }}>
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <h3 className="font-semibold text-black">Platform Stats</h3>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-ping ml-auto"></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: '#c1121f' }}>
                  {liveStats ? liveStats.incidents : "—"}
                </div>
                <div className="text-xs text-gray-600 flex items-center justify-center gap-1 mt-1">
                  <AlertTriangle className="w-3 h-3" /> Incidents Reported
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: '#003049' }}>
                  {liveStats ? liveStats.volunteers : "—"}
                </div>
                <div className="text-xs text-gray-600 flex items-center justify-center gap-1 mt-1">
                  <Users className="w-3 h-3" /> Registered Volunteers
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
