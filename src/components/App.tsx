import { Arrangement } from "@/src/components/Arrangement";
import { Box, Grid, GridItem } from "@chakra-ui/react";
import { Display } from "@/src/components/Display";
import { PatternList } from "@/src/components/PatternList";
import { useEffect, useRef } from "react";
import { useStore } from "@/src/types/StoreContext";
import { observer } from "mobx-react-lite";

export const App = observer(function App() {
  const store = useStore();
  const { uiStore } = store;
  const didInitialize = useRef(false);
  useEffect(() => {
    if (didInitialize.current) return;
    didInitialize.current = true;
    store.initialize();
  }, [store]);

  const gridItems = (
    <>
      <GridItem px="2" area="patterns" bgColor="gray.600">
        <PatternList />
      </GridItem>
      <GridItem area="display">
        <Display />
      </GridItem>
      <GridItem area="arrangement">
        <Arrangement />
      </GridItem>
    </>
  );

  return (
    <Box w="100vw" h="100vh">
      {uiStore.horizontalLayout ? (
        <Grid
          templateAreas={`"patterns display"
                        "patterns arrangement"`}
          gridTemplateColumns="165px calc(100vw - 165px)"
          gridTemplateRows="min-content 1fr"
          height="100vh"
        >
          {gridItems}
        </Grid>
      ) : (
        <Grid
          templateAreas={`"patterns arrangement display"`}
          gridTemplateColumns="165px calc(50vw - 165px) calc(50vw)"
          gridTemplateRows="100vh"
          height="100vh"
        >
          {gridItems}
        </Grid>
      )}
    </Box>
  );
});
