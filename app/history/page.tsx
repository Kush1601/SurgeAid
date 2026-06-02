"use client";
import { useState, useEffect, useCallback } from "react";
import { Search, Clock, MapPin, Users, ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react";
import type { Disaster } from "../../lib/types";

interface SearchResult extends Disaster {
  id: string;
}

interface ApiResponse {
  results: SearchResult[];
  total: number;
  page: number;
  pageSize: number;
}

const severityColors: Record<string, string> = {
  CRITICAL: '#ff0000', HIGH: '#c1121f', MEDIUM: '#f59e0b', LOW: '#22c55e', UNKNOWN: '#9ca3af',
};

const statusColors: Record<string, string> = {
  ACTIVE: '#fbbf24', RESOLVED: '#22c55e', FALSE_ALARM: '#9ca3af',
};

export default function HistoryPage() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const pageSize = 10;

  useEffect(() => { setIsVisible(true); }, []);

  useEffect(() => {
    const t = setTimeout(() => { setDebouncedQuery(query); setPage(0); }, 350);
    return () => clearTimeout(t);
  }, [query]);

  const fetchResults = useCallback(async () => {
    setLoading(true);
    const start = performance.now();
    const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
    if (debouncedQuery) params.set("q", debouncedQuery);
    const res = await fetch(`/api/search?${params}`);
    const data: ApiResponse = await res.json();
    const elapsed = Math.round(performance.now() - start);
    console.log(`[history] search "${debouncedQuery}" page ${page} → ${data.total} results in ${elapsed}ms`);
    setResults(data.results);
    setTotal(data.total);
    setLoading(false);
  }, [debouncedQuery, page]);

  useEffect(() => { fetchResults(); }, [fetchResults]);

  const totalPages = Math.ceil(total / pageSize);

  const formatTimeAgo = (ts: string | null | undefined) => {
    if (!ts) return "";
    const diff = Math.floor((Date.now() - new Date(ts).getTime()) / 60000);
    if (diff < 1) return "Just now";
    if (diff < 60) return `${diff}m ago`;
    const h = Math.floor(diff / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  return (
    <div className="min-h-screen text-black" style={{ backgroundColor: '#fefbf3' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

        {/* Header */}
        <div className={`mb-8 transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-8 h-8" style={{ color: '#c1121f' }} />
            <h1 className="text-3xl font-black" style={{ color: '#c1121f' }}>Incident History</h1>
          </div>
          <p className="text-gray-600 text-sm">Search and browse all reported incidents</p>
        </div>

        {/* Search bar */}
        <div className={`mb-6 transition-all duration-700 delay-100 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search incidents by title or description..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl text-black placeholder-gray-400 focus:outline-none shadow-sm transition-colors text-sm"
              onFocus={e => e.currentTarget.style.borderColor = '#c1121f'}
              onBlur={e => e.currentTarget.style.borderColor = 'rgb(229 231 235)'}
            />
            {loading && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-gray-300 border-t-red-600 rounded-full animate-spin" />
            )}
          </div>
          <p className="text-xs text-gray-400 mt-2 ml-1">
            {total > 0 ? `${total} incident${total !== 1 ? 's' : ''} found` : loading ? 'Searching…' : 'No incidents found'}
          </p>
        </div>

        {/* Results */}
        <div className={`space-y-3 transition-all duration-700 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {results.map(r => {
            const severityColor = severityColors[r.severity ?? 'UNKNOWN'] ?? '#9ca3af';
            const statusColor = statusColors[r.status ?? 'ACTIVE'] ?? '#fbbf24';
            const isResolved = r.status === 'RESOLVED' || r.status === 'FALSE_ALARM';
            return (
              <div
                key={r.id}
                className="rounded-2xl p-5 border bg-white shadow-sm transition-shadow hover:shadow-md"
                style={{ borderColor: isResolved ? 'rgba(34,197,94,0.2)' : 'rgba(193,18,31,0.15)' }}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2 flex-wrap min-w-0">
                    <h3 className="font-semibold text-black text-sm">{r.title}</h3>
                    {r.severity && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded text-white flex-shrink-0" style={{ backgroundColor: severityColor }}>
                        {r.severity}
                      </span>
                    )}
                    <span className="text-xs font-semibold px-2 py-0.5 rounded flex-shrink-0" style={{ backgroundColor: `${statusColor}22`, color: statusColor }}>
                      {r.status ?? 'ACTIVE'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400 flex-shrink-0">
                    <Clock className="w-3 h-3" />
                    {formatTimeAgo(r.created_at)}
                  </div>
                </div>

                {r.description && (
                  <p className="text-gray-600 text-sm mb-3 leading-relaxed">{r.description}</p>
                )}

                <div className="flex items-center gap-4 flex-wrap text-xs text-gray-500">
                  {r.lat && r.lng && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span>{r.lat.toFixed(4)}, {r.lng.toFixed(4)}</span>
                    </div>
                  )}
                  {r.recommended_skills && (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Users className="w-3 h-3 text-blue-400 flex-shrink-0" />
                      {r.recommended_skills.split(',').map(s => s.trim()).filter(Boolean).map(skill => (
                        <span key={skill} className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {!loading && results.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">{debouncedQuery ? `No incidents matching "${debouncedQuery}"` : 'No incidents reported yet'}</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-600">
              Page {page + 1} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="p-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
