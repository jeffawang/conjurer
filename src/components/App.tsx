import { Arrangement } from "@/src/components/Arrangement";
import { Box, Grid, GridItem } from "@chakra-ui/react";
import { Display } from "@/src/components/Display";
import { PatternList } from "@/src/components/PatternList";
import { useEffect, useRef } from "react";
import { useStore } from "@/src/types/StoreContext";

export const App = function App() {
  const store = useStore();
  const didInitialize = useRef(false);
  useEffect(() => {
    if (didInitialize.current) return;
    didInitialize.current = true;
    store.initialize();

    const autosave = () => {
      store.saveToLocalStorage("autosave");
    };

    // TODO: not actually working...
    addEventListener("onbeforeunload", autosave);

    return () => {
      removeEventListener("onbeforeunload", autosave);
    };
  }, [store]);

  return (
    <Box w="100vw" h="100vh">
      <Grid
        templateAreas={`"patterns display"
                        "patterns arrangement"`}
        gridTemplateColumns="165px calc(100vw - 165px)"
        gridTemplateRows="min-content 1fr"
        height="100vh"
        fontWeight="bold"
      >
        <GridItem area="header"></GridItem>
        <GridItem px="2" area="patterns" bgColor="gray.600">
          <PatternList />
        </GridItem>
        <GridItem area="display">
          <Display />
        </GridItem>
        <GridItem area="arrangement">
          <Arrangement />
        </GridItem>
      </Grid>
    </Box>
  );
};
