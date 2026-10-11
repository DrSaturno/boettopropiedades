import * as cheerio from "cheerio";
import { AMENITIES_LIST } from "@/lib/constants";

export interface ScrapedData {
  title: string;
  operation: string;
  propertyType: string;
  price: string;
  currency: string;
  expenses: string;
  address: string;
  neighborhood: string;
  city: string;
  description: string;
  totalArea: string;
  coveredArea: string;
  rooms: string;
  bedrooms: string;
  bathrooms: string;
  garages: string;
  age: string;
  amenities: string[];
  images: string[];
  source: string;
  warning?: string;
  blocked?: boolean;
}

type Json = Record<string, unknown>;

const MAX_IMAGES = 40;
const LISTING_DOMAINS = [
  "zonaprop.com.ar",
  "zonaprop.com",
  "argenprop.com",
  "argenprop.com.ar",
  "mercadolibre.com.ar",
  "mercadolibre.com",
];

export function isSupportedListingUrl(value: string) {
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return false;
    return LISTING_DOMAINS.some(
      (domain) => parsed.hostname === domain || parsed.hostname.endsWith(`.${domain}`)
    );
  } catch {
    return false;
  }
}

const AMENITY_KEYWORDS: Record<(typeof AMENITIES_LIST)[number], string[]> = {
  Pileta: ["pileta", "piscina"],
  Quincho: ["quincho"],
  Parrilla: ["parrilla"],
  Jardín: ["jardin"],
  Balcón: ["balcon"],
  Terraza: ["terraza"],
  Lavadero: ["lavadero", "laundry"],
  Baulera: ["baulera"],
  SUM: ["sum", "salon de usos", "salon de fiestas"],
  Gimnasio: ["gimnasio", "gym"],
  "Seguridad 24hs": ["seguridad", "vigilancia"],
  Ascensor: ["ascensor"],
  "Aire acondicionado": ["aire acondicionado"],
  Calefacción: ["calefaccion", "losa radiante"],
  "Agua corriente": ["agua corriente"],
  "Gas natural": ["gas natural"],
  Cloacas: ["cloaca"],
  Pavimento: ["pavimento"],
  Luminoso: ["luminoso"],
  "Apto profesional": ["apto profesional"],
  "Apto crédito": ["apto credito"],
};

const TYPE_PATTERNS: Array<[RegExp, string]> = [
  [/\b(departamento|depto|dpto|apartamento|monoambiente|semipiso)s?\b/, "departamento"],
  [/\bp\.?h\b/, "ph"],
  [/\b(local|locales)\b/, "local"],
  [/\boficinas?\b/, "oficina"],
  [/\b(terreno|lote)s?\b/, "terreno"],
  [/\b(galpon|galpones|deposito|bodega)\b/, "galpon"],
  [/\bcocheras?\b/, "cochera"],
  [/\b(campo|chacra|quinta)s?\b/, "campo"],
  [/\b(casa|chalet|duplex|triplex)s?\b/, "casa"],
];

function emptyResult(source: string): ScrapedData {
  return {
    title: "", operation: "venta", propertyType: "casa", price: "", currency: "USD",
    expenses: "", address: "", neighborhood: "", city: "", description: "",
    totalArea: "", coveredArea: "", rooms: "", bedrooms: "", bathrooms: "",
    garages: "", age: "", amenities: [], images: [], source,
  };
}

function normalize(text: string) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function clean(text: string | undefined | null) {
  return (text || "").replace(/\s+/g, " ").trim();
}

function detectSource(url: string): string {
  const host = new URL(url).hostname;
  if (host.endsWith("zonaprop.com.ar") || host.endsWith("zonaprop.com")) return "zonaprop";
  if (host.endsWith("argenprop.com.ar") || host.endsWith("argenprop.com")) return "argenprop";
  if (host.endsWith("mercadolibre.com.ar") || host.endsWith("mercadolibre.com")) return "mercadolibre";
  return "otro";
}

function detectOperation(text: string): string {
  return /alquil/.test(normalize(text)) ? "alquiler" : "venta";
}

