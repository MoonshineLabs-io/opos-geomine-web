import { openApiBuilder } from "@zodios/openapi";
import { ctx } from "../common/context";
import { info, specApi } from "./api";
import { geomineApi } from "./geomine/geomineApi";

export const servers = [
  {
    url: "https://devopos.moonshinelabs.io/api/opos",
    description: "Development Server",
  },
  {
    url: "https://stageopos.moonshinelabs.io/api/opos",
    description: "Staging Server",
  },
  {
    url: "https://opos.moonshinelabs.io/api/opos",
    description: "Production Server",
  },
];
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
    .addPublicApi(specApi)
    .addPublicApi(geomineApi)
    .build();
  return res.status(200).json(spec);
});
