import * as cheerio from "cheerio";

interface ScrapedData {
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
}

function emptyResult(source: string): ScrapedData {
  return {
    title: "", operation: "venta", propertyType: "casa", price: "", currency: "USD",
    expenses: "", address: "", neighborhood: "", city: "", description: "",
    totalArea: "", coveredArea: "", rooms: "", bedrooms: "", bathrooms: "",
    garages: "", age: "", amenities: [], images: [], source,
  };
}

function detectSource(url: string): string {
  if (url.includes("zonaprop.com")) return "zonaprop";
  if (url.includes("argenprop.com")) return "argenprop";
  if (url.includes("mercadolibre.com") || url.includes("inmuebles.mercadolibre.com")) return "mercadolibre";
  return "otro";
}

function detectOperation(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes("alquiler") || lower.includes("rent")) return "alquiler";
  return "venta";
}

function detectPropertyType(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes("departamento") || lower.includes("depto")) return "departamento";
  if (lower.includes("ph") || lower.includes("p.h.")) return "ph";
  if (lower.includes("local")) return "local";
  if (lower.includes("oficina")) return "oficina";
  if (lower.includes("terreno") || lower.includes("lote")) return "terreno";
  if (lower.includes("galpón") || lower.includes("galpon")) return "galpon";
  if (lower.includes("cochera")) return "cochera";
  if (lower.includes("campo")) return "campo";
  return "casa";
}

function extractNumber(text: string): string {
  const match = text.replace(/\./g, "").replace(/,/g, ".").match(/[\d.]+/);
  return match ? match[0] : "";
}

function scrapeZonaprop(html: string, url: string): ScrapedData {
  const $ = cheerio.load(html);
  const data = emptyResult("zonaprop");

  data.title = $("h1").first().text().trim() || $(".title-type-sup-property").text().trim();
  data.description = $(".section-description--content").text().trim() || $("[class*='description']").first().text().trim();

  const priceText = $(".price-value, [class*='price']").first().text().trim();
  data.price = extractNumber(priceText);
  data.currency = priceText.includes("U") || priceText.includes("USD") ? "USD" : "ARS";

  const expensesText = $("[class*='expensas'], [class*='expenses']").first().text().trim();
  data.expenses = extractNumber(expensesText);

  data.address = $(".location-container .title-location, [class*='location'] h2, [class*='address']").first().text().trim();
  data.neighborhood = $("[class*='location'] [class*='barrio'], [class*='neighborhood']").first().text().trim();

  $("[class*='feature'], .desktop-section-highlighted-features li, .section-icon-features li").each((_, el) => {
    const text = $(el).text().trim().toLowerCase();
    if (text.includes("m²") || text.includes("m2")) {
      if (text.includes("total") || text.includes("sup.") && !text.includes("cub")) {
        data.totalArea = extractNumber(text);
      } else if (text.includes("cub")) {
        data.coveredArea = extractNumber(text);
      } else if (!data.totalArea) {
        data.totalArea = extractNumber(text);
      }
    }
    if (text.includes("amb")) data.rooms = extractNumber(text);
    if (text.includes("dorm") || text.includes("hab")) data.bedrooms = extractNumber(text);
    if (text.includes("baño")) data.bathrooms = extractNumber(text);
    if (text.includes("coch") || text.includes("garage")) data.garages = extractNumber(text);
    if (text.includes("antig") || text.includes("año")) data.age = extractNumber(text);
  });

  data.operation = detectOperation($("h1").text() + " " + url);
  data.propertyType = detectPropertyType(data.title);

  $("img[src*='zonaprop'], img[data-src*='zonaprop'], [class*='gallery'] img").each((_, el) => {
    const src = $(el).attr("data-src") || $(el).attr("src") || "";
    if (src && src.startsWith("http") && !src.includes("logo") && !src.includes("icon")) {
      data.images.push(src);
    }
  });

  return data;
}

function scrapeArgenprop(html: string, url: string): ScrapedData {
  const $ = cheerio.load(html);
  const data = emptyResult("argenprop");

  data.title = $("h1").first().text().trim();
  data.description = $(".section-description p, [class*='description']").first().text().trim();

  const priceText = $("[class*='precio'], [class*='price']").first().text().trim();
  data.price = extractNumber(priceText);
  data.currency = priceText.includes("U") || priceText.includes("USD") ? "USD" : "ARS";

  const expensesText = $("[class*='expensas']").first().text().trim();
  data.expenses = extractNumber(expensesText);

  data.address = $("[class*='direccion'], [class*='address'], [class*='ubicacion'] p").first().text().trim();

  $("li[class*='feature'], [class*='caracteristicas'] li, ul.properties-features li").each((_, el) => {
    const text = $(el).text().trim().toLowerCase();
    if (text.includes("m²") || text.includes("m2")) {
      if (text.includes("total")) data.totalArea = extractNumber(text);
      else if (text.includes("cub")) data.coveredArea = extractNumber(text);
      else if (!data.totalArea) data.totalArea = extractNumber(text);
    }
    if (text.includes("amb")) data.rooms = extractNumber(text);
    if (text.includes("dorm")) data.bedrooms = extractNumber(text);
    if (text.includes("baño")) data.bathrooms = extractNumber(text);
    if (text.includes("coch")) data.garages = extractNumber(text);
  });

  data.operation = detectOperation(data.title + " " + url);
  data.propertyType = detectPropertyType(data.title);

  $("img[src*='argenprop'], img[data-src], .gallery img").each((_, el) => {
    const src = $(el).attr("data-src") || $(el).attr("src") || "";
    if (src && src.startsWith("http") && !src.includes("logo")) {
      data.images.push(src);
    }
  });

  return data;
}

