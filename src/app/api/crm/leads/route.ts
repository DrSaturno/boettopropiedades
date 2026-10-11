import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { leadInput } from "@/lib/lead-input";

function positiveInteger(value: string | null, fallback: number) {
  const number = Number(value);
  return Number.isSafeInteger(number) && number > 0 ? number : fallback;
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { searchParams } = request.nextUrl;
  const stage = searchParams.get("stage");
  const priority = searchParams.get("priority");
  const source = searchParams.get("source");
  const search = searchParams.get("search");
  const page = positiveInteger(searchParams.get("page"), 1);
  const limit = Math.min(100, positiveInteger(searchParams.get("limit"), 20));

  const where: Record<string, unknown> = {};
  if (stage) where.stage = stage;
  if (priority) where.priority = priority;
  if (source) where.source = source;
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { email: { contains: search } },
      { phone: { contains: search } },
    ];
  }

  try {
    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        include: {
          property: { select: { id: true, title: true } },
          _count: { select: { interactions: true, inquiries: true } },
        },
        orderBy: { updatedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.lead.count({ where }),
    ]);

    return NextResponse.json({ leads, total, page, limit, pages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("[crm] No se pudieron listar los leads", error);
    return NextResponse.json({ error: "No se pudo leer el CRM" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  try {
    const parsed = leadInput.safeParse(await request.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json({ error: "Revisá los datos del lead" }, { status: 400 });
    }
    const { name, email, phone, source, stage, priority, notes, assignedTo, propertyId, tags } = parsed.data;

    const lead = await prisma.lead.create({
      data: {
        name,
        email,
        phone: phone || null,
        source: source || "web",
        stage: stage || "nuevo",
        priority: priority || "media",
        notes: notes || null,
        assignedTo: assignedTo || null,
        propertyId: propertyId || null,
        tags: tags ? JSON.stringify(tags) : null,
      },
      include: {
        property: { select: { id: true, title: true } },
        _count: { select: { interactions: true, inquiries: true } },
      },
    });

    return NextResponse.json(lead, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error al crear el lead" }, { status: 500 });
  }
}
