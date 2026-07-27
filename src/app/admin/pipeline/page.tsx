"use client";

import { useState, useEffect } from "react";
import { formatPrice } from "@/lib/utils";

interface Deal {
  id: string;
  clientName: string;
  propertyTitle: string;
  budget: number;
  stage: "prospect" | "contacted" | "visit" | "offer" | "negotiating" | "closed";
  phone: string;
  email: string;
  notes: string;
  updatedAt: string;
}

const STAGES = [
  { id: "prospect", name: "Prospecto", color: "border-t-slate-500" },
  { id: "contacted", name: "Contactado", color: "border-t-blue-500" },
  { id: "visit", name: "Visita Programada", color: "border-t-amber-500" },
  { id: "offer", name: "Oferta Recibida", color: "border-t-purple-500" },
  { id: "negotiating", name: "Negociación", color: "border-t-brand-sage" },
  { id: "closed", name: "Cerrado / Ganado", color: "border-t-green-500" },
] as const;

export default function AdminPipelinePage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedDealId, setDraggedDealId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDeal, setNewDeal] = useState({
    clientName: "",
    propertyTitle: "",
    budget: "",
    stage: "prospect" as Deal["stage"],
    phone: "",
    email: "",
    notes: "",
  });

  useEffect(() => {
    // We load inquiries from database as base deals and add mock pipeline deals
    fetch("/api/consultas")
      .then((r) => r.json())
      .then((data: any[]) => {
        const dbDeals: Deal[] = data.slice(0, 3).map((inq, index) => {
          const stages: Deal["stage"][] = ["prospect", "contacted", "visit"];
          return {
            id: `inq-deal-${inq.id}`,
            clientName: inq.name,
            propertyTitle: inq.property ? inq.property.title : "Búsqueda general",
            budget: inq.property?.price || 85000,
            stage: stages[index % stages.length],
            phone: inq.phone || "Sin teléfono",
            email: inq.email,
            notes: inq.message || "",
            updatedAt: inq.createdAt,
          };
        });

        const mockDeals: Deal[] = [
          {
            id: "deal-1",
            clientName: "Roberto Fernández",
            propertyTitle: "Dpto 2 dormitorios Urca",
            budget: 135000,
            stage: "negotiating",
            phone: "+54 351 988-7766",
            email: "robertof@gmail.com",
            notes: "Analizando financiación. Contraoferta enviada al propietario.",
            updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
          },
          {
            id: "deal-2",
            clientName: "Silvia Rodríguez",
            propertyTitle: "Casa en Manantiales",
            budget: 210000,
            stage: "visit",
            phone: "+54 351 765-4321",
            email: "silvia_rod@yahoo.com",
            notes: "Segunda visita coordinada para el sábado 10:30 hs con su arquitecto.",
            updatedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
          },
          {
            id: "deal-3",
            clientName: "Ignacio Peralta",
            propertyTitle: "Oficina corporativa Centro",
            budget: 95000,
            stage: "offer",
            phone: "+54 9 351 511-2233",
            email: "ignacio.peralta@tech.com",
            notes: "Presentó seña por USD 90.000. Pendiente de aceptación formal.",
            updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
          },
          {
            id: "deal-4",
            clientName: "Gabriela Mancini",
            propertyTitle: "Dpto Pozo General Paz",
            budget: 68000,
            stage: "closed",
            phone: "+54 351 443-3221",
            email: "gabymancini@gmail.com",
            notes: "Boleto firmado. Comisión cobrada. Transacción finalizada.",
            updatedAt: new Date(Date.now() - 3600000 * 72).toISOString(),
          },
        ];

        setDeals([...dbDeals, ...mockDeals]);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching pipeline deals:", err);
        setLoading(false);
      });
  }, []);

  // HTML5 Drag & Drop handlers
  const handleDragStart = (dealId: string) => {
    setDraggedDealId(dealId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Required to allow drop
  };

  const handleDrop = (stage: Deal["stage"]) => {
    if (!draggedDealId) return;
    setDeals((prev) =>
      prev.map((deal) =>
        deal.id === draggedDealId
          ? { ...deal, stage, updatedAt: new Date().toISOString() }
          : deal
      )
    );
    setDraggedDealId(null);
  };

  const handleAddDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeal.clientName || !newDeal.propertyTitle) {
      alert("Por favor completa el Nombre de cliente y Propiedad.");
      return;
    }
    const added: Deal = {
      id: `custom-deal-${Date.now()}`,
      clientName: newDeal.clientName,
      propertyTitle: newDeal.propertyTitle,
      budget: parseFloat(newDeal.budget) || 0,
      stage: newDeal.stage,
      phone: newDeal.phone || "Sin teléfono",
      email: newDeal.email || "Sin email",
      notes: newDeal.notes,
      updatedAt: new Date().toISOString(),
    };
    setDeals([added, ...deals]);
    setNewDeal({
      clientName: "",
      propertyTitle: "",
      budget: "",
      stage: "prospect",
      phone: "",
      email: "",
      notes: "",
    });
    setShowAddModal(false);
  };

  // Calculations for KPI dashboard
  const activeDeals = deals.filter((d) => d.stage !== "closed");
  const closedDeals = deals.filter((d) => d.stage === "closed");
  const totalActiveVolume = activeDeals.reduce((sum, d) => sum + d.budget, 0);
  const totalClosedVolume = closedDeals.reduce((sum, d) => sum + d.budget, 0);

  if (loading) return <p className="text-sm text-brand-medium-gray">Cargando Pipeline...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-medium text-brand-dark">Embudo de Ventas (Pipeline)</h1>
          <p className="text-sm text-brand-medium-gray mt-1">
            Visualizá y gestioná el progreso de tus operaciones inmobiliarias. Arrastrá las tarjetas para cambiar de etapa.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-brand-sage text-white text-sm font-medium hover:bg-brand-sage-dark transition-colors rounded-sm"
        >
          + Nueva Operación
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-brand-surface p-5 border border-brand-warm-gray/50">
          <p className="text-2xl font-serif font-semibold text-brand-dark">
            {activeDeals.length}
          </p>
          <p className="text-xs text-brand-medium-gray uppercase tracking-wider mt-1">
            Operaciones Activas
          </p>
        </div>
        <div className="bg-brand-surface p-5 border border-brand-warm-gray/50">
          <p className="text-2xl font-serif font-semibold text-brand-sage">
            {formatPrice(totalActiveVolume, "USD")}
          </p>
          <p className="text-xs text-brand-medium-gray uppercase tracking-wider mt-1">
            Volumen en Cartera
          </p>
        </div>
        <div className="bg-brand-surface p-5 border border-brand-warm-gray/50">
          <p className="text-2xl font-serif font-semibold text-green-500">
            {closedDeals.length}
          </p>
          <p className="text-xs text-brand-medium-gray uppercase tracking-wider mt-1">
            Ventas Cerradas
          </p>
        </div>
        <div className="bg-brand-surface p-5 border border-brand-warm-gray/50">
          <p className="text-2xl font-serif font-semibold text-green-500">
            {formatPrice(totalClosedVolume, "USD")}
          </p>
          <p className="text-xs text-brand-medium-gray uppercase tracking-wider mt-1">
            Volumen Cerrado
          </p>
        </div>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-start overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const stageDeals = deals.filter((d) => d.stage === stage.id);
          const stageSum = stageDeals.reduce((sum, d) => sum + d.budget, 0);

          return (
            <div
              key={stage.id}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(stage.id)}
              className="bg-brand-surface border border-brand-warm-gray/40 rounded-sm w-full min-w-[200px] flex flex-col min-h-[500px]"
            >
              {/* Stage Header */}
              <div className={`p-3 border-t-4 ${stage.color} border-b border-brand-warm-gray/20 flex flex-col gap-0.5 bg-brand-cream/35`}>
                <span className="font-semibold text-sm text-brand-dark flex justify-between items-center">
                  <span>{stage.name}</span>
                  <span className="text-xs px-1.5 py-0.5 bg-brand-warm-gray/40 text-brand-medium-gray rounded-full">
                    {stageDeals.length}
                  </span>
                </span>
                <span className="text-xs text-brand-medium-gray font-medium">
                  Total: {formatPrice(stageSum, "USD")}
                </span>
              </div>

              {/* Stage Cards Container */}
              <div className="p-2 space-y-2 flex-1 overflow-y-auto">
                {stageDeals.map((deal) => (
                  <div
                    key={deal.id}
                    draggable
                    onDragStart={() => handleDragStart(deal.id)}
                    className="p-3 bg-brand-cream hover:bg-brand-cream-light border border-brand-warm-gray/60 rounded-sm shadow-sm hover:shadow transition-all cursor-grab active:cursor-grabbing group relative"
                  >
                    <div className="font-medium text-sm text-brand-dark truncate mb-1">
                      {deal.clientName}
                    </div>
                    <div className="text-xs text-brand-medium-gray truncate mb-2">
                      {deal.propertyTitle}
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-brand-warm-gray/20">
                      <span className="text-sm font-semibold text-brand-sage-dark">
                        {deal.budget > 0 ? formatPrice(deal.budget, "USD") : "A convenir"}
                      </span>
                      <span className="text-[10px] text-brand-medium-gray">
                        {new Date(deal.updatedAt).toLocaleDateString("es-AR", {
                          day: "2-digit",
                          month: "2-digit",
                        })}
                      </span>
                    </div>
                    {deal.notes && (
                      <div className="mt-2 text-[11px] text-brand-dark/70 bg-brand-surface/40 p-1.5 border border-brand-warm-gray/30 rounded-sm max-h-16 overflow-y-auto whitespace-pre-wrap">
                        {deal.notes}
                      </div>
                    )}
                  </div>
                ))}

                {stageDeals.length === 0 && (
                  <div className="text-center py-8 text-[11px] text-brand-medium-gray border border-dashed border-brand-warm-gray/20 rounded-sm">
                    Arrastrá tarjetas aquí
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Deal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-brand-surface border border-brand-warm-gray/80 p-6 rounded-sm shadow-2xl">
            <h3 className="text-lg font-serif font-medium text-brand-dark mb-4 border-b border-brand-warm-gray/30 pb-2">
              Nueva Operación en Embudo
            </h3>
            <form onSubmit={handleAddDeal} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-brand-medium-gray mb-1">Nombre de Cliente *</label>
                <input
                  type="text"
                  required
                  value={newDeal.clientName}
                  onChange={(e) => setNewDeal({ ...newDeal, clientName: e.target.value })}
                  placeholder="Ej. Roberto Gómez"
                  className="w-full px-3 py-2 bg-brand-cream border border-brand-warm-gray text-brand-dark rounded-sm text-sm focus:outline-none focus:border-brand-sage"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-brand-medium-gray mb-1">Propiedad de Interés *</label>
                <input
                  type="text"
                  required
                  value={newDeal.propertyTitle}
                  onChange={(e) => setNewDeal({ ...newDeal, propertyTitle: e.target.value })}
                  placeholder="Ej. Dpto 1 Dormitorio Nueva Córdoba"
                  className="w-full px-3 py-2 bg-brand-cream border border-brand-warm-gray text-brand-dark rounded-sm text-sm focus:outline-none focus:border-brand-sage"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-brand-medium-gray mb-1">Presupuesto (USD)</label>
                  <input
                    type="number"
                    value={newDeal.budget}
                    onChange={(e) => setNewDeal({ ...newDeal, budget: e.target.value })}
                    placeholder="Ej. 125000"
                    className="w-full px-3 py-2 bg-brand-cream border border-brand-warm-gray text-brand-dark rounded-sm text-sm focus:outline-none focus:border-brand-sage"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-brand-medium-gray mb-1">Etapa Inicial</label>
                  <select
                    value={newDeal.stage}
                    onChange={(e) => setNewDeal({ ...newDeal, stage: e.target.value as Deal["stage"] })}
                    className="w-full px-3 py-2 bg-brand-cream border border-brand-warm-gray text-brand-dark rounded-sm text-sm focus:outline-none focus:border-brand-sage"
                  >
                    <option value="prospect">Prospecto</option>
                    <option value="contacted">Contactado</option>
                    <option value="visit">Visita Programada</option>
                    <option value="offer">Oferta Recibida</option>
                    <option value="negotiating">Negociación</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-brand-medium-gray mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={newDeal.phone}
                    onChange={(e) => setNewDeal({ ...newDeal, phone: e.target.value })}
                    placeholder="+54 351 555-5555"
                    className="w-full px-3 py-2 bg-brand-cream border border-brand-warm-gray text-brand-dark rounded-sm text-sm focus:outline-none focus:border-brand-sage"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-brand-medium-gray mb-1">Email</label>
                  <input
                    type="email"
                    value={newDeal.email}
                    onChange={(e) => setNewDeal({ ...newDeal, email: e.target.value })}
                    placeholder="cliente@email.com"
                    className="w-full px-3 py-2 bg-brand-cream border border-brand-warm-gray text-brand-dark rounded-sm text-sm focus:outline-none focus:border-brand-sage"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-brand-medium-gray mb-1">Notas / Avances</label>
                <textarea
                  value={newDeal.notes}
                  onChange={(e) => setNewDeal({ ...newDeal, notes: e.target.value })}
                  placeholder="Detalles sobre esta etapa..."
                  rows={3}
                  className="w-full px-3 py-2 bg-brand-cream border border-brand-warm-gray text-brand-dark rounded-sm text-sm focus:outline-none focus:border-brand-sage resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-brand-warm-gray/30">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-brand-warm-gray text-brand-dark hover:bg-brand-cream transition-colors text-sm rounded-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-sage text-white hover:bg-brand-sage-dark transition-colors text-sm rounded-sm"
                >
                  Crear Operación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
