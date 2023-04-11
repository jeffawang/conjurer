import Store from "@/src/types/Store";
import StoreContext from "@/src/types/StoreContext";
import Editor from "@/src/components/Editor";
import { ChakraProvider, theme } from "@chakra-ui/react";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Conjurer</title>
        <meta name="description" content="conjurer" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ChakraProvider theme={theme}>
        <StoreContext.Provider value={new Store()}>
          <Editor />
        </StoreContext.Provider>
      </ChakraProvider>
    </>
  );
}
