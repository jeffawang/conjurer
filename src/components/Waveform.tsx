import { useStore } from "@/src/types/StoreContext";
import { INITIAL_PIXELS_PER_SECOND } from "@/src/utils/time";
import { Box } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import waveformShaderSrc from "@/src/patterns/shaders/waveform.frag"
import vert from "@/src/patterns/shaders/default.vert"
import { Texture } from "@react-three/postprocessing";

export default observer(function Waveform() {
  const initialized = useRef(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { timer, uiStore } = useStore();
  const [ numSamples, setNumSamples] = useState(0);
  
  class AudioTextureStore {
    texture?: THREE.DataTexture;

    setTexture(texture: THREE.DataTexture) {
      this.texture = texture;
    }
  }

  const audioTextureStore = new AudioTextureStore();
  
  useEffect(() => {
    if (initialized.current) return;
    const create = async () => {
      const audioContext = new AudioContext();
      fetch("/cloudkicker-explorebecurious.mp3")
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
        .then(audioBuffer => {
          const audioData = audioBuffer.getChannelData(0);
          const floatArray = Float32Array.from(audioData);
          // console.log(floatArray.length);
          // const sampleTex = new THREE.DataTexture(
          //   floatArray, 
          //   audioBuffer.length, 
          //   1, 
          //   THREE.RedFormat, 
          //   THREE.FloatType
          // );
          // sampleTex.needsUpdate = true;

          const sampleCount = audioBuffer.length;
          const sampleTexWidth = 1024;
          const sampleTexHeight = Math.floor(sampleCount / (4 * sampleTexWidth));
          const sampleTex = new THREE.DataTexture(floatArray, sampleTexWidth, sampleTexHeight, THREE.RGBAFormat, THREE.FloatType);
          sampleTex.needsUpdate = true;

          // Too bad this doesn't work :'(
          setNumSamples(audioData.length);

          audioTextureStore.setTexture(sampleTex);
          if (canvasRef.current != null){
            const renderer = new THREE.WebGLRenderer({
              canvas: canvasRef.current,
              alpha: false, 
            });
            const uniforms = {
              bgColor: { value: new THREE.Vector4(.2, .3, .7, 1) },
              activeColor: { value: new THREE.Vector4(.9, .9, .9, 1) },
              outWidth: { value: 1024.0 },
              outHeight: { value: 40.0 },
              sampleStart: { value: 0.0 },
              sampleEnd: { value: audioData.length },
              sampleWidth: { value: 1024.0 },
              sampleHeight: { value: sampleTexHeight },
              samples: { value: sampleTex },
              numSamples: { value: audioData.length }
            }
            console.log(uniforms);
            const geometry = new THREE.PlaneGeometry(2, 2);
            const waveformShader = new THREE.ShaderMaterial({
              uniforms: uniforms,
            //   vertexShader: `
            //   void main() {
            //     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            //   }
            // `,
              vertexShader: vert,
              fragmentShader: waveformShaderSrc
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
          }
        })
        .catch(error => console.error(error));
    };

    create();
    initialized.current = true;

    return () => {};
  }, []);

  useEffect(() => {
    if (timer.playing) {

    }
  }, [timer.playing]);

  useEffect(() => {
    uiStore.pixelsPerSecond;
  }, [uiStore.pixelsPerSecond]);

  useEffect(() => {
    if (/*is initialized*/true) {
      const progress =
        timer.lastCursorPosition / 1;/*wavesurferRef.current.getDuration()*/
      //wavesurferRef.current.seekTo(progress);
    }
  }, [timer.lastCursorPosition]);

  return (
    <Box position="absolute" top={1.5} width="100%">
      <canvas id="itsamethecanvas" ref={canvasRef} />
    </Box>
  );
});
