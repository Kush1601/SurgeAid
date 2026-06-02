"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import type { RealtimeAlert } from "../../lib/types";

async function requestNotificationPermission() {
  if (typeof Notification === "undefined") return;
  if (Notification.permission === "default") {
    await Notification.requestPermission();
  }
}

function fireBrowserNotification(alert: RealtimeAlert) {
  if (typeof Notification === "undefined") return;
  if (Notification.permission !== "granted") return;
  new Notification(`🚨 ${alert.severity} — ${alert.title}`, {
    body: alert.description || "New emergency reported on SurgeAid",
    icon: "/favicon.ico",
    tag: String(alert.id),
  });
}

export function useSupabaseAlerts(): RealtimeAlert[] {
  const [alerts, setAlerts] = useState<RealtimeAlert[]>([]);

  useEffect(() => {
    requestNotificationPermission();

    const channelName = `surgeaid-alerts:${Math.random().toString(36).slice(2)}`;
    const channel = supabase
      .channel(channelName)
      .on("broadcast", { event: "new-incident" }, ({ payload }) => {
        const alert: RealtimeAlert = { ...payload, id: Date.now() };
        setAlerts((prev) => [alert, ...prev].slice(0, 10));
        fireBrowserNotification(alert);
        setTimeout(() => {
          setAlerts((prev) => prev.filter((a) => a.id !== alert.id));
        }, 8000);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return alerts;
}
