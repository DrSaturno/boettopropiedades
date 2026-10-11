import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  try {
    const inquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: "desc" },
      include: { property: { select: { id: true, title: true, price: true } } },
    });
    return NextResponse.json(inquiries);
  } catch (error) {
    console.error("[consultas] No se pudo listar", error);
    return NextResponse.json(
      { error: "No se pudo leer la base de datos" },
      { status: 500 }
    );
  }
}
