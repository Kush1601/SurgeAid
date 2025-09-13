"use client";
import { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { Heart, Phone, User, Zap, CheckCircle, AlertTriangle } from 'lucide-react';

export default function VolunteerForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [skills, setSkills] = useState("");
  const [subscribed, setSubscribed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "volunteers"), {
        name,
        phone,
        skills,
        subscribed,
        createdAt: new Date()
      });
      setSuccess(true);
      setName(""); setPhone(""); setSkills("");
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      console.error(err);
      alert("Error saving data.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen text-black -mx-4 -my-4" style={{backgroundColor: '#fefbf3'}}>

      <div className="relative z-10 max-w-xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className={`text-center mb-8 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="relative">
              <Heart className="w-8 h-8 animate-pulse" style={{color: '#c1121f'}} />
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-ping" style={{backgroundColor: '#c1121f'}}></div>
            </div>
            <h1 className="text-3xl font-black" style={{color: '#c1121f'}}>
              Join Our Heroes
            </h1>
          </div>

          <p className="text-black text-sm mb-6 leading-relaxed">
            Become a certified community responder. Your skills and compassion can save lives when disasters strike.
          </p>

          <div className="backdrop-blur-lg rounded-xl p-4 border mb-6" style={{backgroundColor: 'rgba(193, 18, 31, 0.1)', borderColor: 'rgba(193, 18, 31, 0.3)'}}>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Zap className="w-4 h-4" style={{color: '#c1121f'}} />
              <span className="font-semibold text-sm" style={{color: '#c1121f'}}>INSTANT IMPACT</span>
              <Zap className="w-4 h-4" style={{color: '#c1121f'}} />
            </div>
            <p className="text-black text-xs">
              Join <span className="font-bold" style={{color: '#c1121f'}}>150+ active volunteers</span> making a difference
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className={`transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="backdrop-blur-lg rounded-2xl p-6 border" style={{backgroundColor: 'rgba(255, 255, 255, 0.4)', borderColor: 'rgba(193, 18, 31, 0.2)'}}>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Field */}
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  value={name}
                  onChange={(e)=>setName(e.target.value)}
                  required
                  placeholder="Full name"
                  className="w-full pl-11 pr-4 py-3 bg-white/20 backdrop-blur border border-gray-300 rounded-xl text-black placeholder-gray-500 focus:outline-none transition-colors"
                  onFocus={(e) => e.target.style.borderColor = '#c1121f'}
                  onBlur={(e) => e.target.style.borderColor = 'rgb(209 213 219)'}
                />
              </div>

              {/* Phone Field */}
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Phone className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  value={phone}
                  onChange={(e)=>setPhone(e.target.value)}
                  required
                  placeholder="Phone number (e.g. +1415555...)"
                  className="w-full pl-11 pr-4 py-3 bg-white/20 backdrop-blur border border-gray-300 rounded-xl text-black placeholder-gray-500 focus:outline-none transition-colors"
                  onFocus={(e) => e.target.style.borderColor = '#c1121f'}
                  onBlur={(e) => e.target.style.borderColor = 'rgb(209 213 219)'}
                />
              </div>

              {/* Skills Field */}
              <div className="relative">
                <div className="absolute left-3 top-4">
                  <Zap className="w-5 h-5 text-gray-400" />
                </div>
                <textarea
                  value={skills}
                  onChange={(e)=>setSkills(e.target.value)}
                  placeholder="Skills & experience (e.g., medical training, logistics, search & rescue, tech support)"
                  rows={3}
                  className="w-full pl-11 pr-4 py-3 bg-white/20 backdrop-blur border border-gray-300 rounded-xl text-black placeholder-gray-500 focus:outline-none transition-colors resize-none"
                  onFocus={(e) => e.target.style.borderColor = '#c1121f'}
                  onBlur={(e) => e.target.style.borderColor = 'rgb(209 213 219)'}
                />
              </div>

              {/* SMS Subscription */}
              <div className="flex items-center gap-3 p-4 rounded-xl border" style={{backgroundColor: 'rgba(193, 18, 31, 0.1)', borderColor: 'rgba(193, 18, 31, 0.3)'}}>
                <input
                  type="checkbox"
                  id="sms-alerts"
                  checked={subscribed}
                  onChange={(e)=>setSubscribed(e.target.checked)}
                  className="w-4 h-4 rounded border-2 bg-transparent"
                  style={{borderColor: '#c1121f', backgroundColor: subscribed ? '#c1121f' : 'transparent'}}
                />
                <label htmlFor="sms-alerts" className="text-sm flex items-center gap-2 text-black">
                  <AlertTriangle className="w-4 h-4" />
                  Subscribe to emergency SMS alerts in my area
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="group w-full relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <span className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Joining Heroes Network...
                    </>
                  ) : (
                    <>
                      <Heart className="w-5 h-5" />
                      Join as Volunteer Hero
                    </>
                  )}
                </span>
              </button>
            </form>

            {/* Success Message */}
            {success && (
              <div className="mt-6 bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-lg rounded-xl p-4 border border-green-400/30 animate-pulse">
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <p className="text-green-300 font-semibold">Welcome to the Heroes Network!</p>
                </div>
                <p className="text-green-200 text-sm text-center mt-2">
                  You'll receive SMS alerts for emergencies in your area. Thank you for stepping up to help your community!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Info Cards */}
        <div className={`mt-8 space-y-4 transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="backdrop-blur-lg rounded-xl p-4 border" style={{backgroundColor: 'rgba(255, 255, 255, 0.3)', borderColor: 'rgba(193, 18, 31, 0.2)'}}>
            <h3 className="font-semibold mb-2" style={{color: '#669bbc'}}>What to Expect</h3>
            <ul className="text-black text-sm space-y-1">
              <li>• Receive SMS alerts only for emergencies in your area</li>
              <li>• One-tap response system - no complex apps</li>
              <li>• Background verification for community safety</li>
              <li>• Optional training sessions and community events</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
