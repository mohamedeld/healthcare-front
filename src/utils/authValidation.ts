import z from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
export type TLoginSchema = z.infer<typeof loginSchema>;
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name cannot exceed 100 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(100, "Password cannot exceed 100 characters"),
    role: z.enum(["patient", "doctor", "finance"]),
    specialization: z.string().optional(),
    phone: z
      .string()
      .regex(/^[0-9\s()+-]+$/, "Invalid phone number format")
      .optional()
      .or(z.literal("")),
  })
  .refine(
    (data) => {
      // If role is doctor, specialization is required
      if (data.role === "doctor") {
        return !!data.specialization && data.specialization.length > 0;
      }
      return true;
    },
    {
      message: "Specialization is required for doctors",
      path: ["specialization"],
    }
  );
export type TRegisterSchema = z.infer<typeof registerSchema>;
/**
 * Change password validation schema
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters")
      .max(100, "New password cannot exceed 100 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });
