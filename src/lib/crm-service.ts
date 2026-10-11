import { prisma } from "@/lib/prisma";

interface CreateInquiryWithLead {
  name: string;
  email: string;
  phone?: string | null;
  message?: string | null;
  type: string;
  source?: string;
  propertyId?: number | null;
}

// A successful form submission must have both a saved inquiry and a linked CRM lead.
export async function createInquiryWithLead({
  name,
  email,
  phone,
  message,
  type,
  source = "web",
  propertyId,
}: CreateInquiryWithLead) {
  const normalizedEmail = email.trim().toLowerCase();

  return prisma.$transaction(async (tx) => {
    const existing = await tx.lead.findFirst({
      where: { email: normalizedEmail },
      orderBy: { updatedAt: "desc" },
    });

    const lead = existing
      ? await tx.lead.update({
          where: { id: existing.id },
          data: {
            ...(phone && !existing.phone && { phone }),
            ...(propertyId && !existing.propertyId && { propertyId }),
          },
        })
      : await tx.lead.create({
          data: {
            name,
            email: normalizedEmail,
            phone: phone || null,
            source,
            propertyId: propertyId || null,
          },
        });

    return tx.inquiry.create({
      data: {
        name,
        email: normalizedEmail,
        phone: phone || null,
        message: message || null,
        type,
        propertyId: propertyId || null,
        leadId: lead.id,
      },
      include: { property: { select: { title: true } } },
    });
  });
}
