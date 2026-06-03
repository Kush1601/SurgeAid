"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { Heart, Phone, User, Zap, CheckCircle, AlertTriangle, Shield, Smartphone, Bell } from 'lucide-react';
import { useSupabaseAlerts } from "../hooks/useSupabaseAlerts";
import AlertToast from "../components/AlertToast";

interface LiveStats {
  volunteers: number;
  incidents: number;
}

interface FormErrors {
  name?: string;
  phone?: string;
  skills?: string;
}

function validatePhone(value: string): string | undefined {
  const digits = value.replace(/\D/g, "");
  if (digits.length < 7) return "Enter a valid phone number";
  return undefined;
}

async function registerPush(): Promise<void> {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;

  const reg = await navigator.serviceWorker.register("/sw.js");
  const permission = await Notification.requestPermission();
  if (permission !== "granted") return;

  const existing = await reg.pushManager.getSubscription();
  const sub = existing ?? await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  });

  await fetch("/api/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sub.toJSON()),
  });
}

export default function VolunteerForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [skills, setSkills] = useState("");
  const [subscribed, setSubscribed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
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

  function validate(): FormErrors {
    const errors: FormErrors = {};
    if (!name.trim()) errors.name = "Name is required";
    const phoneErr = validatePhone(phone);
    if (phoneErr) errors.phone = phoneErr;
    if (!skills.trim()) errors.skills = "Please describe your skills";
    return errors;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    // Optimistic success
    setSuccess(true);
    setLoading(true);

    try {
      const [insertResult] = await Promise.all([
        supabase.from("volunteers").insert({ name, phone, skills, subscribed }),
        subscribed ? registerPush().catch(() => {}) : Promise.resolve(),
      ]);

      if (insertResult.error) throw insertResult.error;

      setName("");
      setPhone("");
      setSkills("");
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error(err);
      setSuccess(false);
      setSubmitError("Something went wrong saving your registration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-black" style={{ backgroundColor: '#fefbf3' }}>
      <AlertToast alerts={alerts} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

        {/* Header */}
        <div className={`text-center mb-8 lg:mb-10 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="relative flex-shrink-0">
              <Heart className="w-8 h-8 lg:w-10 lg:h-10 animate-pulse" style={{ color: '#c1121f' }} />
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-ping" style={{ backgroundColor: '#c1121f' }}></div>
            </div>
            <h1 className="text-3xl lg:text-4xl font-black" style={{ color: '#c1121f' }}>Join as Volunteer</h1>
          </div>
          <p className="text-black text-sm lg:text-base leading-relaxed max-w-xl mx-auto mb-4">
            Become a community responder. Your skills can save lives when disasters strike.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border" style={{ backgroundColor: 'rgba(193,18,31,0.08)', borderColor: 'rgba(193,18,31,0.2)' }}>
            <Zap className="w-4 h-4 flex-shrink-0" style={{ color: '#c1121f' }} />
            <span className="text-sm font-medium" style={{ color: '#c1121f' }}>
              {liveStats
                ? `${liveStats.volunteers} volunteer${liveStats.volunteers !== 1 ? "s" : ""} registered`
                : "Join active volunteers"}
            </span>
          </div>
        </div>

        {/* Two-column on md+ */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10 transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>

          {/* Left: Form (2/3 width on md+) */}
          <div className="md:col-span-2">
            <div className="rounded-2xl p-6 lg:p-8 border" style={{ backgroundColor: 'rgba(255,255,255,0.7)', borderColor: 'rgba(193,18,31,0.2)' }}>
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        <User className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        value={name}
                        onChange={(e) => { setName(e.target.value); setFieldErrors((p) => ({ ...p, name: undefined })); }}
                        placeholder="Full name"
                        className="w-full pl-11 pr-4 py-3 bg-white/60 border rounded-xl text-black placeholder-gray-500 focus:outline-none transition-colors"
                        style={{ borderColor: fieldErrors.name ? '#c1121f' : 'rgb(209 213 219)' }}
                        onFocus={(e) => { if (!fieldErrors.name) e.currentTarget.style.borderColor = '#c1121f'; }}
                        onBlur={(e) => { if (!fieldErrors.name) e.currentTarget.style.borderColor = 'rgb(209 213 219)'; }}
                      />
                    </div>
                    {fieldErrors.name && <p className="mt-1 text-xs" style={{ color: '#c1121f' }}>{fieldErrors.name}</p>}
                  </div>

                  <div>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        <Phone className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        value={phone}
                        onChange={(e) => { setPhone(e.target.value); setFieldErrors((p) => ({ ...p, phone: undefined })); }}
                        placeholder="Phone number"
                        type="tel"
                        className="w-full pl-11 pr-4 py-3 bg-white/60 border rounded-xl text-black placeholder-gray-500 focus:outline-none transition-colors"
                        style={{ borderColor: fieldErrors.phone ? '#c1121f' : 'rgb(209 213 219)' }}
                        onFocus={(e) => { if (!fieldErrors.phone) e.currentTarget.style.borderColor = '#c1121f'; }}
                        onBlur={(e) => { if (!fieldErrors.phone) e.currentTarget.style.borderColor = 'rgb(209 213 219)'; }}
                      />
                    </div>
                    {fieldErrors.phone && <p className="mt-1 text-xs" style={{ color: '#c1121f' }}>{fieldErrors.phone}</p>}
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <div className="absolute left-3 top-4">
                      <Zap className="w-5 h-5 text-gray-400" />
                    </div>
                    <textarea
                      value={skills}
                      onChange={(e) => { setSkills(e.target.value); setFieldErrors((p) => ({ ...p, skills: undefined })); }}
                      placeholder="Skills & experience (e.g., medical training, logistics, search & rescue, tech support)"
                      rows={3}
                      className="w-full pl-11 pr-4 py-3 bg-white/60 border rounded-xl text-black placeholder-gray-500 focus:outline-none transition-colors resize-none"
                      style={{ borderColor: fieldErrors.skills ? '#c1121f' : 'rgb(209 213 219)' }}
                      onFocus={(e) => { if (!fieldErrors.skills) e.currentTarget.style.borderColor = '#c1121f'; }}
                      onBlur={(e) => { if (!fieldErrors.skills) e.currentTarget.style.borderColor = 'rgb(209 213 219)'; }}
                    />
                  </div>
                  {fieldErrors.skills && <p className="mt-1 text-xs" style={{ color: '#c1121f' }}>{fieldErrors.skills}</p>}
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl border" style={{ backgroundColor: 'rgba(193,18,31,0.08)', borderColor: 'rgba(193,18,31,0.25)' }}>
                  <input
                    type="checkbox"
                    id="alerts"
                    checked={subscribed}
                    onChange={(e) => setSubscribed(e.target.checked)}
                    className="w-4 h-4 rounded border-2 bg-transparent flex-shrink-0"
                    style={{ borderColor: '#c1121f', accentColor: '#c1121f' }}
                  />
                  <label htmlFor="alerts" className="text-sm flex items-center gap-2 text-black cursor-pointer">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" style={{ color: '#c1121f' }} />
                    Subscribe to real-time emergency alerts (push notifications to this device)
                  </label>
                </div>

                {submitError && (
                  <div className="rounded-xl p-3 border border-red-300 bg-red-50">
                    <p className="text-red-700 text-sm">{submitError}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="group w-full relative overflow-hidden text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
                  style={{ background: loading ? '#9ca3af' : 'linear-gradient(to right, #003049, #1d4ed8)', boxShadow: loading ? 'none' : '0 4px 14px 0 rgba(0,48,73,0.35)' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <span className="relative flex items-center justify-center gap-2">
                    {loading ? (
                      <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>Registering...</>
                    ) : (
                      <><Heart className="w-5 h-5" />Join as Volunteer</>
                    )}
                  </span>
                </button>
              </form>

              {success && (
                <div className="mt-5 rounded-xl p-4 border border-green-400/30" style={{ backgroundColor: 'rgba(22,163,74,0.1)' }}>
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <p className="text-green-700 font-semibold text-sm">You&apos;re registered!</p>
                  </div>
                  <p className="text-green-600 text-xs">
                    You&apos;ll receive push notifications for emergencies — even when this tab is closed. Thank you for stepping up.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right: What to expect */}
          <div className="space-y-4">
            <div className="rounded-2xl p-6 border" style={{ backgroundColor: 'rgba(255,255,255,0.7)', borderColor: 'rgba(193,18,31,0.2)' }}>
              <h3 className="font-semibold mb-4 text-black">What to Expect</h3>
              <div className="space-y-4">
                {[
                  { icon: Bell, title: "Push notifications", desc: "Alerts delivered to your phone even when the browser is closed" },
                  { icon: Shield, title: "AI-triaged severity", desc: "Each alert is pre-classified so you instantly know urgency" },
                  { icon: Smartphone, title: "No app install", desc: "Works on Android Chrome and iOS Safari 16.4+ via Web Push" },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(193,18,31,0.1)' }}>
                        <Icon className="w-4 h-4" style={{ color: '#c1121f' }} />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-black">{item.title}</p>
                        <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {liveStats && (
              <div className="rounded-2xl p-6 border" style={{ backgroundColor: 'rgba(255,255,255,0.7)', borderColor: 'rgba(193,18,31,0.2)' }}>
                <h3 className="font-semibold mb-4 text-black">Platform Activity</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-black" style={{ color: '#c1121f' }}>{liveStats.volunteers}</div>
                    <div className="text-xs text-gray-600">Volunteers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-black" style={{ color: '#003049' }}>{liveStats.incidents}</div>
                    <div className="text-xs text-gray-600">Incidents</div>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
