import SimpleShader from "@/modules/components/SimpleShader";
import { Canvas, useFrame } from "@react-three/fiber";
import Head from "next/head";
import { MeshBasicMaterial } from "three";

export default function Home() {
  return (
    <>
      <Head>
        <title>Conjurer</title>
        <meta name="description" content="conjurer" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div style={{ width: 100 }}>
          <Canvas>
            <SimpleShader />
          </Canvas>
        </div>
      </main>
    </>
  );
}
