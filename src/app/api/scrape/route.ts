import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isSupportedListingUrl, scrapeProperty } from "@/lib/scraper";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const url = typeof body?.url === "string" ? body.url.trim() : "";
  const html = typeof body?.html === "string" && body.html.trim() ? body.html : undefined;

  if (!url) return NextResponse.json({ error: "URL requerida" }, { status: 400 });
  if (url.length > 2048 || !isSupportedListingUrl(url)) {
    return NextResponse.json({ error: "Usá un link de Zonaprop, Argenprop o MercadoLibre" }, { status: 400 });
  }
  if (html && html.length > 3_500_000) {
    return NextResponse.json({ error: "El código pegado es demasiado grande" }, { status: 413 });
  }

  try {
    const data = await scrapeProperty(url, html);
    return NextResponse.json({ ...data, externalUrl: url });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Error al procesar el link";
    return NextResponse.json({ error: message }, { status: html ? 422 : 500 });
  }
}
