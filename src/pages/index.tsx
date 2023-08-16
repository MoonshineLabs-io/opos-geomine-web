import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <div
      style={{
        backgroundImage: "url(/bg.jpg)",
        height: "100vh",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Head>
        <title>Starlight Artifacts by Moonshine Labs</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: "100%",
          textAlign: "center",
          color: "white",
        }}
      >
        <h1>Starlight Artifacts</h1>
        <p>Experience web3 gaming like never before.</p>
        <div style={{ marginTop: 20 }}>
          <Link href="https://play.google.com/store/link-to-your-game">
            Download on Android
          </Link>< br/>
          <Link href="https://apps.apple.com/link-to-your-game">
            Download on iOS
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
