"use client";
import { useEffect, useState } from "react";
import { BarChart2, Users, AlertTriangle, CheckCircle, TrendingUp, Zap } from "lucide-react";

interface DashboardData {
  severityCounts: Record<string, number>;
  statusCounts: Record<string, number>;
  signupsByDay: Record<string, number>;
  incidentsByDay: Record<string, number>;
  byHour: number[];
  totals: { disasters: number; volunteers: number };
  latency: { p50: number | null; p95: number | null; sampleSize: number };
}

const severityColors: Record<string, string> = {
  CRITICAL: '#ff0000', HIGH: '#c1121f', MEDIUM: '#f59e0b', LOW: '#22c55e', UNKNOWN: '#9ca3af',
};

function BarChartSVG({ data, colors, height = 120 }: { data: { label: string; value: number }[]; colors: (label: string) => string; height?: number }) {
  const max = Math.max(...data.map(d => d.value), 1);
  const w = 100 / data.length;
  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${data.length * 40} ${height + 24}`} className="w-full" style={{ height: height + 24 }}>
        {data.map((d, i) => {
          const barH = Math.max((d.value / max) * height, d.value > 0 ? 4 : 0);
          const x = i * 40 + 4;
          const y = height - barH;
          return (
            <g key={d.label}>
              <rect x={x} y={y} width={32} height={barH} fill={colors(d.label)} rx={3} opacity={0.85} />
              <text x={x + 16} y={height + 14} textAnchor="middle" fontSize={9} fill="#6b7280">{d.label}</text>
              {d.value > 0 && (
                <text x={x + 16} y={y - 3} textAnchor="middle" fontSize={9} fill="#374151" fontWeight="600">{d.value}</text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function LineChartSVG({ data, color = '#c1121f', height = 100 }: { data: { label: string; value: number }[]; color?: string; height?: number }) {
  const max = Math.max(...data.map(d => d.value), 1);
  const W = data.length * 30;
  const points = data.map((d, i) => {
    const x = i * 30 + 15;
    const y = height - (d.value / max) * (height - 10) - 5;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${height + 20}`} className="w-full" style={{ height: height + 20 }}>
      <polyline points={points} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      {data.map((d, i) => {
        const x = i * 30 + 15;
        const y = height - (d.value / max) * (height - 10) - 5;
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={3} fill={color} />
            {d.value > 0 && <text x={x} y={y - 6} textAnchor="middle" fontSize={8} fill="#374151">{d.value}</text>}
          </g>
        );
      })}
      {/* x-axis labels — show every 7th */}
      {data.map((d, i) => i % 7 === 0 && (
        <text key={i} x={i * 30 + 15} y={height + 14} textAnchor="middle" fontSize={8} fill="#9ca3af">
          {d.label.slice(5)}
        </text>
      ))}
    </svg>
  );
}

function HourHeatmap({ byHour }: { byHour: number[] }) {
  const max = Math.max(...byHour, 1);
  return (
    <div className="flex gap-0.5 flex-wrap">
      {byHour.map((v, h) => {
        const intensity = v / max;
        const bg = intensity === 0
          ? '#f3f4f6'
          : `rgba(193,18,31,${0.15 + intensity * 0.85})`;
        return (
          <div
            key={h}
            title={`${h}:00 — ${v} incident${v !== 1 ? 's' : ''}`}
            className="rounded flex items-center justify-center text-xs font-medium cursor-default"
            style={{ width: 32, height: 32, backgroundColor: bg, color: intensity > 0.5 ? '#fff' : '#374151', fontSize: 10 }}
          >
            {h}
          </div>
        );
      })}
    </div>
  );
}

