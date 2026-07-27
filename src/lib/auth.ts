import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { createHash, timingSafeEqual } from "node:crypto";
import { prisma } from "./prisma";

function secureEqual(value: string, expected: string) {
  const valueHash = createHash("sha256").update(value).digest();
  const expectedHash = createHash("sha256").update(expected).digest();
  return timingSafeEqual(valueHash, expectedHash);
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email.trim().toLowerCase();
        const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (adminEmail && adminPassword) {
          const validEmail = secureEqual(email, adminEmail);
          const validPassword = secureEqual(
            credentials.password,
            adminPassword
          );

          if (!validEmail || !validPassword) return null;

          return {
            id: "admin",
            email: adminEmail,
            name: "Administrador",
          };
        }

        if (process.env.NODE_ENV === "production") {
          console.error(
            "Faltan ADMIN_EMAIL o ADMIN_PASSWORD en el entorno de producción"
          );
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) return null;

        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) return null;

        return { id: String(user.id), email: user.email, name: user.name };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
};
