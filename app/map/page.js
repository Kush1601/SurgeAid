"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { MapPin, Zap, AlertTriangle, Clock } from 'lucide-react';

// dynamically import MapDisasters, disable SSR
const MapDisasters = dynamic(() => import("../components/MapDisasters"), {
  ssr: false,
});

export default function MapPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen text-black -mx-4 -my-4" style={{backgroundColor: '#fefbf3'}}>
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
              <MapPin className="w-8 h-8 animate-pulse" style={{color: '#c1121f'}} />
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-ping" style={{backgroundColor: '#c1121f'}}></div>
            </div>
            <h1 className="text-3xl font-black" style={{color: '#c1121f'}}>
              Live Response Map
            </h1>
          </div>

          <p className="text-black text-sm mb-6 leading-relaxed">
            Real-time view of active incidents and volunteer responses in your area.
          </p>

          <div className="backdrop-blur-lg rounded-xl p-4 border mb-6" style={{backgroundColor: 'rgba(193, 18, 31, 0.1)', borderColor: 'rgba(193, 18, 31, 0.3)'}}>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Zap className="w-4 h-4" style={{color: '#fbbf24'}} />
              <span className="font-semibold text-sm" style={{color: '#c1121f'}}>REAL-TIME TRACKING</span>
              <Zap className="w-4 h-4" style={{color: '#fbbf24'}} />
            </div>
            <p className="text-black text-xs">
              Blue markers = USGS events • Red markers = community reports
            </p>
          </div>
        </div>

        {/* Map Section */}
        <div className={`mb-8 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="backdrop-blur-lg rounded-2xl p-4 border" style={{backgroundColor: 'rgba(255, 255, 255, 0.4)', borderColor: 'rgba(193, 18, 31, 0.2)'}}>
            <div className="bg-white rounded-xl overflow-hidden">
              <MapDisasters center={[39.2904, -76.6122]} zoom={6} />
            </div>
          </div>
        </div>

        {/* Status Cards */}
        <div className={`space-y-4 transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="backdrop-blur-lg rounded-xl p-4 border" style={{backgroundColor: 'rgba(255, 255, 255, 0.4)', borderColor: 'rgba(193, 18, 31, 0.2)'}}>
            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <h3 className="font-semibold text-black">Current Incidents</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold" style={{color: '#c1121f'}}>3</div>
                <div className="text-xs text-gray-600">High Priority</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold" style={{color: '#fbbf24'}}>9</div>
                <div className="text-xs text-gray-600">Standard</div>
              </div>
            </div>
          </div>

          <div className="backdrop-blur-lg rounded-xl p-4 border" style={{backgroundColor: 'rgba(255, 255, 255, 0.4)', borderColor: 'rgba(193, 18, 31, 0.2)'}}>
            <div className="flex items-center gap-3 mb-3">
              <Clock className="w-5 h-5 text-blue-400" />
              <h3 className="font-semibold text-black">Response Status</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold" style={{color: '#fbbf24'}}>45s</div>
                <div className="text-xs text-gray-600">Avg Response</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold" style={{color: '#c1121f'}}>87</div>
                <div className="text-xs text-gray-600">Active Volunteers</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
