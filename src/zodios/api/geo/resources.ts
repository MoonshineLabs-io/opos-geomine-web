import { z } from "zod";
export type Resource = z.infer<typeof resourceSchema>;
export const resourceSchema = z.object({
  label: z.string(),
  itemId: z
    .string()
    .regex(/^[a-z]+([A-Z][a-z]*)*$/, "Must be in camelCase format"),
  type: z.string(),
  rarity: z.number().int().min(1).max(1000),
  image: z.string().optional(),
  description: z.string(),
});
export const resources = [
  {
    label: "Energon Shards",
    itemId: "energonShards",
    type: "resource",
    rarity: 1,
    image: "",
    description: "Highly charged energy crystals which can power other items.",
  },
  {
    label: "Nanofabrics",
    itemId: "nanofabrics",
    type: "resource",
    rarity: 2,
    image: "",
    description:
      "Ultra-durable, lightweight materials that can be used in the construction of various items.",
  },
  {
    label: "Quantum Chips",
    itemId: "quantumChips",
    type: "resource",
    rarity: 10,
    image: "",
    description:
      "Advanced computational units which are vital for creating intelligent devices.",
  },
  {
    label: "Bio-Luminescent Spores",
    itemId: "bioLuminescentSpores",
    type: "resource",
    rarity: 20,
    image: "",
    description:
      "Otherworldly lifeforms that can be harnessed for their special properties.",
  },
];
