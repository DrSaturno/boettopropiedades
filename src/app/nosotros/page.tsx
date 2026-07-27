import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Nosotros",
  description: "Conocé a Boetto Propiedades. Trayectoria, valores y compromiso en el mercado inmobiliario de Córdoba.",
};

export default function NosotrosPage() {
  return (
    <>
      <section className="bg-brand-cream py-16">
        <div className="container-wide">
          <p className="text-brand-sage text-sm uppercase tracking-[0.3em] mb-3 font-medium">Sobre nosotros</p>
          <h1 className="text-3xl md:text-4xl font-serif font-medium text-brand-dark">Boetto Propiedades</h1>
        </div>
      </section>

      <section className="py-20">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-6">
              <h2 className="text-2xl font-serif font-medium text-brand-dark">Nuestra historia</h2>
              <p className="text-brand-dark/60 leading-relaxed">
                Boetto Propiedades nació con la convicción de que cada persona merece un acompañamiento profesional y humano a la hora de tomar una de las decisiones más importantes de su vida: elegir dónde vivir.
              </p>
              <p className="text-brand-dark/60 leading-relaxed">
                Con más de una década de experiencia en el mercado inmobiliario de Córdoba, hemos construido una trayectoria basada en la confianza, la transparencia y la dedicación a cada cliente.
              </p>
              <p className="text-brand-dark/60 leading-relaxed">
                Nuestro compromiso va más allá de la transacción: nos involucramos en cada etapa del proceso para que la experiencia sea clara, segura y satisfactoria.
              </p>
            </div>

            <div
              className="aspect-[4/5] bg-cover bg-center"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80')" }}
            />
          </div>
        </div>
      </section>

      <section className="py-20 bg-brand-cream">
        <div className="container-wide">
          <h2 className="text-2xl font-serif font-medium text-brand-dark text-center mb-12">Nuestros valores</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Confianza",
                description: "Construimos relaciones duraderas basadas en la honestidad y la transparencia en cada operación.",
              },
              {
                title: "Profesionalismo",
                description: "Abordamos cada consulta con el máximo rigor profesional, brindando asesoramiento experto y actualizado.",
              },
              {
                title: "Cercanía",
                description: "Entendemos que detrás de cada propiedad hay una historia. Te acompañamos con atención personalizada.",
              },
            ].map((value) => (
              <div key={value.title} className="bg-brand-surface border border-brand-warm-gray/30 p-8">
                <h3 className="text-lg font-serif font-medium text-brand-dark mb-3">{value.title}</h3>
                <p className="text-sm text-brand-dark/60 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-wide text-center">
          <h2 className="text-2xl font-serif font-medium text-brand-dark mb-4">¿Listo para dar el próximo paso?</h2>
          <p className="text-brand-dark/60 mb-8 max-w-lg mx-auto">
            Ya sea que busques comprar, vender, alquilar o tasar, estamos para ayudarte.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/propiedades" className="px-8 py-3.5 bg-brand-sage text-white text-sm font-medium tracking-wide hover:bg-brand-sage-dark transition-colors">
              Ver propiedades
            </Link>
            <Link href="/contacto" className="px-8 py-3.5 border border-brand-warm-gray text-brand-dark text-sm font-medium tracking-wide hover:bg-brand-sage hover:text-white hover:border-brand-sage transition-colors">
              Contactanos
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
