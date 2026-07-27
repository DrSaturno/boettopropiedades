import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { scrapeProperty } from "@/lib/scraper";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  try {
    const { url } = await request.json();
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL requerida" }, { status: 400 });
    }

    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: "URL inválida" }, { status: 400 });
    }

    const data = await scrapeProperty(url);
    return NextResponse.json({ ...data, externalUrl: url });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Error al procesar el link";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
