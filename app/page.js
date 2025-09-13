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
    <div className="min-h-screen text-black -mx-4 -my-4" style={{backgroundColor: '#fdf0d5'}}>

      <div className="relative z-10 max-w-xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className={`text-center mb-12 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="mb-8">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="relative">
                <AlertTriangle className="w-10 h-10 animate-bounce" style={{color: '#c1121f'}} />
                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-ping" style={{backgroundColor: '#c1121f'}}></div>
              </div>
              <h1 className="text-4xl font-black" style={{color: '#c1121f'}}>
                SurgeAid
              </h1>
            </div>

            <p className="text-sm text-black leading-relaxed">
              When disaster strikes, every second counts. SurgeAid instantly mobilizes local volunteers through smart SMS alerts, creating a rapid response network in your community.
            </p>
          </div>

          {/* Animated CTA Buttons */}
          <div className="flex flex-col gap-3 mb-8">
            <a
              href="/volunteer"
              className="group relative overflow-hidden text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
              style={{backgroundColor: '#003049'}}
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
              className="group relative overflow-hidden text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
              style={{backgroundColor: '#c1121f'}}
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
              className="group relative overflow-hidden text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
              style={{backgroundColor: '#669bbc'}}
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
          <div className="backdrop-blur-lg rounded-xl p-4 border mb-8" style={{backgroundColor: 'rgba(255, 255, 255, 0.4)', borderColor: 'rgba(193, 18, 31, 0.2)'}}>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className={`text-center transform transition-all duration-500 ${
                    currentStat === index ? 'scale-110' : 'scale-100'
                  }`}
                  style={{color: currentStat === index ? '#c1121f' : 'black'}}
                >
                  <div className="text-xl font-bold">{stat.number}</div>
                  <div className="text-xs text-black">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className={`mb-12 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h2 className="text-2xl font-bold text-center mb-8" style={{color: '#780000'}}>
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
                      <h3 className="font-bold mb-1 text-black group-hover:transition-colors">
                        {step.title}
                      </h3>

                      <p className="text-black text-sm leading-relaxed">
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
            <h3 className="text-xl font-bold text-center mb-6" style={{color: '#780000'}}>Why Choose SurgeAid?</h3>

            <div className="grid grid-cols-1 gap-4">
              {[
                { icon: Clock, title: "Sub-60 Second Response", desc: "From incident to volunteer alert in under a minute" },
                { icon: Shield, title: "Verified Network", desc: "Background-checked volunteers you can trust" },
                { icon: Smartphone, title: "Zero-App Required", desc: "Works via SMS - no downloads needed" }
              ].map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="text-center group">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full mb-3 group-hover:animate-spin" style={{background: 'linear-gradient(to right, #780000, #c1121f)'}}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-semibold mb-1 text-black">{feature.title}</h4>
                    <p className="text-black text-sm">{feature.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Emergency Banner */}
        <section className={`text-center transform transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="backdrop-blur-lg rounded-xl p-4 border" style={{backgroundColor: 'rgba(193, 18, 31, 0.1)', borderColor: 'rgba(193, 18, 31, 0.3)'}}>
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full animate-ping" style={{backgroundColor: '#c1121f'}}></div>
              <span className="font-semibold" style={{color: '#c1121f'}}>LIVE SYSTEM STATUS</span>
              <div className="w-2 h-2 rounded-full animate-ping" style={{backgroundColor: '#c1121f'}}></div>
            </div>
            <p className="text-black font-medium text-sm">
              🚨 SurgeAid is monitoring <span className="font-bold" style={{color: '#c1121f'}}>12 active incidents</span> across 4 communities
            </p>
            <p className="text-black text-xs mt-2">
              Join volunteers making a difference in their neighborhoods
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
