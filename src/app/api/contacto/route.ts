import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deliverInquiryNotification } from "@/lib/inquiry-notifications";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message, type, propertyId } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Nombre y email son requeridos" }, { status: 400 });
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        name,
        email,
        phone: phone || null,
        message: message || null,
        type: type || "contact",
        propertyId: propertyId ? Number(propertyId) : null,
      },
      include: {
        property: {
          select: { title: true },
        },
      },
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
  } catch {
    return NextResponse.json({ error: "Error al procesar la consulta" }, { status: 500 });
  }
}
