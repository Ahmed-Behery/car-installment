import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    const { locale } = this.props;
    const isRtl = locale !== "en";

    return (
      <Html lang={locale} dir={isRtl ? "rtl" : "ltr"}>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
