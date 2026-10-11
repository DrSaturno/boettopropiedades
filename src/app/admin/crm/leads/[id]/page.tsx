"use client";

import { useEffect, useState, useCallback, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ErrorNotice from "@/components/admin/ErrorNotice";
import { errorMessage, fetchJson, sendJson } from "@/lib/admin-fetch";
import { LEAD_STAGES, LEAD_PRIORITIES, LEAD_SOURCES, INTERACTION_TYPES } from "@/lib/crm-constants";

interface Interaction {
  id: number;
  type: string;
  notes: string;
  createdBy: string | null;
  createdAt: string;
}

interface Inquiry {
  id: number;
  name: string;
  email: string;
  message: string | null;
  type: string;
  createdAt: string;
}

interface LeadDetail {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  source: string;
  stage: string;
  priority: string;
  notes: string | null;
  assignedTo: string | null;
  tags: string | null;
  createdAt: string;
  updatedAt: string;
  property?: { id: number; title: string; slug: string } | null;
  interactions: Interaction[];
  inquiries: Inquiry[];
}

export default function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [lead, setLead] = useState<LeadDetail | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ stage: "", priority: "", notes: "", assignedTo: "" });
  const [newInteraction, setNewInteraction] = useState({ type: "nota", notes: "" });
  const [error, setError] = useState("");

  const fetchLead = useCallback(() => {
    fetchJson<LeadDetail>(`/api/crm/leads/${id}`)
      .then((data) => {
        setLead(data);
        setForm({ stage: data.stage, priority: data.priority, notes: data.notes || "", assignedTo: data.assignedTo || "" });
      })
      .catch((e) => setError(errorMessage(e)));
  }, [id]);

  useEffect(() => { fetchLead(); }, [fetchLead]);

  const run = async (action: () => Promise<unknown>) => {
    setError("");
    try {
      await action();
      return true;
    } catch (e) {
      setError(errorMessage(e));
      return false;
    }
  };

  const handleSave = async () => {
    if (await run(() => sendJson(`/api/crm/leads/${id}`, "PUT", form))) {
      setEditing(false);
      fetchLead();
    }
  };

  const handleStageChange = async (stage: string) => {
    if (await run(() => sendJson(`/api/crm/leads/${id}`, "PUT", { stage }))) fetchLead();
  };

  const handleAddInteraction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInteraction.notes.trim()) return;
    if (await run(() => sendJson(`/api/crm/leads/${id}/interactions`, "POST", newInteraction))) {
      setNewInteraction({ type: "nota", notes: "" });
      fetchLead();
    }
  };

  const handleDelete = async () => {
    if (!confirm("¿Eliminar este lead? Esta acción no se puede deshacer.")) return;
    if (await run(() => fetchJson(`/api/crm/leads/${id}`, { method: "DELETE" }))) {
      router.push("/admin/crm/leads");
    }
  };

  if (!lead) {
    return error ? (
      <ErrorNotice message={error} />
    ) : (
      <p className="text-sm text-brand-medium-gray py-10 text-center">Cargando...</p>
    );
  }

  const stageInfo = LEAD_STAGES.find((s) => s.value === lead.stage);
  const interactionLabel = (type: string) =>
    INTERACTION_TYPES.find((t) => t.value === type)?.label || type;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  const selectClass = "px-3 py-2 text-sm border border-brand-warm-gray/50 bg-brand-surface text-brand-dark focus:outline-none focus:ring-1 focus:ring-brand-sage";

  return (
    <div>
      <ErrorNotice message={error} />
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/crm/leads" className="text-brand-medium-gray hover:text-brand-dark transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </Link>
        <h1 className="text-2xl font-serif font-medium text-brand-dark flex-1">{lead.name}</h1>
        <button onClick={handleDelete} className="px-3 py-1.5 text-xs text-red-600 border border-red-200 hover:bg-red-50 transition-colors">
          Eliminar
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-brand-surface border border-brand-warm-gray/50 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-brand-medium-gray">{lead.email}</p>
                {lead.phone && <p className="text-sm text-brand-medium-gray">{lead.phone}</p>}
              </div>
              <button
                onClick={() => setEditing(!editing)}
                className="text-xs text-brand-sage hover:text-brand-sage-dark transition-colors"
              >
                {editing ? "Cancelar" : "Editar"}
              </button>
            </div>

            {editing ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <select value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value })} className={selectClass}>
                    {LEAD_STAGES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                  <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className={selectClass}>
                    {LEAD_PRIORITIES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
                <input
                  placeholder="Asignado a"
                  value={form.assignedTo}
                  onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-brand-warm-gray/50 bg-brand-surface text-brand-dark focus:outline-none focus:ring-1 focus:ring-brand-sage"
                />
                <textarea
                  placeholder="Notas"
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-brand-warm-gray/50 bg-brand-surface text-brand-dark focus:outline-none focus:ring-1 focus:ring-brand-sage resize-none"
                />
                <button onClick={handleSave} className="px-4 py-2 text-sm bg-brand-sage text-white hover:bg-brand-sage-dark transition-colors">
                  Guardar
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs px-2 py-0.5 rounded ${stageInfo?.color}`}>{stageInfo?.label}</span>
                  <span className="text-xs text-brand-medium-gray">Prioridad: {LEAD_PRIORITIES.find((p) => p.value === lead.priority)?.label}</span>
                  <span className="text-xs text-brand-medium-gray">Fuente: {LEAD_SOURCES.find((s) => s.value === lead.source)?.label}</span>
                </div>
                {lead.assignedTo && <p className="text-sm text-brand-medium-gray">Asignado a: {lead.assignedTo}</p>}
                {lead.notes && <p className="text-sm text-brand-dark whitespace-pre-wrap">{lead.notes}</p>}
                {lead.property && (
                  <p className="text-sm">
                    Propiedad: <Link href={`/propiedades/${lead.property.slug}`} className="text-brand-sage hover:underline">{lead.property.title}</Link>
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="bg-brand-surface border border-brand-warm-gray/50 p-4">
            <h2 className="text-xs font-medium text-brand-dark uppercase tracking-wider mb-3">Mover a etapa</h2>
            <div className="flex flex-wrap gap-2">
              {LEAD_STAGES.map((stage) => (
                <button
                  key={stage.value}
                  onClick={() => handleStageChange(stage.value)}
                  className={`text-xs px-3 py-1.5 rounded transition-colors ${
                    lead.stage === stage.value
                      ? stage.color + " ring-2 ring-brand-sage"
                      : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {stage.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-brand-surface border border-brand-warm-gray/50">
            <div className="p-4 border-b border-brand-warm-gray/50">
              <h2 className="text-xs font-medium text-brand-dark uppercase tracking-wider">Nueva interacción</h2>
            </div>
            <form onSubmit={handleAddInteraction} className="p-4 space-y-3">
              <select
                value={newInteraction.type}
                onChange={(e) => setNewInteraction({ ...newInteraction, type: e.target.value })}
                className={selectClass}
              >
                {INTERACTION_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
              <textarea
                placeholder="Detalle de la interacción..."
                rows={3}
                value={newInteraction.notes}
                onChange={(e) => setNewInteraction({ ...newInteraction, notes: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-brand-warm-gray/50 bg-brand-surface text-brand-dark focus:outline-none focus:ring-1 focus:ring-brand-sage resize-none"
              />
              <button
                type="submit"
                disabled={!newInteraction.notes.trim()}
                className="px-4 py-2 text-sm bg-brand-sage text-white hover:bg-brand-sage-dark disabled:opacity-40 transition-colors"
              >
                Agregar
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-brand-surface border border-brand-warm-gray/50">
            <div className="p-4 border-b border-brand-warm-gray/50">
              <h2 className="text-xs font-medium text-brand-dark uppercase tracking-wider">Timeline</h2>
            </div>
            <div className="divide-y divide-brand-warm-gray/30 max-h-[600px] overflow-y-auto">
              {lead.interactions.length === 0 && lead.inquiries.length === 0 ? (
                <p className="text-sm text-brand-medium-gray p-4">Sin actividad registrada</p>
              ) : (
                <>
                  {lead.interactions.map((interaction) => (
                    <div key={`i-${interaction.id}`} className="p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-brand-dark">{interactionLabel(interaction.type)}</span>
                        <span className="text-[10px] text-brand-medium-gray">{formatDate(interaction.createdAt)}</span>
                      </div>
                      <p className="text-sm text-brand-dark whitespace-pre-wrap">{interaction.notes}</p>
                      {interaction.createdBy && (
                        <p className="text-[10px] text-brand-medium-gray mt-1">por {interaction.createdBy}</p>
                      )}
                    </div>
                  ))}
                  {lead.inquiries.map((inquiry) => (
                    <div key={`q-${inquiry.id}`} className="p-4 bg-blue-50/30">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-blue-700">Consulta web ({inquiry.type})</span>
                        <span className="text-[10px] text-brand-medium-gray">{formatDate(inquiry.createdAt)}</span>
                      </div>
                      {inquiry.message && <p className="text-sm text-brand-dark whitespace-pre-wrap">{inquiry.message}</p>}
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          <div className="bg-brand-surface border border-brand-warm-gray/50 p-4">
            <h2 className="text-xs font-medium text-brand-dark uppercase tracking-wider mb-2">Info</h2>
            <dl className="space-y-1 text-xs text-brand-medium-gray">
              <div className="flex justify-between"><dt>Creado</dt><dd>{formatDate(lead.createdAt)}</dd></div>
              <div className="flex justify-between"><dt>Actualizado</dt><dd>{formatDate(lead.updatedAt)}</dd></div>
              <div className="flex justify-between"><dt>Consultas</dt><dd>{lead.inquiries.length}</dd></div>
              <div className="flex justify-between"><dt>Interacciones</dt><dd>{lead.interactions.length}</dd></div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
