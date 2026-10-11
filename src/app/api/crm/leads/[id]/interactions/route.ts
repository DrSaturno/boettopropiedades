import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { interactionInput } from "@/lib/lead-input";

type RouteContext = { params: Promise<{ id: string }> };

async function readId(context: RouteContext) {
  const { id } = await context.params;
  const number = Number(id);
  return Number.isSafeInteger(number) && number > 0 ? number : null;
}

export async function GET(_request: NextRequest, context: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const leadId = await readId(context);
  if (!leadId) return NextResponse.json({ error: "Lead no encontrado" }, { status: 404 });

  try {
    const interactions = await prisma.interaction.findMany({
      where: { leadId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(interactions);
  } catch (error) {
    console.error(`[crm] No se pudieron leer las interacciones de ${leadId}`, error);
    return NextResponse.json({ error: "No se pudo leer el CRM" }, { status: 500 });
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const leadId = await readId(context);
  if (!leadId) return NextResponse.json({ error: "Lead no encontrado" }, { status: 404 });

  try {
    const parsed = interactionInput.safeParse(await request.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json({ error: "Revisá los datos de la interacción" }, { status: 400 });
    }
    const { type, notes } = parsed.data;

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
