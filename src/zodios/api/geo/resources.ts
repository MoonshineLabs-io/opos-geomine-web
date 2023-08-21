import { z } from "zod";
import { pubkeyStrSchema } from "../../schemas/SharedSchemas";
export type Resource = z.infer<typeof resourceSchema>;
export const resourceSchema = z.object({
  label: z.string(),
  itemId: pubkeyStrSchema,
  category: z.string(),
  rarity: z.number().int().min(1).max(1000),
  image: z.string().optional(),
  description: z.string(),
});
export type ScannedResource = z.infer<typeof scannedResourceSchema>;
export const scannedResourceSchema = resourceSchema.extend({
  eid: z.string(),
  // count: z.number().int().min(1).max(1000),
});
export const resources = [
  {
    label: "Energon Shards",
    itemId: "energonShards",
    category: "resource",
    rarity: 1,
    image: "",
    description: "Highly charged energy crystals which can power other items.",
  },
  {
    label: "Nanofabrics",
    itemId: "nanofabrics",
    category: "resource",
    rarity: 2,
    image: "",
    description:
      "Ultra-durable, lightweight materials that can be used in the construction of various items.",
  },
  {
    label: "Quantum Chips",
    itemId: "quantumChips",
    category: "resource",
    rarity: 10,
    image: "",
    description:
      "Advanced computational units which are vital for creating intelligent devices.",
  },
  {
    label: "Bio-Luminescent Spores",
    itemId: "bioLuminescentSpores",
    category: "resource",
    rarity: 20,
    image: "",
    description:
      "Otherworldly lifeforms that can be harnessed for their special properties.",
  },
];
