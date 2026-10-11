import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { leadUpdateInput } from "@/lib/lead-input";
import { Prisma } from "@prisma/client";

type RouteContext = { params: Promise<{ id: string }> };

async function readId(context: RouteContext) {
  const { id } = await context.params;
  const number = Number(id);
  return Number.isSafeInteger(number) && number > 0 ? number : null;
}

function notFound() {
  return NextResponse.json({ error: "Lead no encontrado" }, { status: 404 });
}

export async function GET(_request: NextRequest, context: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const leadId = await readId(context);
  if (!leadId) return notFound();

  try {
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        property: { select: { id: true, title: true, slug: true } },
        inquiries: { orderBy: { createdAt: "desc" } },
        interactions: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!lead) return notFound();

    return NextResponse.json(lead);
  } catch (error) {
    console.error(`[crm] No se pudo leer el lead ${leadId}`, error);
    return NextResponse.json({ error: "No se pudo leer el CRM" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const leadId = await readId(context);
  if (!leadId) return notFound();

  try {
    const parsed = leadUpdateInput.safeParse(await request.json().catch(() => null));
    if (!parsed.success || Object.keys(parsed.data).length === 0) {
      return NextResponse.json({ error: "Revisá los datos del lead" }, { status: 400 });
    }
    const { name, email, phone, source, stage, priority, notes, assignedTo, propertyId, tags } = parsed.data;

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
        ...(propertyId !== undefined && { propertyId: propertyId || null }),
        ...(tags !== undefined && { tags: tags ? JSON.stringify(tags) : null }),
      },
      include: {
        property: { select: { id: true, title: true } },
        _count: { select: { interactions: true, inquiries: true } },
      },
    });

    return NextResponse.json(lead);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") return notFound();
    console.error(`[crm] No se pudo actualizar el lead ${leadId}`, error);
    return NextResponse.json({ error: "Error al actualizar el lead" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const leadId = await readId(context);
  if (!leadId) return notFound();

  try {
    await prisma.lead.delete({ where: { id: leadId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") return notFound();
    console.error(`[crm] No se pudo eliminar el lead ${leadId}`, error);
    return NextResponse.json({ error: "Error al eliminar el lead" }, { status: 500 });
  }
}
