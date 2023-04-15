import { useStore } from "@/src/types/StoreContext";
import { Box } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useRef, useEffect, memo, useState } from "react";
import * as THREE from "three";
import { IUniform } from "three";
import waveformShaderSrc from "@/src/patterns/shaders/waveform.frag";
import vert from "@/src/patterns/shaders/default.vert";
import { Canvas } from "@react-three/fiber";

export default memo(function Waveform() {
  const [initialized, setInitialized] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const uniforms = useRef<Record<string, IUniform>>({});

  useEffect(() => {
    const create = async () => {
      try {
        const response = await fetch("/cloudkicker-explorebecurious.mp3");
        const arrayBuffer = await response.arrayBuffer();

        const audioContext = new AudioContext();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        const audioData = audioBuffer.getChannelData(0);
        const floatArray = Float32Array.from(audioData);

        const sampleCount = audioBuffer.length;
        const sampleTexWidth = 1024;
        const sampleTexHeight = Math.floor(sampleCount / (4 * sampleTexWidth));
        const sampleTex = new THREE.DataTexture(
          floatArray,
          sampleTexWidth,
          sampleTexHeight,
          THREE.RGBAFormat,
          THREE.FloatType
        );
        sampleTex.needsUpdate = true;

        if (!canvasRef.current) return;

        // const renderer = new THREE.WebGLRenderer({
        //   canvas: canvasRef.current,
        //   alpha: false,
        // });
        uniforms.current = {
          bgColor: { value: new THREE.Vector4(0.2, 0.3, 0.7, 1) },
          activeColor: { value: new THREE.Vector4(0.9, 0.9, 0.9, 1) },
          outWidth: { value: 1024.0 },
          outHeight: { value: 40.0 },
          sampleStart: { value: 0.0 },
          sampleEnd: { value: audioData.length },
          sampleWidth: { value: 1024.0 },
          sampleHeight: { value: sampleTexHeight },
          samples: { value: sampleTex },
          numSamples: { value: audioData.length },
        };
        setInitialized(true);
      } catch (e) {
        console.error(e);
      }
    };

    create();

    return () => {};
  }, []);

  return (
    <Box position="absolute" top={1.5} width="1024px" height="40px">
      <Canvas dpr={1} ref={canvasRef}>
        {initialized && (
          <mesh>
            <planeGeometry args={[2, 2]} />
            <shaderMaterial
              uniforms={uniforms.current}
              fragmentShader={waveformShaderSrc}
              vertexShader={vert}
            />
          </mesh>
        )}
      </Canvas>
    </Box>
  );
});
