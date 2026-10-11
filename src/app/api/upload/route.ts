import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { put } from "@vercel/blob";
import { authOptions } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import {
  getPropertyImagesBucket,
  getSupabaseAdmin,
} from "@/lib/supabase/admin";

const extensionByMimeType: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

// Vercel rejects request bodies above 4.5 MB before they reach this handler.
const MAX_BYTES = 4 * 1024 * 1024;

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No se envió un archivo" }, { status: 400 });
    }

    const extension = extensionByMimeType[file.type];
    if (!extension) {
      return NextResponse.json({ error: "Tipo de archivo no permitido" }, { status: 400 });
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "El archivo excede 4 MB" }, { status: 413 });
    }

    const safeName = file.name
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 50);
    const filename = `${safeName}-${Date.now()}.${extension}`;

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`properties/${filename}`, file, {
        access: "public",
        addRandomSuffix: true,
        contentType: file.type,
      });
      return NextResponse.json({ url: blob.url });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    if (process.env.SUPABASE_STORAGE_ENABLED === "true") {
      const bucket = getPropertyImagesBucket();
      const objectPath = `properties/${filename}`;
      const supabase = getSupabaseAdmin();
      const { error } = await supabase.storage
        .from(bucket)
        .upload(objectPath, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (error) throw error;

      const { data } = supabase.storage.from(bucket).getPublicUrl(objectPath);
      return NextResponse.json({ url: data.publicUrl });
    }

    // Vercel's filesystem is read-only, so local disk only works in development.
    if (process.env.VERCEL) {
      return NextResponse.json(
        { error: "Falta configurar el almacenamiento de imágenes (Vercel Blob)" },
        { status: 503 }
      );
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    await writeFile(path.join(uploadDir, filename), buffer);

    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error al subir el archivo" }, { status: 500 });
  }
}
