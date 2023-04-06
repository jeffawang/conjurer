import BlockView from "@/modules/components/BlockView";
import Timeline from "@/modules/components/Timeline";
import { patterns } from "@/modules/patterns/Patterns";
import { Box, Button, Grid, GridItem, Heading, VStack } from "@chakra-ui/react";
import { Canvas } from "@react-three/fiber";
import { useMemo, useState } from "react";
import { Block } from "../common/types/Block";

export default function Editor() {
  const [pattern, setPattern] = useState(patterns[0]);

  const block = useMemo(() => {
    return new Block(pattern, {
      u_time: ({ sp, time }) => {
        sp.value = time;
      },
    });
  }, [pattern]);

  return (
    <Box w="100vw" h="100vh">
      <Grid
        templateAreas={`"header header"
                        "nav    display"
                        "nav    timeline"`}
        gridTemplateColumns="150px 1fr"
        gap="1"
        fontWeight="bold"
      >
        <GridItem marginY="2" area="header">
          <VStack justifyContent="center">
            <Heading>Conjurer</Heading>
          </VStack>
        </GridItem>
        <GridItem pl="2" area="nav">
          <VStack>
            {patterns.map((p) => (
              <Button
                key={p.name}
                colorScheme="teal"
                variant="outline"
                onClick={() => setPattern(p)}
              >
                {p.name}
              </Button>
            ))}
          </VStack>
        </GridItem>
        <GridItem pl="2" area="display">
          <Box width="192px" height="150px">
            <Canvas>
              <BlockView key={block.pattern.name} block={block} />
            </Canvas>
          </Box>
        </GridItem>
        <GridItem pl="2" area="timeline">
          <Timeline />
        </GridItem>
      </Grid>
    </Box>
  );
}
