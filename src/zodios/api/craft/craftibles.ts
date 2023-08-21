import { z } from "zod";

// Craftible Recipe Schema
const recipeSchema = z.array(
  z.object({
    itemId: z
      .string()
      .regex(/^[a-z]+([A-Z][a-z]*)*$/, "Must be in camelCase format"),
    quantity: z.number().min(1),
  })
);

// Craftible Schema
export type Craftible = z.infer<typeof craftibleSchema>;
export const craftibleSchema = z.object({
  label: z.string(),
  itemId: z
    .string()
    .regex(/^[a-z]+([A-Z][a-z]*)*$/, "Must be in camelCase format"),
  category: z.string(),//z.literal("craftible"),
  image: z.string().optional(),
  recipe: recipeSchema,
  description: z.string(),
});

export const craftibles = [
  {
    label: "Energon Torch",
    itemId: "energonTorch",
    category: "craftible",
    image: "",
    recipe: [{ itemId: "energonShards", quantity: 1 }],
    description: "Lights up dark areas.",
  },
  {
    label: "Portable Shield",
    itemId: "portableShield",
    category: "craftible",
    image: "",
    recipe: [
      { itemId: "energonShards", quantity: 1 },
      { itemId: "nanofabrics", quantity: 1 },
    ],
    description: "Provides a temporary shield against hazards.",
  },
  {
    label: "Quantum Communicator",
    itemId: "quantumCommunicator",
    category: "craftible",
    image: "",
    recipe: [
      { itemId: "quantumChips", quantity: 1 },
      { itemId: "nanofabrics", quantity: 1 },
    ],
    description:
      "Enables communication with other players at distant locations.",
  },
  {
    label: "Scavenger Drone",
    itemId: "scavengerDrone",
    category: "craftible",
    image: "",
    recipe: [
      { itemId: "energonShards", quantity: 1 },
      { itemId: "nanofabrics", quantity: 1 },
      { itemId: "quantumChips", quantity: 1 },
      { itemId: "bioLuminescentSpores", quantity: 1 },
    ],
    description: "Automatically collects resources within a certain radius.",
  },
  {
    label: "Bio-Luminescent Lantern",
    itemId: "bioLuminescentLantern",
    category: "craftible",
    image: "",
    recipe: [
      { itemId: "bioLuminescentSpores", quantity: 1 },
      { itemId: "energonShards", quantity: 1 },
    ],
    description: "Attracts rare resources.",
  },
  {
    label: "Quantum Analyzer",
    itemId: "quantumAnalyzer",
    category: "craftible",
    image: "",
    recipe: [
      { itemId: "quantumChips", quantity: 1 },
      { itemId: "bioLuminescentSpores", quantity: 1 },
    ],
    description:
      "Identifies hidden properties of resources, unlocking new crafting options.",
  },
  {
    label: "Stealth Cloak",
    itemId: "stealthCloak",
    category: "craftible",
    image: "",
    recipe: [
      { itemId: "nanofabrics", quantity: 1 },
      { itemId: "quantumChips", quantity: 1 },
    ],
    description:
      "Renders the player invisible to other players for a short period.",
  },
  {
    label: "Spore Incubator",
    itemId: "sporeIncubator",
    category: "craftible",
    image: "",
    recipe: [
      { itemId: "bioLuminescentSpores", quantity: 1 },
      { itemId: "nanofabrics", quantity: 1 },
    ],
    description: "Can create new Bio-Luminescent Spores over time.",
  },
  {
    label: "Energon Amplifier",
    itemId: "energonAmplifier",
    category: "craftible",
    image: "",
    recipe: [
      { itemId: "energonShards", quantity: 1 },
      { itemId: "quantumChips", quantity: 1 },
    ],
    description:
      "Enhances the potency of Energon Shards, increasing their efficiency.",
  },
  {
    label: "Nanofabric Weaver",
    itemId: "nanofabricWeaver",
    category: "craftible",
    image: "",
    recipe: [
      { itemId: "nanofabrics", quantity: 1 },
      { itemId: "energonShards", quantity: 1 },
    ],
    description: "Accelerates the production of Nanofabrics.",
  },
];
