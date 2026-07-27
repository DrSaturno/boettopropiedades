import Link from "next/link";

export default function CTABlock() {
  return (
    <section className="py-24 bg-brand-accent-dark text-white">
      <div className="container-wide text-center">
        <p className="text-brand-sage-light text-sm uppercase tracking-[0.3em] mb-3 font-medium">
          ¿Tenés una propiedad?
        </p>
        <h2 className="text-3xl md:text-4xl font-serif font-medium mb-6 max-w-2xl mx-auto leading-tight">
          Vendé, alquilá o tasá tu propiedad con nosotros
        </h2>
        <p className="text-white/60 mb-10 max-w-xl mx-auto leading-relaxed">
          Dejá tu propiedad en manos de profesionales. Te ofrecemos la mejor
          exposición, asesoramiento legal y acompañamiento en todo el proceso.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/tasaciones"
            className="px-8 py-3.5 bg-brand-sage text-white text-sm font-medium tracking-wide hover:bg-brand-sage-dark transition-colors"
          >
            Solicitar tasación gratuita
          </Link>
          <Link
            href="/contacto"
            className="px-8 py-3.5 border border-white/30 text-white text-sm font-medium tracking-wide hover:bg-white/10 transition-colors"
          >
            Contactanos
          </Link>
        </div>
      </div>
    </section>
  );
}
