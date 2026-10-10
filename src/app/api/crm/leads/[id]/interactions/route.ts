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

  const interactions = await prisma.interaction.findMany({
    where: { leadId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(interactions);
}

export async function POST(request: NextRequest, context: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await context.params;
  const leadId = Number(id);

  try {
    const body = await request.json();
    const { type, notes } = body;

    if (!type || !notes) {
      return NextResponse.json({ error: "Tipo y notas son requeridos" }, { status: 400 });
    }

    const interaction = await prisma.interaction.create({
      data: {
        leadId,
        type,
        notes,
        createdBy: session.user?.email || null,
      },
    });

    await prisma.lead.update({
      where: { id: leadId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json(interaction, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error al crear la interacción" }, { status: 500 });
  }
}
