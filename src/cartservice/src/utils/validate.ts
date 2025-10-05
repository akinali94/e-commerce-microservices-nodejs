import { z } from "zod";

export const addItemBodySchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive()
});

export type AddItemBody = z.infer<typeof addItemBodySchema>;