import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Center, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

export const Hero3DLogo = () => {
  const logoRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!logoRef.current) return;
    
    // Floating animation
    logoRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    
    // Rotation animation
    logoRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    logoRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    
    // Glow pulse
    if (glowRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      glowRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group ref={logoRef}>
      <Center>
        <Text
          fontSize={1.2}
          maxWidth={200}
          lineHeight={1}
          letterSpacing={0.02}
          textAlign="center"
          font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff"
          anchorX="center"
          anchorY="middle"
        >
          Downloadudio
          <MeshTransmissionMaterial
            backside
            samples={8}
            resolution={512}
            transmission={0.9}
            roughness={0.2}
            thickness={0.3}
            ior={1.5}
            chromaticAberration={0.3}
            anisotropy={1}
            distortion={0.2}
            distortionScale={0.3}
            temporalDistortion={0.1}
            color="#8b5cf6"
          />
        </Text>
      </Center>
      
      {/* Glow sphere behind text */}
      <mesh ref={glowRef} position={[0, 0, -1]}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.15} />
      </mesh>
    </group>
  );
};
