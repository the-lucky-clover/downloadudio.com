import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface ParticleProps {
  count?: number;
}

export const Interactive3DBackground = ({ count = 200 }: ParticleProps) => {
  const meshRef = useRef<THREE.Points>(null);
  const { mouse } = useThree();

  // Generate random particle positions
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Position
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      // Color gradient (purple to pink to blue)
      const colorChoice = Math.random();
      if (colorChoice < 0.33) {
        colors[i * 3] = 0.54; // r
        colors[i * 3 + 1] = 0.36; // g
        colors[i * 3 + 2] = 0.96; // b (purple)
      } else if (colorChoice < 0.66) {
        colors[i * 3] = 0.96; // r
        colors[i * 3 + 1] = 0.33; // g
        colors[i * 3 + 2] = 0.63; // b (pink)
      } else {
        colors[i * 3] = 0.25; // r
        colors[i * 3 + 1] = 0.61; // g
        colors[i * 3 + 2] = 0.98; // b (blue)
      }

      // Size
      sizes[i] = Math.random() * 0.5 + 0.1;
    }

    return { positions, colors, sizes };
  }, [count]);

  // Animation loop
  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.elapsedTime;
    const positions = meshRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Floating motion
      positions[i3 + 1] += Math.sin(time + i) * 0.001;
      
      // Mouse interaction
      const mouseX = mouse.x * 5;
      const mouseY = mouse.y * 5;
      positions[i3] += (mouseX - positions[i3]) * 0.0005;
      positions[i3 + 1] += (mouseY - positions[i3 + 1]) * 0.0005;

      // Boundary check - reset if too far
      if (Math.abs(positions[i3]) > 20) positions[i3] *= 0.95;
      if (Math.abs(positions[i3 + 1]) > 20) positions[i3 + 1] *= 0.95;
      if (Math.abs(positions[i3 + 2]) > 15) positions[i3 + 2] *= 0.95;
    }

    meshRef.current.geometry.attributes.position.needsUpdate = true;
    meshRef.current.rotation.y = time * 0.05;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={particles.colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={particles.sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.3}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};
