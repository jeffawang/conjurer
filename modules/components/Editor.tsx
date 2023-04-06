import Timeline from "@/modules/components/Timeline";
import { patterns } from "@/modules/patterns/Patterns";
import { Box, Button, Grid, GridItem, Heading, VStack } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { Block } from "../common/types/Block";
import Display from "@/modules/components/Display";
import BlockView from "@/modules/components/BlockView";
import { Canvas } from "@react-three/fiber";

export default function Editor() {
  const [pattern, setPattern] = useState(patterns[0]);

  const block = useMemo(() => new Block(pattern), [pattern]);

  return (
    <Box w="100vw" h="100vh">
      <Grid
        templateAreas={`".      header"
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
            <Canvas>
              <BlockView key={block.pattern.name} autorun block={block} />
            </Canvas>
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
          <Display />
        </GridItem>
        <GridItem pl="2" area="timeline">
          <Timeline />
        </GridItem>
      </Grid>
    </Box>
  );
}
