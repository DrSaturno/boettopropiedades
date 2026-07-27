import { CURRENCIES } from "./constants";

export function slugify(text: string): string {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

export function formatPrice(
  price: number | null | undefined,
  currency: string = "USD"
): string {
  if (!price) return "Consultar";
  const curr = CURRENCIES.find((c) => c.value === currency);
  const symbol = curr?.symbol || "$";
  return `${symbol} ${price.toLocaleString("es-AR")}`;
}

export function formatArea(area: number | null | undefined): string {
  if (!area) return "-";
  return `${area} m²`;
}

export function getWhatsAppUrl(message: string, phone: string = "5411456323842"): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function getPropertyWhatsAppMessage(title: string, slug: string): string {
  return `Hola, me interesa la propiedad "${title}" publicada en boettopropiedades.com.ar/propiedades/${slug}. Me gustaría recibir más información.`;
}

export function parseJsonField<T>(field: string | null | undefined, fallback: T): T {
  if (!field) return fallback;
  try {
    return JSON.parse(field) as T;
  } catch {
    return fallback;
  }
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
