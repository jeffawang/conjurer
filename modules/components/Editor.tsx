import BlockView from "@/modules/components/BlockView";
import Timeline from "@/modules/components/Timeline";
import GradientPattern from "@/modules/patterns/GradientPattern";
import { patterns } from "@/modules/patterns/Patterns";
import {
  Box,
  Button,
  Grid,
  GridItem,
  Heading,
  Input,
  VStack,
} from "@chakra-ui/react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { Block } from "../common/types/Block";

export default function Editor() {
  const [patternID, setPattern] = useState(0);

  const [blueness, setBlueness] = useState(0);

  const b = useRef({ val: 1 });

  const block = useMemo(() => {
    const pattern = patterns[patternID]();
    return new Block(pattern, {
      u_blueness: ({ sp }) => {
        // console.log("updating!!!", sp);
        sp.value = b.current.val;
      },
    });
  }, [patternID]);

  return (
    <Box w="100vw" h="100vh">
      <Grid
        templateAreas={`"header header"
                        "nav    display"
                        "nav    timeline"`}
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
            {patterns.map((p, i) => (
              <Button
                key={p.name}
                colorScheme="teal"
                variant="outline"
                onClick={() => setPattern(i)}
              >
                {p.name}
              </Button>
            ))}
            <Input
              value={blueness}
              onChange={(e) => {
                const v = parseFloat(e.target.value);
                setBlueness(v);
                b.current.val = v;
              }}
            />
          </VStack>
        </GridItem>
        <GridItem pl="2" area="display">
          <Canvas>
            <BlockView key={block.pattern.name} block={block} />
          </Canvas>
        </GridItem>
        <GridItem pl="2" area="timeline">
          <Timeline />
        </GridItem>
      </Grid>
    </Box>
  );
}
