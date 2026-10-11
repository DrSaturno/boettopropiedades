// Creates the schema in a Turso database. Prisma CLI 5 cannot push to libsql:// URLs,
// so these statements mirror prisma/schema.prisma (prisma migrate diff --from-empty).
// Usage: TURSO_DATABASE_URL=... TURSO_AUTH_TOKEN=... node scripts/turso-setup.mjs
import { createClient } from "@libsql/client";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const statements = [
  `CREATE TABLE IF NOT EXISTS "Property" ("id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "title" TEXT NOT NULL, "slug" TEXT NOT NULL, "operation" TEXT NOT NULL, "propertyType" TEXT NOT NULL, "status" TEXT NOT NULL DEFAULT 'published', "featured" BOOLEAN NOT NULL DEFAULT false, "price" REAL, "currency" TEXT NOT NULL DEFAULT 'USD', "expenses" REAL, "address" TEXT, "neighborhood" TEXT, "city" TEXT, "province" TEXT NOT NULL DEFAULT 'Ciudad Autónoma de Buenos Aires', "description" TEXT, "totalArea" REAL, "coveredArea" REAL, "rooms" INTEGER, "bedrooms" INTEGER, "bathrooms" INTEGER, "garages" INTEGER, "age" INTEGER, "amenities" TEXT, "images" TEXT, "videoUrl" TEXT, "externalUrl" TEXT, "externalSource" TEXT, "seoTitle" TEXT, "seoDescription" TEXT, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "Property_slug_key" ON "Property"("slug")`,
  `CREATE TABLE IF NOT EXISTS "Lead" ("id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "name" TEXT NOT NULL, "email" TEXT NOT NULL, "phone" TEXT, "source" TEXT NOT NULL DEFAULT 'web', "stage" TEXT NOT NULL DEFAULT 'nuevo', "priority" TEXT NOT NULL DEFAULT 'media', "notes" TEXT, "assignedTo" TEXT, "propertyId" INTEGER, "tags" TEXT, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY ("propertyId") REFERENCES "Property" ("id") ON DELETE SET NULL ON UPDATE CASCADE)`,
  `CREATE TABLE IF NOT EXISTS "Inquiry" ("id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "name" TEXT NOT NULL, "phone" TEXT, "email" TEXT NOT NULL, "message" TEXT, "type" TEXT NOT NULL DEFAULT 'contact', "propertyId" INTEGER, "read" BOOLEAN NOT NULL DEFAULT false, "notificationStatus" TEXT NOT NULL DEFAULT 'pending', "notificationError" TEXT, "notifiedAt" DATETIME, "leadId" INTEGER, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY ("propertyId") REFERENCES "Property" ("id") ON DELETE SET NULL ON UPDATE CASCADE, FOREIGN KEY ("leadId") REFERENCES "Lead" ("id") ON DELETE SET NULL ON UPDATE CASCADE)`,
  `CREATE TABLE IF NOT EXISTS "Interaction" ("id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "leadId" INTEGER NOT NULL, "type" TEXT NOT NULL, "notes" TEXT NOT NULL, "createdBy" TEXT, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY ("leadId") REFERENCES "Lead" ("id") ON DELETE CASCADE ON UPDATE CASCADE)`,
  `CREATE TABLE IF NOT EXISTS "User" ("id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "email" TEXT NOT NULL, "password" TEXT NOT NULL, "name" TEXT)`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email")`,
];

for (const sql of statements) {
  await client.execute(sql);
}

console.log("Esquema creado en Turso.");
client.close();
