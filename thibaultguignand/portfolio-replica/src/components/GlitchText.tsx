import { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { FluidTextMaterial } from './FluidTextShader';
import './GlitchText.css';

extend({ FluidTextMaterial });

declare module '@react-three/fiber' {
  interface ThreeElements {
    fluidTextMaterial: any;
  }
}

interface GlitchTextProps {
  text: string;
}

const Scene = ({ text }: { text: string }) => {
  const materialRef = useRef<any>(null);
  const { viewport } = useThree();
  
  const mouse = useRef(new THREE.Vector2(0.5, 0.5));
  const velocity = useRef(0);
  const lastMouse = useRef(new THREE.Vector2(0.5, 0.5));

  // Generate a robust 2D Canvas Texture for the text
  const textTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'white';
      ctx.font = '900 240px "Outfit", monospace, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      // Slight letter spacing by drawing characters? Or just rely on standard drawing
      ctx.fillText(text.toUpperCase(), canvas.width / 2, canvas.height / 2);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.format = THREE.RGBAFormat;
    return texture;
  }, [text]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = 1.0 - (e.clientY / window.innerHeight); // WebGL Y is inverted
      
      mouse.current.set(x, y);

      const dx = mouse.current.x - lastMouse.current.x;
      const dy = mouse.current.y - lastMouse.current.y;
      const vel = Math.sqrt(dx * dx + dy * dy);
      
      velocity.current = Math.min(velocity.current + vel * 50.0, 5.0);
      lastMouse.current.copy(mouse.current);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.elapsedTime;
      // Smoothly interpolate mouse uniform
      materialRef.current.uMouse.lerp(mouse.current, 0.1);
      // Slowly decay velocity
      velocity.current = THREE.MathUtils.lerp(velocity.current, 0, 0.05);
      materialRef.current.uVelo = velocity.current;
    }
  });

  // Calculate plane size based on viewport width to maintain texture aspect ratio (2048x512 is 4:1)
  const planeWidth = viewport.width * 0.8; // Take up 80% of screen width
  const planeHeight = planeWidth / 4;

  return (
    <mesh scale={[planeWidth, planeHeight, 1]}>
      <planeGeometry args={[1, 1, 64, 64]} />
      <fluidTextMaterial ref={materialRef} transparent={true} uTexture={textTexture} />
    </mesh>
  );
};

const GlitchText = ({ text }: GlitchTextProps) => {
  return (
    <div className="glitch-text-container">
      <Canvas orthographic camera={{ position: [0, 0, 5], zoom: 100 }} style={{ pointerEvents: 'none' }}>
        <Scene text={text} />
      </Canvas>
    </div>
  );
};

export default GlitchText;
