import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Sun, 
  Moon, 
  Lightbulb, 
  Flame, 
  Camera, 
  Sparkles, 
  Layers, 
  Volume2, 
  Eye,
  Maximize2
} from 'lucide-react';
import { LamborghiniCar, CarColor } from '../types/lamborghini';
import { playEngineRev } from '../utils/audioSynth';

interface Car3DViewerProps {
  selectedCar: LamborghiniCar;
  activeColor: CarColor;
  onColorChange: (color: CarColor) => void;
}

type StudioEnvironment = 'showroom' | 'cyberpunk' | 'volcano' | 'spotlight';
type CameraView = 'front-quarter' | 'side' | 'rear' | 'top' | 'front';

export const Car3DViewer: React.FC<Car3DViewerProps> = ({
  selectedCar,
  activeColor,
  onColorChange,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const carGroupRef = useRef<THREE.Group | null>(null);
  const carMaterialsRef = useRef<{ bodyMat: THREE.MeshPhysicalMaterial; wheelMats: THREE.MeshStandardMaterial[] }>({
    bodyMat: new THREE.MeshPhysicalMaterial(),
    wheelMats: []
  });

  const headlightLightsRef = useRef<THREE.SpotLight[]>([]);
  const flameMeshesRef = useRef<THREE.Mesh[]>([]);

  // State controls
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [headlightsOn, setHeadlightsOn] = useState(true);
  const [wireframeMode, setWireframeMode] = useState(false);
  const [studioEnv, setStudioEnv] = useState<StudioEnvironment>('showroom');
  const [activeCamPreset, setActiveCamPreset] = useState<CameraView>('front-quarter');
  const [isRevving, setIsRevving] = useState(false);
  const [paintFinish, setPaintFinish] = useState<'metallic' | 'matte' | 'pearl'>('metallic');

  // Interactive Drag & Zoom state
  const isDraggingRef = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const cameraSphericalRef = useRef({ radius: 8.5, theta: Math.PI / 4, phi: Math.PI / 3.2 });
  const targetLookAt = useRef(new THREE.Vector3(0, 0.6, 0));

  // Handle engine rev sound + exhaust flame burst
  const handleRevEngine = () => {
    if (isRevving) return;
    setIsRevving(true);
    playEngineRev(selectedCar.id);

    // Trigger visual exhaust flame burst in 3D
    if (flameMeshesRef.current.length > 0) {
      flameMeshesRef.current.forEach(mesh => {
        mesh.visible = true;
        mesh.scale.set(1.5, 1.5, 3.0);
      });
      setTimeout(() => {
        flameMeshesRef.current.forEach(mesh => {
          mesh.scale.set(1.0, 1.0, 1.0);
          mesh.visible = false;
        });
        setIsRevving(false);
      }, 2600);
    } else {
      setTimeout(() => setIsRevving(false), 2600);
    }
  };

  // Build Procedural 3D Car Geometry
  const buildCarModel = (car: LamborghiniCar, scene: THREE.Scene) => {
    if (carGroupRef.current) {
      scene.remove(carGroupRef.current);
      carGroupRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
    }

    const carGroup = new THREE.Group();
    carGroupRef.current = carGroup;
    flameMeshesRef.current = [];

    // Body Material
    const bodyMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(activeColor.hex),
      metalness: paintFinish === 'matte' ? 0.2 : 0.85,
      roughness: paintFinish === 'matte' ? 0.65 : 0.15,
      clearcoat: paintFinish === 'matte' ? 0.1 : 1.0,
      clearcoatRoughness: 0.1,
      reflectivity: 0.9,
      wireframe: wireframeMode,
    });
    carMaterialsRef.current.bodyMat = bodyMaterial;

    // Secondary Materials
    const carbonMaterial = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      metalness: 0.4,
      roughness: 0.6,
      wireframe: wireframeMode
    });

    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x111625,
      metalness: 0.9,
      roughness: 0.05,
      transmission: 0.85,
      thickness: 0.5,
      transparent: true,
      opacity: 0.88,
    });

    const interiorMaterial = new THREE.MeshStandardMaterial({
      color: 0x27272a,
      roughness: 0.8,
    });

    const wheelRimMaterial = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      metalness: 0.95,
      roughness: 0.2,
      wireframe: wireframeMode
    });
    carMaterialsRef.current.wheelMats = [wheelRimMaterial];

    const tireMaterial = new THREE.MeshStandardMaterial({
      color: 0x121214,
      roughness: 0.9,
    });

    const goldBrakeMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.9,
      roughness: 0.3,
    });

    const isSUV = car.model3DConfig.bodyType === 'suv';
    const isV12 = car.model3DConfig.bodyType === 'flagship-v12';

    // 1. Lower Chassis Floor / Underbody & Diffuser
    const chassisGeo = new THREE.BoxGeometry(
      isSUV ? 2.1 : 2.05,
      0.15,
      isSUV ? 4.9 : (isV12 ? 4.8 : 4.6)
    );
    const chassisMesh = new THREE.Mesh(chassisGeo, carbonMaterial);
    chassisMesh.position.y = isSUV ? 0.45 : 0.22;
    chassisMesh.castShadow = true;
    chassisMesh.receiveShadow = true;
    carGroup.add(chassisMesh);

    // 2. Main Aerodynamic Body Monocoque
    // Lower body wedge
    const bodyWedgeGeo = new THREE.BoxGeometry(
      isSUV ? 2.0 : 1.98,
      isSUV ? 0.75 : 0.42,
      isSUV ? 4.7 : (isV12 ? 4.65 : 4.45)
    );
    const bodyMesh = new THREE.Mesh(bodyWedgeGeo, bodyMaterial);
    bodyMesh.position.y = isSUV ? 0.8 : 0.42;
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    carGroup.add(bodyMesh);

    // Front Nose Wedge (Hood Slope)
    const noseGeo = new THREE.CylinderGeometry(
      isSUV ? 0.95 : 0.9,
      isSUV ? 1.0 : 0.98,
      isSUV ? 1.4 : 1.5,
      4,
      1,
      false,
      Math.PI / 4
    );
    noseGeo.rotateX(Math.PI / 2);
    const noseMesh = new THREE.Mesh(noseGeo, bodyMaterial);
    noseMesh.position.set(0, isSUV ? 0.75 : 0.4, isSUV ? 1.7 : 1.6);
    noseMesh.scale.set(1, 0.45, 1);
    noseMesh.castShadow = true;
    carGroup.add(noseMesh);

    // 3. Cabin Greenhouse & Roof Structure
    const roofWidth = isSUV ? 1.7 : 1.5;
    const roofHeight = isSUV ? 0.75 : 0.48;
    const roofLength = isSUV ? 2.6 : (isV12 ? 2.1 : 1.9);
    const roofGeo = new THREE.BoxGeometry(roofWidth, roofHeight, roofLength);
    const roofMesh = new THREE.Mesh(roofGeo, glassMaterial);
    roofMesh.position.set(0, isSUV ? 1.35 : 0.76, isSUV ? -0.2 : -0.15);
    roofMesh.castShadow = true;
    carGroup.add(roofMesh);

    // Roof Top Carbon Panel
    const roofTopGeo = new THREE.BoxGeometry(roofWidth * 0.92, 0.05, roofLength * 0.85);
    const roofTopMesh = new THREE.Mesh(roofTopGeo, carbonMaterial);
    roofTopMesh.position.set(0, (isSUV ? 1.35 : 0.76) + roofHeight / 2 + 0.02, isSUV ? -0.2 : -0.15);
    carGroup.add(roofTopMesh);

    // Interior basic bucket seats & steering
    const seatGeo = new THREE.BoxGeometry(0.5, 0.6, 0.45);
    const seatLeft = new THREE.Mesh(seatGeo, interiorMaterial);
    seatLeft.position.set(-0.4, isSUV ? 1.0 : 0.52, isSUV ? 0.1 : 0.0);
    const seatRight = new THREE.Mesh(seatGeo, interiorMaterial);
    seatRight.position.set(0.4, isSUV ? 1.0 : 0.52, isSUV ? 0.1 : 0.0);
    carGroup.add(seatLeft, seatRight);

    if (isSUV) {
      // Urus 5-seat rear bench
      const rearBenchGeo = new THREE.BoxGeometry(1.4, 0.55, 0.45);
      const rearBench = new THREE.Mesh(rearBenchGeo, interiorMaterial);
      rearBench.position.set(0, 1.05, -0.75);
      carGroup.add(rearBench);
    }

    // 4. Front Splitter & Hexagonal Air Intakes
    const splitterGeo = new THREE.BoxGeometry(isSUV ? 1.95 : 1.9, 0.08, 0.6);
    const splitter = new THREE.Mesh(splitterGeo, carbonMaterial);
    splitter.position.set(0, isSUV ? 0.35 : 0.18, isSUV ? 2.3 : 2.2);
    splitter.castShadow = true;
    carGroup.add(splitter);

    // 5. Signature LED Headlights & Daytime Running Lights (Y-Shape / Hexagonal)
    const headlightGeo = new THREE.BoxGeometry(0.35, 0.08, 0.2);
    const headlightMat = new THREE.MeshBasicMaterial({
      color: headlightsOn ? 0xe0f2fe : 0x334155,
    });

    const leftLight = new THREE.Mesh(headlightGeo, headlightMat);
    leftLight.position.set(-0.75, isSUV ? 0.9 : 0.46, isSUV ? 2.2 : 2.05);
    leftLight.rotation.y = 0.25;

    const rightLight = new THREE.Mesh(headlightGeo, headlightMat);
    rightLight.position.set(0.75, isSUV ? 0.9 : 0.46, isSUV ? 2.2 : 2.05);
    rightLight.rotation.y = -0.25;

    carGroup.add(leftLight, rightLight);

    // Headlight Spotlights
    headlightLightsRef.current = [];
    if (headlightsOn) {
      const spotLeft = new THREE.SpotLight(0xa5f3fc, 8, 18, Math.PI / 6, 0.4, 1.5);
      spotLeft.position.set(-0.75, isSUV ? 0.9 : 0.46, isSUV ? 2.2 : 2.05);
      const targetLeft = new THREE.Object3D();
      targetLeft.position.set(-1.0, 0, 10);
      scene.add(targetLeft);
      spotLeft.target = targetLeft;
      carGroup.add(spotLeft);
      headlightLightsRef.current.push(spotLeft);

      const spotRight = new THREE.SpotLight(0xa5f3fc, 8, 18, Math.PI / 6, 0.4, 1.5);
      spotRight.position.set(0.75, isSUV ? 0.9 : 0.46, isSUV ? 2.2 : 2.05);
      const targetRight = new THREE.Object3D();
      targetRight.position.set(1.0, 0, 10);
      scene.add(targetRight);
      spotRight.target = targetRight;
      carGroup.add(spotRight);
      headlightLightsRef.current.push(spotRight);
    }

    // 6. Rear Tail Lights & Rear Hex Diffuser
    const tailLightGeo = new THREE.BoxGeometry(0.45, 0.06, 0.1);
    const tailLightMat = new THREE.MeshBasicMaterial({ color: 0xff002b });

    const leftTail = new THREE.Mesh(tailLightGeo, tailLightMat);
    leftTail.position.set(-0.65, isSUV ? 0.95 : 0.52, isSUV ? -2.35 : (isV12 ? -2.35 : -2.25));
    const rightTail = new THREE.Mesh(tailLightGeo, tailLightMat);
    rightTail.position.set(0.65, isSUV ? 0.95 : 0.52, isSUV ? -2.35 : (isV12 ? -2.35 : -2.25));
    carGroup.add(leftTail, rightTail);

    // Rear Aero Wing / Diffuser
    if (isV12 || car.id === 'temerario') {
      // High performance active rear wing / spoiler
      const wingGeo = new THREE.BoxGeometry(1.8, 0.05, 0.35);
      const wing = new THREE.Mesh(wingGeo, carbonMaterial);
      wing.position.set(0, isV12 ? 0.72 : 0.65, isV12 ? -2.2 : -2.15);
      carGroup.add(wing);

      // Wing support struts
      const strutGeo = new THREE.BoxGeometry(0.04, 0.2, 0.15);
      const strutL = new THREE.Mesh(strutGeo, carbonMaterial);
      strutL.position.set(-0.55, isV12 ? 0.62 : 0.55, isV12 ? -2.2 : -2.15);
      const strutR = new THREE.Mesh(strutGeo, carbonMaterial);
      strutR.position.set(0.55, isV12 ? 0.62 : 0.55, isV12 ? -2.2 : -2.15);
      carGroup.add(strutL, strutR);
    }

    // 7. Exhaust System & Flame Burst Emitters
    const exhaustMat = new THREE.MeshStandardMaterial({
      color: 0x222222,
      metalness: 0.95,
      roughness: 0.2
    });

    const createExhaustTip = (x: number, y: number, z: number, radius = 0.08) => {
      const tipGeo = new THREE.CylinderGeometry(radius, radius, 0.25, 16);
      tipGeo.rotateX(Math.PI / 2);
      const tip = new THREE.Mesh(tipGeo, exhaustMat);
      tip.position.set(x, y, z);
      carGroup.add(tip);

      // Flame burst cone for engine rev
      const flameGeo = new THREE.ConeGeometry(radius * 0.9, 0.5, 8);
      flameGeo.rotateX(-Math.PI / 2);
      const flameMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.9
      });
      const flameMesh = new THREE.Mesh(flameGeo, flameMat);
      flameMesh.position.set(x, y, z - 0.3);
      flameMesh.visible = false;
      carGroup.add(flameMesh);
      flameMeshesRef.current.push(flameMesh);
    };

    if (isSUV) {
      // Quad exhaust for Urus
      createExhaustTip(-0.65, 0.35, -2.4, 0.07);
      createExhaustTip(-0.5, 0.35, -2.4, 0.07);
      createExhaustTip(0.5, 0.35, -2.4, 0.07);
      createExhaustTip(0.65, 0.35, -2.4, 0.07);
    } else if (isV12) {
      // High-exit dual hexagonal titanium center exhaust for Revuelto
      createExhaustTip(-0.16, 0.68, -2.35, 0.09);
      createExhaustTip(0.16, 0.68, -2.35, 0.09);
    } else {
      // High-center dual hex exhaust for Temerario
      createExhaustTip(-0.14, 0.56, -2.28, 0.085);
      createExhaustTip(0.14, 0.56, -2.28, 0.085);
    }

    // 8. Four High Performance Wheels (Rims + Tires + Golden Carbon Ceramic Calipers)
    const wheelRadius = isSUV ? 0.44 : 0.36;
    const wheelWidth = isSUV ? 0.28 : 0.25;
    const wheelPositions = [
      { x: -(isSUV ? 0.98 : 0.95), y: isSUV ? 0.44 : 0.36, z: isSUV ? 1.45 : 1.35 }, // Front Left
      { x: (isSUV ? 0.98 : 0.95), y: isSUV ? 0.44 : 0.36, z: isSUV ? 1.45 : 1.35 },  // Front Right
      { x: -(isSUV ? 0.98 : 0.95), y: isSUV ? 0.44 : 0.36, z: isSUV ? -1.45 : -1.35 }, // Rear Left
      { x: (isSUV ? 0.98 : 0.95), y: isSUV ? 0.44 : 0.36, z: isSUV ? -1.45 : -1.35 },  // Rear Right
    ];

    wheelPositions.forEach((pos) => {
      const wheelAssembly = new THREE.Group();
      wheelAssembly.position.set(pos.x, pos.y, pos.z);

      // Rubber Tire
      const tireGeo = new THREE.CylinderGeometry(wheelRadius, wheelRadius, wheelWidth, 24);
      tireGeo.rotateZ(Math.PI / 2);
      const tire = new THREE.Mesh(tireGeo, tireMaterial);
      tire.castShadow = true;
      wheelAssembly.add(tire);

      // Alloy Rim Hub
      const rimGeo = new THREE.CylinderGeometry(wheelRadius * 0.78, wheelRadius * 0.78, wheelWidth + 0.02, 16);
      rimGeo.rotateZ(Math.PI / 2);
      const rim = new THREE.Mesh(rimGeo, wheelRimMaterial);
      wheelAssembly.add(rim);

      // Y-Spokes pattern
      for (let s = 0; s < 5; s++) {
        const spokeGeo = new THREE.BoxGeometry(0.04, wheelRadius * 1.3, wheelWidth + 0.03);
        const spoke = new THREE.Mesh(spokeGeo, wheelRimMaterial);
        spoke.rotation.x = (s * Math.PI) / 5;
        wheelAssembly.add(spoke);
      }

      // Carbon Ceramic Brake Disc & Gold Caliper
      const brakeDiscGeo = new THREE.CylinderGeometry(wheelRadius * 0.65, wheelRadius * 0.65, 0.03, 16);
      brakeDiscGeo.rotateZ(Math.PI / 2);
      const brakeMat = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.8, roughness: 0.4 });
      const brake = new THREE.Mesh(brakeDiscGeo, brakeMat);
      wheelAssembly.add(brake);

      const caliperGeo = new THREE.BoxGeometry(0.08, wheelRadius * 0.35, 0.15);
      const caliper = new THREE.Mesh(caliperGeo, goldBrakeMaterial);
      caliper.position.set(pos.x < 0 ? -0.05 : 0.05, wheelRadius * 0.25, 0);
      wheelAssembly.add(caliper);

      carGroup.add(wheelAssembly);
    });

    // 9. Side Carbon Skirts & Aerodynamic Mirrors
    const skirtGeo = new THREE.BoxGeometry(0.12, 0.08, isSUV ? 2.8 : 2.5);
    const skirtL = new THREE.Mesh(skirtGeo, carbonMaterial);
    skirtL.position.set(-(isSUV ? 1.05 : 1.02), isSUV ? 0.32 : 0.18, 0);
    const skirtR = new THREE.Mesh(skirtGeo, carbonMaterial);
    skirtR.position.set((isSUV ? 1.05 : 1.02), isSUV ? 0.32 : 0.18, 0);
    carGroup.add(skirtL, skirtR);

    // Carbon Mirrors
    const mirrorGeo = new THREE.BoxGeometry(0.22, 0.1, 0.14);
    const mirrorL = new THREE.Mesh(mirrorGeo, carbonMaterial);
    mirrorL.position.set(-1.05, isSUV ? 1.2 : 0.68, isSUV ? 0.8 : 0.65);
    const mirrorR = new THREE.Mesh(mirrorGeo, carbonMaterial);
    mirrorR.position.set(1.05, isSUV ? 1.2 : 0.68, isSUV ? 0.8 : 0.65);
    carGroup.add(mirrorL, mirrorR);

    scene.add(carGroup);
  };

  // Setup Three.js Scene, Camera, Lighting & Animation Loop
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    cameraRef.current = camera;
    updateCameraPosition();

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    // Clear old canvases
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Studio Environment Setup
    setupLightingAndEnvironment(scene, studioEnv);

    // Build Initial Car Model
    buildCarModel(selectedCar, scene);

    // Animation Loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Auto rotation
      if (isAutoRotating && !isDraggingRef.current && carGroupRef.current) {
        cameraSphericalRef.current.theta += 0.0045;
        updateCameraPosition();
      }

      // Render
      renderer.render(scene, camera);
    };

    animate();

    // Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newWidth, height: newHeight } = entry.contentRect;
        if (newWidth > 0 && newHeight > 0 && cameraRef.current && rendererRef.current) {
          cameraRef.current.aspect = newWidth / newHeight;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(newWidth, newHeight);
        }
      }
    });

    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      renderer.dispose();
    };
  }, []);

  // Update Environment Lighting when studioEnv changes
  const setupLightingAndEnvironment = (scene: THREE.Scene, env: StudioEnvironment) => {
    // Remove existing environment lights & floor
    const toRemove: THREE.Object3D[] = [];
    scene.traverse((obj) => {
      if (obj.name === 'env-object') {
        toRemove.push(obj);
      }
    });
    toRemove.forEach((obj) => scene.remove(obj));

    // Ambient Light
    const ambientColor = env === 'cyberpunk' ? 0x1e1b4b : (env === 'volcano' ? 0x431407 : 0x27272a);
    const ambientLight = new THREE.AmbientLight(ambientColor, env === 'spotlight' ? 0.8 : 1.8);
    ambientLight.name = 'env-object';
    scene.add(ambientLight);

    // Main Studio Key Light
    const keyLightColor = env === 'volcano' ? 0xff7700 : (env === 'cyberpunk' ? 0x38bdf8 : 0xffffff);
    const keyLight = new THREE.DirectionalLight(keyLightColor, 2.5);
    keyLight.position.set(6, 10, 8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.bias = -0.0001;
    keyLight.name = 'env-object';
    scene.add(keyLight);

    // Fill Light
    const fillLightColor = env === 'cyberpunk' ? 0xd946ef : (env === 'volcano' ? 0xef4444 : 0x94a3b8);
    const fillLight = new THREE.DirectionalLight(fillLightColor, 1.6);
    fillLight.position.set(-8, 6, -6);
    fillLight.name = 'env-object';
    scene.add(fillLight);

    // Rim Backlight for sharp supercar contours
    const rimLightColor = env === 'volcano' ? 0xf59e0b : 0xe0f2fe;
    const rimLight = new THREE.DirectionalLight(rimLightColor, 2.0);
    rimLight.position.set(0, 8, -10);
    rimLight.name = 'env-object';
    scene.add(rimLight);

    // Reflective Studio Showroom Floor
    const floorGeo = new THREE.PlaneGeometry(35, 35);
    const floorMat = new THREE.MeshStandardMaterial({
      color: env === 'spotlight' ? 0x050505 : (env === 'volcano' ? 0x110806 : 0x09090b),
      roughness: env === 'showroom' ? 0.1 : 0.35,
      metalness: 0.8,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = 0;
    floorMesh.receiveShadow = true;
    floorMesh.name = 'env-object';
    scene.add(floorMesh);

    // Studio Circular Spotlight Glow / Grid
    const circleGeo = new THREE.RingGeometry(0.1, 4.8, 64);
    const circleMat = new THREE.MeshBasicMaterial({
      color: env === 'volcano' ? 0xf97316 : (env === 'cyberpunk' ? 0x06b6d4 : 0xf59e0b),
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25,
    });
    const circleMesh = new THREE.Mesh(circleGeo, circleMat);
    circleMesh.rotation.x = -Math.PI / 2;
    circleMesh.position.y = 0.01;
    circleMesh.name = 'env-object';
    scene.add(circleMesh);
  };

  // Helper to recompute camera coords
  const updateCameraPosition = () => {
    if (!cameraRef.current) return;
    const { radius, theta, phi } = cameraSphericalRef.current;
    const x = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.cos(theta);

    cameraRef.current.position.set(x, y, z);
    cameraRef.current.lookAt(targetLookAt.current);
  };

  // Re-build model when car changes or rebuild materials when color changes
  useEffect(() => {
    if (sceneRef.current) {
      buildCarModel(selectedCar, sceneRef.current);
    }
  }, [selectedCar, headlightsOn, wireframeMode, paintFinish]);

  // Update Body Color dynamically in real-time
  useEffect(() => {
    if (carMaterialsRef.current.bodyMat) {
      carMaterialsRef.current.bodyMat.color.set(activeColor.hex);
      carMaterialsRef.current.bodyMat.needsUpdate = true;
    }
  }, [activeColor]);

  // Update Studio Environment
  useEffect(() => {
    if (sceneRef.current) {
      setupLightingAndEnvironment(sceneRef.current, studioEnv);
    }
  }, [studioEnv]);

  // Camera presets
  const handleCameraPreset = (preset: CameraView) => {
    setActiveCamPreset(preset);
    setIsAutoRotating(false);
    switch (preset) {
      case 'front-quarter':
        cameraSphericalRef.current = { radius: 8.0, theta: Math.PI / 4, phi: Math.PI / 3.2 };
        break;
      case 'side':
        cameraSphericalRef.current = { radius: 8.5, theta: Math.PI / 2, phi: Math.PI / 2.3 };
        break;
      case 'rear':
        cameraSphericalRef.current = { radius: 7.8, theta: Math.PI, phi: Math.PI / 3.0 };
        break;
      case 'top':
        cameraSphericalRef.current = { radius: 9.0, theta: Math.PI / 4, phi: 0.15 };
        break;
      case 'front':
        cameraSphericalRef.current = { radius: 7.5, theta: 0, phi: Math.PI / 2.4 };
        break;
    }
    updateCameraPosition();
  };

  // Mouse & Touch Orbit Controls handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - previousMousePosition.current.x;
    const deltaY = e.clientY - previousMousePosition.current.y;

    cameraSphericalRef.current.theta -= deltaX * 0.007;
    cameraSphericalRef.current.phi = Math.max(
      0.1,
      Math.min(Math.PI / 2.05, cameraSphericalRef.current.phi - deltaY * 0.007)
    );

    updateCameraPosition();
    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    cameraSphericalRef.current.radius = Math.max(
      4.5,
      Math.min(14.0, cameraSphericalRef.current.radius + e.deltaY * 0.005)
    );
    updateCameraPosition();
  };

  // Zoom Button controls
  const handleZoom = (delta: number) => {
    cameraSphericalRef.current.radius = Math.max(
      4.5,
      Math.min(14.0, cameraSphericalRef.current.radius + delta)
    );
    updateCameraPosition();
  };

  return (
    <div id="3d-car-studio" className="relative w-full rounded-2xl overflow-hidden bg-black/40 backdrop-blur-md border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.8)] mb-8">
      
      {/* Top Studio Controls Overlay */}
      <div className="absolute top-0 inset-x-0 z-20 px-4 py-3 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
        
        {/* Active Car Info Badge */}
        <div className="flex items-center space-x-3">
          <div className="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-orange-500 text-black shadow-[0_0_12px_rgba(249,115,22,0.4)]">
            {selectedCar.name}
          </div>
          <span className="text-xs text-gray-400 font-mono hidden sm:inline tracking-wider">
            360° VIRTUAL STUDIO • {selectedCar.engineSummary.type.toUpperCase()}
          </span>
        </div>

        {/* Studio Lighting & Mode Controls */}
        <div className="flex items-center space-x-2">
          {/* Engine Rev Sound Button */}
          <button
            onClick={handleRevEngine}
            disabled={isRevving}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono flex items-center space-x-1.5 transition-all shadow-md cursor-pointer ${
              isRevving
                ? 'bg-orange-500 text-black animate-pulse shadow-[0_0_15px_rgba(249,115,22,0.5)]'
                : 'bg-white/5 hover:bg-white/10 text-orange-400 border border-white/10 hover:border-orange-500/40'
            }`}
            title="Play high-fidelity simulated engine exhaust roar with flame burst"
          >
            <Flame className={`w-4 h-4 ${isRevving ? 'text-black' : 'text-orange-400'}`} />
            <span>{isRevving ? '10,000 RPM REV 🔥' : 'Rev Engine Note'}</span>
          </button>

          {/* Auto Rotate Toggle */}
          <button
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={`p-2 rounded-xl text-xs transition-colors border cursor-pointer ${
              isAutoRotating
                ? 'bg-orange-500/20 border-orange-500/50 text-orange-400'
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
            title={isAutoRotating ? 'Pause 360° Auto Orbit' : 'Enable 360° Auto Orbit'}
          >
            <RotateCw className={`w-4 h-4 ${isAutoRotating ? 'animate-spin text-orange-400' : ''}`} style={{ animationDuration: '8s' }} />
          </button>

          {/* Headlights Toggle */}
          <button
            onClick={() => setHeadlightsOn(!headlightsOn)}
            className={`p-2 rounded-xl text-xs transition-colors border cursor-pointer ${
              headlightsOn
                ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400'
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
            title="Toggle LED Headlights"
          >
            <Lightbulb className="w-4 h-4" />
          </button>

          {/* Wireframe Aero / X-Ray Mode */}
          <button
            onClick={() => setWireframeMode(!wireframeMode)}
            className={`p-2 rounded-xl text-xs transition-colors border cursor-pointer ${
              wireframeMode
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
            title="Toggle Aerodynamic Mesh & Wireframe X-Ray"
          >
            <Layers className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas Container */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        className="w-full h-[400px] sm:h-[480px] cursor-grab active:cursor-grabbing select-none"
      />

      {/* Bottom Floating Control Bar */}
      <div className="absolute bottom-3 inset-x-3 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
        
        {/* Quick Color Swatches for the active car */}
        <div className="flex items-center space-x-1.5 p-1.5 rounded-xl bg-black/60 backdrop-blur-xl border border-white/10">
          <span className="text-[10px] font-mono text-gray-400 px-1 uppercase hidden md:inline">Palette:</span>
          {selectedCar.featuredColors.slice(0, 7).map((color) => (
            <button
              key={color.name}
              onClick={() => onColorChange(color)}
              className={`relative w-6 h-6 rounded-full transition-transform border cursor-pointer ${
                activeColor.name === color.name
                  ? 'scale-125 border-white ring-2 ring-orange-500 shadow-lg'
                  : 'border-white/20 hover:scale-110 opacity-75 hover:opacity-100'
              }`}
              style={{ backgroundColor: color.hex }}
              title={`${color.name} (${color.category} ${color.finish})`}
            />
          ))}
          <span className="text-[11px] font-mono text-orange-400 px-2 font-medium">
            {activeColor.name}
          </span>
        </div>

        {/* Camera Views Preset Pills */}
        <div className="flex items-center space-x-1 p-1 rounded-xl bg-black/60 backdrop-blur-xl border border-white/10">
          {(['front-quarter', 'side', 'rear', 'top'] as CameraView[]).map((view) => (
            <button
              key={view}
              onClick={() => handleCameraPreset(view)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono capitalize transition-all cursor-pointer ${
                activeCamPreset === view
                  ? 'bg-orange-500 text-black font-bold shadow'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {view.replace('-', ' ')}
            </button>
          ))}

          {/* Zoom Buttons */}
          <div className="flex items-center pl-1 border-l border-white/10 space-x-1">
            <button
              onClick={() => handleZoom(-1.0)}
              className="p-1 rounded text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleZoom(1.0)}
              className="p-1 rounded text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Studio Theme Switcher */}
        <div className="flex items-center space-x-1 p-1 rounded-xl bg-black/60 backdrop-blur-xl border border-white/10">
          <span className="text-[10px] font-mono text-gray-400 px-1 uppercase hidden lg:inline">Atmosphere:</span>
          {(['showroom', 'volcano', 'cyberpunk', 'spotlight'] as StudioEnvironment[]).map((env) => (
            <button
              key={env}
              onClick={() => setStudioEnv(env)}
              className={`px-2 py-1 rounded-lg text-[10px] font-mono uppercase transition-colors cursor-pointer ${
                studioEnv === env
                  ? 'bg-white/10 text-orange-400 font-bold border border-orange-500/40'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {env}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Helper Text */}
      <div className="absolute left-3 top-14 pointer-events-none text-[10px] font-mono text-gray-400 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
        🖱️ Click & Drag to Orbit • Scroll to Zoom
      </div>
    </div>
  );
};
