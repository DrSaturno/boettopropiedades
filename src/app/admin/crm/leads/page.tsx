"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { LEAD_STAGES, LEAD_PRIORITIES, LEAD_SOURCES } from "@/lib/crm-constants";

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  source: string;
  stage: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
  property?: { id: number; title: string } | null;
  _count: { interactions: number; inquiries: number };
}

interface LeadsResponse {
  leads: Lead[];
  total: number;
  page: number;
  pages: number;
}

export default function LeadsPage() {
  const [data, setData] = useState<LeadsResponse | null>(null);
  const [filters, setFilters] = useState({ stage: "", priority: "", source: "", search: "" });
  const [page, setPage] = useState(1);
  const [showNew, setShowNew] = useState(false);
  const [newLead, setNewLead] = useState({ name: "", email: "", phone: "", source: "web", priority: "media" });

  const fetchLeads = useCallback(() => {
    const params = new URLSearchParams();
    if (filters.stage) params.set("stage", filters.stage);
    if (filters.priority) params.set("priority", filters.priority);
    if (filters.source) params.set("source", filters.source);
    if (filters.search) params.set("search", filters.search);
    params.set("page", String(page));

    fetch(`/api/crm/leads?${params}`)
      .then((r) => r.json())
      .then(setData);
  }, [filters, page]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/crm/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newLead),
    });
    setShowNew(false);
    setNewLead({ name: "", email: "", phone: "", source: "web", priority: "media" });
    fetchLeads();
  };

  const stageColor = (value: string) =>
    LEAD_STAGES.find((s) => s.value === value)?.color || "bg-gray-100 text-gray-700";
  const stageLabel = (value: string) =>
    LEAD_STAGES.find((s) => s.value === value)?.label || value;
  const priorityLabel = (value: string) =>
    LEAD_PRIORITIES.find((s) => s.value === value)?.label || value;

  const inputClass = "w-full px-3 py-2 text-sm border border-brand-warm-gray/50 bg-brand-surface text-brand-dark focus:outline-none focus:ring-1 focus:ring-brand-sage";
  const selectClass = "px-3 py-2 text-sm border border-brand-warm-gray/50 bg-brand-surface text-brand-dark focus:outline-none focus:ring-1 focus:ring-brand-sage";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif font-medium text-brand-dark">Leads</h1>
        <button
          onClick={() => setShowNew(!showNew)}
          className="px-4 py-2 text-sm bg-brand-sage text-white hover:bg-brand-sage-dark transition-colors"
        >
          {showNew ? "Cancelar" : "Nuevo lead"}
        </button>
      </div>

      {showNew && (
        <form onSubmit={handleCreate} className="bg-brand-surface border border-brand-warm-gray/50 p-6 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <input placeholder="Nombre" required value={newLead.name} onChange={(e) => setNewLead({ ...newLead, name: e.target.value })} className={inputClass} />
          <input placeholder="Email" type="email" required value={newLead.email} onChange={(e) => setNewLead({ ...newLead, email: e.target.value })} className={inputClass} />
          <input placeholder="Teléfono" value={newLead.phone} onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })} className={inputClass} />
          <select value={newLead.source} onChange={(e) => setNewLead({ ...newLead, source: e.target.value })} className={selectClass}>
            {LEAD_SOURCES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <select value={newLead.priority} onChange={(e) => setNewLead({ ...newLead, priority: e.target.value })} className={selectClass}>
            {LEAD_PRIORITIES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <button type="submit" className="px-4 py-2 text-sm bg-brand-sage text-white hover:bg-brand-sage-dark transition-colors">
            Crear
          </button>
        </form>
      )}

      <div className="flex flex-wrap gap-3 mb-6">
        <input
          placeholder="Buscar por nombre, email o teléfono..."
          value={filters.search}
          onChange={(e) => { setFilters({ ...filters, search: e.target.value }); setPage(1); }}
          className="flex-1 min-w-[200px] px-3 py-2 text-sm border border-brand-warm-gray/50 bg-brand-surface text-brand-dark focus:outline-none focus:ring-1 focus:ring-brand-sage"
        />
        <select value={filters.stage} onChange={(e) => { setFilters({ ...filters, stage: e.target.value }); setPage(1); }} className={selectClass}>
          <option value="">Todas las etapas</option>
          {LEAD_STAGES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <select value={filters.priority} onChange={(e) => { setFilters({ ...filters, priority: e.target.value }); setPage(1); }} className={selectClass}>
          <option value="">Todas las prioridades</option>
          {LEAD_PRIORITIES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <select value={filters.source} onChange={(e) => { setFilters({ ...filters, source: e.target.value }); setPage(1); }} className={selectClass}>
          <option value="">Todas las fuentes</option>
          {LEAD_SOURCES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      {!data ? (
        <p className="text-sm text-brand-medium-gray py-10 text-center">Cargando...</p>
      ) : data.leads.length === 0 ? (
        <div className="text-center py-16 bg-brand-surface border border-brand-warm-gray/50">
          <p className="text-brand-medium-gray mb-2">No hay leads</p>
          <p className="text-sm text-brand-medium-gray">Los contactos desde el sitio web aparecerán aquí automáticamente.</p>
        </div>
      ) : (
        <>
          <div className="bg-brand-surface border border-brand-warm-gray/50 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-warm-gray/50">
                  <th className="text-left p-3 text-xs font-medium text-brand-medium-gray uppercase tracking-wider">Nombre</th>
                  <th className="text-left p-3 text-xs font-medium text-brand-medium-gray uppercase tracking-wider hidden md:table-cell">Email</th>
                  <th className="text-left p-3 text-xs font-medium text-brand-medium-gray uppercase tracking-wider">Etapa</th>
                  <th className="text-left p-3 text-xs font-medium text-brand-medium-gray uppercase tracking-wider hidden md:table-cell">Prioridad</th>
                  <th className="text-left p-3 text-xs font-medium text-brand-medium-gray uppercase tracking-wider hidden lg:table-cell">Fuente</th>
                  <th className="text-left p-3 text-xs font-medium text-brand-medium-gray uppercase tracking-wider hidden lg:table-cell">Interacciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-warm-gray/30">
                {data.leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-brand-cream/50 transition-colors">
                    <td className="p-3">
                      <Link href={`/admin/crm/leads/${lead.id}`} className="text-brand-dark font-medium hover:text-brand-sage">
                        {lead.name}
                      </Link>
                      {lead.property && <p className="text-xs text-brand-medium-gray mt-0.5">{lead.property.title}</p>}
                    </td>
                    <td className="p-3 text-brand-medium-gray hidden md:table-cell">{lead.email}</td>
                    <td className="p-3">
                      <span className={`text-xs px-2 py-0.5 rounded ${stageColor(lead.stage)}`}>{stageLabel(lead.stage)}</span>
                    </td>
                    <td className="p-3 text-brand-medium-gray hidden md:table-cell">{priorityLabel(lead.priority)}</td>
                    <td className="p-3 text-brand-medium-gray hidden lg:table-cell">{LEAD_SOURCES.find((s) => s.value === lead.source)?.label || lead.source}</td>
                    <td className="p-3 text-brand-medium-gray hidden lg:table-cell">{lead._count.interactions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {data.pages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-xs text-brand-medium-gray">{data.total} leads en total</p>
              <div className="flex gap-2">
                <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="px-3 py-1 text-sm border border-brand-warm-gray/50 text-brand-dark disabled:opacity-30 hover:bg-brand-cream transition-colors">
                  Anterior
                </button>
                <span className="px-3 py-1 text-sm text-brand-medium-gray">{page} / {data.pages}</span>
                <button disabled={page >= data.pages} onClick={() => setPage(page + 1)} className="px-3 py-1 text-sm border border-brand-warm-gray/50 text-brand-dark disabled:opacity-30 hover:bg-brand-cream transition-colors">
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
