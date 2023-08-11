import { makeErrors } from "@zodios/core";
import { z } from "zod";
import { zFail } from "./../../types/zod/ZodConfig";

export const makeError = (code: number, message: string) => {
  return {
    error: {
      code,
      message,
    },
  };
};
export const makeZError = (code: number, zError: z.ZodError) => {
  return {
    error: {
      code,
      message: zFail(zError),
    },
  };
};
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
