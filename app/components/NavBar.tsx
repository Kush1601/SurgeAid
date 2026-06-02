"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AlertTriangle, Heart, FileText, MapPin, History, BarChart2, LogIn } from "lucide-react";
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";

export default function NavBar() {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();

  const navItems = [
    { href: "/volunteer", label: "Volunteer", icon: Heart, authOnly: false },
    { href: "/report", label: "Report", icon: FileText, authOnly: false },
    { href: "/map", label: "Map", icon: MapPin, authOnly: false },
    { href: "/history", label: "History", icon: History, authOnly: false },
    { href: "/dashboard", label: "Dashboard", icon: BarChart2, authOnly: true },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
          <div className="relative">
            <AlertTriangle className="w-5 h-5 group-hover:animate-pulse" style={{ color: '#c1121f' }} />
            <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: '#c1121f' }}></div>
          </div>
          <span className="text-lg font-bold" style={{ color: '#c1121f' }}>SurgeAid</span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          {/* Nav links */}
          <nav className="flex">
            {navItems.filter(item => !item.authOnly || isSignedIn).map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive ? "shadow-sm" : "text-gray-600 hover:bg-gray-50"
                  }`}
                  style={{
                    backgroundColor: isActive ? '#fef3c7' : undefined,
                    color: isActive ? '#c1121f' : undefined,
                  }}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" style={{ color: isActive ? '#c1121f' : undefined }} />
                  <span className="hidden xs:inline sm:inline leading-none">{item.label}</span>
                  {isActive && (
                    <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full" style={{ backgroundColor: '#c1121f' }}></div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Auth */}
          {isSignedIn ? (
            <UserButton />
          ) : (
            <SignInButton mode="modal">
              <button className="ml-1 flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-semibold text-white transition-colors flex-shrink-0" style={{ backgroundColor: '#c1121f' }}>
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            </SignInButton>
          )}
        </div>
      </div>
    </header>
  );
}
