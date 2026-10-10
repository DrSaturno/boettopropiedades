import { prisma } from "@/lib/prisma";

interface CreateLeadFromInquiry {
  inquiryId: number;
  name: string;
  email: string;
  phone?: string | null;
  source?: string;
  propertyId?: number | null;
}

export async function findOrCreateLead({ inquiryId, name, email, phone, source = "web", propertyId }: CreateLeadFromInquiry) {
  const existing = await prisma.lead.findFirst({
    where: { email: { equals: email } },
    orderBy: { updatedAt: "desc" },
  });

  if (existing) {
    const updated = await prisma.lead.update({
      where: { id: existing.id },
      data: {
        ...(phone && !existing.phone && { phone }),
        ...(propertyId && !existing.propertyId && { propertyId }),
      },
    });

    await prisma.inquiry.update({
      where: { id: inquiryId },
      data: { leadId: updated.id },
    });

    return updated;
  }

  const lead = await prisma.lead.create({
    data: {
      name,
      email,
      phone: phone || null,
      source,
      propertyId: propertyId || null,
    },
  });

  await prisma.inquiry.update({
    where: { id: inquiryId },
    data: { leadId: lead.id },
  });

  return lead;
}
