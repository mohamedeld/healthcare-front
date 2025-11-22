import z from "zod";

/**
 * Create visit validation schema
 */
export const createVisitSchema = z.object({
  doctorId: z.string().min(1, "Please select a doctor"),
  scheduledDate: z
    .string()
    .min(1, "Scheduled date is required")
    .refine((date) => {
      const selectedDate = new Date(date);
      const now = new Date();
      return selectedDate >= now;
    }, "Scheduled date cannot be in the past"),
  chiefComplaint: z
    .string()
    .max(1000, "Chief complaint cannot exceed 1000 characters")
    .optional(),
});

export type TCreateVisitSchema = z.infer<typeof createVisitSchema>;
/**
 * Update visit validation schema
 */
export const updateVisitSchema = z.object({
  diagnosis: z
    .string()
    .max(2000, "Diagnosis cannot exceed 2000 characters")
    .optional(),
  notes: z.string().max(5000, "Notes cannot exceed 5000 characters").optional(),
  chiefComplaint: z
    .string()
    .max(1000, "Chief complaint cannot exceed 1000 characters")
    .optional(),
});
export type TUpdateVisitSchema = z.infer<typeof updateVisitSchema>;