// The earliest keyword wins, so "Casa con local" stays a house.
function detectPropertyType(text: string, fallback = "casa"): string {
  const normalized = normalize(text);
  let best = { index: Infinity, type: fallback };
  for (const [pattern, type] of TYPE_PATTERNS) {
    const index = normalized.search(pattern);
    if (index !== -1 && index < best.index) best = { index, type };
  }
  return best.type;
}

// Argentine formatting: dots group thousands and the comma is the decimal mark.
function numberText(value: unknown): string {
  if (typeof value === "number") return Number.isFinite(value) ? String(value) : "";
  if (typeof value !== "string") return "";
  const match = value.replace(/\./g, "").replace(/,/g, ".").match(/\d+(\.\d+)?/);
  return match ? match[0] : "";
}

function ageText(value: unknown): string {
  if (typeof value === "string" && /estrenar/i.test(value)) return "0";
  return numberText(value);
}

function currencyOf(text: string) {
  return /usd|u\$s|us\$/i.test(text) ? "USD" : "ARS";
}

function htmlToText(html: string) {
  const withBreaks = html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|h\d)>/gi, "\n");
  return cheerio
    .load(`<div>${withBreaks}</div>`)
    .root()
    .text()
    .replace(/[ \t]+/g, " ")
    .replace(/ ?\n ?/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function matchAmenities(labels: string[]): string[] {
  const normalizedLabels = labels.map(normalize);
  return AMENITIES_LIST.filter((amenity) =>
    AMENITY_KEYWORDS[amenity].some((keyword) => {
      const pattern = new RegExp(`\\b${keyword}${keyword.length <= 3 ? "\\b" : ""}`);
      return normalizedLabels.some((label) => pattern.test(label));
    })
  );
}

function readJsonLd($: cheerio.CheerioAPI): Json[] {
  const items: Json[] = [];
  $('script[type="application/ld+json"]').each((_, element) => {
    try {
      const parsed = JSON.parse($(element).contents().text());
      for (const item of Array.isArray(parsed) ? parsed : [parsed]) {
        if (item && typeof item === "object") items.push(item as Json);
      }
    } catch {
      // Malformed blocks are common and safe to skip.
    }
  });
  return items;
}

function findJsonLd(items: Json[], types: string[]) {
  return items.find((item) => types.includes(String(item["@type"])));
}

const RESIDENCE_TYPES = [
  "Apartment", "House", "SingleFamilyResidence", "Residence", "Accommodation",
  "RealEstateListing", "Product", "Place",
];

function applyJsonLd(data: ScrapedData, item: Json | undefined) {
  if (!item) return;

  if (!data.title) data.title = clean(String(item.name || ""));
  if (!data.description) data.description = clean(String(item.description || ""));
  if (!data.rooms) data.rooms = numberText(item.numberOfRooms);
  if (!data.bedrooms) data.bedrooms = numberText(item.numberOfBedrooms);
  if (!data.bathrooms) data.bathrooms = numberText(item.numberOfBathroomsTotal);

  const floorSize = item.floorSize as Json | undefined;
  if (!data.totalArea && floorSize) data.totalArea = numberText(floorSize.value);

  const address = item.address as Json | undefined;
  if (address && typeof address === "object") {
    if (!data.address) data.address = clean(String(address.streetAddress || ""));
    if (!data.neighborhood) data.neighborhood = clean(String(address.addressRegion || ""));
    if (!data.city) {
      const locality = clean(String(address.addressLocality || ""))
        .replace(/,?\s*Argentina\s*,?\s*$/i, "")
        .trim();
      data.city = /^caba$/i.test(locality) ? "Capital Federal" : locality;
    }
  }

  const offers = item.offers as Json | undefined;
  if (!data.price && offers && typeof offers === "object") {
    data.price = numberText(offers.price);
    if (offers.priceCurrency) data.currency = currencyOf(String(offers.priceCurrency));
  }

  const image = item.image;
  const images = Array.isArray(image) ? image : image ? [image] : [];
  for (const entry of images) {
    const url = typeof entry === "string" ? entry : (entry as Json)?.url;
    if (typeof url === "string" && url.startsWith("http")) data.images.push(url);
  }
}

function findBalancedEnd(source: string, start: number): number {
  let depth = 0;
  let inString = false;
  for (let index = start; index < source.length; index += 1) {
    const char = source[index];
    if (inString) {
      if (char === "\\") index += 1;
      else if (char === '"') inString = false;
    } else if (char === '"') {
      inString = true;
    } else if (char === "[" || char === "{") {
      depth += 1;
    } else if (char === "]" || char === "}") {
      depth -= 1;
      if (depth === 0) return index;
    }
  }
  return -1;
}

function findStringEnd(source: string, start: number, quote: string): number {
  for (let index = start + 1; index < source.length; index += 1) {
    if (source[index] === "\\") index += 1;
    else if (source[index] === quote) return index;
    else if (source[index] === "\n") return -1;
  }
  return -1;
}

function parseLiteral(source: string, start: number): unknown {
  const first = source[start];

  if (first === "[" || first === "{") {
    const end = findBalancedEnd(source, start);
    if (end === -1) return undefined;
    try {
      return JSON.parse(source.slice(start, end + 1));
    } catch {
      return undefined;
    }
  }

  if (first === '"' || first === "'") {
    const end = findStringEnd(source, start, first);
    if (end === -1) return undefined;
    const body = source.slice(start + 1, end).replace(/\\'/g, "'");
    const json = first === "'" ? body.replace(/(?<!\\)"/g, '\\"') : body;
    try {
      return JSON.parse(`"${json}"`);
    } catch {
      return body;
    }
  }

  return undefined;
}

// Portals embed the listing as a JS object literal whose values are JSON.
function readEmbeddedValue(script: string, key: string): unknown {
  for (const quote of ["'", '"']) {
    const marker = `${quote}${key}${quote}`;
    let from = 0;
    while (from < script.length) {
      const at = script.indexOf(marker, from);
      if (at === -1) break;
      const separator = script.slice(at + marker.length).match(/^\s*:\s*/);
      if (separator) {
        const value = parseLiteral(script, at + marker.length + separator[0].length);
        if (value !== undefined) return value;
      }
      from = at + marker.length;
    }
  }
  return undefined;
}

function parseZonaprop(html: string, url: string): ScrapedData {
  const $ = cheerio.load(html);
  const data = emptyResult("zonaprop");

  let script = "";
  $("script:not([src])").each((_, element) => {
    const text = $(element).contents().text();
    const at = text.indexOf("avisoInfo =");
    if (at !== -1 && text.length > script.length) script = text.slice(at);
  });

  let typeHint = "";
  let operationHint = "";

  if (script) {
    data.title = clean(String(readEmbeddedValue(script, "postingTitle") || ""));

    const prices = readEmbeddedValue(script, "pricesData") as Json[] | undefined;
    const firstOperation = Array.isArray(prices) ? prices[0] : undefined;
    const firstPrice = (firstOperation?.prices as Json[] | undefined)?.[0];
    if (firstPrice) {
      data.price = numberText(firstPrice.amount);
      data.currency = currencyOf(String(firstPrice.isoCode || firstPrice.currency || ""));
    }
    operationHint = String((firstOperation?.operationType as Json | undefined)?.name || "");

    data.expenses = numberText(readEmbeddedValue(script, "expenses"));

    const description = readEmbeddedValue(script, "description");
    if (typeof description === "string") {
      data.description = htmlToText(
        description.replace(
          /<span class=['"]descripcionDatosAnunciante['"]>[\s\S]*?<\/span>/g,
          ""
        )
      );
    }

    const address = readEmbeddedValue(script, "address") as Json | undefined;
    if (address && typeof address === "object") data.address = clean(String(address.name || ""));

    let location = readEmbeddedValue(script, "location") as Json | null | undefined;
    while (location && typeof location === "object") {
      const label = String(location.label || "");
      const name = clean(String(location.name || ""));
      if (label === "BARRIO" && !data.neighborhood) data.neighborhood = name;
      if (label === "CIUDAD" && !data.city) data.city = name;
      location = location.parent as Json | null | undefined;
    }

    const mainFeatures = readEmbeddedValue(script, "mainFeatures") as Json | undefined;
    for (const feature of Object.values(mainFeatures || {}) as Json[]) {
      const kind = normalize(`${feature.icon || ""} ${feature.label || ""}`);
      const value = feature.value;
      if (kind.includes("stotal") || /\btot/.test(kind)) data.totalArea = numberText(value);
      else if (kind.includes("scubierta") || /\bcub/.test(kind)) data.coveredArea = numberText(value);
      else if (kind.includes("ambiente") || /\bamb/.test(kind)) data.rooms = numberText(value);
      else if (kind.includes("dormitorio") || /\bdorm/.test(kind)) data.bedrooms = numberText(value);
      else if (/\bbano/.test(kind)) data.bathrooms = numberText(value);
      else if (kind.includes("cochera") || /\bcoch/.test(kind)) data.garages = numberText(value);
      else if (kind.includes("antiguedad")) data.age = ageText(value);
    }

    const generalFeatures = readEmbeddedValue(script, "generalFeatures") as Json | undefined;
    const labels: string[] = [];
    for (const group of Object.values(generalFeatures || {}) as Json[]) {
      for (const feature of Object.values(group || {}) as Json[]) {
        if (feature?.label) labels.push(String(feature.label));
      }
    }
    data.amenities = matchAmenities(labels);

    const pictures = readEmbeddedValue(script, "pictures") as Json[] | undefined;
    for (const picture of Array.isArray(pictures) ? pictures : []) {
      const picked =
        picture.url1200x1200 || picture.resizeUrl1200x1200 || picture.url730x532;
      if (typeof picked === "string") data.images.push(picked.split("?")[0]);
    }

    const realEstateType = readEmbeddedValue(script, "realEstateType") as Json | undefined;
    typeHint = String(realEstateType?.name || "");
  }

  const hadEmbeddedImages = data.images.length > 0;
  applyJsonLd(data, findJsonLd(readJsonLd($), RESIDENCE_TYPES));
  if (hadEmbeddedImages) data.images = data.images.filter((image) => !image.includes("?"));

  if (!data.title) data.title = clean($("h1").first().text());
  data.title = data.title.replace(/\s*-\s*Zonaprop\s*$/i, "");

  const slug = url.split("/").pop() || "";
  data.operation = detectOperation(operationHint || (slug.startsWith("al") ? "alquiler" : "venta"));
  data.propertyType = detectPropertyType(`${typeHint} ${data.title}`);

  return data;
}

function parseArgenprop(html: string, url: string): ScrapedData {
  const $ = cheerio.load(html);
  const data = emptyResult("argenprop");

  data.title = clean($("h1").first().text());
  data.address = clean($(".titlebar__address").first().text());

  const priceText = clean($(".titlebar__price").first().text());
  data.price = numberText(priceText);
  if (data.price) data.currency = currencyOf(priceText);
  data.expenses = numberText(clean($(".titlebar__expenses").first().text()));

  const descriptionHtml = $(".section-description--content").first().html();
  if (descriptionHtml) data.description = htmlToText(descriptionHtml);

  let typeHint = "";
  let operationHint = "";
  const labels: string[] = [];

  $("ul.property-features li").each((_, element) => {
    const text = clean($(element).text());
    const separator = text.indexOf(":");
    if (separator === -1) {
      labels.push(text);
      return;
    }

    const label = normalize(text.slice(0, separator));
    const value = text.slice(separator + 1).trim();
    if (label.includes("ambientes")) data.rooms = numberText(value);
    else if (label.includes("dormitorios")) data.bedrooms = numberText(value);
    else if (label.includes("banos")) data.bathrooms = numberText(value);
    else if (label.includes("cocheras")) data.garages = numberText(value);
    else if (label.includes("sup. cubierta")) data.coveredArea = numberText(value);
    else if (label.includes("sup. total")) data.totalArea = numberText(value);
    else if (label.includes("antiguedad")) data.age = ageText(value);
    else if (label.includes("tipo de unidad")) typeHint = value;
    else if (label.includes("tipo de operacion")) operationHint = value;
    else if (label.includes("expensas") && !data.expenses) data.expenses = numberText(value);
  });

  $(".property-main-features li").each((_, element) => {
    const kind = normalize($(element).attr("title") || "");
    const value = clean($(element).text());
    if (kind.includes("antiguedad") && !data.age) data.age = ageText(value);
  });

  data.amenities = matchAmenities(labels);

  const jsonLd = findJsonLd(readJsonLd($), RESIDENCE_TYPES);
  const mainImage = typeof jsonLd?.image === "string" ? jsonLd.image : "";
  applyJsonLd(data, jsonLd);

  // Thumbnails of other listings share the page, so keep only this listing's folder.
  const folder = mainImage.match(/static-content\/([^/]+)\//)?.[1];
  $("[data-open-gallery]").each((_, element) => {
    const match = ($(element).attr("style") || "").match(/url\((https?:[^)]+)\)/);
    if (match) data.images.push(match[1]);
  });
  data.images = data.images
    .filter((image) => !folder || image.includes(`/static-content/${folder}/`))
    .map((image) => image.replace(/_u_(small|medium|large)(\.\w+)$/, "$2"));

  data.operation = detectOperation(operationHint || `${data.title} ${url}`);
  data.propertyType = detectPropertyType(`${typeHint} ${data.title} ${url}`);

  return data;
}

function parseMercadoLibre(html: string, url: string): ScrapedData {
  const $ = cheerio.load(html);
  const data = emptyResult("mercadolibre");
  const jsonLd = readJsonLd($);

  data.title = clean($("h1").first().text());

  const descriptionHtml = $(".ui-pdp-description__content").first().html();
  if (descriptionHtml) data.description = htmlToText(descriptionHtml);

  const location = clean($(".ui-vip-location__subtitle p, .ui-vip-location p").first().text());
  const [address = "", neighborhood = "", city = ""] = location.split(",").map((part) => part.trim());
  data.address = address;
  data.neighborhood = neighborhood;
  data.city = city;

  const labels: string[] = [];
  $(".andes-table__row, .ui-vpp-striped-specs__row").each((_, element) => {
    const rawLabel = clean($(element).find("th").text());
    const label = normalize(rawLabel);
    const value = clean($(element).find("td").text());
    if (label.includes("superficie total")) data.totalArea = numberText(value);
    else if (label.includes("superficie cubierta")) data.coveredArea = numberText(value);
    else if (label === "ambientes") data.rooms = numberText(value);
    else if (label === "dormitorios") data.bedrooms = numberText(value);
    else if (label === "banos") data.bathrooms = numberText(value);
    else if (label === "cocheras") data.garages = numberText(value);
    else if (label.includes("antiguedad")) data.age = ageText(value);
    else if (label.includes("expensas")) data.expenses = numberText(value);
    else if (/^si\b/.test(normalize(value))) labels.push(rawLabel);
  });
  data.amenities = matchAmenities(labels);

  const product = findJsonLd(jsonLd, ["Product"]);
  const offers = product?.offers as Json | undefined;
  if (offers) {
    data.price = numberText(offers.price);
    data.currency = currencyOf(String(offers.priceCurrency || ""));
  } else {
    const priceLine = $(".ui-pdp-price__second-line").first();
    data.price = numberText(priceLine.find(".andes-money-amount__fraction").first().text());
    data.currency = currencyOf(priceLine.find(".andes-money-amount__currency-symbol").first().text());
  }

  const seen = new Set<string>();
  $(".ui-pdp-gallery__figure img").each((_, element) => {
    const source = $(element).attr("data-zoom") || $(element).attr("src") || "";
    const id = source.match(/\d+-MLA\d+_\d+/)?.[0];
    if (!source.startsWith("http") || !id || seen.has(id)) return;
    seen.add(id);
    data.images.push(source);
  });

  const breadcrumb = findJsonLd(jsonLd, ["BreadcrumbList"]);
  const crumbs = ((breadcrumb?.itemListElement as Json[] | undefined) || [])
    .map((entry) => String((entry.item as Json | undefined)?.name || ""))
    .join(" ");

  data.operation = detectOperation(`${crumbs} ${url}`);
  data.propertyType = detectPropertyType(`${crumbs} ${data.title} ${url}`);

  return data;
}

function parseGeneric(html: string): ScrapedData {
  const $ = cheerio.load(html);
  const data = emptyResult("otro");

  data.title =
    clean($("h1").first().text()) ||
    clean($('meta[property="og:title"]').attr("content")) ||
    clean($("title").text());

  applyJsonLd(data, findJsonLd(readJsonLd($), RESIDENCE_TYPES));

  if (!data.description) {
    data.description =
      clean($('meta[property="og:description"]').attr("content")) ||
      clean($('meta[name="description"]').attr("content"));
  }

  const ogImage = $('meta[property="og:image"]').attr("content");
  if (ogImage?.startsWith("http")) data.images.push(ogImage);

  $("img").each((_, element) => {
    const source = $(element).attr("data-src") || $(element).attr("src") || "";
    if (source.startsWith("http") && !/logo|icon|avatar|sprite/i.test(source)) {
      data.images.push(source);
    }
  });

  const context = `${data.title} ${$("body").text().slice(0, 500)}`;
  data.operation = detectOperation(context);
  data.propertyType = detectPropertyType(context);

  return data;
}

function parseListing(html: string, url: string, source: string): ScrapedData {
  let data: ScrapedData;
  switch (source) {
    case "zonaprop": data = parseZonaprop(html, url); break;
    case "argenprop": data = parseArgenprop(html, url); break;
    case "mercadolibre": data = parseMercadoLibre(html, url); break;
    default: data = parseGeneric(html);
  }

  if (normalize(data.neighborhood) === normalize(data.city)) data.neighborhood = "";
  data.images = [...new Set(data.images)].slice(0, MAX_IMAGES);
  return data;
}

function looksLikeChallenge(html: string) {
  const head = html.slice(0, 4000).toLowerCase();
  return (
    head.includes("<title>just a moment") ||
    head.includes("<title>attention required") ||
    head.includes("challenge-platform")
  );
}

function fromUrlOnly(url: string, source: string, reason: string): ScrapedData {
  const data = emptyResult(source);

  try {
    const parts = new URL(url).pathname
      .replace(/\.[^/.]+$/, "")
      .split("/")
      .filter(Boolean);

    let slug = parts[parts.length - 1] || "";
    if (/^\d+$/.test(slug) && parts.length > 1) slug = parts[parts.length - 2];
    slug = slug.replace(/-+\d+$/, "").replace(/^(ve|al)cl[a-z]{4}-+/, "");

    data.title = slug
      .split("-")
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  } catch {
    data.title = "";
  }

  data.operation = detectOperation(url.includes("/alcl") ? "alquiler" : url);
  data.propertyType = detectPropertyType(url);
  data.blocked = true;
  data.warning = `El portal no permitió leer la publicación automáticamente (${reason}). Podés pegar el código de la página para traer todos los datos, o completar el formulario a mano.`;

  return data;
}

export async function scrapeProperty(url: string, pastedHtml?: string): Promise<ScrapedData> {
  const source = detectSource(url);

  if (pastedHtml) {
    const data = looksLikeChallenge(pastedHtml)
      ? emptyResult(source)
      : parseListing(pastedHtml, url, source);
    if (!data.title) {
      throw new Error(
        "El código pegado no contiene los datos de la publicación. Copialo desde la pestaña donde se ve la propiedad."
      );
    }
    return data;
  }

  let html: string;
  try {
    let currentUrl = url;
    let response: Response | undefined;
    for (let redirect = 0; redirect < 4; redirect++) {
      response = await fetch(currentUrl, {
        redirect: "manual",
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "es-AR,es;q=0.9,en;q=0.8",
        },
        signal: AbortSignal.timeout(15000),
      });

      if (response.status < 300 || response.status >= 400) break;
      const location = response.headers.get("location");
      if (!location) break;
      const nextUrl = new URL(location, currentUrl).href;
      if (!isSupportedListingUrl(nextUrl)) {
        throw new Error("Redirección fuera de los portales permitidos");
      }
      currentUrl = nextUrl;
    }

    if (!response) throw new Error("Sin respuesta");

    if (!response.ok) return fromUrlOnly(url, source, `código ${response.status}`);
    if (Number(response.headers.get("content-length")) > 5_000_000) {
      return fromUrlOnly(url, source, "página demasiado grande");
    }
    html = await response.text();
  } catch {
    return fromUrlOnly(url, source, "sin respuesta");
  }

  if (looksLikeChallenge(html)) return fromUrlOnly(url, source, "verificación anti-bots");

  const data = parseListing(html, url, source);
  return data.title ? data : fromUrlOnly(url, source, "sin datos");
}
