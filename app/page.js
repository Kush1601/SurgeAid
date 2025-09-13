"use client";
import { useState, useEffect } from 'react';
import { AlertTriangle, Users, Smartphone, MapPin, Zap, ArrowRight, Shield, Clock, Heart } from 'lucide-react';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStat, setCurrentStat] = useState(0);

  const stats = [
    { number: "2.3K", label: "Lives Impacted" },
    { number: "150", label: "Active Volunteers" },
    { number: "89", label: "Communities Served" },
    { number: "4.8★", label: "User Rating" }
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white -mx-4 -my-4">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
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
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className={`text-center mb-12 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="mb-8">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="relative">
                <AlertTriangle className="w-10 h-10 text-red-400 animate-bounce" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
              </div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                SurgeAid
              </h1>
            </div>

            <p className="text-sm text-gray-300 leading-relaxed">
              When disaster strikes, every second counts. SurgeAid instantly mobilizes local volunteers through smart SMS alerts, creating a rapid response network in your community.
            </p>
          </div>

          {/* Animated CTA Buttons */}
          <div className="flex flex-col gap-3 mb-8">
            <a
              href="/volunteer"
              className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <span className="relative flex items-center justify-center gap-2">
                <Heart className="w-4 h-4" />
                Join as Volunteer
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </a>

            <a
              href="/report"
              className="group relative overflow-hidden bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <span className="relative flex items-center justify-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Report Emergency
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </a>

            <a
              href="/map"
              className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <span className="relative flex items-center justify-center gap-2">
                <MapPin className="w-4 h-4" />
                View Live Map
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </a>
          </div>

          {/* Dynamic Stats */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 mb-8">
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className={`text-center transform transition-all duration-500 ${
                    currentStat === index ? 'scale-110 text-yellow-400' : 'scale-100'
                  }`}
                >
                  <div className="text-xl font-bold">{stat.number}</div>
                  <div className="text-xs text-gray-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className={`mb-12 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h2 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            How SurgeAid Works
          </h2>

          <div className="space-y-4">
            {[
              {
                icon: Users,
                title: "Volunteers Sign Up",
                description: "Community members register and subscribe to location-based SMS alerts for rapid deployment.",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: MapPin,
                title: "Incident Reported",
                description: "Coordinators report emergencies with precise location data and specific resource needs.",
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: Zap,
                title: "Instant Mobilization",
                description: "Nearby volunteers receive SMS alerts with one-tap response links for immediate action.",
                color: "from-orange-500 to-red-500"
              }
            ].map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 hover:border-white/40 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center flex-shrink-0 group-hover:animate-pulse`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-bold mb-1 text-white group-hover:text-yellow-400 transition-colors">
                        {step.title}
                      </h3>

                      <p className="text-gray-300 text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                    <div className="text-4xl font-black text-white/5 group-hover:text-white/10 transition-colors">
                      {index + 1}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Features Section */}
        <section className={`mb-12 transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-center mb-6 text-white">Why Choose SurgeAid?</h3>

            <div className="grid grid-cols-1 gap-4">
              {[
                { icon: Clock, title: "Sub-60 Second Response", desc: "From incident to volunteer alert in under a minute" },
                { icon: Shield, title: "Verified Network", desc: "Background-checked volunteers you can trust" },
                { icon: Smartphone, title: "Zero-App Required", desc: "Works via SMS - no downloads needed" }
              ].map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="text-center group">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-3 group-hover:animate-spin">
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-semibold mb-1 text-white">{feature.title}</h4>
                    <p className="text-gray-300 text-sm">{feature.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Emergency Banner */}
        <section className={`text-center transform transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-gradient-to-r from-red-600/20 to-orange-600/20 backdrop-blur-lg rounded-xl p-4 border border-red-500/30">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
              <span className="text-red-400 font-semibold">LIVE SYSTEM STATUS</span>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
            </div>
            <p className="text-white font-medium text-sm">
              🚨 SurgeAid is monitoring <span className="text-yellow-400 font-bold">12 active incidents</span> across 4 communities
            </p>
            <p className="text-gray-300 text-xs mt-2">
              Join volunteers making a difference in their neighborhoods
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
