import { NextResponse } from "next/server";
import { deliverInquiryNotification } from "@/lib/inquiry-notifications";
import { createInquiryWithLead } from "@/lib/crm-service";
import { contactInput } from "@/lib/inquiry-input";

export async function POST(request: Request) {
  try {
    const parsed = contactInput.safeParse(await request.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json({ error: "Revisá los datos del formulario" }, { status: 400 });
    }
    const { name, email, phone, message, type, propertyId } = parsed.data;

    const inquiry = await createInquiryWithLead({
      name,
      email,
      phone,
      message,
      type,
      propertyId: propertyId || null,
    });

    const notificationStatus = await deliverInquiryNotification({
      id: inquiry.id,
      name: inquiry.name,
      email: inquiry.email,
      phone: inquiry.phone,
      message: inquiry.message,
      type: inquiry.type,
      propertyTitle: inquiry.property?.title,
      createdAt: inquiry.createdAt,
    });

    return NextResponse.json({
      success: true,
      id: inquiry.id,
      notificationStatus,
    });
  } catch (error) {
    console.error("[contacto] No se pudo registrar la consulta", error);
    return NextResponse.json({ error: "Error al procesar la consulta" }, { status: 500 });
  }
}
