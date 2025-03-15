'use client'

import React, { useEffect, useRef, useState, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import ImageModal from './ImageModal'

const isMobile = window.innerWidth < 768;
const RADIUS = isMobile ? 2 : 4;
const IMAGE_COUNT = 19  // Updated to include all images
const AUTO_ROTATE_SPEED = 0.0005

// Pre-create geometries and materials to avoid recreation on each render
const planeGeometry = new THREE.PlaneGeometry(1.2, 1.2)
const textureLoader = new THREE.TextureLoader()
const textures = new Map()

const imageUrls = [
  // Original images
  ...Array.from({ length: 16 }, (_, i) => `/images/image${i + 1}.jpeg`),
  // New images
  '/images/Celestia_Build_Whatever4_04.png',
  '/images/Celestia_Build_Whatever5_01 (1).png',
  '/images/Celestia_Build_Whatever9_01 (1).jpg'
]

function loadTexture(url: string) {
  if (!textures.has(url)) {
    textures.set(url, textureLoader.load(url))
  }
  return textures.get(url)
}

interface ImagePosition {
  position: [number, number, number]
  rotation: [number, number, number]
}

interface ImagePlaneProps {
  url: string
  position: [number, number, number]
  rotation: [number, number, number]
  onClick: () => void
  key?: React.Key
}

const ImagePlane = React.memo(({ url, position, rotation, onClick }: ImagePlaneProps) => {
  const texture = loadTexture(url)
  const [hovered, setHovered] = useState(false)
  const materialRef = useRef<THREE.MeshBasicMaterial>(null)
  const meshRef = useRef<THREE.Mesh>(null)
  const targetScale = useRef(1)
  const currentScale = useRef(1)

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.needsUpdate = true
    }
  }, [texture])

  useFrame(() => {
    if (meshRef.current) {
      targetScale.current = hovered ? 1.1 : 1
      currentScale.current += (targetScale.current - currentScale.current) * 0.1
      meshRef.current.scale.setScalar(currentScale.current)
    }
  })

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <primitive object={planeGeometry} />
      <meshBasicMaterial
        ref={materialRef}
        map={texture}
        transparent
        opacity={1}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
})

ImagePlane.displayName = 'ImagePlane'

function GlobeScene({ onImageClick }: { onImageClick: (url: string) => void }) {
  const { camera } = useThree()
  const groupRef = useRef<THREE.Group>(null)
  const [autoRotate, setAutoRotate] = useState(true)

  const isMobile = window.innerWidth < 768;
  const minDistance = isMobile ? 3.5 : 6;
  const maxDistance = isMobile ? 7 : 12;

  useEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.position.z = 8
      camera.fov = 60
      camera.updateProjectionMatrix()
    }
  }, [camera])

  useFrame(() => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += AUTO_ROTATE_SPEED
    }
  })

  const imagePositions = useMemo(() => {
    const positions: ImagePosition[] = []
    const phi = Math.PI * (3 - Math.sqrt(5)) // golden angle in radians

    for (let i = 0; i < IMAGE_COUNT; i++) {
      const y = 1 - (i / (IMAGE_COUNT - 1)) * 2 // y goes from 1 to -1
      const radius = Math.sqrt(1 - y * y) // radius at y
      const theta = phi * i // golden angle increment

      const x = Math.cos(theta) * radius
      const z = Math.sin(theta) * radius

      // Calculate rotation to face center
      const direction = new THREE.Vector3(x, y, z).normalize()
      const rotationMatrix = new THREE.Matrix4()
      rotationMatrix.lookAt(
        new THREE.Vector3(0, 0, 0), // look at center
        direction.multiplyScalar(-1), // from position towards center
        new THREE.Vector3(0, 1, 0) // up vector
      )
      const rotation = new THREE.Euler().setFromRotationMatrix(rotationMatrix)

      positions.push({
        position: [x * RADIUS, y * RADIUS, z * RADIUS] as [number, number, number],
        rotation: [rotation.x, rotation.y, rotation.z] as [number, number, number]
      })
    }

    return positions
  }, [])

  return (
    <>
      <ambientLight intensity={1} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      <group ref={groupRef}>
        {imagePositions.map((pos, index) => (
          <ImagePlane
            key={index}
            url={imageUrls[index]}
            position={pos.position}
            rotation={pos.rotation}
            onClick={() => {
              onImageClick(imageUrls[index])
              setAutoRotate(false)
            }}
          />
        ))}
      </group>
      <OrbitControls 
        enableZoom={true}
        enablePan={false}
        autoRotate={autoRotate}
        autoRotateSpeed={2}
        minPolarAngle={Math.PI / 2.5}
        maxPolarAngle={Math.PI / 1.5}
        onStart={() => setAutoRotate(false)}
        enableDamping={true}
        dampingFactor={0.08}
        rotateSpeed={0.5}
        minDistance={minDistance}
        maxDistance={maxDistance}
        zoomSpeed={0.3}
      />
    </>
  )
}

export default function Globe() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        camera={{ position: [0, 0, isMobile ? 5 : 8], fov: isMobile ? 45 : 60 }}
        style={{ width: '100%', height: '100%' }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
      >
        <GlobeScene onImageClick={setSelectedImage} />
      </Canvas>
      <div style={{ position: 'fixed', top: 0, left: 0, pointerEvents: selectedImage ? 'auto' : 'none' }}>
        <ImageModal
          imageUrl={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      </div>
    </div>
  )
}