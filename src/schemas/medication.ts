import { z } from "zod";

export const medicationSchema = z.object({
  name: z
    .string()
    .min(1, "Medication name is required")
    .max(100, "Name is too long")
    .trim(),
  dosage: z
    .string()
    .min(1, "Dosage is required")
    .max(50, "Dosage is too long")
    .trim(),
  scheduled_time: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Enter a valid time (HH:MM)"),
});

export type MedicationFormData = z.infer<typeof medicationSchema>;
