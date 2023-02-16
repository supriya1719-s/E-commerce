import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import NextNProgress from "nextjs-progressbar";

const MyApp = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <SessionProvider session={session}>
      <NextNProgress color="#ffffff" />
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default MyApp;
