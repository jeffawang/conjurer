import SimpleShader from "@/modules/components/SimpleShader";
import { Box, Button, Grid, GridItem, Heading, VStack } from "@chakra-ui/react";
import { Canvas } from "@react-three/fiber";

export default function Editor() {
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
            <SimpleShader />
          </Canvas>
        </GridItem>
        <GridItem pl="2" area="footer"></GridItem>
      </Grid>
    </Box>
  );
}
