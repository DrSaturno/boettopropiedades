import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

type RouteContext = { params: Promise<{ id: string }> };

async function readId(params: RouteContext["params"]) {
  const { id } = await params;
  const number = Number(id);
  return Number.isSafeInteger(number) && number > 0 ? number : null;
}

const notFound = () => NextResponse.json({ error: "Consulta no encontrada" }, { status: 404 });

export async function PUT(request: Request, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const id = await readId(params);
  if (!id) return notFound();
  const body = await request.json().catch(() => null);
  if (!body || typeof body.read !== "boolean") {
    return NextResponse.json({ error: "Valor inválido para read" }, { status: 400 });
  }

  try {
    const inquiry = await prisma.inquiry.update({
      where: { id },
      data: { read: body.read },
    });
    return NextResponse.json(inquiry);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") return notFound();
    console.error(`[consultas] No se pudo actualizar ${id}`, error);
    return NextResponse.json(
      { error: "No se pudo actualizar la consulta" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const id = await readId(params);
  if (!id) return notFound();

  try {
    await prisma.inquiry.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") return notFound();
    console.error(`[consultas] No se pudo eliminar ${id}`, error);
    return NextResponse.json(
      { error: "No se pudo eliminar la consulta" },
      { status: 500 }
    );
  }
}
