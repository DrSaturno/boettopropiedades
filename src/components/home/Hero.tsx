import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative h-[85vh] min-h-[600px] flex items-center">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-brand-accent-dark/55" />
      </div>

      <div className="relative container-wide text-white">
        <div className="max-w-2xl">
          <p className="text-brand-sage-light text-sm uppercase tracking-[0.3em] mb-4 font-medium">
            Inmobiliaria de confianza
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium leading-tight mb-6">
            Encontrá la propiedad
            <br />
            <span className="text-brand-sage-light">que estás buscando</span>
          </h1>
          <p className="text-lg text-white/80 mb-10 max-w-xl leading-relaxed">
            Te acompañamos en cada paso. Venta, alquiler y tasación de
            propiedades en Córdoba con atención personalizada.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/propiedades?operation=venta"
              className="px-8 py-3.5 bg-brand-sage text-white text-sm font-medium tracking-wide hover:bg-brand-sage-dark transition-colors"
            >
              Ver propiedades en venta
            </Link>
            <Link
              href="/propiedades?operation=alquiler"
              className="px-8 py-3.5 border border-white/40 text-white text-sm font-medium tracking-wide hover:bg-white/10 transition-colors"
            >
              Ver alquileres
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
