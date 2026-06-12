import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';

export const FluidTextMaterial = shaderMaterial(
  {
    uTime: 0,
    uMouse: new THREE.Vector2(0.5, 0.5),
    uVelo: 0,
    uTexture: new THREE.Texture(),
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform float uTime;
    uniform vec2 uMouse;
    uniform float uVelo;
    uniform sampler2D uTexture;
    
    varying vec2 vUv;

    // Classic 2D Noise
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod289(i);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m ; m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      // Distance from current pixel UV to mouse UV
      float dist = distance(vUv, uMouse);
      
      // Calculate noise based on UV and time
      float noise = snoise(vUv * 10.0 + uTime * 0.5);
      
      // Intensity of the distortion falls off with distance from mouse, scaled by velocity
      float intensity = smoothstep(0.2, 0.0, dist) * clamp(uVelo, 0.0, 5.0);
      
      vec2 distortedUv = vUv;
      distortedUv.x += noise * intensity * 0.05;
      distortedUv.y += noise * intensity * 0.05;
      
      // Chromatic Aberration Amount
      float splitAmount = intensity * 0.03;
      
      vec4 texR = texture2D(uTexture, distortedUv + vec2(splitAmount, 0.0));
      vec4 texG = texture2D(uTexture, distortedUv);
      vec4 texB = texture2D(uTexture, distortedUv - vec2(splitAmount, 0.0));
      
      float alpha = max(texG.a, max(texR.a, texB.a));
      
      gl_FragColor = vec4(texR.r, texG.g, texB.b, alpha);
    }
  `
);
