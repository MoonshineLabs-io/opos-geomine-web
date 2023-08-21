import * as z from "zod";
import {
  pubkeyStrSchema,
  thirtyTwoBytesSchema,
  urlPathParamSchema,
} from "./SharedSchemas";
import { Document } from "mongodb";

// Craftible Recipe Schema
const recipeSchema = z.array(
  z.object({
    itemId: z
      .string()
      .regex(/^[a-z]+([A-Z][a-z]*)*$/, "Must be in camelCase format"),
    quantity: z.number().min(1),
  })
);

export type ItemPrice = z.infer<typeof itemPriceSchema>;
export const itemPriceSchema = z.object({
  price: z.number(),
  tokenName: z.string(),
  token: pubkeyStrSchema,
  active: z.boolean(),
  decimals: z.number().int().gte(0).lte(9).optional(),
  discountPrice: z.number().optional(),
});
export type CreateItem = z.infer<typeof createItemSchema>;
export const createItemSchema = z.object({
  itemId: urlPathParamSchema,
  label: z.string(),
  priceArray: z.array(itemPriceSchema),
  image: z.string(),
  description: z.string().optional(),
  rarity: z.number().int().min(1).max(1000).optional(),
  recipe: recipeSchema.optional(),
  collection: thirtyTwoBytesSchema.optional(),
  quantity: z.number().optional(),
  category: z.string().optional(),
  subcategory: z.string().optional(),
  scenes: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  requiredRoles: z.array(z.string()).optional(),
  excludedRoles: z.array(z.string()).optional(),
});
export type ItemDoc = Document & Item;
export type Item = z.infer<typeof itemSchema>;
export const itemSchema = createItemSchema.extend({
  itemPlatId: z.string(),
  platformId: urlPathParamSchema,
  platformRefId: thirtyTwoBytesSchema,
  inStock: z.boolean(),
  itemRefId: thirtyTwoBytesSchema,
  createdUTC: z.number(),
  lastModified: z.date().optional(),
});
export const ItemsSchema = z.array(itemSchema);
