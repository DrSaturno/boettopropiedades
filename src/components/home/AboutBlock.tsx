import Link from "next/link";

export default function AboutBlock() {
  return (
    <section className="py-24">
      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-brand-sage text-sm uppercase tracking-[0.3em] mb-3 font-medium">
              Sobre nosotros
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-medium text-brand-dark mb-6 leading-tight">
              Tu inmobiliaria
              <br />
              de confianza
            </h2>
            <p className="text-brand-dark/60 leading-relaxed mb-6">
              En Boetto Propiedades creemos que cada operación inmobiliaria es
              única. Por eso brindamos una atención personalizada, transparente y
              profesional, acompañándote desde el primer contacto hasta la
              concreción del negocio.
            </p>
            <p className="text-brand-dark/60 leading-relaxed mb-8">
              Nuestra experiencia en el mercado inmobiliario de Córdoba nos
              permite ofrecerte el mejor asesoramiento, ya sea que busques
              comprar, vender, alquilar o tasar una propiedad.
            </p>

            <div className="grid grid-cols-3 gap-8 mb-10">
              {[
                { number: "10+", label: "Años de experiencia" },
                { number: "500+", label: "Operaciones realizadas" },
                { number: "100%", label: "Compromiso" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-serif font-semibold text-brand-sage mb-1">
                    {stat.number}
                  </p>
                  <p className="text-xs text-brand-dark/50 uppercase tracking-wider">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <Link
              href="/nosotros"
              className="inline-flex items-center gap-2 text-sm font-medium text-brand-sage border-b border-brand-sage pb-1 hover:text-brand-sage-light hover:border-brand-sage-light transition-colors"
            >
              Conocé más sobre nosotros
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="relative">
            <div
              className="aspect-[4/5] bg-cover bg-center rounded-sm"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80')",
              }}
            />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-brand-sage/20 -z-10" />
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-brand-sage/10 -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
