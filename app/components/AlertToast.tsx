"use client";
import { AlertTriangle, MapPin } from "lucide-react";
import type { RealtimeAlert, Severity } from "../../lib/types";

const SEVERITY_STYLES: Record<Severity, { bg: string; border: string; label: string }> = {
  CRITICAL: { bg: "rgba(127,0,0,0.95)",   border: "#ff0000", label: "CRITICAL" },
  HIGH:     { bg: "rgba(193,18,31,0.92)",  border: "#c1121f", label: "HIGH" },
  MEDIUM:   { bg: "rgba(180,100,0,0.92)", border: "#fbbf24", label: "MEDIUM" },
  LOW:      { bg: "rgba(30,80,30,0.92)",  border: "#4ade80", label: "LOW" },
  UNKNOWN:  { bg: "rgba(50,50,50,0.92)",  border: "#9ca3af", label: "NEW" },
};

export default function AlertToast({ alerts }: { alerts: RealtimeAlert[] }) {
  if (!alerts.length) return null;

  return (
    <div className="fixed top-4 right-2 left-2 sm:left-auto sm:right-4 z-50 flex flex-col gap-2 sm:max-w-sm w-auto pointer-events-none">
      {alerts.map((alert) => {
        const style = SEVERITY_STYLES[alert.severity] ?? SEVERITY_STYLES.UNKNOWN;
        return (
          <div
            key={alert.id}
            className="rounded-xl p-4 shadow-2xl pointer-events-auto"
            style={{
              backgroundColor: style.bg,
              border: `1px solid ${style.border}`,
              backdropFilter: "blur(12px)",
            }}
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: style.border }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ backgroundColor: style.border, color: "#fff" }}>
                    {style.label}
                  </span>
                  <span className="text-white font-semibold text-sm truncate">{alert.title}</span>
                </div>
                {alert.description && (
                  <p className="text-gray-200 text-xs leading-relaxed line-clamp-2">{alert.description}</p>
                )}
                {alert.lat && alert.lng && (
                  <div className="flex items-center gap-1 mt-1 text-gray-400 text-xs">
                    <MapPin className="w-3 h-3" />
                    {Number(alert.lat).toFixed(4)}, {Number(alert.lng).toFixed(4)}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
