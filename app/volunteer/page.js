"use client";
import { useState } from "react";
import { db } from "../../lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function VolunteerForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [skills, setSkills] = useState("");
  const [subscribed, setSubscribed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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
    <main className="flex min-h-screen items-start justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6 mt-6">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-4">Volunteer Signup</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input value={name} onChange={(e)=>setName(e.target.value)} required placeholder="Full name" className="w-full px-4 py-2 border rounded-lg" />
          <input value={phone} onChange={(e)=>setPhone(e.target.value)} required placeholder="Phone number (e.g. +1415555...)" className="w-full px-4 py-2 border rounded-lg" />
          <input value={skills} onChange={(e)=>setSkills(e.target.value)} placeholder="Skills (e.g., medical, logistics)" className="w-full px-4 py-2 border rounded-lg" />
          <label className="flex items-center gap-3">
            <input type="checkbox" checked={subscribed} onChange={(e)=>setSubscribed(e.target.checked)} />
            <span className="text-sm">Subscribe to SMS alerts</span>
          </label>
          <button type="submit" disabled={loading} className="w-full py-2 bg-blue-600 text-white rounded-lg">
            {loading ? "Submitting..." : "Sign Up"}
          </button>
        </form>
        {success && <p className="text-green-600 mt-4 text-center">Thanks — you’re signed up!</p>}
      </div>
    </main>
  );
}
