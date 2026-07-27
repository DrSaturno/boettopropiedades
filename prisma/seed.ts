import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || "admin123",
    12
  );

  await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || "admin@boettopropiedades.com.ar" },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || "admin@boettopropiedades.com.ar",
      password: hashedPassword,
      name: "Administrador",
    },
  });

  const sampleProperties = [
    {
      title: "Casa moderna en Urca con pileta",
      slug: "casa-moderna-urca-pileta",
      operation: "venta",
      propertyType: "casa",
      status: "published",
      featured: true,
      price: 185000,
      currency: "USD",
      address: "Barrio Urca",
      neighborhood: "Urca",
      city: "Córdoba",
      province: "Córdoba",
      description:
        "Hermosa casa moderna de 3 dormitorios en Barrio Urca. Amplio living comedor con salida a jardín con pileta. Cocina integrada con isla. Suite principal con vestidor y baño privado. Cochera doble. Excelente estado de conservación.",
      totalArea: 320,
      coveredArea: 220,
      rooms: 5,
      bedrooms: 3,
      bathrooms: 3,
      garages: 2,
      age: 5,
      amenities: JSON.stringify(["Pileta", "Quincho", "Parrilla", "Jardín", "Aire acondicionado", "Calefacción"]),
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
      ]),
      externalSource: "manual",
    },
    {
      title: "Departamento 2 ambientes en Nueva Córdoba",
      slug: "departamento-2-amb-nueva-cordoba",
      operation: "alquiler",
      propertyType: "departamento",
      status: "published",
      featured: true,
      price: 350000,
      currency: "ARS",
      expenses: 45000,
      address: "Bv. Chacabuco 800",
      neighborhood: "Nueva Córdoba",
      city: "Córdoba",
      province: "Córdoba",
      description:
        "Departamento luminoso de 2 ambientes en el corazón de Nueva Córdoba. Balcón con vista a la ciudad. Edificio con amenities: pileta, gimnasio, SUM. Ideal inversión.",
      totalArea: 55,
      coveredArea: 48,
      rooms: 2,
      bedrooms: 1,
      bathrooms: 1,
      garages: 0,
      age: 3,
      amenities: JSON.stringify(["Balcón", "Pileta", "Gimnasio", "SUM", "Ascensor", "Seguridad 24hs"]),
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
      ]),
      externalSource: "manual",
    },
    {
      title: "Terreno en Country La Cascada",
      slug: "terreno-country-la-cascada",
      operation: "venta",
      propertyType: "terreno",
      status: "published",
      featured: false,
      price: 65000,
      currency: "USD",
      neighborhood: "La Cascada",
      city: "Córdoba",
      province: "Córdoba",
      description:
        "Lote de 800 m² en Country La Cascada. Excelente ubicación dentro del barrio, cerca de la zona deportiva. Todos los servicios. Escritura inmediata.",
      totalArea: 800,
      rooms: 0,
      bedrooms: 0,
      bathrooms: 0,
      garages: 0,
      amenities: JSON.stringify(["Seguridad 24hs", "Pavimento", "Agua corriente", "Gas natural", "Cloacas"]),
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
      ]),
      externalSource: "manual",
    },
    {
      title: "PH reciclado en General Paz",
      slug: "ph-reciclado-general-paz",
      operation: "venta",
      propertyType: "ph",
      status: "published",
      featured: true,
      price: 95000,
      currency: "USD",
      address: "Barrio General Paz",
      neighborhood: "General Paz",
      city: "Córdoba",
      province: "Córdoba",
      description:
        "PH reciclado a nuevo con gran estilo. 2 dormitorios, living con doble altura, patio con parrilla. Sin expensas. Zona con excelente accesibilidad.",
      totalArea: 110,
      coveredArea: 85,
      rooms: 3,
      bedrooms: 2,
      bathrooms: 1,
      garages: 1,
      age: 0,
      amenities: JSON.stringify(["Parrilla", "Terraza", "Luminoso"]),
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80",
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
      ]),
      externalSource: "manual",
    },
  ];

  for (const prop of sampleProperties) {
    await prisma.property.upsert({
      where: { slug: prop.slug },
      update: {},
      create: prop,
    });
  }

  console.log("Seed completed successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
