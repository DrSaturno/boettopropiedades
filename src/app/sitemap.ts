import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { DEMO_PROPERTIES } from "@/data/demo-properties";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://boettopropiedades.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/propiedades`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/contacto`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/tasaciones`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/nosotros`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  const properties = await prisma.property.findMany({
    where: { status: "published" },
    select: { slug: true, updatedAt: true },
  });
  const propertyPages: MetadataRoute.Sitemap = properties.length === 0 && process.env.CATALOG_DEMO_MODE === "true"
    ? DEMO_PROPERTIES.map((p) => ({
      url: `${BASE_URL}/propiedades/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }))
    : properties.map((p) => ({
      url: `${BASE_URL}/propiedades/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  return [...staticPages, ...propertyPages];
}
