import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function buildPrisma() {
  if (process.env.VERCEL && !process.env.TURSO_DATABASE_URL) {
    throw new Error("Falta TURSO_DATABASE_URL en Vercel: no hay base de datos persistente");
  }
  if (process.env.TURSO_DATABASE_URL?.startsWith("libsql://") && !process.env.TURSO_AUTH_TOKEN) {
    throw new Error("Falta TURSO_AUTH_TOKEN para conectar con Turso");
  }
  if (process.env.TURSO_DATABASE_URL) {
    const libsql = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    const adapter = new PrismaLibSQL(libsql);
    return new PrismaClient({ adapter });
  }
  return new PrismaClient();
}

export const prisma = globalForPrisma.prisma ?? buildPrisma();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
