export type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "UNKNOWN";
export type IncidentStatus = "ACTIVE" | "RESOLVED" | "FALSE_ALARM";

export interface Volunteer {
  id?: string;
  name: string;
  phone: string;
  skills: string;
  subscribed: boolean;
  created_at?: string;
}

export interface Disaster {
  id?: string;
  title: string;
  description: string;
  lat: number | null;
  lng: number | null;
  severity?: Severity;
  action?: string;
  status?: IncidentStatus;
  recommended_skills?: string;
  created_at?: string;
}

export interface RealtimeAlert {
  id: number;
  title: string;
  description: string;
  lat: number | null;
  lng: number | null;
  severity: Severity;
  timestamp: string;
}
