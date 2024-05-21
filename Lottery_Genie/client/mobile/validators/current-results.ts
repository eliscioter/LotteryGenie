import { z } from "zod";

export const lotteryResultSchema = z.object({
  id: z.number().positive(),
  date: z.string().date(),
  category: z.string(),
  combination: z
    .string()
    .regex(/^\d{3}-\d{3}-\d{3}$/)
    .or(z.string().regex(/^\d{6}$/))
    .transform((str) => str.trim()),
  prize: z.string(),
  winners: z.string(),
});
