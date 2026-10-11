import { NextResponse } from "next/server";
import { deliverInquiryNotification } from "@/lib/inquiry-notifications";
import { createInquiryWithLead } from "@/lib/crm-service";
import { valuationInput } from "@/lib/inquiry-input";

export async function POST(request: Request) {
  try {
    const parsed = valuationInput.safeParse(await request.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json({ error: "Revisá los datos del formulario" }, { status: 400 });
    }
    const { name, email, phone, propertyType, operation, location, message } = parsed.data;

    const fullMessage = [
      `Tipo: ${propertyType || "-"}`,
      `Operación: ${operation || "-"}`,
      `Ubicación: ${location || "-"}`,
      message ? `Comentarios: ${message}` : "",
    ].filter(Boolean).join("\n");

    const inquiry = await createInquiryWithLead({
      name,
      email,
      phone,
      message: fullMessage,
      type: "tasacion",
    });

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
  } catch (error) {
    console.error("[tasaciones] No se pudo registrar la solicitud", error);
    return NextResponse.json({ error: "Error al procesar la solicitud" }, { status: 500 });
  }
}
