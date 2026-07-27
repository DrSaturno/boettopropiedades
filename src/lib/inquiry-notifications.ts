import "server-only";

import { prisma } from "@/lib/prisma";
import {
  InquiryEmailPayload,
  sendInquiryEmail,
} from "@/lib/inquiry-email";

function publicError(error: unknown) {
  const message = error instanceof Error ? error.message : "Error desconocido";
  return message.replace(/\s+/g, " ").slice(0, 500);
}

export async function deliverInquiryNotification(
  payload: InquiryEmailPayload
): Promise<"sent" | "failed"> {
  try {
    await sendInquiryEmail(payload);

    await prisma.inquiry.update({
      where: { id: payload.id },
      data: {
        notificationStatus: "sent",
        notificationError: null,
        notifiedAt: new Date(),
      },
    });

    return "sent";
  } catch (error) {
    const message = publicError(error);
    console.error(`No se pudo notificar la consulta ${payload.id}: ${message}`);

    await prisma.inquiry.update({
      where: { id: payload.id },
      data: {
        notificationStatus: "failed",
        notificationError: message,
      },
    });

    return "failed";
  }
}

