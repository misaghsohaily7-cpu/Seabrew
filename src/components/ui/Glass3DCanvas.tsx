import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { getReducedMotionPreference } from '../../lib/motion';

interface Glass3DCanvasProps {
  progress: number; // 0 to 1
  isPouring?: boolean;
  className?: string;
}

export const Glass3DCanvas: React.FC<Glass3DCanvasProps> = ({
  progress,
  isPouring = false,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isPouringRef = useRef(isPouring);
  isPouringRef.current = isPouring;

  const sceneRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    glassGroup: THREE.Group;
    liquidGroup: THREE.Group;
    liquidMesh: THREE.Mesh;
    liquidSurfaceMesh: THREE.Mesh;
    liquidMaterial: THREE.MeshPhysicalMaterial;
    surfaceMaterial: THREE.MeshPhysicalMaterial;
    bubbleRing: THREE.Mesh;
    iceCubes: {
      mesh: THREE.Mesh;
      baseOffset: THREE.Vector3;
      rotationVelocity: THREE.Vector3;
      buoyancyDepth: number;
    }[];
    strawberry: {
      group: THREE.Group;
      baseOffset: THREE.Vector3;
      rotationVelocity: THREE.Vector3;
    };
    beans: {
      mesh: THREE.Mesh;
      baseOffset: THREE.Vector3;
      orbitSpeed: number;
      orbitRadius: number;
      orbitAngle: number;
    }[];
    condensationDroplets: {
      mesh: THREE.Mesh;
      yPos: number;
      baseScale: THREE.Vector3;
    }[];
    pourStream: THREE.Mesh;
    dustPoints: THREE.Points;
    dustPos: Float32Array;
    dustSpeeds: Float32Array;
    dustPhases: Float32Array;
    targetProgress: number;
    currentProgress: number;
    clock: THREE.Clock;
    disposed: boolean;
  } | null>(null);

  // Initialize Three.js scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 380;
    const height = container.clientHeight || 480;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 1.25, 5.3);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // --- 1. PROCEDURAL STUDIO ENVIRONMENT MAP ---
    const envCanvas = document.createElement('canvas');
    envCanvas.width = 512;
    envCanvas.height = 256;
    const envCtx = envCanvas.getContext('2d');
    let envMap: THREE.Texture | null = null;
    if (envCtx) {
      const grad = envCtx.createLinearGradient(0, 0, 0, 256);
      grad.addColorStop(0, '#fffade');
      grad.addColorStop(0.35, '#f5deb3');
      grad.addColorStop(0.65, '#a78040');
      grad.addColorStop(1, '#1e140d');
      envCtx.fillStyle = grad;
      envCtx.fillRect(0, 0, 512, 256);

      // Studio key softbox
      envCtx.fillStyle = '#ffffff';
      envCtx.shadowColor = '#fdb716';
      envCtx.shadowBlur = 30;
      envCtx.fillRect(110, 30, 95, 110);

      // Studio rim softbox
      envCtx.fillStyle = '#fffade';
      envCtx.shadowColor = '#ffffff';
      envCtx.shadowBlur = 20;
      envCtx.fillRect(360, 50, 45, 120);

      // Sun flare spot
      envCtx.beginPath();
      envCtx.arc(256, 65, 38, 0, Math.PI * 2);
      envCtx.fillStyle = '#fdb716';
      envCtx.fill();

      const texture = new THREE.CanvasTexture(envCanvas);
      texture.mapping = THREE.EquirectangularReflectionMapping;
      const pmremGen = new THREE.PMREMGenerator(renderer);
      pmremGen.compileEquirectangularShader();
      envMap = pmremGen.fromEquirectangular(texture).texture;
      scene.environment = envMap;
      pmremGen.dispose();
      texture.dispose();
    }

    // Main tumbler group
    const glassGroup = new THREE.Group();
    scene.add(glassGroup);

    // --- 2. LIGHTING RIG ---
    const ambientLight = new THREE.AmbientLight(0xfff8eb, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(3, 5, 4);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xfdb716, 3.4);
    rimLight.position.set(-3, 3, -3.5);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0xe8d0b5, 1.6);
    fillLight.position.set(-3.5, 0.8, 2.5);
    scene.add(fillLight);

    // --- 3. GLASS PROFILE & INNER GEOMETRY DEFINITION ---
    // Mathematically exact glass profile:
    const BASE_Y = -1.32;
    const INNER_BOTTOM_Y = -1.04;
    const TOP_RIM_Y = 1.42;

    // Mathematical profile function giving the exact inside wall radius at any height y
    const getInnerRadiusAt = (y: number): number => {
      if (y <= INNER_BOTTOM_Y) return 0.72;
      if (y <= -0.98) {
        const t = (y - INNER_BOTTOM_Y) / (-0.98 - INNER_BOTTOM_Y);
        return 0.72 + t * (0.77 - 0.72);
      }
      if (y <= 0.4) {
        const t = (y - (-0.98)) / (0.4 - (-0.98));
        return 0.77 + t * (0.89 - 0.77);
      }
      if (y <= TOP_RIM_Y) {
        const t = (y - 0.4) / (TOP_RIM_Y - 0.4);
        return 0.89 + t * (0.965 - 0.89);
      }
      return 0.965;
    };

    // Construct Outer & Inner Glass Lathe
    const glassPoints: THREE.Vector2[] = [];
    glassPoints.push(new THREE.Vector2(0.0, BASE_Y));
    glassPoints.push(new THREE.Vector2(0.74, BASE_Y));
    glassPoints.push(new THREE.Vector2(0.79, BASE_Y + 0.08));
    glassPoints.push(new THREE.Vector2(0.83, INNER_BOTTOM_Y));
    glassPoints.push(new THREE.Vector2(0.96, 0.4));
    glassPoints.push(new THREE.Vector2(1.04, TOP_RIM_Y));
    // Soft beveled lip curve
    glassPoints.push(new THREE.Vector2(1.065, TOP_RIM_Y + 0.025));
    glassPoints.push(new THREE.Vector2(1.045, TOP_RIM_Y + 0.04));
    glassPoints.push(new THREE.Vector2(0.985, TOP_RIM_Y + 0.02));
    glassPoints.push(new THREE.Vector2(0.965, TOP_RIM_Y));
    // Inner wall down to inner base
    glassPoints.push(new THREE.Vector2(0.89, 0.4));
    glassPoints.push(new THREE.Vector2(0.77, -0.98));
    glassPoints.push(new THREE.Vector2(0.72, INNER_BOTTOM_Y));
    glassPoints.push(new THREE.Vector2(0.0, INNER_BOTTOM_Y));

    const glassGeometry = new THREE.LatheGeometry(glassPoints, 72);
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.96,
      opacity: 1,
      transparent: true,
      roughness: 0.025,
      ior: 1.52, // Optical flint glass
      thickness: 1.2,
      specularIntensity: 1.0,
      specularColor: new THREE.Color(0xfff9ed),
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      depthWrite: false,
    });

    const glassMesh = new THREE.Mesh(glassGeometry, glassMaterial);
    glassMesh.renderOrder = 4;
    glassGroup.add(glassMesh);

    // Thick crystal base punt band
    const baseRingGeo = new THREE.CylinderGeometry(0.78, 0.75, 0.24, 40);
    const baseRingMat = new THREE.MeshPhysicalMaterial({
      color: 0xfffcf0,
      transmission: 0.92,
      roughness: 0.05,
      ior: 1.51,
      transparent: true,
      opacity: 0.88,
      thickness: 0.8,
      depthWrite: false,
    });
    const baseRing = new THREE.Mesh(baseRingGeo, baseRingMat);
    baseRing.position.y = BASE_Y + 0.12;
    baseRing.renderOrder = 4;
    glassGroup.add(baseRing);

    // --- 4. CONDENSATION DEW DROPLETS (Dynamically chilled by cold brew) ---
    const condensationGroup = new THREE.Group();
    condensationGroup.renderOrder = 3;
    const dropletGeo = new THREE.SphereGeometry(1, 10, 8);
    dropletGeo.scale(1, 1.3, 0.65);
    const dropletMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.96,
      roughness: 0.03,
      ior: 1.33,
      transparent: true,
      opacity: 0.85,
      clearcoat: 1.0,
      depthWrite: false,
    });

    const condensationDroplets: {
      mesh: THREE.Mesh;
      yPos: number;
      baseScale: THREE.Vector3;
    }[] = [];

    // Distribute 42 droplets on outer lower glass surface
    for (let i = 0; i < 42; i++) {
      const droplet = new THREE.Mesh(dropletGeo, dropletMat);
      const angle = (i / 42) * Math.PI * 2 + Math.sin(i * 3.7) * 0.3;
      const yNorm = (i % 7) / 7;
      const y = INNER_BOTTOM_Y + 0.08 + yNorm * 1.6;
      const t = (y - BASE_Y) / (TOP_RIM_Y - BASE_Y);
      const r = 0.81 + t * 0.22;

      droplet.position.set(Math.cos(angle) * r, y, Math.sin(angle) * r);
      droplet.rotation.y = angle + Math.PI / 2;
      const s = 0.02 + (Math.sin(i * 5.1) * 0.5 + 0.5) * 0.022;
      const baseScale = new THREE.Vector3(s, s * (1 + (i % 3) * 0.25), s * 0.8);
      droplet.scale.set(0, 0, 0); // Initially dormant until chilled

      condensationDroplets.push({ mesh: droplet, yPos: y, baseScale });
      condensationGroup.add(droplet);
    }
    glassGroup.add(condensationGroup);

    // --- 5. CONTACT SHADOW & CAUSTIC POOL ---
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext('2d');
    if (sCtx) {
      const sGrad = sCtx.createRadialGradient(128, 128, 10, 128, 128, 120);
      sGrad.addColorStop(0, 'rgba(22, 22, 23, 0.7)');
      sGrad.addColorStop(0.35, 'rgba(130, 95, 39, 0.35)');
      sGrad.addColorStop(0.65, 'rgba(253, 183, 22, 0.15)');
      sGrad.addColorStop(1, 'rgba(255, 250, 222, 0)');
      sCtx.fillStyle = sGrad;
      sCtx.fillRect(0, 0, 256, 256);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowPlaneGeo = new THREE.PlaneGeometry(3.6, 3.6);
    const shadowPlaneMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    });
    const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = BASE_Y - 0.01;
    shadowPlane.renderOrder = 0;
    scene.add(shadowPlane);

    // --- 6. UNIFIED VOLUMETRIC LIQUID SYSTEM ---
    // The liquid and glass are modeled as one integrated physical system.
    // Liquid body height goes from INNER_BOTTOM_Y up to fill height.
    // We create a dedicated group for fluid contents that handles sloshing and buoyancy.
    const liquidGroup = new THREE.Group();
    glassGroup.add(liquidGroup);

    // Segmented parametric cylinder for liquid body that conforms dynamically to glass wall
    const LIQUID_SEGMENTS_Y = 24;
    const LIQUID_SEGMENTS_R = 48;
    const liquidGeo = new THREE.CylinderGeometry(
      0.8,
      0.71,
      1,
      LIQUID_SEGMENTS_R,
      LIQUID_SEGMENTS_Y,
      false
    );

    const liquidMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x3d1d07,
      roughness: 0.04,
      transmission: 0.84,
      ior: 1.34, // Water/Cold Brew optical refraction
      thickness: 1.4,
      transparent: true,
      opacity: 0.96,
      attenuationColor: new THREE.Color(0xf59e0b), // Amber absorption
      attenuationDistance: 0.55,
      depthWrite: true,
    });

    const liquidMesh = new THREE.Mesh(liquidGeo, liquidMaterial);
    liquidMesh.renderOrder = 1;
    liquidGroup.add(liquidMesh);

    // Liquid surface disk (meniscus cap)
    const surfaceGeo = new THREE.CircleGeometry(0.8, LIQUID_SEGMENTS_R);
    surfaceGeo.rotateX(-Math.PI / 2);
    const surfaceMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xd97706,
      roughness: 0.04,
      transmission: 0.6,
      ior: 1.33,
      transparent: true,
      opacity: 0.95,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      depthWrite: false,
    });
    const liquidSurfaceMesh = new THREE.Mesh(surfaceGeo, surfaceMaterial);
    liquidSurfaceMesh.renderOrder = 2;
    liquidGroup.add(liquidSurfaceMesh);

    // Crema / micro-effervescence ring at meniscus wall
    const bubbleRingGeo = new THREE.TorusGeometry(0.8, 0.014, 8, 48);
    bubbleRingGeo.rotateX(Math.PI / 2);
    const bubbleRingMat = new THREE.MeshStandardMaterial({
      color: 0xfde047,
      roughness: 0.2,
      transparent: true,
      opacity: 0.55,
    });
    const bubbleRing = new THREE.Mesh(bubbleRingGeo, bubbleRingMat);
    liquidSurfaceMesh.add(bubbleRing);

    // --- 7. NATURAL ICE CUBES WITH PHYSICAL BUOYANCY ---
    const iceMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xf2faff,
      transmission: 0.94,
      roughness: 0.05,
      ior: 1.31,
      thickness: 0.75,
      transparent: true,
      opacity: 0.88,
      clearcoat: 0.9,
      depthWrite: true,
    });

    const createIceCube = (size: [number, number, number]) => {
      const geo = new THREE.BoxGeometry(...size, 3, 3, 3);
      const pos = geo.attributes.position;
      const v = new THREE.Vector3();
      for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i);
        v.normalize().multiplyScalar(Math.min(size[0], size[1], size[2]) * 0.08);
        pos.setXYZ(i, pos.getX(i) * 0.92 + v.x, pos.getY(i) * 0.92 + v.y, pos.getZ(i) * 0.92 + v.z);
      }
      geo.computeVertexNormals();

      const iceMesh = new THREE.Mesh(geo, iceMaterial);
      iceMesh.renderOrder = 2;

      // Natural frosted core
      const coreGeo = new THREE.SphereGeometry(size[0] * 0.25, 8, 8);
      const coreMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.25,
      });
      const core = new THREE.Mesh(coreGeo, coreMat);
      iceMesh.add(core);

      return iceMesh;
    };

    const ice1 = createIceCube([0.48, 0.44, 0.46]);
    const ice2 = createIceCube([0.44, 0.4, 0.42]);
    const ice3 = createIceCube([0.42, 0.38, 0.4]);

    glassGroup.add(ice1);
    glassGroup.add(ice2);
    glassGroup.add(ice3);

    const iceCubes = [
      {
        mesh: ice1,
        baseOffset: new THREE.Vector3(-0.22, 0, 0.08),
        rotationVelocity: new THREE.Vector3(0.003, 0.004, 0.002),
        buoyancyDepth: 0.22,
      },
      {
        mesh: ice2,
        baseOffset: new THREE.Vector3(0.24, 0, -0.14),
        rotationVelocity: new THREE.Vector3(-0.002, 0.003, 0.003),
        buoyancyDepth: 0.34,
      },
      {
        mesh: ice3,
        baseOffset: new THREE.Vector3(-0.04, 0, 0.18),
        rotationVelocity: new THREE.Vector3(0.004, -0.002, 0.004),
        buoyancyDepth: 0.14,
      },
    ];

    // --- 8. FRESH STRAWBERRY SLICE ---
    const strawberryGroup = new THREE.Group();
    strawberryGroup.renderOrder = 2;
    const strawShape = new THREE.Shape();
    strawShape.moveTo(0, -0.28);
    strawShape.bezierCurveTo(0.26, -0.28, 0.35, 0.08, 0, 0.35);
    strawShape.bezierCurveTo(-0.35, 0.08, -0.26, -0.28, 0, -0.28);

    const strawGeo = new THREE.ExtrudeGeometry(strawShape, {
      depth: 0.06,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.02,
      bevelThickness: 0.02,
    });
    const strawMat = new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      roughness: 0.3,
      metalness: 0.05,
    });
    const strawMesh = new THREE.Mesh(strawGeo, strawMat);
    strawMesh.scale.set(0.82, 0.82, 0.82);
    strawberryGroup.add(strawMesh);
    glassGroup.add(strawberryGroup);

    const strawberry = {
      group: strawberryGroup,
      baseOffset: new THREE.Vector3(0.18, 0, 0.2),
      rotationVelocity: new THREE.Vector3(0.002, 0.003, 0.004),
    };

    // --- 9. ROASTED COFFEE BEANS SWIRL ---
    const createBean = () => {
      const beanGeo = new THREE.SphereGeometry(0.11, 16, 12);
      beanGeo.scale(1, 1.4, 0.7);
      const beanMat = new THREE.MeshStandardMaterial({
        color: 0x22130c,
        roughness: 0.35,
        metalness: 0.1,
      });
      const bMesh = new THREE.Mesh(beanGeo, beanMat);
      bMesh.renderOrder = 2;
      return bMesh;
    };

    const bean1 = createBean();
    const bean2 = createBean();
    glassGroup.add(bean1);
    glassGroup.add(bean2);

    const beans = [
      {
        mesh: bean1,
        baseOffset: new THREE.Vector3(0, 0, 0),
        orbitSpeed: 0.012,
        orbitRadius: 0.32,
        orbitAngle: 0.4,
      },
      {
        mesh: bean2,
        baseOffset: new THREE.Vector3(0, 0, 0),
        orbitSpeed: 0.009,
        orbitRadius: 0.28,
        orbitAngle: 3.4,
      },
    ];

    // --- 10. POUR STREAM ---
    const pourGeo = new THREE.CylinderGeometry(0.035, 0.055, 2.5, 16);
    const pourMat = new THREE.MeshPhysicalMaterial({
      color: 0x9c6527,
      transmission: 0.85,
      roughness: 0.08,
      transparent: true,
      opacity: 0,
      emissive: 0x5a330e,
      attenuationColor: new THREE.Color(0xf59e0b),
      attenuationDistance: 0.5,
    });
    const pourStream = new THREE.Mesh(pourGeo, pourMat);
    pourStream.position.set(0, 2.4, 0);
    glassGroup.add(pourStream);

    // --- 11. GOLDEN SUNBEAM DUST PARTICLES ---
    const dustCount = 80;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    const dustSpeeds = new Float32Array(dustCount);
    const dustPhases = new Float32Array(dustCount);

    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 4.2;
      dustPos[i * 3 + 1] = -1.6 + Math.random() * 3.8;
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 3.6;
      dustSpeeds[i] = 0.15 + Math.random() * 0.35;
      dustPhases[i] = Math.random() * Math.PI * 2;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));

    const pCanvas = document.createElement('canvas');
    pCanvas.width = 32;
    pCanvas.height = 32;
    const pCtx = pCanvas.getContext('2d');
    if (pCtx) {
      const pGrad = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
      pGrad.addColorStop(0, 'rgba(253, 183, 22, 1)');
      pGrad.addColorStop(0.35, 'rgba(253, 183, 22, 0.7)');
      pGrad.addColorStop(1, 'rgba(253, 183, 22, 0)');
      pCtx.fillStyle = pGrad;
      pCtx.fillRect(0, 0, 32, 32);
    }
    const pTexture = new THREE.CanvasTexture(pCanvas);
    const dustMat = new THREE.PointsMaterial({
      size: 0.08,
      map: pTexture,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const dustPoints = new THREE.Points(dustGeo, dustMat);
    scene.add(dustPoints);

    // --- 12. POINTER & INTERACTION RIG ---
    const mouseTarget = { x: 0, y: 0 };
    const mouseCurrent = { x: 0, y: 0 };
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragRotY = 0;
    let dragRotX = 0;
    let targetDragRotY = 0;
    let targetDragRotX = 0;

    const handlePointerDown = (e: PointerEvent) => {
      isDragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      try {
        container.setPointerCapture(e.pointerId);
      } catch {
        // Safe capture
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseTarget.x = Math.max(-1, Math.min(1, x));
      mouseTarget.y = Math.max(-1, Math.min(1, y));

      if (isDragging) {
        const deltaX = e.clientX - dragStartX;
        const deltaY = e.clientY - dragStartY;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        targetDragRotY += (deltaX / rect.width) * 3.5;
        targetDragRotX += (deltaY / rect.height) * 2.2;
        // Clamp so glass never inverts unnaturally
        targetDragRotX = Math.max(-0.35, Math.min(0.35, targetDragRotX));
        targetDragRotY = Math.max(-1.4, Math.min(1.4, targetDragRotY));
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      isDragging = false;
      try {
        container.releasePointerCapture(e.pointerId);
      } catch {
        // Safe release
      }
    };

    const handlePointerLeave = () => {
      mouseTarget.x = 0;
      mouseTarget.y = 0;
      isDragging = false;
    };

    container.addEventListener('pointerdown', handlePointerDown);
    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerup', handlePointerUp);
    container.addEventListener('pointercancel', handlePointerUp);
    container.addEventListener('pointerleave', handlePointerLeave);

    const clock = new THREE.Clock();
    sceneRef.current = {
      renderer,
      scene,
      camera,
      glassGroup,
      liquidGroup,
      liquidMesh,
      liquidSurfaceMesh,
      liquidMaterial,
      surfaceMaterial,
      bubbleRing,
      iceCubes,
      strawberry,
      beans,
      condensationDroplets,
      pourStream,
      dustPoints,
      dustPos,
      dustSpeeds,
      dustPhases,
      targetProgress: progress,
      currentProgress: progress,
      clock,
      disposed: false,
    };

    // --- 13. FLUID SLOSH & BUOYANCY PHYSICS SIMULATION ---
    // Fluid slosh harmonic spring state
    let sloshX = 0;
    let sloshZ = 0;
    let sloshVelX = 0;
    let sloshVelZ = 0;
    let prevGlassRotX = 0;
    let prevGlassRotZ = 0;

    let frameId: number;

    const animate = () => {
      frameId = requestAnimationFrame(animate);

      const state = sceneRef.current;
      if (!state || state.disposed) return;

      const delta = Math.min(state.clock.getDelta(), 0.05);
      const elapsedTime = state.clock.getElapsedTime();
      const isReduced = getReducedMotionPreference();

      // Smooth damp current progress to targetProgress
      state.currentProgress += (state.targetProgress - state.currentProgress) * 0.08;
      const p = Math.max(0.06, Math.min(0.96, state.currentProgress));

      // Smooth mouse lerp
      if (!isReduced) {
        mouseCurrent.x += (mouseTarget.x - mouseCurrent.x) * 0.05;
        mouseCurrent.y += (mouseTarget.y - mouseCurrent.y) * 0.05;
      } else {
        mouseCurrent.x = 0;
        mouseCurrent.y = 0;
      }

      // Smooth drag dampening and gentle auto-recenter when user releases
      dragRotY += (targetDragRotY - dragRotY) * 0.12;
      dragRotX += (targetDragRotX - dragRotX) * 0.12;
      if (!isDragging) {
        targetDragRotY *= 0.94; // Spring back to center
        targetDragRotX *= 0.94;
      }

      // 3D Glass rotation
      const scrollRotY = isReduced ? 0.2 : (p - 0.2) * 1.8;
      const scrollRotX = isReduced ? 0.02 : Math.sin(p * Math.PI) * 0.12;

      state.glassGroup.rotation.y = scrollRotY + dragRotY + mouseCurrent.x * 0.22;
      state.glassGroup.rotation.x = scrollRotX + dragRotX - mouseCurrent.y * 0.15;
      state.glassGroup.rotation.z = isReduced ? 0 : Math.sin(elapsedTime * 1.2) * 0.01;

      // Compute angular velocities for fluid inertia
      const currentGlassRotX = state.glassGroup.rotation.x;
      const currentGlassRotZ = state.glassGroup.rotation.z;
      const glassAngVelX = (currentGlassRotX - prevGlassRotX) / Math.max(delta, 0.001);
      const glassAngVelZ = (currentGlassRotZ - prevGlassRotZ) / Math.max(delta, 0.001);
      prevGlassRotX = currentGlassRotX;
      prevGlassRotZ = currentGlassRotZ;

      // Harmonic fluid slosh oscillator
      if (!isReduced) {
        const spring = 28;
        const damping = 3.6;
        const accelX = -glassAngVelX * 0.035 - spring * sloshX - damping * sloshVelX;
        const accelZ = -glassAngVelZ * 0.035 - spring * sloshZ - damping * sloshVelZ;
        sloshVelX += accelX * delta;
        sloshVelZ += accelZ * delta;
        sloshX += sloshVelX * delta;
        sloshZ += sloshVelZ * delta;
      } else {
        sloshX = 0;
        sloshZ = 0;
      }

      // --- EXACT VOLUMETRIC FLUID FORMATION ---
      // Max fill height is 1.18 (leaving room for ice & garnish at lip)
      const maxFillY = 1.18;
      const fillHeight = INNER_BOTTOM_Y + 0.02 + p * (maxFillY - INNER_BOTTOM_Y);
      const currentTopRadius = getInnerRadiusAt(fillHeight) - 0.003;
      const currentBottomRadius = getInnerRadiusAt(INNER_BOTTOM_Y + 0.02) - 0.003;

      // Re-form liquid body geometry to perfectly hug the glass interior walls
      const liquidTotalH = fillHeight - (INNER_BOTTOM_Y + 0.01);
      const posAttr = state.liquidMesh.geometry.attributes.position as THREE.BufferAttribute;
      const vPos = posAttr.array as Float32Array;

      // Update cylinder vertices so each horizontal slice matches getInnerRadiusAt(sliceY)
      let ptr = 0;
      for (let yIdx = 0; yIdx <= LIQUID_SEGMENTS_Y; yIdx++) {
        const vRatio = yIdx / LIQUID_SEGMENTS_Y;
        const sliceY = INNER_BOTTOM_Y + 0.01 + vRatio * liquidTotalH;
        const sliceRadius = getInnerRadiusAt(sliceY) - 0.003;

        for (let rIdx = 0; rIdx <= LIQUID_SEGMENTS_R; rIdx++) {
          const uAngle = (rIdx / LIQUID_SEGMENTS_R) * Math.PI * 2;
          vPos[ptr++] = Math.sin(uAngle) * sliceRadius;
          vPos[ptr++] = sliceY;
          vPos[ptr++] = Math.cos(uAngle) * sliceRadius;
        }
      }
      posAttr.needsUpdate = true;
      state.liquidMesh.geometry.computeVertexNormals();

      // Position and align liquid top meniscus surface
      state.liquidSurfaceMesh.position.y = fillHeight;
      state.liquidSurfaceMesh.scale.set(currentTopRadius, currentTopRadius, currentTopRadius);

      // Natural sloshing wave: surface tilts in counter-direction to glass tilt + slosh momentum
      const waveFreq = isPouringRef.current ? 4.5 : 2.2;
      const microWave = isReduced ? 0 : Math.sin(elapsedTime * waveFreq) * (isPouringRef.current ? 0.03 : 0.012);
      state.liquidSurfaceMesh.rotation.z = -currentGlassRotZ * 0.8 + sloshZ + microWave;
      state.liquidSurfaceMesh.rotation.x = -currentGlassRotX * 0.8 + sloshX + microWave * 0.7;

      // Liquid color deepens with level
      if (p < 0.3) {
        state.liquidMaterial.color.setHex(0x5a2d0b);
        state.surfaceMaterial.color.setHex(0xbc6a25);
      } else if (p < 0.7) {
        state.liquidMaterial.color.setHex(0x381907);
        state.surfaceMaterial.color.setHex(0xd97706);
      } else {
        state.liquidMaterial.color.setHex(0x241004);
        state.surfaceMaterial.color.setHex(0xb45309);
      }

      // --- CONDENSATION DROPLETS CHILL EFFECT ---
      // Droplets only form where chilled by cold brew (below fill height)
      for (const d of state.condensationDroplets) {
        if (d.yPos <= fillHeight + 0.05) {
          const chillT = Math.min(1, Math.max(0, (fillHeight + 0.05 - d.yPos) * 2.5));
          d.mesh.scale.lerp(d.baseScale.clone().multiplyScalar(chillT), 0.08);
        } else {
          d.mesh.scale.set(0, 0, 0);
        }
      }

      // --- PHYSICAL ICE BUOYANCY ---
      // Ice floats on the sloshing surface when liquid is high enough; otherwise rests on bottom
      for (let i = 0; i < state.iceCubes.length; i++) {
        const ice = state.iceCubes[i];
        const restY = INNER_BOTTOM_Y + 0.22 + i * 0.16;
        // Local fluid height at ice cube position
        const localSurfaceY =
          fillHeight +
          state.liquidSurfaceMesh.rotation.x * ice.baseOffset.z -
          state.liquidSurfaceMesh.rotation.z * ice.baseOffset.x;

        const floatY = localSurfaceY - ice.buoyancyDepth;
        const targetY = Math.max(restY, floatY);

        ice.mesh.position.x = ice.baseOffset.x + Math.sin(elapsedTime * 1.4 + i) * 0.015;
        ice.mesh.position.z = ice.baseOffset.z + Math.cos(elapsedTime * 1.2 + i) * 0.015;
        ice.mesh.position.y += (targetY - ice.mesh.position.y) * 0.1;

        if (!isReduced) {
          ice.mesh.rotation.x += ice.rotationVelocity.x;
          ice.mesh.rotation.y += ice.rotationVelocity.y;
          ice.mesh.rotation.z += ice.rotationVelocity.z;
        }
      }

      // --- STRAWBERRY BUOYANCY & TILT ---
      const strawRestY = INNER_BOTTOM_Y + 0.28;
      const strawSurfaceY =
        fillHeight +
        state.liquidSurfaceMesh.rotation.x * state.strawberry.baseOffset.z -
        state.liquidSurfaceMesh.rotation.z * state.strawberry.baseOffset.x;
      const strawTargetY = Math.max(strawRestY, strawSurfaceY - 0.24);
      state.strawberry.group.position.y += (strawTargetY - state.strawberry.group.position.y) * 0.08;
      state.strawberry.group.position.x = state.strawberry.baseOffset.x + Math.sin(elapsedTime * 1.5) * 0.01;
      state.strawberry.group.position.z = state.strawberry.baseOffset.z + Math.cos(elapsedTime * 1.3) * 0.01;
      if (!isReduced) {
        state.strawberry.group.rotation.z = 0.5 + Math.sin(elapsedTime * 1.6) * 0.04;
      }

      // --- COFFEE BEANS VORTEX ---
      for (const bean of state.beans) {
        bean.orbitAngle += bean.orbitSpeed;
        const bX = Math.cos(bean.orbitAngle) * bean.orbitRadius;
        const bZ = Math.sin(bean.orbitAngle) * bean.orbitRadius;
        const bRestY = INNER_BOTTOM_Y + 0.35;
        const bTargetY = Math.max(bRestY, fillHeight - 0.45);

        bean.mesh.position.x = bX;
        bean.mesh.position.z = bZ;
        bean.mesh.position.y += (bTargetY - bean.mesh.position.y) * 0.06;
        if (!isReduced) {
          bean.mesh.rotation.y += 0.01;
        }
      }

      // --- POUR STREAM VISIBILITY & CONTACT ---
      if (isPouringRef.current) {
        state.pourStream.visible = true;
        (state.pourStream.material as THREE.MeshPhysicalMaterial).opacity = 0.88;
        state.pourStream.position.y = fillHeight + 1.25;
      } else {
        const mat = state.pourStream.material as THREE.MeshPhysicalMaterial;
        mat.opacity *= 0.85;
        if (mat.opacity < 0.02) {
          state.pourStream.visible = false;
        }
      }

      // --- DUST PARTICLES DRIFT ---
      if (!isReduced) {
        const dPosAttr = state.dustPoints.geometry.attributes.position as THREE.BufferAttribute;
        const positions = state.dustPos;
        for (let i = 0; i < dustCount; i++) {
          state.dustPhases[i] += state.dustSpeeds[i] * 0.02;
          positions[i * 3 + 1] += state.dustSpeeds[i] * 0.004;
          positions[i * 3] += Math.sin(state.dustPhases[i]) * 0.002;
          positions[i * 3 + 2] += Math.cos(state.dustPhases[i] * 0.8) * 0.002;

          if (positions[i * 3 + 1] > 2.5) {
            positions[i * 3 + 1] = -1.6;
            positions[i * 3] = (Math.random() - 0.5) * 4.2;
          }
        }
        dPosAttr.needsUpdate = true;
      }

      state.renderer.render(state.scene, state.camera);
    };

    animate();

    // ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newW, height: newH } = entry.contentRect;
        if (newW > 0 && newH > 0) {
          camera.aspect = newW / newH;
          camera.updateProjectionMatrix();
          renderer.setSize(newW, newH);
        }
      }
    });

    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      container.removeEventListener('pointerdown', handlePointerDown);
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerup', handlePointerUp);
      container.removeEventListener('pointercancel', handlePointerUp);
      container.removeEventListener('pointerleave', handlePointerLeave);

      if (sceneRef.current) {
        sceneRef.current.disposed = true;
      }

      // Dispose resources
      glassGeometry.dispose();
      glassMaterial.dispose();
      baseRingGeo.dispose();
      baseRingMat.dispose();
      dropletGeo.dispose();
      dropletMat.dispose();
      shadowPlaneGeo.dispose();
      shadowPlaneMat.dispose();
      shadowTex.dispose();
      liquidGeo.dispose();
      liquidMaterial.dispose();
      surfaceGeo.dispose();
      surfaceMaterial.dispose();
      bubbleRingGeo.dispose();
      bubbleRingMat.dispose();
      iceMaterial.dispose();
      strawGeo.dispose();
      strawMat.dispose();
      pourGeo.dispose();
      pourMat.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      pTexture.dispose();
      if (envMap) envMap.dispose();

      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update target progress whenever prop changes
  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.targetProgress = progress;
    }
  }, [progress]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing ${className}`}
      style={{ touchAction: 'none' }}
      aria-label="نمای سه‌بعدی تعاملی لیوان SEA BREW"
    />
  );
};
