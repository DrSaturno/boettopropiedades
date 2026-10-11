"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ErrorNotice from "@/components/admin/ErrorNotice";
import { errorMessage, fetchJson } from "@/lib/admin-fetch";
import { LEAD_STAGES, LEAD_SOURCES } from "@/lib/crm-constants";

interface CrmStats {
  totalLeads: number;
  newThisMonth: number;
  newThisWeek: number;
  byStage: Record<string, number>;
  bySource: Record<string, number>;
  byPriority: Record<string, number>;
  recentLeads: Array<{
    id: number;
    name: string;
    email: string;
    stage: string;
    source: string;
    createdAt: string;
    property?: { title: string } | null;
    _count: { interactions: number };
  }>;
}

export default function CrmDashboard() {
  const [stats, setStats] = useState<CrmStats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchJson<CrmStats>("/api/crm/stats")
      .then(setStats)
      .catch((e) => setError(errorMessage(e)));
  }, []);

  if (error) return <ErrorNotice message={error} />;

  if (!stats) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-brand-medium-gray">Cargando CRM...</p>
      </div>
    );
  }

  const stageLabel = (value: string) =>
    LEAD_STAGES.find((s) => s.value === value)?.label || value;
  const stageColor = (value: string) =>
    LEAD_STAGES.find((s) => s.value === value)?.color || "bg-gray-100 text-gray-700";
  const sourceLabel = (value: string) =>
    LEAD_SOURCES.find((s) => s.value === value)?.label || value;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-serif font-medium text-brand-dark">CRM</h1>
        <div className="flex gap-3">
          <Link
            href="/admin/crm/leads"
            className="px-4 py-2 text-sm border border-brand-warm-gray text-brand-dark hover:bg-brand-sage hover:text-white hover:border-brand-sage transition-colors"
          >
            Ver leads
          </Link>
          <Link
            href="/admin/pipeline"
            className="px-4 py-2 text-sm bg-brand-sage text-white hover:bg-brand-sage-dark transition-colors"
          >
            Pipeline
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-brand-surface p-6 border border-brand-warm-gray/50">
          <p className="text-3xl font-serif font-semibold text-brand-dark">{stats.totalLeads}</p>
          <p className="text-xs text-brand-medium-gray uppercase tracking-wider mt-1">Total leads</p>
        </div>
        <div className="bg-brand-surface p-6 border border-brand-warm-gray/50">
          <p className="text-3xl font-serif font-semibold text-brand-dark">{stats.newThisMonth}</p>
          <p className="text-xs text-brand-medium-gray uppercase tracking-wider mt-1">Nuevos este mes</p>
        </div>
        <div className="bg-brand-surface p-6 border border-brand-warm-gray/50">
          <p className="text-3xl font-serif font-semibold text-brand-dark">{stats.newThisWeek}</p>
          <p className="text-xs text-brand-medium-gray uppercase tracking-wider mt-1">Nuevos esta semana</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-brand-surface p-6 border border-brand-warm-gray/50">
          <h2 className="text-sm font-medium text-brand-dark mb-4 uppercase tracking-wider">Por etapa</h2>
          <div className="space-y-2">
            {LEAD_STAGES.map((stage) => (
              <div key={stage.value} className="flex items-center justify-between">
                <span className={`text-xs px-2 py-1 rounded ${stage.color}`}>{stage.label}</span>
                <span className="text-sm font-medium text-brand-dark">{stats.byStage[stage.value] || 0}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-brand-surface p-6 border border-brand-warm-gray/50">
          <h2 className="text-sm font-medium text-brand-dark mb-4 uppercase tracking-wider">Por fuente</h2>
          <div className="space-y-2">
            {LEAD_SOURCES.map((source) => {
              const count = stats.bySource[source.value] || 0;
              if (!count) return null;
              return (
                <div key={source.value} className="flex items-center justify-between">
                  <span className="text-sm text-brand-medium-gray">{source.label}</span>
                  <span className="text-sm font-medium text-brand-dark">{count}</span>
                </div>
              );
            })}
            {Object.keys(stats.bySource).length === 0 && (
              <p className="text-sm text-brand-medium-gray">Sin datos</p>
            )}
          </div>
        </div>
      </div>

      {stats.recentLeads.length > 0 && (
        <div className="bg-brand-surface border border-brand-warm-gray/50">
          <div className="p-4 border-b border-brand-warm-gray/50">
            <h2 className="text-sm font-medium text-brand-dark uppercase tracking-wider">Leads recientes</h2>
          </div>
          <div className="divide-y divide-brand-warm-gray/30">
            {stats.recentLeads.map((lead) => (
              <Link
                key={lead.id}
                href={`/admin/crm/leads/${lead.id}`}
                className="flex items-center justify-between p-4 hover:bg-brand-cream/50 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-brand-dark">{lead.name}</p>
                  <p className="text-xs text-brand-medium-gray">{lead.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  {lead.property && (
                    <span className="text-xs text-brand-medium-gray hidden md:inline">{lead.property.title}</span>
                  )}
                  <span className={`text-xs px-2 py-0.5 rounded ${stageColor(lead.stage)}`}>
                    {stageLabel(lead.stage)}
                  </span>
                  <span className="text-xs text-brand-medium-gray hidden sm:inline">{sourceLabel(lead.source)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
