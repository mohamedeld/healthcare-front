import { z } from "zod";

/**
 * Treatment validation schema
 */
export const treatmentSchema = z.object({
  name: z
    .string()
    .min(1, "Treatment name is required")
    .max(200, "Treatment name cannot exceed 200 characters"),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
  quantity: z
    .number()
    .int("Quantity must be an integer")
    .min(1, "Quantity must be at least 1")
    .or(z.string().transform((val) => parseInt(val, 10))),
  unitPrice: z
    .number()
    .min(0, "Unit price must be a positive number")
    .or(z.string().transform((val) => parseFloat(val))),
  category: z.enum([
    "consultation",
    "medication",
    "procedure",
    "lab_test",
    "imaging",
    "other",
  ]),
});
export type TreatmentSchema = z.infer<typeof treatmentSchema>;
/**
 * Finance search validation schema
 */
export const financeSearchSchema = z
  .object({
    visitId: z.string().optional(),
    doctorName: z.string().optional(),
    patientName: z.string().optional(),
    status: z
      .enum(["scheduled", "in_progress", "completed", "cancelled"])
      .optional(),
    paymentStatus: z.enum(["pending", "partial", "paid"]).optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  })
  .refine(
    (data) => {
      // If endDate is provided, startDate must also be provided
      if (data.endDate && !data.startDate) {
        return false;
      }
      return true;
    },
    {
      message: "Start date is required when end date is provided",
      path: ["startDate"],
    }
  )
  .refine(
    (data) => {
      // End date must be after start date
      if (data.startDate && data.endDate) {
        const start = new Date(data.startDate);
        const end = new Date(data.endDate);
        return end >= start;
      }
      return true;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  );

export type TSearchSchema = z.infer<typeof financeSearchSchema>;
