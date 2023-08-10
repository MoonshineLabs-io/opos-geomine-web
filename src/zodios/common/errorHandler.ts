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