export default function DashboardClient() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    fetch("/api/dashboard").then(r => r.json()).then(setData);
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fefbf3' }}>
        <div className="w-6 h-6 border-2 border-gray-300 border-t-red-600 rounded-full animate-spin" />
      </div>
    );
  }

  const severityData = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'UNKNOWN'].map(s => ({
    label: s === 'UNKNOWN' ? 'UNK' : s.slice(0, 3),
    value: data.severityCounts[s] ?? 0,
    key: s,
  }));

  const statusData = ['ACTIVE', 'RESOLVED', 'FALSE_ALARM'].map(s => ({
    label: s === 'FALSE_ALARM' ? 'FALSE' : s.slice(0, 3),
    value: data.statusCounts[s] ?? 0,
    key: s,
  }));

  const statusColors: Record<string, string> = { ACT: '#fbbf24', RES: '#22c55e', FAL: '#9ca3af' };

  const signupSeries = Object.entries(data.signupsByDay).map(([label, value]) => ({ label, value }));
  const incidentSeries = Object.entries(data.incidentsByDay).map(([label, value]) => ({ label, value }));

  const resolvedPct = data.totals.disasters > 0
    ? Math.round(((data.statusCounts.RESOLVED ?? 0) / data.totals.disasters) * 100)
    : 0;

  return (
    <div className="min-h-screen text-black" style={{ backgroundColor: '#fefbf3' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

        {/* Header */}
        <div className={`mb-8 transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="flex items-center gap-3 mb-1">
            <BarChart2 className="w-8 h-8" style={{ color: '#c1121f' }} />
            <h1 className="text-3xl font-black" style={{ color: '#c1121f' }}>Coordinator Dashboard</h1>
          </div>
          <p className="text-gray-500 text-sm">Live analytics — coordinator access only</p>
        </div>

        {/* KPI row */}
        <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4 transition-all duration-700 delay-100 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {[
            { label: 'Total Incidents', value: data.totals.disasters, icon: AlertTriangle, color: '#c1121f' },
            { label: 'Volunteers', value: data.totals.volunteers, icon: Users, color: '#3b82f6' },
            { label: 'Resolved', value: data.statusCounts.RESOLVED ?? 0, icon: CheckCircle, color: '#22c55e' },
            { label: 'Resolution Rate', value: `${resolvedPct}%`, icon: TrendingUp, color: '#f59e0b' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <Icon className="w-4 h-4" style={{ color }} />
                <span className="text-xs text-gray-500 font-medium">{label}</span>
              </div>
              <div className="text-2xl font-black" style={{ color }}>{value}</div>
            </div>
          ))}
        </div>

        {/* AI latency KPI row */}
        <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 transition-all duration-700 delay-150 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {[
            {
              label: 'AI Classify P50',
              value: data.latency.p50 != null ? `${data.latency.p50}ms` : '—',
              sub: 'median latency',
            },
            {
              label: 'AI Classify P95',
              value: data.latency.p95 != null ? `${data.latency.p95}ms` : '—',
              sub: '95th percentile',
            },
            {
              label: 'Measured Incidents',
              value: data.latency.sampleSize,
              sub: 'with classify_ms logged',
            },
          ].map(({ label, value, sub }) => (
            <div key={label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4" style={{ color: '#f59e0b' }} />
                <span className="text-xs text-gray-500 font-medium">{label}</span>
              </div>
              <div className="text-2xl font-black" style={{ color: '#f59e0b' }}>{value}</div>
              <div className="text-xs text-gray-400 mt-0.5">{sub}</div>
            </div>
          ))}
        </div>

        {/* Charts row 1 */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 transition-all duration-700 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-sm text-gray-700 mb-4">Incidents by Severity</h3>
            <BarChartSVG
              data={severityData.map(d => ({ label: d.label, value: d.value }))}
              colors={(label) => {
                const full = ['CRI', 'HIG', 'MED', 'LOW', 'UNK'];
                const keys = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'UNKNOWN'];
                const i = full.indexOf(label);
                return severityColors[keys[i] ?? 'UNKNOWN'] ?? '#9ca3af';
              }}
            />
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-sm text-gray-700 mb-4">Incidents by Status</h3>
            <BarChartSVG
              data={statusData.map(d => ({ label: d.label, value: d.value }))}
              colors={(label) => ({ ACT: '#fbbf24', RES: '#22c55e', FAL: '#9ca3af' })[label] ?? '#9ca3af'}
            />
          </div>
        </div>

        {/* Charts row 2 */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 transition-all duration-700 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-sm text-gray-700 mb-4">Incidents — Last 14 Days</h3>
            <LineChartSVG data={incidentSeries} color="#c1121f" />
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-sm text-gray-700 mb-4">Volunteer Signups — Last 14 Days</h3>
            <LineChartSVG data={signupSeries} color="#3b82f6" />
          </div>
        </div>

        {/* Hour heatmap */}
        <div className={`bg-white rounded-2xl p-5 border border-gray-100 shadow-sm transition-all duration-700 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h3 className="font-semibold text-sm text-gray-700 mb-1">Incidents by Hour of Day</h3>
          <p className="text-xs text-gray-400 mb-4">Hover each cell to see the count — darker red = more incidents</p>
          <HourHeatmap byHour={data.byHour} />
        </div>

      </div>
    </div>
  );
}
