import { openApiBuilder } from "@zodios/openapi";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import dynamic from "next/dynamic";
import { Fragment } from "react";
import { SwaggerUIProps } from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import { info } from "../../zodios/api/api";
import { geomineApi } from "../../zodios/api/geomine/geomineApi";

const SwaggerUI = dynamic<SwaggerUIProps>(import("swagger-ui-react"), {
  ssr: false,
});

const lh = process.env.NEXT_PUBLIC_LOCALHOST === "true";
const condition = lh;
const elementToAdd = {
  url: "http://localhost:3000/api/opos",
  description: "Local Server",
};
const hosted = {
  url: "https://devopos.moonshinelabs.io/api/opos",
  description: "Development Server",
};
export const servers0 = [
  {
    url: "https://stageopos.moonshinelabs.io/api/opos",
    description: "Staging Server",
  },
  {
    url: "https://opos.moonshinelabs.io/api/opos",
    description: "Production Server",
  },
];
export const servers = (condition ? [elementToAdd] : [hosted]).concat(servers0);

export const getStaticProps: GetStaticProps = async () => {
  const spec1 = openApiBuilder(info)
    .addServer(servers[0])
    .addServer(servers[1])
    .addServer(servers[2])
    .addPublicApi(geomineApi)
    .build();
  const spec = JSON.stringify(spec1);
  return {
    props: {
      spec,
    },
  };
};

function ApiDoc({ spec }: InferGetStaticPropsType<typeof getStaticProps>) {

  return (
    <Fragment>
      {/* <Box
        position="absolute"
        w="full"
        top="34px"
        bg="transparent"
        _dark={{ bg: "gray.300" }}
      > */}
        <SwaggerUI
          tryItOutEnabled={true}
          displayRequestDuration={true}
          filter={true}
          requestSnippetsEnabled={true}
          showMutatedRequest={true}
          showExtensions={true}
          // requestInterceptor={(req) => {
          //   if (!bearToken) return req;
          //   req.headers.token = bearToken;
          //   return req;
          // }}
          spec={spec}
        />
      {/* </Box> */}
    </Fragment>
  );
}
export default ApiDoc;
