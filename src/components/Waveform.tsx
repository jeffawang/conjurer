import { useStore } from "@/src/types/StoreContext";
import { Box } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import waveformShaderSrc from "@/src/patterns/shaders/waveform.frag";
import vert from "@/src/patterns/shaders/default.vert";

export default observer(function Waveform() {
  const initialized = useRef(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (initialized.current) return;

    const create = async () => {
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

      const renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        alpha: false,
      });
      const uniforms = {
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
      console.log(uniforms);
      const geometry = new THREE.PlaneGeometry(2, 2);
      const waveformShader = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vert,
        fragmentShader: waveformShaderSrc,
      });
      const mesh = new THREE.Mesh(geometry, waveformShader);
      const scene = new THREE.Scene();
      scene.add(mesh);
      const camera = new THREE.OrthographicCamera(
        -1, // Left
        1, // Right
        1, // Top
        -1, // Bottom
        0.1, // Near
        10 // Far
      );
      camera.position.z = 1;
      renderer.setSize(1024, 40); // Set the size of the renderer
      renderer.render(scene, camera);
    };

    create();
    initialized.current = true;

    return () => {};
  }, []);

  return (
    <Box position="absolute" top={1.5} width="100%">
      <canvas id="itsamethecanvas" ref={canvasRef} />
    </Box>
  );
});
