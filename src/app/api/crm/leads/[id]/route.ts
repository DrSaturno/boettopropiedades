import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await context.params;
  const leadId = Number(id);

  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    include: {
      property: { select: { id: true, title: true, slug: true } },
      inquiries: { orderBy: { createdAt: "desc" } },
      interactions: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!lead) return NextResponse.json({ error: "Lead no encontrado" }, { status: 404 });

  return NextResponse.json(lead);
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await context.params;
  const leadId = Number(id);

  try {
    const body = await request.json();
    const { name, email, phone, source, stage, priority, notes, assignedTo, propertyId, tags } = body;

    const lead = await prisma.lead.update({
      where: { id: leadId },
      data: {
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
        ...(phone !== undefined && { phone }),
        ...(source !== undefined && { source }),
        ...(stage !== undefined && { stage }),
        ...(priority !== undefined && { priority }),
        ...(notes !== undefined && { notes }),
        ...(assignedTo !== undefined && { assignedTo }),
        ...(propertyId !== undefined && { propertyId: propertyId ? Number(propertyId) : null }),
        ...(tags !== undefined && { tags: tags ? JSON.stringify(tags) : null }),
      },
      include: {
        property: { select: { id: true, title: true } },
        _count: { select: { interactions: true, inquiries: true } },
      },
    });

    return NextResponse.json(lead);
  } catch {
    return NextResponse.json({ error: "Error al actualizar el lead" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await context.params;
  const leadId = Number(id);

  try {
    await prisma.lead.delete({ where: { id: leadId } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Error al eliminar el lead" }, { status: 500 });
  }
}
