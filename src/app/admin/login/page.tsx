"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const result = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false,
    });

    if (result?.error) {
      setError("Credenciales incorrectas");
      setLoading(false);
    } else {
      router.push("/admin");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-sm p-8 bg-brand-surface border border-brand-warm-gray/50">
        <div className="text-center mb-8">
          <Image src="/logos/logo-white.svg" alt="Boetto Propiedades" width={220} height={48} className="mx-auto mb-6" />
          <h1 className="text-lg font-serif text-brand-dark">Panel de administración</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            required
            placeholder="Email"
            className="w-full px-4 py-3 border border-brand-warm-gray rounded-sm text-sm bg-brand-surface text-brand-dark placeholder:text-brand-medium-gray focus:outline-none focus:border-brand-sage"
          />
          <input
            name="password"
            type="password"
            required
            placeholder="Contraseña"
            className="w-full px-4 py-3 border border-brand-warm-gray rounded-sm text-sm bg-brand-surface text-brand-dark placeholder:text-brand-medium-gray focus:outline-none focus:border-brand-sage"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-sage text-white text-sm font-medium hover:bg-brand-sage-dark transition-colors disabled:opacity-50"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
}
