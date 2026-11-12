import { z } from "zod";

export const FLYER_TEMPLATES = ["story", "price"] as const;
export type FlyerTemplate = (typeof FLYER_TEMPLATES)[number];

export const FLYER_TEMPLATE_LABELS: Record<FlyerTemplate, string> = {
  story: "Sin precio (historia vertical)",
  price: "Con precio",
};

// Photos each layout can show: the first one is the large photo.
export const FLYER_MAX_PHOTOS: Record<FlyerTemplate, number> = { story: 5, price: 4 };
export const FLYER_MAX_CHIPS: Record<FlyerTemplate, number> = { story: 12, price: 6 };

const text = (max: number) => z.string().trim().max(max);

export const flyerChipSchema = z.object({
  text: text(40).min(1),
  highlight: z.boolean().optional(),
});

export const flyerDataSchema = z.object({
  template: z.enum(FLYER_TEMPLATES),
  badge: text(16).min(1),
  zone: text(40).min(1),
  subtitle: text(64),
  headline: text(60),
  headlineAccent: text(30),
  description: text(220),
  chips: z.array(flyerChipSchema).max(12),
  features: z.array(text(28)).max(3),
  price: text(24),
  priceNote: text(40),
  reserved: z.boolean(),
  photos: z.array(z.string().min(1).max(2048)).min(1).max(5),
});

export type FlyerData = z.infer<typeof flyerDataSchema>;
export type FlyerChip = z.infer<typeof flyerChipSchema>;
