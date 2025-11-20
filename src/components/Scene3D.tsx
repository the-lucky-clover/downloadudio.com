import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment } from "@react-three/drei";
import { Suspense } from "react";
import { Interactive3DBackground } from "./Interactive3DBackground";
import { FloatingGeometry } from "./FloatingGeometry";

interface Scene3DProps {
  showLogo?: boolean;
  className?: string;
}

export const Scene3D = ({ showLogo = false, className = "" }: Scene3DProps) => {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
        className="touch-none"
      >
        <PerspectiveCamera makeDefault position={[0, 0, 10]} />
        
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#8b5cf6" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ec4899" />
          <spotLight
            position={[0, 15, 0]}
            angle={0.3}
            penumbra={1}
            intensity={1}
            color="#a855f7"
          />

          {/* Environment */}
          <Environment preset="night" />

          {/* 3D Elements */}
          <Interactive3DBackground count={150} />
          <FloatingGeometry />

          {/* Subtle orbit controls for interactivity */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
