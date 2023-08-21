import { Method, ZodiosPathsByMethod } from "@zodios/core";
import type { ZodiosContext } from "@zodios/express";
import {
  zodiosContext,
  ZodiosRequestHandler,
  ZodiosRouterContextRequestHandler,
} from "@zodios/express";
import z from "zod";
import { geoApi } from "../api/geo/geoApi";
import { playerSchema } from "../api/register/registerApi";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ContextSchema<TCtx extends ZodiosContext<any>> =
  TCtx extends ZodiosContext<infer TSchema> ? TSchema : never;

const ctxSchema = z.object({
  player: playerSchema,
  session: z.object({
    id: z.string().uuid(),
    mail: z.string().email(),
    role_id: z.string(),
    permissions: z.array(z.string()),
    session_created_at: z.date(),
    session_expires_at: z.date(),
  }),
});

export type Context = typeof ctxSchema;

export const ctx = zodiosContext(ctxSchema);
export type PlayerMiddleware = ZodiosRouterContextRequestHandler<
  ContextSchema<typeof ctx>
>;
// export type ZodiosContext2 = NonNullable<typeof ctx>;
// export type ExpressContext = NonNullable<typeof ctx.context>;
// export type PlayerMiddleware2 =
//   ZodiosRouterContextRequestHandler<ExpressContext>;
export type Api = geoApi;
// https://github.com/ecyrbe/zodios/issues/443
export type Middleware<
  M extends Method,
  Path extends ZodiosPathsByMethod<Api, Method>
> = ZodiosRequestHandler<Api, Context, M, Path>;
