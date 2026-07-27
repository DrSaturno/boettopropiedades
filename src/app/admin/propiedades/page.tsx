"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

interface AdminProperty {
  id: number;
  title: string;
  slug: string;
  operation: string;
  propertyType: string;
  status: string;
  featured: boolean;
  price: number | null;
  currency: string;
  city: string | null;
  createdAt: string;
  _count: { inquiries: number };
}

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<AdminProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/propiedades")
      .then((r) => r.json())
      .then((data) => { setProperties(data); setLoading(false); });
  }, []);

  async function toggleFeatured(id: number, featured: boolean) {
    await fetch(`/api/propiedades/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !featured }),
    });
    setProperties((prev) => prev.map((p) => p.id === id ? { ...p, featured: !featured } : p));
  }

  async function toggleStatus(id: number, status: string) {
    const newStatus = status === "published" ? "paused" : "published";
    await fetch(`/api/propiedades/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setProperties((prev) => prev.map((p) => p.id === id ? { ...p, status: newStatus } : p));
  }

  async function deleteProperty(id: number) {
    if (!confirm("¿Estás seguro de eliminar esta propiedad?")) return;
    await fetch(`/api/propiedades/${id}`, { method: "DELETE" });
    setProperties((prev) => prev.filter((p) => p.id !== id));
  }

  if (loading) return <p className="text-sm text-brand-medium-gray">Cargando...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-serif font-medium text-brand-dark">Propiedades</h1>
        <div className="flex gap-3">
          <Link href="/admin/propiedades/importar" className="px-4 py-2 border border-brand-warm-gray text-brand-dark text-sm hover:bg-brand-sage hover:text-white hover:border-brand-sage transition-colors">
            Importar
          </Link>
          <Link href="/admin/propiedades/nueva" className="px-4 py-2 bg-brand-sage text-white text-sm hover:bg-brand-sage-dark transition-colors">
            + Nueva
          </Link>
        </div>
      </div>

      <div className="bg-brand-surface border border-brand-warm-gray/50 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-brand-cream text-left">
            <tr>
              <th className="px-4 py-3 text-xs font-medium text-brand-medium-gray uppercase tracking-wider">Propiedad</th>
              <th className="px-4 py-3 text-xs font-medium text-brand-medium-gray uppercase tracking-wider">Operación</th>
              <th className="px-4 py-3 text-xs font-medium text-brand-medium-gray uppercase tracking-wider">Precio</th>
              <th className="px-4 py-3 text-xs font-medium text-brand-medium-gray uppercase tracking-wider">Estado</th>
              <th className="px-4 py-3 text-xs font-medium text-brand-medium-gray uppercase tracking-wider">Consultas</th>
              <th className="px-4 py-3 text-xs font-medium text-brand-medium-gray uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-warm-gray/30">
            {properties.map((p) => (
              <tr key={p.id} className="hover:bg-brand-cream/50">
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium text-brand-dark">{p.title}</p>
                    <p className="text-xs text-brand-medium-gray">{p.city || "Sin ubicación"}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 text-xs uppercase tracking-wider bg-brand-cream text-brand-dark">
                    {p.operation}
                  </span>
                </td>
                <td className="px-4 py-3 text-brand-dark">{formatPrice(p.price, p.currency)}</td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleStatus(p.id, p.status)} className={`px-2 py-1 text-xs uppercase tracking-wider ${p.status === "published" ? "bg-green-100 text-green-700" : p.status === "paused" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-600"}`}>
                    {p.status === "published" ? "Publicada" : p.status === "paused" ? "Pausada" : "Borrador"}
                  </button>
                </td>
                <td className="px-4 py-3 text-center text-brand-medium-gray">{p._count?.inquiries || 0}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleFeatured(p.id, p.featured)} title={p.featured ? "Quitar destacada" : "Destacar"} className={`p-1 ${p.featured ? "text-yellow-500" : "text-brand-warm-gray hover:text-yellow-500"} transition-colors`}>
                      <svg className="w-4 h-4" fill={p.featured ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                      </svg>
                    </button>
                    <Link href={`/admin/propiedades/${p.id}`} className="p-1 text-brand-medium-gray hover:text-brand-sage transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                      </svg>
                    </Link>
                    <button onClick={() => deleteProperty(p.id)} className="p-1 text-brand-medium-gray hover:text-red-500 transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {properties.length === 0 && (
          <div className="text-center py-12 text-brand-medium-gray text-sm">
            No hay propiedades cargadas aún.
          </div>
        )}
      </div>
    </div>
  );
}
