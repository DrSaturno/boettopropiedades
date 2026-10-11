import "server-only";

import type { Property } from "@prisma/client";
import { DEMO_PROPERTIES, findDemoProperty } from "@/data/demo-properties";
import { prisma } from "@/lib/prisma";
import { selectHomeProperties } from "@/lib/home-property-selection";
import { parseJsonField } from "@/lib/utils";
import type { PropertyData } from "@/types";

export interface PublicCatalogFilters {
  operation?: string;
  propertyTypes?: string[];
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
}

interface CatalogResult {
  properties: PropertyData[];
  demoMode: boolean;
}

const demoCatalogEnabled = process.env.CATALOG_DEMO_MODE === "true";

function mapDatabaseProperty(property: Property): PropertyData {
  return {
    ...property,
    images: parseJsonField<string[]>(property.images, []),
    amenities: parseJsonField<string[]>(property.amenities, []),
    createdAt: property.createdAt.toISOString(),
    updatedAt: property.updatedAt.toISOString(),
  };
}

function filterDemoProperties(filters: PublicCatalogFilters) {
  const location = filters.city?.trim().toLocaleLowerCase("es-AR");

  return DEMO_PROPERTIES.filter((property) => {
    if (filters.operation && property.operation !== filters.operation) {
      return false;
    }

    if (
      filters.propertyTypes?.length &&
      !filters.propertyTypes.includes(property.propertyType)
    ) {
      return false;
    }

    if (location) {
      const searchableLocation = [
        property.address,
        property.neighborhood,
        property.city,
      ]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase("es-AR");

      if (!searchableLocation.includes(location)) return false;
    }

    if (
      filters.minPrice != null &&
      (property.price == null || property.price < filters.minPrice)
    ) {
      return false;
    }

    if (
      filters.maxPrice != null &&
      (property.price == null || property.price > filters.maxPrice)
    ) {
      return false;
    }

    if (
      filters.bedrooms != null &&
      (property.bedrooms == null || property.bedrooms < filters.bedrooms)
    ) {
      return false;
    }

    return true;
  });
}

export async function getPublicPropertyCatalog(
  filters: PublicCatalogFilters
): Promise<CatalogResult> {
  try {
    const publishedCount = await prisma.property.count({
      where: { status: "published" },
    });

    if (publishedCount > 0) {
      const properties = await prisma.property.findMany({
        where: {
          status: "published",
          operation: filters.operation,
          propertyType: filters.propertyTypes?.length
            ? { in: filters.propertyTypes }
            : undefined,
          price:
            filters.minPrice != null || filters.maxPrice != null
              ? { gte: filters.minPrice, lte: filters.maxPrice }
              : undefined,
          bedrooms:
            filters.bedrooms != null ? { gte: filters.bedrooms } : undefined,
          OR: filters.city
            ? [
                { city: { contains: filters.city } },
                { neighborhood: { contains: filters.city } },
                { address: { contains: filters.city } },
              ]
            : undefined,
        },
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      });

      return {
        properties: properties.map(mapDatabaseProperty),
        demoMode: false,
      };
    }

    return {
      properties: demoCatalogEnabled ? filterDemoProperties(filters) : [],
      demoMode: demoCatalogEnabled,
    };
  } catch (error) {
    console.error("[properties] Unable to load the property catalog", error);
    throw error;
  }
}

export async function getCatalogPropertyBySlug(slug: string): Promise<{
  property: PropertyData | null;
  demoMode: boolean;
}> {
  try {
    const property = await prisma.property.findUnique({ where: { slug } });

    if (property?.status === "published") {
      return { property: mapDatabaseProperty(property), demoMode: false };
    }

    if (demoCatalogEnabled && await prisma.property.count({ where: { status: "published" } }) === 0) {
      return { property: findDemoProperty(slug), demoMode: true };
    }

    return { property: null, demoMode: false };
  } catch (error) {
    console.error(`[properties] Unable to load property ${slug}`, error);
    throw error;
  }
}

export async function getRelatedCatalogProperties(
  property: PropertyData,
  demoMode: boolean
): Promise<PropertyData[]> {
  if (!demoMode) {
    try {
      const related = await prisma.property.findMany({
        where: {
          status: "published",
          slug: { not: property.slug },
          OR: [
            { operation: property.operation, city: property.city },
            { propertyType: property.propertyType },
          ],
        },
        take: 3,
        orderBy: { createdAt: "desc" },
      });

      return related.map(mapDatabaseProperty);
    } catch (error) {
      console.error(
        `[properties] Unable to load related properties for ${property.slug}`,
        error
      );
    }
    return [];
  }

  return DEMO_PROPERTIES.filter(
    (candidate) =>
      candidate.slug !== property.slug &&
      (candidate.neighborhood === property.neighborhood ||
        candidate.operation === property.operation)
  ).slice(0, 3);
}

export async function getHomeCatalogProperties() {
  try {
    const properties = await prisma.property.findMany({
      where: { status: "published" },
      orderBy: { createdAt: "desc" },
    });

    if (properties.length > 0) {
      return selectHomeProperties(properties).map(mapDatabaseProperty);
    }

    return demoCatalogEnabled
      ? selectHomeProperties(DEMO_PROPERTIES)
      : [];
  } catch (error) {
    console.error("[home] Unable to load properties", error);
    throw error;
  }
}
