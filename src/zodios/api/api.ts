import { makeApi, makeEndpoint, makeErrors } from "@zodios/core";
import z from "zod";
export const info = {
  title: "Moonshine Labs OPOS Geomine API Documentation",
  description:
    "Moonshine Labs Geomine api documentation for developers, team members, and partners.",
  contact: {
    name: "Moonshine Labs",
    url: "https://moonshinelabs.io",
    email: "team@moonshinelabs.io",
  },
  version: "0.5",
};
export const servers = [
  {
    url: "https://devopos.moonshinelabs.io/api",
    description: "Development Server",
  },
  {
    url: "https://opos.moonshinelabs.io/api",
    description: "Production Server",
  },
  {
    url: "http://localhost:3000/api",
    description: "Local Server",
  },
];
export const errors = makeErrors([
  // {
  //   status: 404,
  //   description: "User not found",
  //   schema: z.object({
  //     error: z.object({
  //       code: z.string(),
  //       message: z.string(),
  //     }),
  //   }),
  // },
  {
    status: "default",
    description: "Default error",
    schema: z.object({
      error: z.object({
        code: z.number(),
        message: z.string(),
      }),
    }),
  },
]);

const getSpec = makeEndpoint({
  method: "get",
  path: "/spec",
  alias: "getSpec",
  response: z.any(),
});
export const specApi = makeApi([getSpec]);
