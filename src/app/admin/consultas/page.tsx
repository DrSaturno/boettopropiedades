"use client";

import { useEffect, useState } from "react";

interface Inquiry {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  type: string;
  read: boolean;
  createdAt: string;
  property: { id: number; title: string } | null;
}

export default function AdminConsultasPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetch("/api/consultas")
      .then((r) => r.json())
      .then((data) => { setInquiries(data); setLoading(false); });
  }, []);

  async function toggleRead(id: number, read: boolean) {
    await fetch(`/api/consultas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: !read }),
    });
    setInquiries((prev) => prev.map((i) => i.id === id ? { ...i, read: !read } : i));
  }

  async function deleteInquiry(id: number) {
    if (!confirm("¿Eliminar esta consulta?")) return;
    await fetch(`/api/consultas/${id}`, { method: "DELETE" });
    setInquiries((prev) => prev.filter((i) => i.id !== id));
  }

  const filtered = filter === "all" ? inquiries
    : filter === "unread" ? inquiries.filter((i) => !i.read)
    : inquiries.filter((i) => i.type === filter);

  const typeLabels: Record<string, string> = {
    contact: "Contacto",
    tasacion: "Tasación",
    property: "Propiedad",
  };

  if (loading) return <p className="text-sm text-brand-medium-gray">Cargando...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-serif font-medium text-brand-dark">Consultas</h1>
        <div className="flex gap-2">
          {["all", "unread", "contact", "tasacion", "property"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs uppercase tracking-wider border transition-colors ${filter === f ? "bg-brand-sage text-white border-brand-sage" : "border-brand-warm-gray text-brand-dark/60 hover:border-brand-sage"}`}
            >
              {f === "all" ? "Todas" : f === "unread" ? "Sin leer" : typeLabels[f] || f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((inq) => (
          <div
            key={inq.id}
            className={`bg-brand-surface border p-5 transition-colors ${inq.read ? "border-brand-warm-gray/30" : "border-brand-sage/50 bg-brand-sage/5"}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-medium text-brand-dark">{inq.name}</span>
                  <span className={`px-2 py-0.5 text-xs uppercase tracking-wider ${inq.type === "tasacion" ? "bg-purple-100 text-purple-700" : inq.type === "property" ? "bg-blue-100 text-blue-700" : "bg-brand-cream text-brand-dark"}`}>
                    {typeLabels[inq.type] || inq.type}
                  </span>
                  {!inq.read && (
                    <span className="w-2 h-2 bg-brand-sage rounded-full" />
                  )}
                </div>
                <div className="flex gap-4 text-xs text-brand-medium-gray mb-2">
                  <span>{inq.email}</span>
                  {inq.phone && <span>{inq.phone}</span>}
                  <span>{new Date(inq.createdAt).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                </div>
                {inq.property && (
                  <p className="text-xs text-brand-sage mb-2">
                    Re: {inq.property.title}
                  </p>
                )}
                {inq.message && (
                  <p className="text-sm text-brand-dark/80 whitespace-pre-line">{inq.message}</p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => toggleRead(inq.id, inq.read)}
                  title={inq.read ? "Marcar como no leída" : "Marcar como leída"}
                  className="p-1.5 text-brand-medium-gray hover:text-brand-sage transition-colors"
                >
                  {inq.read ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.98l7.5-4.04a2.25 2.25 0 012.134 0l7.5 4.04a2.25 2.25 0 011.183 1.98V18" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={() => deleteInquiry(inq.id)}
                  className="p-1.5 text-brand-medium-gray hover:text-red-500 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-brand-medium-gray text-sm bg-brand-surface border border-brand-warm-gray/50">
          {filter === "unread" ? "No hay consultas sin leer." : "No hay consultas."}
        </div>
      )}
    </div>
  );
}
