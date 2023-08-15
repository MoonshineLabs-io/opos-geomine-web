import { makeApi, makeEndpoint } from "@zodios/core";
import { z } from "zod";
import { errors } from "../../common/errorHandler";

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
