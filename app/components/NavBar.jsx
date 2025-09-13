"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AlertTriangle, Heart, FileText, MapPin } from "lucide-react";

export default function NavBar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/volunteer", label: "Volunteer", icon: Heart },
    { href: "/report", label: "Report", icon: FileText },
    { href: "/map", label: "Map", icon: MapPin }
  ];

  return (
    <header className="relative z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200/50 shadow-sm">
      <div className="max-w-xl mx-auto px-3 py-2 flex items-center justify-between">
        {/* Logo - Compact Mobile Version */}
        <Link href="/" className="flex items-center gap-2 group min-w-0">
          <div className="relative flex-shrink-0">
            <AlertTriangle className="w-5 h-5 group-hover:animate-pulse transition-all" style={{color: '#ca0013'}} />
            <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full animate-ping" style={{backgroundColor: '#ca0013'}}></div>
          </div>
          <span className="text-lg font-bold truncate" style={{color: '#ca0013'}}>
            SurgeAid
          </span>
        </Link>

        {/* Mobile-First Navigation */}
        <nav className="flex gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative px-2 py-1.5 text-xs rounded-md font-medium transition-all duration-200 ${
                  isActive
                    ? "shadow-sm"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
                style={{
                  backgroundColor: isActive ? '#fef3c7' : undefined,
                  color: isActive ? '#ca0013' : undefined
                }}
              >
                <div className="flex flex-col items-center gap-0.5 min-w-0">
                  <Icon className={`w-4 h-4 flex-shrink-0 ${
                    isActive ? "" : "text-gray-500"
                  }`} style={{color: isActive ? '#ca0013' : undefined}} />
                  <span className="truncate leading-none">{item.label}</span>
                </div>

                {/* Active indicator - Mobile style */}
                {isActive && (
                  <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-4 h-0.5 rounded-full" style={{backgroundColor: '#ca0013'}}></div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
