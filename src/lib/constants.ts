export const OPERATIONS = [
  { value: "venta", label: "Venta" },
  { value: "alquiler", label: "Alquiler" },
] as const;

export const PROPERTY_TYPES = [
  { value: "casa", label: "Casa" },
  { value: "departamento", label: "Departamento" },
  { value: "ph", label: "PH" },
  { value: "local", label: "Local comercial" },
  { value: "oficina", label: "Oficina" },
  { value: "terreno", label: "Terreno" },
  { value: "galpon", label: "Galpón" },
  { value: "cochera", label: "Cochera" },
  { value: "campo", label: "Campo" },
  { value: "otro", label: "Otro" },
] as const;

export const CURRENCIES = [
  { value: "USD", label: "USD", symbol: "U$S" },
  { value: "ARS", label: "ARS", symbol: "$" },
] as const;

export const PROPERTY_STATUS = [
  { value: "published", label: "Publicada" },
  { value: "draft", label: "Borrador" },
  { value: "paused", label: "Pausada" },
] as const;

export const WHATSAPP_NUMBER = "5411456323842";
export const WHATSAPP_MESSAGE =
  "Hola, me comunico desde la web de Boetto Propiedades. Me gustaría hacer una consulta.";

export const COMPANY_INFO = {
  name: "Boetto Propiedades",
  phone: "+54 11 4563-2384",
  email: "ventas@boettopropiedades.com",
  instagram: "boettopropiedades",
  address: "Capital Federal, Buenos Aires, Argentina",
  website: "https://boettopropiedades.com.ar",
} as const;

export const AMENITIES_LIST = [
  "Pileta",
  "Quincho",
  "Parrilla",
  "Jardín",
  "Balcón",
  "Terraza",
  "Lavadero",
  "Baulera",
  "SUM",
  "Gimnasio",
  "Seguridad 24hs",
  "Ascensor",
  "Aire acondicionado",
  "Calefacción",
  "Agua corriente",
  "Gas natural",
  "Cloacas",
  "Pavimento",
  "Luminoso",
  "Apto profesional",
  "Apto crédito",
] as const;
