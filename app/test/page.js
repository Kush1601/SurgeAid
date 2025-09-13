"use client";
import { db } from "../../lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function TestPage() {
  const addVolunteer = async () => {
    await addDoc(collection(db, "volunteers"), {
      name: "Test User",
      phone: "1234567890",
      skills: "Medical",
      subscribed: true,
    });
    alert("Volunteer added!");
  };

  return (
    <main className="flex min-h-screen items-center justify-center">
      <button
        onClick={addVolunteer}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg"
      >
        Add Test Volunteer
      </button>
    </main>
  );
}
