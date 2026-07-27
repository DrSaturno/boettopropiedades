import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, propertyType, operation, location, message } = body;

    if (!name || !email || !phone) {
      return NextResponse.json({ error: "Campos requeridos incompletos" }, { status: 400 });
    }

    const fullMessage = [
      `Tipo: ${propertyType || "-"}`,
      `Operación: ${operation || "-"}`,
      `Ubicación: ${location || "-"}`,
      message ? `Comentarios: ${message}` : "",
    ].filter(Boolean).join("\n");

    const inquiry = await prisma.inquiry.create({
      data: {
        name,
        email,
        phone,
        message: fullMessage,
        type: "tasacion",
      },
    });

    return NextResponse.json({ success: true, id: inquiry.id });
  } catch {
    return NextResponse.json({ error: "Error al procesar la solicitud" }, { status: 500 });
  }
}
