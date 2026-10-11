import { z } from "zod";

const name = z.string().trim().min(2).max(160);
const email = z.email().trim().toLowerCase().max(254);
const phone = z.string().trim().max(60);
const message = z.string().trim().max(10000);

export const contactInput = z.object({
  name,
  email,
  phone: phone.optional().nullable(),
  message: message.optional().nullable(),
  type: z.enum(["contact", "property"]).default("contact"),
  propertyId: z.number().int().positive().optional().nullable(),
});

export const valuationInput = z.object({
  name,
  email,
  phone: phone.min(1),
  propertyType: z.string().trim().min(1).max(100),
  operation: z.enum(["venta", "alquiler"]),
  location: z.string().trim().min(2).max(300),
  message: message.optional().nullable(),
});
