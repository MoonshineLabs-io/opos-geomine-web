import { z } from "zod";
export const zFail = (zodError: z.ZodError, error: boolean = false) => {
  {
    const message = zodError.issues
      .map((i) => i.message)
      .flat()
      .toString(); //params.error.format();
    console.dir(message);
  if (error) throw new Error(message);
  return message
  }
};

export const zodFail = (zodError: z.ZodError, error: boolean = false) => {
    {
      const message = zodError.issues
        .map((i) => i.message)
        .flat()
        .toString(); //params.error.format();
      console.dir(message);
    if (error) throw new Error(message);
    return { success: false, message };
    }
  };
  export const zError: z.ZodErrorMap = (issue, ctx) => {
    switch (issue.code) {
      // case z.ZodIssueCode.invalid_type:
      //   return { message: "Invalid type" };
      // case z.ZodIssueCode.invalid_string:
      //   return { message: "Invalid string" };
      default:
        return { message: issue.path[0] + " is " + issue.code };
      // return { message: issue.path[0] + " is required" };
      // return { message: ctx.defaultError };
    }
    // if (issue.code === z.ZodIssueCode.invalid_type) {
    //   if (issue.expected === "string") {
    //     return { message: issue.path[0] + " is required" };
    //   }
    // }
    // if (issue.code === z.ZodIssueCode.custom) {
    //   return { message: `less-than-${(issue.params || {}).minimum}` };
    // }
    // return { message: ctx.defaultError };
  };