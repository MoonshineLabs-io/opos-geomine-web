import { makeApi, makeEndpoint } from "@zodios/core";
import { openApiBuilder } from "@zodios/openapi";
import z from "zod";
import { ctx } from "../common/context";
import { info, localServer, servers } from "../common/oapiConfig";
import { geomineApi } from "./geomine/geomineApi";

const getSpec = makeEndpoint({
  method: "get",
  path: "/spec",
  alias: "getSpec",
  response: z.any(),
});
export const specApi = makeApi([getSpec]);

export const specRouter = ctx.router(specApi);
// export const specRouter = zodiosRouter(specApi);

// export const specRouter = ctx.router(specApi);
specRouter.get("/spec", (req, res) => {
  // const spec = generateOpenAPI();
  // const oapiRouter = zodiosRouter([...platformApi, ...itemApi]);

  const spec = openApiBuilder(info)
    .addServer(servers[0])
    .addServer(servers[1])
    .addServer(servers[2])
    .addServer(localServer)
    .addPublicApi(specApi)
    .addPublicApi(geomineApi)
    .build();
  return res.status(200).json(spec);
});
