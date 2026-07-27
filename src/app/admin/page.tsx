"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Stats {
  total: number;
  published: number;
  featured: number;
  venta: number;
  alquiler: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ total: 0, published: 0, featured: 0, venta: 0, alquiler: 0 });

  useEffect(() => {
    fetch("/api/propiedades")
      .then((r) => r.json())
      .then((data: Array<{ status: string; featured: boolean; operation: string }>) => {
        setStats({
          total: data.length,
          published: data.filter((p) => p.status === "published").length,
          featured: data.filter((p) => p.featured).length,
          venta: data.filter((p) => p.operation === "venta").length,
          alquiler: data.filter((p) => p.operation === "alquiler").length,
        });
      });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-serif font-medium text-brand-dark mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
        {[
          { label: "Total", value: stats.total },
          { label: "Publicadas", value: stats.published },
          { label: "Destacadas", value: stats.featured },
          { label: "En venta", value: stats.venta },
          { label: "En alquiler", value: stats.alquiler },
        ].map((s) => (
          <div key={s.label} className="bg-brand-surface p-6 border border-brand-warm-gray/50">
            <p className="text-2xl font-serif font-semibold text-brand-dark">{s.value}</p>
            <p className="text-xs text-brand-medium-gray uppercase tracking-wider mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <Link href="/admin/propiedades/nueva" className="px-6 py-3 bg-brand-sage text-white text-sm font-medium hover:bg-brand-sage-dark transition-colors">
          Crear propiedad
        </Link>
        <Link href="/admin/propiedades/importar" className="px-6 py-3 border border-brand-warm-gray text-brand-dark text-sm font-medium hover:bg-brand-sage hover:text-white hover:border-brand-sage transition-colors">
          Importar por link
        </Link>
      </div>
    </div>
  );
}
