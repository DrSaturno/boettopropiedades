import type { Property } from "@prisma/client";
import { PROPERTY_TYPES } from "@/lib/constants";
import { parseJsonField } from "@/lib/utils";
import {
  FLYER_MAX_CHIPS,
  FLYER_MAX_PHOTOS,
  type FlyerChip,
  type FlyerData,
  type FlyerTemplate,
} from "./types";

type FlyerSource = Pick<
  Property,
  | "title"
  | "operation"
  | "propertyType"
  | "neighborhood"
  | "city"
  | "rooms"
  | "bedrooms"
  | "bathrooms"
  | "garages"
  | "totalArea"
  | "coveredArea"
  | "expenses"
  | "price"
  | "currency"
  | "description"
  | "amenities"
  | "images"
>;

const positive = (value: number | null | undefined): value is number => typeof value === "number" && value > 0;

const plural = (n: number, singular: string, pluralForm = `${singular}s`) => `${formatNumber(n)} ${n === 1 ? singular : pluralForm}`;

function formatNumber(n: number) {
  return Number.isInteger(n) ? String(n) : n.toFixed(1).replace(".", ",");
}

function shorten(text: string | null | undefined, max: number) {
  const clean = (text ?? "").replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const sentence = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("! "), cut.lastIndexOf("? "));
  if (sentence > max * 0.5) return cut.slice(0, sentence + 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:\s]+$/, "")}…`;
}

export function formatFlyerPrice(price: number | null | undefined, currency: string) {
  if (!positive(price)) return "";
  const amount = price.toLocaleString("es-AR");
  return currency === "ARS" ? `$ ${amount}` : `USD ${amount}`;
}

export function buildFlyerDefaults(property: FlyerSource, template: FlyerTemplate): FlyerData {
  const typeLabel = PROPERTY_TYPES.find((type) => type.value === property.propertyType)?.label ?? "Propiedad";
  const rooms = positive(property.rooms) ? property.rooms : 0;
  const garages = positive(property.garages) ? property.garages : 0;
  const amenities = parseJsonField<string[]>(property.amenities, []);
  const images = parseJsonField<string[]>(property.images, []);
  const hasAmenity = (name: string) => amenities.some((item) => item.toLowerCase() === name.toLowerCase());

  const shared = {
    template,
    badge: property.operation === "alquiler" ? "ALQUILER" : "VENTA",
    zone: (property.neighborhood || property.city || property.title).slice(0, 40),
    reserved: false,
    photos: images.slice(0, FLYER_MAX_PHOTOS[template]),
  };

  if (template === "story") {
    const subtitleParts = [rooms ? plural(rooms, "ambiente") : "", garages ? "Cochera" : ""].filter(Boolean);
    const chips: FlyerChip[] = [];
    if (positive(property.coveredArea)) chips.push({ text: `${formatNumber(property.coveredArea)} m² cubiertos` });
    if (positive(property.totalArea) && property.totalArea !== property.coveredArea) {
      chips.push({ text: `${formatNumber(property.totalArea)} m² totales` });
    }
    if (positive(property.bedrooms)) chips.push({ text: plural(property.bedrooms, "dormitorio") });
    if (positive(property.bathrooms)) chips.push({ text: plural(property.bathrooms, "baño") });
    for (const amenity of amenities) {
      if (/^cochera$/i.test(amenity) || /^luminoso$/i.test(amenity)) continue;
      chips.push({ text: amenity });
    }
    if (garages) chips.push({ text: garages === 1 ? "Cochera" : `${garages} cocheras`, highlight: true });
    if (hasAmenity("Luminoso")) chips.push({ text: "Muy luminoso", highlight: true });

    return {
      ...shared,
      subtitle: subtitleParts.join(" · ") || typeLabel,
      headline: `${typeLabel}${rooms ? ` ${rooms} ambientes` : ""}`.slice(0, 60),
      headlineAccent: garages ? "con cochera" : "",
      description: shorten(property.description, 150),
      chips: chips.slice(0, FLYER_MAX_CHIPS.story),
      features: [],
      price: "",
      priceNote: "",
    };
  }

  const areaPart = positive(property.totalArea) ? ` · ${formatNumber(property.totalArea)} m² totales` : "";
  const chips: FlyerChip[] = [];
  if (positive(property.bedrooms)) chips.push({ text: plural(property.bedrooms, "dormitorio") });
  if (positive(property.bathrooms)) chips.push({ text: plural(property.bathrooms, "baño") });
  if (positive(property.coveredArea)) chips.push({ text: `${formatNumber(property.coveredArea)} m² cubiertos` });
  if (garages) chips.push({ text: garages === 1 ? "Cochera" : `${garages} cocheras` });
  for (const amenity of amenities) {
    if (/^cochera$/i.test(amenity)) continue;
    chips.push({ text: amenity });
  }

  return {
    ...shared,
    subtitle: `${typeLabel}${rooms ? ` ${rooms} ambientes` : ""}${areaPart}`.slice(0, 64),
    headline: "",
    headlineAccent: "",
    description: shorten(property.description, 170),
    chips: chips.slice(0, FLYER_MAX_CHIPS.price),
    features: amenities.filter((item) => !/^cochera$/i.test(item)).slice(0, 3),
    price: formatFlyerPrice(property.price, property.currency),
    priceNote: positive(property.expenses) ? `Expensas $ ${property.expenses.toLocaleString("es-AR")}` : "",
  };
}
