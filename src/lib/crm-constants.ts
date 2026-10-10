export const LEAD_STAGES = [
  { value: "nuevo", label: "Nuevo", color: "bg-blue-100 text-blue-700" },
  { value: "contactado", label: "Contactado", color: "bg-yellow-100 text-yellow-700" },
  { value: "en_seguimiento", label: "En seguimiento", color: "bg-purple-100 text-purple-700" },
  { value: "visita_programada", label: "Visita programada", color: "bg-indigo-100 text-indigo-700" },
  { value: "negociacion", label: "Negociación", color: "bg-orange-100 text-orange-700" },
  { value: "cerrado_ganado", label: "Cerrado ganado", color: "bg-green-100 text-green-700" },
  { value: "cerrado_perdido", label: "Cerrado perdido", color: "bg-red-100 text-red-700" },
] as const;

export const LEAD_PRIORITIES = [
  { value: "baja", label: "Baja" },
  { value: "media", label: "Media" },
  { value: "alta", label: "Alta" },
  { value: "urgente", label: "Urgente" },
] as const;

export const LEAD_SOURCES = [
  { value: "web", label: "Web" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "telefono", label: "Teléfono" },
  { value: "referido", label: "Referido" },
  { value: "redes", label: "Redes sociales" },
  { value: "portal", label: "Portal inmobiliario" },
  { value: "otro", label: "Otro" },
] as const;

export const INTERACTION_TYPES = [
  { value: "llamada", label: "Llamada", icon: "phone" },
  { value: "email", label: "Email", icon: "email" },
  { value: "whatsapp", label: "WhatsApp", icon: "chat" },
  { value: "visita", label: "Visita", icon: "location" },
  { value: "reunion", label: "Reunión", icon: "calendar" },
  { value: "nota", label: "Nota interna", icon: "note" },
] as const;

export const PIPELINE_STAGES = LEAD_STAGES.filter(
  (s) => s.value !== "cerrado_ganado" && s.value !== "cerrado_perdido"
);
