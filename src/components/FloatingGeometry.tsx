import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

export const FloatingGeometry = () => {
  const torusRef = useRef<THREE.Mesh>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  const octahedronRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (torusRef.current) {
      torusRef.current.rotation.x = time * 0.3;
      torusRef.current.rotation.y = time * 0.2;
      torusRef.current.position.y = Math.sin(time) * 0.5;
    }

    if (sphereRef.current) {
      sphereRef.current.rotation.z = time * 0.2;
      sphereRef.current.position.y = Math.cos(time * 0.8) * 0.5;
    }

    if (octahedronRef.current) {
      octahedronRef.current.rotation.x = time * 0.4;
      octahedronRef.current.rotation.z = time * 0.3;
      octahedronRef.current.position.y = Math.sin(time * 1.2) * 0.5;
    }
  });

  return (
    <>
      {/* Torus */}
      <mesh ref={torusRef} position={[-8, 0, -10]}>
        <torusGeometry args={[1.5, 0.5, 16, 32]} />
        <MeshDistortMaterial
          color="#8b5cf6"
          transparent
          opacity={0.3}
          distort={0.4}
          speed={2}
          roughness={0.2}
        />
      </mesh>

      {/* Sphere */}
      <mesh ref={sphereRef} position={[8, 2, -12]}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <MeshDistortMaterial
          color="#ec4899"
          transparent
          opacity={0.3}
          distort={0.5}
          speed={3}
          roughness={0.2}
        />
      </mesh>

      {/* Octahedron */}
      <mesh ref={octahedronRef} position={[0, -3, -15]}>
        <octahedronGeometry args={[1.5]} />
        <MeshDistortMaterial
          color="#3b82f6"
          transparent
          opacity={0.3}
          distort={0.3}
          speed={2.5}
          roughness={0.2}
        />
      </mesh>
    </>
  );
};
