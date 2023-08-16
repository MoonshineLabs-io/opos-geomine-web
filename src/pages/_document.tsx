// pages/_document.tsx

import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
      <Head>
          <link rel="apple-touch-icon" href="/sa256.png" />
          <link rel="shortcut icon" href="/favicon.ico" />
          <meta
            name="description"
            content="A revolutionary augmented reality game!"
          />
          <meta property="og:title" content="Starlight Artifacts by Moonshine Labs" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
