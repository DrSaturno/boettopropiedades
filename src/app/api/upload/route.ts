import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
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

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "El archivo excede 10MB" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const safeName = file.name
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 50);
    const filename = `${safeName}-${Date.now()}.${extension}`;

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

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    await writeFile(path.join(uploadDir, filename), buffer);

    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error al subir el archivo" }, { status: 500 });
  }
}