function scrapeMercadoLibre(html: string, url: string): ScrapedData {
  const $ = cheerio.load(html);
  const data = emptyResult("mercadolibre");

  data.title = $("h1").first().text().trim();
  data.description = $("[class*='description'] p, .item-description__text").first().text().trim();

  const priceText = $("[class*='price'] span, .price-tag-fraction").first().text().trim();
  data.price = extractNumber(priceText);
  const currencySymbol = $("[class*='price'] [class*='currency'], .price-tag-symbol").first().text().trim();
  data.currency = currencySymbol.includes("U") ? "USD" : "ARS";

  $("[class*='attribute'], .specs-item, table.andes-table tr").each((_, el) => {
    const label = $(el).find("th, .specs-item__label, [class*='label']").text().trim().toLowerCase();
    const value = $(el).find("td, .specs-item__value, [class*='value']").text().trim();
    if (label.includes("superficie total") || label.includes("sup. total")) data.totalArea = extractNumber(value);
    if (label.includes("superficie cubierta") || label.includes("sup. cub")) data.coveredArea = extractNumber(value);
    if (label.includes("ambientes") || label.includes("amb")) data.rooms = extractNumber(value);
    if (label.includes("dormitorio") || label.includes("recám")) data.bedrooms = extractNumber(value);
    if (label.includes("baño")) data.bathrooms = extractNumber(value);
    if (label.includes("cochera") || label.includes("estacion")) data.garages = extractNumber(value);
    if (label.includes("antigüedad") || label.includes("antig")) data.age = extractNumber(value);
  });

  data.address = $("[class*='location'] p, [class*='ubicacion']").first().text().trim();
  data.operation = detectOperation(data.title + " " + url);
  data.propertyType = detectPropertyType(data.title);

  $("img[data-zoom], figure img, [class*='gallery'] img").each((_, el) => {
    const src = $(el).attr("data-zoom") || $(el).attr("data-src") || $(el).attr("src") || "";
    if (src && src.startsWith("http") && !src.includes("logo")) {
      data.images.push(src.replace(/-O\.jpg/, "-F.jpg"));
    }
  });

  return data;
}

function scrapeGeneric(html: string): ScrapedData {
  const $ = cheerio.load(html);
  const data = emptyResult("otro");

  data.title = $("h1").first().text().trim() || $("title").text().trim();
  data.description = $("meta[name='description']").attr("content") || "";

  const bodyText = $("body").text().toLowerCase();
  data.operation = detectOperation(bodyText);
  data.propertyType = detectPropertyType(data.title + " " + bodyText.slice(0, 500));

  $("img").each((_, el) => {
    const src = $(el).attr("src") || "";
    if (src && src.startsWith("http") && !src.includes("logo") && !src.includes("icon") && !src.includes("avatar")) {
      data.images.push(src);
    }
  });

  data.images = data.images.slice(0, 20);
  return data;
}

function parseDataFromUrl(url: string, source: string, errorMessage: string): ScrapedData {
  const data = emptyResult(source);
  
  try {
    const parsedUrl = new URL(url);
    const pathname = parsedUrl.pathname;
    
    const cleanPath = pathname.split("?")[0].replace(/\.[^/.]+$/, "");
    const parts = cleanPath.split("/").filter(p => p.length > 0);
    
    let slug = parts[parts.length - 1] || "";
    if (slug.match(/^\d+$/) && parts.length > 1) {
      slug = parts[parts.length - 2];
    }
    
    slug = slug.replace(/-\d+$/, "").replace(/\d+$/, "");
    
    if (slug) {
      const rawTitle = slug.split("-")
        .filter(w => w.length > 0)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
      data.title = rawTitle;
    } else {
      data.title = `Propiedad de ${source.toUpperCase()}`;
    }
  } catch {
    data.title = `Propiedad de ${source.toUpperCase()}`;
  }
  
  data.operation = detectOperation(url);
  data.propertyType = detectPropertyType(url);
  
  return {
    ...data,
    warning: `El sitio web destino bloqueó el acceso automático (Código ${errorMessage}). Hemos pre-completado los datos usando el enlace para que los edites manualmente.`,
  };
}

export async function scrapeProperty(url: string): Promise<ScrapedData> {
  const source = detectSource(url);

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "es-AR,es;q=0.9,en;q=0.8",
      },
    });

    if (!response.ok) {
      throw new Error(`${response.status}`);
    }

    const html = await response.text();

    let data: ScrapedData;
    switch (source) {
      case "zonaprop": data = scrapeZonaprop(html, url); break;
      case "argenprop": data = scrapeArgenprop(html, url); break;
      case "mercadolibre": data = scrapeMercadoLibre(html, url); break;
      default: data = scrapeGeneric(html);
    }

    data.images = [...new Set(data.images)].slice(0, 30);
    return data;
  } catch (error) {
    console.warn(`Scrape failed for ${url}, falling back to URL parsing. Error:`, error);
    const code = error instanceof Error ? error.message : "Desconocido";
    return parseDataFromUrl(url, source, code);
  }
}
