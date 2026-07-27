import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatArea, parseJsonField, getWhatsAppUrl, getPropertyWhatsAppMessage } from "@/lib/utils";
import { PROPERTY_TYPES, OPERATIONS } from "@/lib/constants";
import PropertyGallery from "@/components/properties/PropertyGallery";
import ContactForm from "@/components/forms/ContactForm";
import PropertyCard from "@/components/properties/PropertyCard";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const property = await prisma.property.findUnique({ where: { slug } });
  if (!property) return { title: "Propiedad no encontrada" };

  return {
    title: property.seoTitle || property.title,
    description:
      property.seoDescription ||
      `${property.title} en ${property.city || "Córdoba"}. ${formatPrice(property.price, property.currency)}.`,
    openGraph: {
      title: property.title,
      description: property.description?.slice(0, 160) || "",
      images: parseJsonField<string[]>(property.images, []).slice(0, 1),
    },
  };
}

export default async function PropertyDetailPage({ params }: Props) {
  const { slug } = await params;
  const property = await prisma.property.findUnique({ where: { slug } });

  if (!property || property.status !== "published") notFound();

  const images = parseJsonField<string[]>(property.images, []);
  const amenities = parseJsonField<string[]>(property.amenities, []);
  const operationLabel = OPERATIONS.find((o) => o.value === property.operation)?.label || property.operation;
  const typeLabel = PROPERTY_TYPES.find((t) => t.value === property.propertyType)?.label || property.propertyType;

  const related = await prisma.property.findMany({
    where: {
      status: "published",
      slug: { not: slug },
      OR: [
        { operation: property.operation, city: property.city },
        { propertyType: property.propertyType },
      ],
    },
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  const whatsappMsg = getPropertyWhatsAppMessage(property.title, property.slug);

  return (
    <>
      <section className="py-8 bg-brand-cream">
        <div className="container-wide">
          <div className="flex items-center gap-2 text-sm text-brand-medium-gray mb-2">
            <a href="/propiedades" className="hover:text-brand-sage transition-colors">Propiedades</a>
            <span>/</span>
            <span className="text-brand-dark">{property.title}</span>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">
              <PropertyGallery images={images} title={property.title} />

              <div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-brand-accent-dark text-white text-xs uppercase tracking-wider font-medium">
                    {operationLabel}
                  </span>
                  <span className="px-3 py-1 bg-brand-cream text-brand-dark text-xs uppercase tracking-wider font-medium">
                    {typeLabel}
                  </span>
                  {property.featured && (
                    <span className="px-3 py-1 bg-brand-sage text-white text-xs uppercase tracking-wider font-medium">
                      Destacada
                    </span>
                  )}
                </div>

                <h1 className="text-2xl md:text-3xl font-serif font-medium text-brand-dark mb-2">
                  {property.title}
                </h1>
                <p className="text-brand-medium-gray flex items-center gap-1.5 mb-6">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  {[property.address, property.neighborhood, property.city].filter(Boolean).join(", ")}
                </p>

                <div className="flex items-baseline gap-4 mb-8">
                  <p className="text-3xl font-serif font-semibold text-brand-dark">
                    {formatPrice(property.price, property.currency)}
                  </p>
                  {property.expenses != null && property.expenses > 0 && (
                    <p className="text-sm text-brand-medium-gray">
                      + {formatPrice(property.expenses, "ARS")} expensas
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-brand-cream">
                {[
                  { label: "Superficie total", value: formatArea(property.totalArea) },
                  { label: "Superficie cubierta", value: formatArea(property.coveredArea) },
                  { label: "Ambientes", value: property.rooms ?? "-" },
                  { label: "Dormitorios", value: property.bedrooms ?? "-" },
                  { label: "Baños", value: property.bathrooms ?? "-" },
                  { label: "Cocheras", value: property.garages ?? "-" },
                  { label: "Antigüedad", value: property.age != null ? (property.age === 0 ? "A estrenar" : `${property.age} años`) : "-" },
                  { label: "Tipo", value: typeLabel },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <p className="text-xs text-brand-medium-gray uppercase tracking-wider mb-1">{item.label}</p>
                    <p className="text-sm font-medium text-brand-dark">{item.value}</p>
                  </div>
                ))}
              </div>

              {property.description && (
                <div>
                  <h2 className="text-xl font-serif font-medium text-brand-dark mb-4">Descripción</h2>
                  <div className="text-sm text-brand-dark/70 leading-relaxed whitespace-pre-line">
                    {property.description}
                  </div>
                </div>
              )}

              {amenities.length > 0 && (
                <div>
                  <h2 className="text-xl font-serif font-medium text-brand-dark mb-4">Características</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {amenities.map((a) => (
                      <div key={a} className="flex items-center gap-2 text-sm text-brand-dark/70">
                        <svg className="w-4 h-4 text-brand-sage shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {a}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {property.externalUrl && (
                <div className="p-4 border border-brand-warm-gray/50">
                  <p className="text-sm text-brand-medium-gray mb-2">Publicación original:</p>
                  <a
                    href={property.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-brand-sage hover:underline inline-flex items-center gap-1"
                  >
                    Ver en {property.externalSource || "sitio externo"}
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                  </a>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="sticky top-28">
                <div className="bg-brand-surface border border-brand-warm-gray/50 p-6 mb-6">
                  <h3 className="text-lg font-serif font-medium text-brand-dark mb-4">
                    Consultá por esta propiedad
                  </h3>
                  <ContactForm propertyId={property.id} propertyTitle={property.title} type="property" />
                </div>

                <a
                  href={getWhatsAppUrl(whatsappMsg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-[#25D366] text-white text-sm font-medium hover:bg-[#20bd5a] transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Consultar por WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="py-16 bg-brand-cream">
          <div className="container-wide">
            <h2 className="text-2xl font-serif font-medium text-brand-dark mb-8">
              Propiedades relacionadas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {related.map((p) => (
                <PropertyCard
                  key={p.id}
                  property={{
                    ...p,
                    images: parseJsonField<string[]>(p.images, []),
                    amenities: parseJsonField<string[]>(p.amenities, []),
                    createdAt: p.createdAt.toISOString(),
                    updatedAt: p.updatedAt.toISOString(),
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
