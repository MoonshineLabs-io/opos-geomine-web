import { AppProps } from "next/app";
import { Session } from "next-auth/core/types";
import Link from "next/link";
import Head from "next/head";

type AppOwnProps = {
  session: Session;
  // isLocalhost: boolean;
};
// https://stackoverflow.com/questions/73668032/nextauth-type-error-property-session-does-not-exist-on-type
export function MyApp({ Component, pageProps }: AppProps<AppOwnProps>) {
  return (
    <>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
