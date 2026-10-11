import "server-only";

import type { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import {
  CURRENCIES,
  OPERATIONS,
  PROPERTY_STATUS,
  PROPERTY_TYPES,
} from "@/lib/constants";

type Body = Record<string, unknown>;
type PropertyFields = Prisma.PropertyUncheckedUpdateInput;

const TEXT_FIELDS = [
  "address",
  "neighborhood",
  "city",
  "description",
  "videoUrl",
  "externalUrl",
  "seoTitle",
  "seoDescription",
] as const;

const DECIMAL_FIELDS = ["price", "expenses", "totalArea", "coveredArea"] as const;
const INTEGER_FIELDS = ["rooms", "bedrooms", "bathrooms", "garages", "age"] as const;
const LIST_FIELDS = ["amenities", "images"] as const;

const CHOICE_FIELDS = {
  operation: OPERATIONS,
  propertyType: PROPERTY_TYPES,
  status: PROPERTY_STATUS,
  currency: CURRENCIES,
} as const;

function provided(body: Body, key: string) {
  return Object.prototype.hasOwnProperty.call(body, key) && body[key] !== undefined;
}

function optionalText(value: unknown) {
  const text = typeof value === "string" ? value.trim() : "";
  return text || null;
}

function optionalList(value: unknown) {
  if (!Array.isArray(value)) return null;
  const items = value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
  return items.length ? JSON.stringify(items) : null;
}

// Only fields present in the body are returned, so a partial update never clears the rest.
export function readPropertyFields(body: Body): {
  data: PropertyFields;
  error: string | null;
} {
  const data: PropertyFields = {};

  if (provided(body, "title")) {
    const title = optionalText(body.title);
    if (!title) return { data, error: "El título es obligatorio" };
    data.title = title;
  }

  for (const [field, options] of Object.entries(CHOICE_FIELDS)) {
    if (!provided(body, field)) continue;
    const value = body[field];
    if (!options.some((option) => option.value === value)) {
      return { data, error: `Valor inválido para ${field}` };
    }
    data[field as keyof typeof CHOICE_FIELDS] = value as string;
  }

  if (provided(body, "featured")) {
    if (typeof body.featured !== "boolean") {
      return { data, error: "Valor inválido para featured" };
    }
    data.featured = body.featured;
  }
  if (provided(body, "province")) {
    data.province = optionalText(body.province) || "Ciudad Autónoma de Buenos Aires";
  }
  if (provided(body, "externalSource")) {
    data.externalSource = optionalText(body.externalSource) || "manual";
  }

  for (const field of TEXT_FIELDS) {
    if (provided(body, field)) data[field] = optionalText(body[field]);
  }
  for (const field of DECIMAL_FIELDS) {
    if (!provided(body, field)) continue;
    const raw = body[field];
    if (raw === null || raw === "") {
      data[field] = null;
      continue;
    }
    const number = typeof raw === "number" || typeof raw === "string" ? Number(raw) : NaN;
    if (!Number.isFinite(number) || number < 0) {
      return { data, error: `Número inválido para ${field}` };
    }
    data[field] = number;
  }
  for (const field of INTEGER_FIELDS) {
    if (!provided(body, field)) continue;
    const raw = body[field];
    if (raw === null || raw === "") {
      data[field] = null;
      continue;
    }
    const number = typeof raw === "number" || typeof raw === "string" ? Number(raw) : NaN;
    if (!Number.isInteger(number) || number < 0) {
      return { data, error: `Número entero inválido para ${field}` };
    }
    data[field] = number;
  }
  for (const field of LIST_FIELDS) {
    if (!provided(body, field)) continue;
    if (!Array.isArray(body[field]) || !body[field].every((item: unknown) => typeof item === "string")) {
      return { data, error: `Lista inválida para ${field}` };
    }
    data[field] = optionalList(body[field]);
  }

  return { data, error: null };
}

// The home, the detail pages and the sitemap are prerendered, so they need an explicit refresh.
export function revalidatePublicCatalog() {
  revalidatePath("/");
  revalidatePath("/propiedades");
  revalidatePath("/propiedades/[slug]", "page");
  revalidatePath("/sitemap.xml");
}
