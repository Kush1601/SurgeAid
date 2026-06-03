const SEVERITY_COLORS = {
  CRITICAL: "#c1121f",
  HIGH: "#ef4444",
  MEDIUM: "#fbbf24",
  LOW: "#22c55e",
  UNKNOWN: "#6b7280",
};

self.addEventListener("push", (event) => {
  if (!event.data) return;

  let payload;
  try {
    payload = event.data.json();
  } catch {
    payload = { title: "SurgeAid Alert", body: event.data.text(), severity: "UNKNOWN" };
  }

  const { title, description, severity = "UNKNOWN", lat, lng } = payload;

  const color = SEVERITY_COLORS[severity] ?? SEVERITY_COLORS.UNKNOWN;
  const locationText = lat && lng ? ` — ${Number(lat).toFixed(3)}, ${Number(lng).toFixed(3)}` : "";

  event.waitUntil(
    self.registration.showNotification(`[${severity}] ${title}`, {
      body: `${description ?? ""}${locationText}`,
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      tag: `surgeaid-${severity}`,
      data: { url: "/map" },
      vibrate: severity === "CRITICAL" ? [200, 100, 200, 100, 200] : [200],
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url ?? "/";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});
