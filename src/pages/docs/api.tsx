import { GetStaticProps, InferGetStaticPropsType } from "next";
import dynamic from "next/dynamic";
import { Fragment } from "react";
import { SwaggerUIProps } from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import { apiSpec } from "../../zodios/common/oapiConfig";

const SwaggerUI = dynamic<SwaggerUIProps>(import("swagger-ui-react"), {
  ssr: false,
});

const lh = process.env.NEXT_PUBLIC_LOCALHOST === "true";

export const getStaticProps: GetStaticProps = async () => {
  const spec = JSON.stringify(apiSpec(lh));
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
