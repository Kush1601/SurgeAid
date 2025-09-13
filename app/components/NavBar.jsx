"use client";
import Link from "next/link";

export default function NavBar() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-600">
          SurgeAid
        </Link>

        <nav className="flex gap-2">
          <Link href="/volunteer" className="px-3 py-2 text-sm rounded hover:bg-gray-100">
            Volunteer
          </Link>
          <Link href="/report" className="px-3 py-2 text-sm rounded hover:bg-gray-100">
            Report
          </Link>
          <Link href="/map" className="px-3 py-2 text-sm rounded hover:bg-gray-100">
            Map
          </Link>
        </nav>
      </div>
    </header>
  );
}
