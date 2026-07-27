"use client";

import { useEffect, useState } from "react";

interface Contact {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  role: "Comprador" | "Vendedor" | "Inquilino" | "Propietario" | "Interesado";
  interest: string;
  notes: string;
  createdAt: string;
}

interface InquiryContact {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  type: string;
  message?: string | null;
  createdAt: string;
  property?: { title: string } | null;
}

export default function AdminCRMPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newContact, setNewContact] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Interesado" as Contact["role"],
    interest: "",
    notes: "",
  });

  useEffect(() => {
    // We load inquiries from database as base contacts, and add some realistic mock clients
    fetch("/api/consultas")
      .then((r) => r.json())
      .then((data: InquiryContact[]) => {
        const dbContacts: Contact[] = data.map((inq) => ({
          id: `inq-${inq.id}`,
          name: inq.name,
          email: inq.email,
          phone: inq.phone || "Sin teléfono",
          role: inq.type === "tasacion" ? "Propietario" : "Comprador",
          interest: inq.property ? inq.property.title : "Consulta general",
          notes: inq.message || "",
          createdAt: inq.createdAt,
        }));

        const mockContacts: Contact[] = [
          {
            id: 1,
            name: "María Eugenia Paz",
            email: "mariaeugenia@gmail.com",
            phone: "+54 351 555-1234",
            role: "Vendedor",
            interest: "Casa en Villa Belgrano",
            notes: "Interesada en vender para comprar departamento más chico.",
            createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
          },
          {
            id: 2,
            name: "Carlos Alberto Gómez",
            email: "carlosgomez@outlook.com",
            phone: "+54 351 612-9876",
            role: "Comprador",
            interest: "Terreno en Valle Escondido",
            notes: "Busca terreno apto dúplex, presupuesto USD 120.000.",
            createdAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
          },
          {
            id: 3,
            name: "Sofía Martínez",
            email: "sofiamartinez@hotmail.com",
            phone: "+54 9 351 234-5678",
            role: "Inquilino",
            interest: "Dpto 1 dormitorio Nueva Córdoba",
            notes: "Estudiante de medicina, busca cerca de la UNC.",
            createdAt: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
          },
          {
            id: 4,
            name: "Lucio Benavídez",
            email: "lucio.benavidez@empresa.com",
            phone: "+54 351 345-6789",
            role: "Propietario",
            interest: "Tasación de local comercial",
            notes: "Quiere tasar local en Centro de Córdoba para alquilar.",
            createdAt: new Date(Date.now() - 3600000 * 24 * 12).toISOString(),
          },
        ];

        // Combine database inquiries and mock contacts
        setContacts([...dbContacts, ...mockContacts]);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading CRM contacts:", err);
        setLoading(false);
      });
  }, []);

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContact.name || !newContact.email) {
      alert("Por favor completa Nombre y Email.");
      return;
    }
    const added: Contact = {
      id: `custom-${Date.now()}`,
      ...newContact,
      createdAt: new Date().toISOString(),
    };
    setContacts([added, ...contacts]);
    setNewContact({
      name: "",
      email: "",
      phone: "",
      role: "Interesado",
      interest: "",
      notes: "",
    });
    setShowAddModal(false);
  };

  const filteredContacts = contacts.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      (c.interest && c.interest.toLowerCase().includes(search.toLowerCase()));

    const matchesRole = roleFilter === "all" || c.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (role: Contact["role"]) => {
    switch (role) {
      case "Comprador":
        return "bg-blue-900/40 text-blue-200 border-blue-800/60";
      case "Vendedor":
        return "bg-amber-900/40 text-amber-200 border-amber-800/60";
      case "Inquilino":
        return "bg-green-900/40 text-green-200 border-green-800/60";
      case "Propietario":
        return "bg-purple-900/40 text-purple-200 border-purple-800/60";
      default:
        return "bg-slate-800 text-slate-200 border-slate-700";
    }
  };

  if (loading) return <p className="text-sm text-brand-medium-gray">Cargando CRM...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-medium text-brand-dark">CRM de Contactos</h1>
          <p className="text-sm text-brand-medium-gray mt-1">
            Gestioná la cartera de clientes, compradores, inquilinos y propietarios.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-brand-sage text-white text-sm font-medium hover:bg-brand-sage-dark transition-colors rounded-sm"
        >
          + Agregar Contacto
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-brand-surface p-4 border border-brand-warm-gray/50">
        <div className="w-full md:w-72">
          <input
            type="text"
            placeholder="Buscar por nombre, email o interés..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 bg-brand-cream border border-brand-warm-gray text-brand-dark rounded-sm text-sm focus:outline-none focus:border-brand-sage"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs text-brand-medium-gray uppercase tracking-wider whitespace-nowrap mr-2">Filtrar:</span>
          {["all", "Comprador", "Vendedor", "Inquilino", "Propietario", "Interesado"].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 text-xs uppercase tracking-wider border transition-colors rounded-sm whitespace-nowrap ${
                roleFilter === r
                  ? "bg-brand-sage text-white border-brand-sage"
                  : "border-brand-warm-gray text-brand-dark/60 hover:border-brand-sage"
              }`}
            >
              {r === "all" ? "Todos" : r}
            </button>
          ))}
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-brand-surface border border-brand-warm-gray/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-brand-cream text-brand-medium-gray text-xs uppercase tracking-wider border-b border-brand-warm-gray/30">
              <tr>
                <th className="px-6 py-4 font-medium">Cliente</th>
                <th className="px-6 py-4 font-medium">Contacto</th>
                <th className="px-6 py-4 font-medium">Rol / Categoría</th>
                <th className="px-6 py-4 font-medium">Interés principal</th>
                <th className="px-6 py-4 font-medium">Notas / Observaciones</th>
                <th className="px-6 py-4 font-medium">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-warm-gray/30">
              {filteredContacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-brand-cream/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-brand-dark whitespace-nowrap">
                    {contact.name}
                  </td>
                  <td className="px-6 py-4 text-xs">
                    <div className="text-brand-dark">{contact.email}</div>
                    <div className="text-brand-medium-gray mt-0.5">{contact.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs border rounded-full font-medium ${getRoleBadgeColor(contact.role)}`}>
                      {contact.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-brand-dark font-medium">
                    {contact.interest || "Ninguno"}
                  </td>
                  <td className="px-6 py-4 text-xs text-brand-dark/80 max-w-xs truncate" title={contact.notes}>
                    {contact.notes || "Sin observaciones."}
                  </td>
                  <td className="px-6 py-4 text-xs text-brand-medium-gray whitespace-nowrap">
                    {new Date(contact.createdAt).toLocaleDateString("es-AR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredContacts.length === 0 && (
          <div className="text-center py-12 text-brand-medium-gray text-sm">
            No se encontraron contactos que coincidan con los filtros.
          </div>
        )}
      </div>

      {/* Add Contact Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-brand-surface border border-brand-warm-gray/80 p-6 rounded-sm shadow-2xl">
            <h3 className="text-lg font-serif font-medium text-brand-dark mb-4 border-b border-brand-warm-gray/30 pb-2">
              Agregar Nuevo Contacto
            </h3>
            <form onSubmit={handleAddContact} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-brand-medium-gray mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={newContact.name}
                  onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                  placeholder="Ej. Juan Pérez"
                  className="w-full px-3 py-2 bg-brand-cream border border-brand-warm-gray text-brand-dark rounded-sm text-sm focus:outline-none focus:border-brand-sage"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-brand-medium-gray mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={newContact.email}
                    onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                    placeholder="ejemplo@email.com"
                    className="w-full px-3 py-2 bg-brand-cream border border-brand-warm-gray text-brand-dark rounded-sm text-sm focus:outline-none focus:border-brand-sage"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-brand-medium-gray mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={newContact.phone}
                    onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                    placeholder="+54 351 555-5555"
                    className="w-full px-3 py-2 bg-brand-cream border border-brand-warm-gray text-brand-dark rounded-sm text-sm focus:outline-none focus:border-brand-sage"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-brand-medium-gray mb-1">Rol / Categoría</label>
                  <select
                    value={newContact.role}
                    onChange={(e) => setNewContact({ ...newContact, role: e.target.value as Contact["role"] })}
                    className="w-full px-3 py-2 bg-brand-cream border border-brand-warm-gray text-brand-dark rounded-sm text-sm focus:outline-none focus:border-brand-sage"
                  >
                    <option value="Interesado">Interesado</option>
                    <option value="Comprador">Comprador</option>
                    <option value="Vendedor">Vendedor</option>
                    <option value="Inquilino">Inquilino</option>
                    <option value="Propietario">Propietario</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-brand-medium-gray mb-1">Interés principal</label>
                  <input
                    type="text"
                    value={newContact.interest}
                    onChange={(e) => setNewContact({ ...newContact, interest: e.target.value })}
                    placeholder="Ej. Casa en Barrio Jardín"
                    className="w-full px-3 py-2 bg-brand-cream border border-brand-warm-gray text-brand-dark rounded-sm text-sm focus:outline-none focus:border-brand-sage"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-brand-medium-gray mb-1">Notas / Detalles</label>
                <textarea
                  value={newContact.notes}
                  onChange={(e) => setNewContact({ ...newContact, notes: e.target.value })}
                  placeholder="Detalles sobre el cliente..."
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
                  Guardar Contacto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
