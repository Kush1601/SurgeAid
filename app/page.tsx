"use client";
import { useState, useEffect } from 'react';
import { AlertTriangle, Users, Smartphone, MapPin, Zap, ArrowRight, Shield, Clock, Heart } from 'lucide-react';

interface LiveStats {
  volunteers: number;
  incidents: number;
}

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [liveStats, setLiveStats] = useState<LiveStats | null>(null);

  useEffect(() => {
    setIsVisible(true);
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data: LiveStats) => setLiveStats(data))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen text-black" style={{ backgroundColor: '#fefbf3' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">

        {/* Hero */}
        <section className={`mb-12 lg:mb-20 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">

            {/* Left: text + CTAs */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="relative flex-shrink-0">
                  <AlertTriangle className="w-10 h-10 lg:w-12 lg:h-12 animate-bounce" style={{ color: '#c1121f' }} />
                  <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-ping" style={{ backgroundColor: '#c1121f' }}></div>
                </div>
                <h1 className="text-4xl lg:text-5xl font-black" style={{ color: '#c1121f' }}>SurgeAid</h1>
              </div>

              <p className="text-base lg:text-lg text-black leading-relaxed mb-8 max-w-lg">
                When disaster strikes, every second counts. SurgeAid instantly mobilizes local volunteers through real-time alerts, creating a rapid response network in your community.
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                <a
                  href="/volunteer"
                  className="group relative overflow-hidden text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 text-center"
                  style={{ backgroundColor: '#003049' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <span className="relative flex items-center justify-center gap-2">
                    <Heart className="w-4 h-4 flex-shrink-0" />
                    Join as Volunteer
                    <ArrowRight className="w-4 h-4 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                  </span>
                </a>

                <a
                  href="/report"
                  className="group relative overflow-hidden text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 text-center"
                  style={{ backgroundColor: '#c1121f' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <span className="relative flex items-center justify-center gap-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    Report Emergency
                    <ArrowRight className="w-4 h-4 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                  </span>
                </a>

                <a
                  href="/map"
                  className="group relative overflow-hidden text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 text-center"
                  style={{ backgroundColor: '#669bbc' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <span className="relative flex items-center justify-center gap-2">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    View Live Map
                    <ArrowRight className="w-4 h-4 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                  </span>
                </a>
              </div>
            </div>

            {/* Right: live stats card */}
            <div className="rounded-2xl p-6 lg:p-8 border" style={{ backgroundColor: 'rgba(255,255,255,0.7)', borderColor: 'rgba(193,18,31,0.2)' }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-black text-lg">Community Impact</h2>
                <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ backgroundColor: 'rgba(193,18,31,0.1)', color: '#c1121f' }}>Live</span>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-3xl lg:text-4xl font-black mb-1" style={{ color: '#c1121f' }}>
                    {liveStats ? liveStats.volunteers : "—"}
                  </div>
                  <div className="text-xs text-gray-600">Registered Volunteers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl lg:text-4xl font-black mb-1" style={{ color: '#003049' }}>
                    {liveStats ? liveStats.incidents : "—"}
                  </div>
                  <div className="text-xs text-gray-600">Incidents Reported</div>
                </div>
              </div>

              <div className="rounded-xl p-4 border" style={{ backgroundColor: 'rgba(193,18,31,0.05)', borderColor: 'rgba(193,18,31,0.15)' }}>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full animate-ping flex-shrink-0" style={{ backgroundColor: '#c1121f' }}></div>
                  <span className="text-xs font-semibold" style={{ color: '#c1121f' }}>LIVE SYSTEM STATUS</span>
                </div>
                <p className="text-black text-sm">
                  {liveStats
                    ? <>SurgeAid has <span className="font-bold" style={{ color: '#c1121f' }}>{liveStats.incidents} incident{liveStats.incidents !== 1 ? "s" : ""}</span> on record with <span className="font-bold" style={{ color: '#c1121f' }}>{liveStats.volunteers} volunteer{liveStats.volunteers !== 1 ? "s" : ""}</span> registered</>
                    : "Connecting to live data…"
                  }
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className={`mb-12 lg:mb-20 transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h2 className="text-2xl lg:text-3xl font-bold text-center mb-8 lg:mb-12" style={{ color: '#780000' }}>
            How SurgeAid Works
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
            {[
              {
                icon: Users,
                title: "Volunteers Sign Up",
                description: "Community members register and subscribe to real-time alerts for rapid deployment.",
                color: "from-blue-500 to-cyan-500",
                step: 1,
              },
              {
                icon: MapPin,
                title: "Incident Reported",
                description: "Coordinators report emergencies with precise location data and AI-assessed severity.",
                color: "from-purple-500 to-pink-500",
                step: 2,
              },
              {
                icon: Zap,
                title: "Instant Mobilization",
                description: "All connected volunteers receive a live push alert with incident details in under a second.",
                color: "from-orange-500 to-red-500",
                step: 3,
              },
            ].map((step) => {
              const IconComponent = step.icon;
              return (
                <div
                  key={step.step}
                  className="group relative rounded-xl p-6 border transition-all duration-300"
                  style={{ backgroundColor: 'rgba(255,255,255,0.7)', borderColor: 'rgba(193,18,31,0.2)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(193,18,31,0.4)')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(193,18,31,0.2)')}
                >
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center mb-4 group-hover:animate-pulse`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-4xl font-black mb-2" style={{ color: 'rgba(0,0,0,0.06)' }}>{step.step}</div>
                  <h3 className="font-bold mb-2 text-black text-base">{step.title}</h3>
                  <p className="text-black text-sm leading-relaxed">{step.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Why Choose SurgeAid */}
        <section className={`transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="rounded-2xl p-6 lg:p-10 border" style={{ backgroundColor: 'rgba(255,255,255,0.7)', borderColor: 'rgba(193,18,31,0.2)' }}>
            <h3 className="text-xl lg:text-2xl font-bold text-center mb-8" style={{ color: '#780000' }}>Why Choose SurgeAid?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { icon: Clock, title: "Sub-Second Alerts", desc: "Supabase Realtime pushes incidents to all connected volunteers instantly" },
                { icon: Shield, title: "AI Severity Triage", desc: "Claude API classifies each incident so volunteers know urgency at a glance" },
                { icon: Smartphone, title: "No App Required", desc: "Volunteers just keep the browser tab open — no installs needed" },
              ].map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="text-center group">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 group-hover:animate-spin" style={{ background: 'linear-gradient(to right, #780000, #c1121f)' }}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-semibold mb-1 text-black">{feature.title}</h4>
                    <p className="text-black text-sm leading-relaxed">{feature.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
