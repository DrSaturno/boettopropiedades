import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deliverInquiryNotification } from "@/lib/inquiry-notifications";
import { findOrCreateLead } from "@/lib/crm-service";

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

    findOrCreateLead({
      inquiryId: inquiry.id,
      name,
      email,
      phone,
      source: "web",
    }).catch((err) => console.error("[crm] Error creating lead from tasacion:", err));

    const notificationStatus = await deliverInquiryNotification({
      id: inquiry.id,
      name: inquiry.name,
      email: inquiry.email,
      phone: inquiry.phone,
      message: inquiry.message,
      type: inquiry.type,
      createdAt: inquiry.createdAt,
    });

    return NextResponse.json({
      success: true,
      id: inquiry.id,
      notificationStatus,
    });
  } catch {
    return NextResponse.json({ error: "Error al procesar la solicitud" }, { status: 500 });
  }
}
