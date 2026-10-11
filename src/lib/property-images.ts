import "server-only";

import { del } from "@vercel/blob";
import { unlink } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";

export function parsePropertyImages(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const images: unknown = JSON.parse(raw);
    return Array.isArray(images)
      ? images.filter((image): image is string => typeof image === "string")
      : [];
  } catch {
    return [];
  }
}

export function isManagedBlobImage(url: string): boolean {
  try {
    const parsed = new URL(url);
    return (
      parsed.protocol === "https:" &&
      parsed.hostname.endsWith(".public.blob.vercel-storage.com") &&
      parsed.pathname.startsWith("/properties/")
    );
  } catch {
    return false;
  }
}

export function isManagedLocalImage(url: string): boolean {
  return /^\/uploads\/[a-zA-Z0-9_-]*-\d+\.(jpg|png|webp|avif)$/.test(url);
}

// A photo may be reused by another property. Remove it only after the last DB reference is gone.
export async function deleteUnusedPropertyImages(urls: string[]) {
  let failed = 0;

  for (const url of new Set(urls.filter((image) =>
    isManagedBlobImage(image) || isManagedLocalImage(image)
  ))) {
    try {
      const references = await prisma.property.count({
        where: { images: { contains: url } },
      });
      if (references > 0) continue;

      if (isManagedBlobImage(url) && process.env.BLOB_READ_WRITE_TOKEN) {
        await del(url);
      } else if (isManagedLocalImage(url) && !process.env.VERCEL) {
        await unlink(path.join(process.cwd(), "public", "uploads", path.basename(url)));
      }
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        failed += 1;
        console.error(`[images] No se pudo borrar ${url}`, error);
      }
    }
  }

  return { failed };
}
