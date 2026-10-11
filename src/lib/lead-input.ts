import { z } from "zod";
import { INTERACTION_TYPES, LEAD_PRIORITIES, LEAD_SOURCES, LEAD_STAGES } from "@/lib/crm-constants";

const oneOf = (options: readonly { value: string }[]) =>
  z.string().refine((value) => options.some((option) => option.value === value));

const optionalText = (max: number) => z.string().trim().max(max).nullable();

export const leadInput = z.object({
  name: z.string().trim().min(1).max(160),
  email: z.email().trim().toLowerCase().max(254),
  phone: optionalText(60).optional(),
  source: oneOf(LEAD_SOURCES).optional(),
  stage: oneOf(LEAD_STAGES).optional(),
  priority: oneOf(LEAD_PRIORITIES).optional(),
  notes: optionalText(10000).optional(),
  assignedTo: optionalText(160).optional(),
  propertyId: z.number().int().positive().nullable().optional(),
  tags: z.array(z.string().trim().min(1).max(50)).max(20).nullable().optional(),
});

export const leadUpdateInput = leadInput.partial();

export const interactionInput = z.object({
  type: oneOf(INTERACTION_TYPES),
  notes: z.string().trim().min(1).max(10000),
});
