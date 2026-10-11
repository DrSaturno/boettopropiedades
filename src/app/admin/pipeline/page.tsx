"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import ErrorNotice from "@/components/admin/ErrorNotice";
import { errorMessage, fetchJson, sendJson } from "@/lib/admin-fetch";
import { LEAD_STAGES, PIPELINE_STAGES, LEAD_PRIORITIES } from "@/lib/crm-constants";

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  stage: string;
  priority: string;
  source: string;
  updatedAt: string;
  property?: { id: number; title: string } | null;
  _count: { interactions: number; inquiries: number };
}

export default function PipelinePage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLeads = useCallback(() => {
    async function loadAllLeads() {
      const first = await fetchJson<{ leads: Lead[]; pages: number }>("/api/crm/leads?limit=100&page=1");
      const pages = await Promise.all(
        Array.from({ length: Math.max(0, first.pages - 1) }, (_, index) =>
          fetchJson<{ leads: Lead[] }>(`/api/crm/leads?limit=100&page=${index + 2}`)
        )
      );
      setLeads([...first.leads, ...pages.flatMap((page) => page.leads)]);
      setError("");
    }

    loadAllLeads()
      .catch((e) => setError(errorMessage(e)))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const moveToStage = async (leadId: number, stage: string) => {
    setError("");
    try {
      await sendJson(`/api/crm/leads/${leadId}`, "PUT", { stage });
      fetchLeads();
    } catch (e) {
      setError(errorMessage(e));
    }
  };

  const priorityDot = (priority: string) => {
    switch (priority) {
      case "urgente": return "bg-red-500";
      case "alta": return "bg-orange-500";
      case "media": return "bg-yellow-500";
      default: return "bg-gray-400";
    }
  };

  if (loading) {
    return <p className="text-sm text-brand-medium-gray py-10 text-center">Cargando pipeline...</p>;
  }

  return (
    <div>
      <ErrorNotice message={error} />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif font-medium text-brand-dark">Pipeline</h1>
        <Link
          href="/admin/crm/leads"
          className="px-4 py-2 text-sm border border-brand-warm-gray text-brand-dark hover:bg-brand-sage hover:text-white hover:border-brand-sage transition-colors"
        >
          Ver lista
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {PIPELINE_STAGES.map((stage) => {
          const stageLeads = leads.filter((l) => l.stage === stage.value);
          return (
            <div key={stage.value} className="min-w-[280px] flex-1">
              <div className="mb-3 flex items-center justify-between">
                <h2 className={`text-xs font-medium px-2 py-1 rounded ${stage.color}`}>{stage.label}</h2>
                <span className="text-xs text-brand-medium-gray">{stageLeads.length}</span>
              </div>
              <div className="space-y-2 min-h-[200px] bg-brand-cream/30 p-2 rounded border border-brand-warm-gray/20">
                {stageLeads.map((lead) => (
                  <div key={lead.id} className="bg-brand-surface border border-brand-warm-gray/50 p-3">
                    <div className="flex items-start gap-2 mb-2">
                      <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${priorityDot(lead.priority)}`} />
                      <div className="flex-1 min-w-0">
                        <Link href={`/admin/crm/leads/${lead.id}`} className="text-sm font-medium text-brand-dark hover:text-brand-sage block truncate">
                          {lead.name}
                        </Link>
                        <p className="text-xs text-brand-medium-gray truncate">{lead.email}</p>
                      </div>
                    </div>
                    {lead.property && (
                      <p className="text-[10px] text-brand-medium-gray mb-2 truncate">{lead.property.title}</p>
                    )}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] text-brand-medium-gray">
                        {LEAD_PRIORITIES.find((p) => p.value === lead.priority)?.label}
                      </span>
                      <select
                        aria-label={`Mover a ${lead.name} de etapa`}
                        value={lead.stage}
                        onChange={(e) => moveToStage(lead.id, e.target.value)}
                        className="max-w-[150px] border border-brand-warm-gray/50 bg-brand-surface px-1.5 py-1 text-[11px] text-brand-dark focus:outline-none focus:border-brand-sage"
                      >
                        {LEAD_STAGES.map((target) => (
                          <option key={target.value} value={target.value}>
                            {target.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
                {stageLeads.length === 0 && (
                  <p className="text-xs text-brand-medium-gray text-center py-8">Sin leads</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
