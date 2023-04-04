import PatternView from "@/modules/components/PatternView";
import GradientPattern from "@/modules/patterns/GradientPattern";
import { patterns } from "@/modules/patterns/Patterns";
import { Box, Button, Grid, GridItem, Heading, VStack } from "@chakra-ui/react";
import { Canvas } from "@react-three/fiber";
import { useRef, useState } from "react";

export default function Editor() {
  const [pattern, setPattern] = useState(patterns[0]);

  return (
    <Box w="100vw" h="100vh">
      <Grid
        templateAreas={`"header header"
                        "nav    display"
                        "nav    footer"`}
        gridTemplateColumns="150px 1fr 150px"
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
          <Canvas>
            <PatternView key={pattern.name} pattern={pattern} />
          </Canvas>
        </GridItem>
        <GridItem pl="2" area="footer"></GridItem>
      </Grid>
    </Box>
  );
}
