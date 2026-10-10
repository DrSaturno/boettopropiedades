import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const [
    totalLeads,
    newThisMonth,
    newThisWeek,
    byStage,
    bySource,
    byPriority,
    recentLeads,
  ] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.lead.count({ where: { createdAt: { gte: startOfWeek } } }),
    prisma.lead.groupBy({ by: ["stage"], _count: { id: true } }),
    prisma.lead.groupBy({ by: ["source"], _count: { id: true } }),
    prisma.lead.groupBy({ by: ["priority"], _count: { id: true } }),
    prisma.lead.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        property: { select: { title: true } },
        _count: { select: { interactions: true } },
      },
    }),
  ]);

  return NextResponse.json({
    totalLeads,
    newThisMonth,
    newThisWeek,
    byStage: Object.fromEntries(byStage.map((s) => [s.stage, s._count.id])),
    bySource: Object.fromEntries(bySource.map((s) => [s.source, s._count.id])),
    byPriority: Object.fromEntries(byPriority.map((s) => [s.priority, s._count.id])),
    recentLeads,
  });
}
