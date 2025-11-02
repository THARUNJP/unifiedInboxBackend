import z from "zod";

export const contactSchema = z
  .object({
    teamId: z.string().trim().min(1, "teamId cannot be empty"),
    name: z
      .string()
      .trim()
      .min(1, "Name cannot be empty")
      .max(100, "Name must be under 100 characters"),
    phone: z
      .string()
      .trim()
      .regex(/^\+?[0-9]{10,15}$/, "Invalid phone number format")
      .optional(),

    email: z.email("Invalid email format").trim().toLowerCase().optional(),
    socialHandles: z
      .record(
        z.string(), // 👈 keys like "linkedin", "twitter"
        z.url("Each social handle must be a valid URL").trim()
      )
      .optional(),
  })
  .strict();

export type contactInput = z.infer<typeof contactSchema>;
