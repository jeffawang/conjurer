import PatternView from "@/modules/components/PatternView";
import SimpleShader from "@/modules/components/PatternView";
import { Box, Button, Grid, GridItem, Heading, VStack } from "@chakra-ui/react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import { Pattern } from "../common/types/Pattern";

import gradient from "../shaders/gradient.frag";

export default function Editor() {
  const pattern = useMemo(() => {
    return new Pattern("hello", gradient, {
      u_blah: {
        name: "Blah",
        value: 1,
      },
    });
  }, []);

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
            <Button colorScheme="teal" variant="outline">
              SimpleShader
            </Button>
            <Button colorScheme="teal" variant="outline">
              BlahShader
            </Button>
          </VStack>
        </GridItem>
        <GridItem pl="2" area="display">
          <Canvas>
            <PatternView pattern={pattern} />
          </Canvas>
        </GridItem>
        <GridItem pl="2" area="footer"></GridItem>
      </Grid>
    </Box>
  );
}
