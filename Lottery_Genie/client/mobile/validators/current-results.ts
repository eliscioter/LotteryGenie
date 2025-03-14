import { z } from "zod";

export const lotteryResultSchema = z.array(
  z.object({
    id: z.number().positive(),
    date: z.string().date(),
    category: z.string(),
    combination: z.array(z.string().min(1).max(2)).length(6),
    prize: z.string(),
    result: z.object({
      user_combination: z.array(z.string().min(1).max(2)).length(6),
      number: z.array(z.string().min(1).max(2)).length(6),
      count: z.number().int().positive(),
    }),
    prize_amount: z.object({
      amount: z.string(),
      message: z.string(),
    }),
  })
);

export const InputSchema = z.object({
  category: z.string(),
  date: z.date(),
  combination: z.array(
    z.object({ value: z.array(z.string().min(1).max(2)).length(6) })
  ),
  prize: z.string().optional(),
});
