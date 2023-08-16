import { makeApi, makeEndpoint } from "@zodios/core";
import { z } from "zod";
import { errors } from "../../common/errorHandler";

export type SolanaPayGetQRResponse = z.infer<typeof solanaPayGetQrResponseSchema>;
export const solanaPayGetQrResponseSchema = z.object({
  link: z.string().url(),
  label: z.string().nullish(),
  message: z.string().nullish(),
});

const register = makeEndpoint({
  method: "get",
  path: "/register",
  alias: "registerUser",
  response: z.object({
    redirectUrl: z.string(),
  }),
  description: "Generates a Solana keypair, stores the secret key and UTC, then redirects to Phantom.com",
  errors,
});

const api = makeApi([register]);
export default api;
