import { PublicKey } from "@solana/web3.js";
import bs58 from "bs58";
import z from "zod";
export type PubkeyString = z.infer<typeof pubkeyStrSchema>;
export type Base58String = z.infer<typeof base58Schema>;
export const base58Schema = z.string().regex(/^([1-9a-km-zA-HJ-NP-Z]+)$/);
export const pubkeyStrSchema = base58Schema.min(26).max(48);
export const pubkeyStrArraySchema = z.array(pubkeyStrSchema);
export const publicKeySchema = z
  .any()
  .refine((key) => key instanceof PublicKey, {
    message: "Must be a valid public key",
  });

export const thirtyTwoBytesSchema = base58Schema.refine(
  (value) => {
    try {
      const decoded = bs58.decode(value);
      return decoded.length === 32;
    } catch {
      return false;
    }
  },
  {
    message: "Must be a valid base58-encoded 32 byte string",
  }
);
export const optionalUrl = z.union([z.string().url().nullish(), z.literal("")]);

// Define a regular expression that allows URL-safe characters (alphanumeric, hyphen, underscore)
const urlSafeRegex = /^[a-zA-Z0-9-_]+$/;

export const urlPathParamSchema = z
  .string()
  .refine((value) => urlSafeRegex.test(value), {
    message:
      "The string must contain only URL-safe characters (alphanumeric, hyphen, underscore).",
  });

// Define and export a constant function to validate URL path parameters
export const validateUrlPathParam = (param: string) => {
  const validationResult = urlPathParamSchema.safeParse(param);
  if (validationResult.success) {
    console.log("Path parameter is valid:", validationResult.data);
  } else {
    console.log("Validation errors:", validationResult.error);
  }
};

export type Quantity = z.infer<typeof quantityIntegerSchema>;
export const quantityIntegerSchema = z
  .number()
  .int()
  .refine((value) => value >= 0, {
    message: "Must be a non-negative integer",
  });

export type Price = z.infer<typeof amountSchema>;
export const amountSchema = z
  .number()
  .refine((value) => value >= 0, {
    message: "Must be a non-negative number",
  })
  .refine(
    (value) => {
      // Check if the value is a decimal number less than 1
      if (value < 1 && value > 0) {
        return value.toString().startsWith("0.");
      }
      return true;
    },
    {
      message:
        "If the value is a decimal number less than 1, it must have a leading 0 before the .",
    }
  )
  .refine(
    (value) => {
      // Check if the value is in scientific notation
      return !/[eE]/.test(value.toString());
    },
    {
      message: "Scientific notation is prohibited.",
    }
  )
  .refine(
    (value) => {
      // Check if the number of decimal places exceed what's supported for SOL (9) or the SPL Token (mint specific)
      const decimalPart = value.toString().split(".")[1];
      return !decimalPart || decimalPart.length <= 9; // assuming 9 as a placeholder for the mint specific precision
    },
    {
      message:
        "The number of decimal places exceed what's supported for SOL (9) or the SPL Token",
    }
  );
export const amountStringSchema = z
  .string()
  .refine((value) => parseFloat(value ?? "0") >= 0, {
    message: "Must be a non-negative number",
  });
