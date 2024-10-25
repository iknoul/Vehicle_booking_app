'use client'
// components/RotatingCar.tsx
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import React, { useRef } from 'react';
import * as THREE from 'three';

import styles from './threeDImage.module.css'

// Load the car model using the useGLTF hook
const CarModel: React.FC = () => {
  const { scene } = useGLTF('/asset/Black_Mercedes_SUV_1016112024.glb'); // Replace with the actual path to your car model
  const carRef = useRef<THREE.Group>(null);

  // Rotate the car model continuously
  useFrame(() => {
    if (carRef.current) {
      carRef.current.rotation.y += 0.01; // Adjust rotation speed here
    }
  });

  return <primitive ref={carRef} object={scene} scale={[3.4, 3.4, 3.4]} />;
};

const RotatingCar: React.FC = () => {
  return (
    <Canvas className={styles.canvas}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 0, 5]} />
      <CarModel /> {/* Render the CarModel component */}
      <OrbitControls />
    </Canvas>
  );
};

export default RotatingCar;
