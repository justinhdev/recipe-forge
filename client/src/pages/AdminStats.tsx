import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  Activity,
  AlertTriangle,
  Clock3,
  DollarSign,
  Gauge,
  RefreshCcw,
} from "lucide-react";
import PageWrapper from "../components/PageWrapper";
import api from "../utils/api";
import { toMessage } from "../utils/error";

type GenerationStatus = "SUCCESS" | "FAILURE";

type RecentGeneration = {
  id: number;
  status: GenerationStatus;
  latencyMs: number;
  estimatedCostUsd: number | null;
  failureReason: string | null;
  model: string;
  promptVersion: string;
  totalTokens: number | null;
  createdAt: string;
};

type AdminStatsResponse = {
  totalGenerations: number;
  sampleSize: number;
  successfulGenerations: number;
  failedGenerations: number;
  successRate: number;
  averageLatencyMs: number | null;
  p50LatencyMs: number | null;
  p95LatencyMs: number | null;
  totalEstimatedCostUsd: number;
  last24hGenerations: number;
  statusCounts: Partial<Record<GenerationStatus, number>>;
  modelCounts: Record<string, number>;
  promptVersionCounts: Record<string, number>;
  failureReasons: Record<string, number>;
  recentGenerations: RecentGeneration[];
};

const formatMs = (value: number | null) =>
  value === null ? "N/A" : `${value.toLocaleString()} ms`;

const formatPercent = (value: number) =>
  `${Math.round(value * 100).toLocaleString()}%`;

const formatCurrency = (value: number | null | undefined) =>
  typeof value === "number"
    ? value.toLocaleString(undefined, {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 4,
        maximumFractionDigits: 6,
      })
    : "N/A";

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));

function StatTile({
  label,
  value,
  caption,
  icon,
}: {
  label: string;
  value: string;
  caption?: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {label}
        </p>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
          {icon}
        </div>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-normal text-gray-950 dark:text-white">
        {value}
      </p>
      {caption && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {caption}
        </p>
      )}
    </div>
  );
}

function CountList({
  title,
  values,
}: {
  title: string;
  values: Record<string, number>;
}) {
  const entries = Object.entries(values).sort((a, b) => b[1] - a[1]);

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
        {title}
      </h2>
      <div className="mt-3 space-y-2">
        {entries.length > 0 ? (
          entries.map(([key, count]) => (
            <div
              key={key}
              className="flex items-center justify-between gap-3 text-sm"
            >
              <span className="truncate text-gray-600 dark:text-gray-300">
                {key}
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {count}
              </span>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">No data yet.</p>
        )}
      </div>
    </section>
  );
}

export default function AdminStats() {
  const [stats, setStats] = useState<AdminStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get<AdminStatsResponse>("/api/admin/stats");
      setStats(response.data);
    } catch (err) {
      setError(toMessage(err, "Failed to load admin stats"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchStats();
  }, []);

  const statusCounts = useMemo<Record<string, number>>(
    () =>
      stats
        ? {
            Success: stats.statusCounts.SUCCESS ?? 0,
            Failure: stats.statusCounts.FAILURE ?? 0,
          }
        : ({} as Record<string, number>),
    [stats]
  );

  return (
    <PageWrapper>
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <header className="flex flex-col gap-4 border-b border-gray-200 pb-5 dark:border-gray-800 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600 dark:text-blue-300">
              Internal
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-normal text-gray-950 dark:text-white">
              Generation Stats
            </h1>
          </div>
          <button
            type="button"
            onClick={fetchStats}
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-wait disabled:opacity-70 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 sm:w-auto"
          >
            <RefreshCcw size={16} />
            Refresh
          </button>
        </header>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
            {error}
          </div>
        )}

        {loading && !stats ? (
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-sm text-gray-500 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
            Loading stats...
          </div>
        ) : stats ? (
          <>
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatTile
                label="Total Generations"
                value={stats.totalGenerations.toLocaleString()}
                caption={`${stats.last24hGenerations.toLocaleString()} in the last 24h`}
                icon={<Activity size={18} />}
              />
              <StatTile
                label="Success Rate"
                value={formatPercent(stats.successRate)}
                caption={`${stats.failedGenerations.toLocaleString()} failures logged`}
                icon={<Gauge size={18} />}
              />
              <StatTile
                label="p95 Latency"
                value={formatMs(stats.p95LatencyMs)}
                caption={`Average ${formatMs(stats.averageLatencyMs)}`}
                icon={<Clock3 size={18} />}
              />
              <StatTile
                label="Estimated Cost"
                value={formatCurrency(stats.totalEstimatedCostUsd)}
                caption="Based on configured token prices"
                icon={<DollarSign size={18} />}
              />
            </section>

            <section className="grid gap-4 lg:grid-cols-3">
              <CountList title="Status" values={statusCounts} />
              <CountList title="Models" values={stats.modelCounts} />
              <CountList
                title="Failure Reasons"
                values={stats.failureReasons}
              />
            </section>

            <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center gap-2 border-b border-gray-200 px-4 py-3 dark:border-gray-800">
                <AlertTriangle
                  size={16}
                  className="text-amber-500 dark:text-amber-300"
                />
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Recent Generations
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm dark:divide-gray-800">
                  <thead className="bg-gray-50 dark:bg-gray-950">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-500 dark:text-gray-400">
                        Time
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-500 dark:text-gray-400">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-500 dark:text-gray-400">
                        Latency
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-500 dark:text-gray-400">
                        Tokens
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-500 dark:text-gray-400">
                        Cost
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-500 dark:text-gray-400">
                        Reason
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {stats.recentGenerations.length > 0 ? (
                      stats.recentGenerations.map((generation) => (
                        <tr key={generation.id}>
                          <td className="whitespace-nowrap px-4 py-3 text-gray-600 dark:text-gray-300">
                            {formatDateTime(generation.createdAt)}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3">
                            <span
                              className={`rounded-full px-2 py-1 text-xs font-semibold ${
                                generation.status === "SUCCESS"
                                  ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                                  : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
                              }`}
                            >
                              {generation.status}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-gray-600 dark:text-gray-300">
                            {formatMs(generation.latencyMs)}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-gray-600 dark:text-gray-300">
                            {generation.totalTokens?.toLocaleString() ?? "N/A"}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-gray-600 dark:text-gray-300">
                            {formatCurrency(generation.estimatedCostUsd)}
                          </td>
                          <td className="max-w-xs truncate px-4 py-3 text-gray-600 dark:text-gray-300">
                            {generation.failureReason ?? "N/A"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-4 py-6 text-center text-gray-500 dark:text-gray-400"
                        >
                          No generation metrics have been recorded yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        ) : null}
      </div>
    </PageWrapper>
  );
}
