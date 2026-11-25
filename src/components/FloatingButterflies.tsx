"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export interface FloatingButterfliesProps {
  /** Whether the butterflies should be active (starts once the envelope is opened) */
  active?: boolean;
  /** Delay in milliseconds after activation before the butterflies emerge */
  emergenceDelayMs?: number;
}

interface ButterflyConfig {
  textureUrl: string;
  baseScale: number;
  cruiseSpeed: number;
  baseFlapFreq: number;
  flapAmp: number;
  phaseOffset: number;
  initialDirX: number;
  initialDirY: number;
  wanderSeed: number;
  tint: [number, number, number];
}

interface ButterflyAgent {
  config: ButterflyConfig;
  mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
  shadowMesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  target: THREE.Vector3;
  waypointTimer: number;
  flapPhase: number;
  glideTimer: number;
  glideDuration: number;
  isGliding: boolean;
  prevHeading: number;
  bankAngle: number;
  age: number;
  emergenceDelay: number;
  baseSize: number;
}

const BUTTERFLY_VERTEX_SHADER = /* glsl */ `
  uniform float uFlapPhase;
  uniform float uFlapAmp;

  varying vec2 vUv;
  varying vec3 vNormal;

  void main() {
    vUv = uv;

    vec3 pos = position;
    float absX = abs(pos.x);
    float side = pos.x >= 0.0 ? 1.0 : -1.0;

    // Keep the central thorax rigid so the body never splits
    float bodyHalfWidth = 0.032;
    float wingDist = max(0.0, absX - bodyHalfWidth);

    // Slight aerodynamic trailing lag toward wingtips and hindwings
    float lag = wingDist * 1.15 + (0.5 - pos.y) * 0.35;
    float beat = sin(uFlapPhase);
    float laggedBeat = sin(uFlapPhase - lag * 0.42);

    // Asymmetric natural butterfly stroke (folds higher up than down)
    float localAngle = 0.24 + laggedBeat * uFlapAmp;

    if (wingDist > 0.0) {
      pos.x = side * (bodyHalfWidth + wingDist * cos(localAngle));
      pos.z = wingDist * sin(localAngle);
      // Soft wingtip flex
      pos.z -= cos(uFlapPhase - lag * 0.42) * wingDist * wingDist * 0.12;
    }

    // Gentle opposing vertical body lift on downstroke
    pos.z -= beat * 0.045;

    // Compute analytical wing normal for soft 3D sunlight shading
    vec3 localNormal = wingDist > 0.0
      ? normalize(vec3(-side * sin(localAngle), 0.0, cos(localAngle)))
      : vec3(0.0, 0.0, 1.0);

    vNormal = normalize(normalMatrix * localNormal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const BUTTERFLY_FRAGMENT_SHADER = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uOpacity;
  uniform vec3 uTint;

  varying vec2 vUv;
  varying vec3 vNormal;

  void main() {
    vec4 texColor = texture2D(uMap, vUv);
    if (texColor.a < 0.025) discard;

    vec3 normal = gl_FrontFacing ? normalize(vNormal) : -normalize(vNormal);
    vec3 lightDir = normalize(vec3(0.32, 0.55, 0.88));
    float ndl = max(dot(normal, lightDir), 0.0);

    // Luminous warm sunlight shading that keeps wing colors vivid and natural
    float undersideFactor = gl_FrontFacing ? 1.0 : 0.88;
    float lighting = (0.78 + 0.30 * ndl) * undersideFactor;

    vec3 color = texColor.rgb * uTint * lighting;
    gl_FragColor = vec4(color, texColor.a * uOpacity);
    #include <colorspace_fragment>
  }
`;

const SHADOW_VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const SHADOW_FRAGMENT_SHADER = /* glsl */ `
  uniform float uOpacity;
  varying vec2 vUv;

  void main() {
    vec2 centered = (vUv - 0.5) * 2.0;
    float distSq = dot(centered, centered);
    float falloff = exp(-distSq * 3.2);
    float alpha = falloff * uOpacity;
    if (alpha < 0.004) discard;
    // Warm sepia-parchment shadow tone matching the wedding invitation
    gl_FragColor = vec4(0.24, 0.16, 0.09, alpha);
  }
`;

// Two harmonious butterflies matching the warm cream-gold & Persian jewel palette
const BUTTERFLY_CONFIGS: ButterflyConfig[] = [
  {
    // Royal turquoise & velvet-black swallowtail
    textureUrl: "/butterfly_1.png",
    baseScale: 1.0,
    cruiseSpeed: 1.65,
    baseFlapFreq: 10.2,
    flapAmp: 0.86,
    phaseOffset: 0.0,
    initialDirX: -0.78,
    initialDirY: 0.62,
    wanderSeed: 1.37,
    tint: [1.0, 1.0, 1.0],
  },
  {
    // Warm ivory-gold & soft coral-tip garden butterfly
    textureUrl: "/butterfly_2.png",
    baseScale: 0.9,
    cruiseSpeed: 1.5,
    baseFlapFreq: 11.4,
    flapAmp: 0.84,
    phaseOffset: 2.4,
    initialDirX: 0.82,
    initialDirY: 0.57,
    wanderSeed: 5.91,
    tint: [1.02, 1.0, 0.96],
  },
];

function computeVisibleBounds(camera: THREE.PerspectiveCamera) {
  const dist = camera.position.z;
  const vFovRad = THREE.MathUtils.degToRad(camera.fov);
  const halfH = Math.tan(vFovRad / 2) * dist;
  const halfW = halfH * camera.aspect;
  return { halfW, halfH };
}

function pickNextWaypoint(
  currentPos: THREE.Vector3,
  halfW: number,
  halfH: number,
  otherPos?: THREE.Vector3
): THREE.Vector3 {
  const marginX = Math.min(halfW * 0.16, 1.15);
  const marginY = Math.min(halfH * 0.14, 0.95);
  const usableW = Math.max(halfW - marginX, 0.8);
  const usableH = Math.max(halfH - marginY, 0.8);

  let best = new THREE.Vector3();
  let bestScore = -Infinity;

  // Sample several candidate waypoints across the viewport and pick one that
  // encourages wide, graceful sweeping flights across the whole screen
  for (let i = 0; i < 6; i++) {
    const cx = (Math.random() * 2 - 1) * usableW;
    const cy = (Math.random() * 2 - 1) * usableH;
    const cz = (Math.random() * 2 - 1) * 1.15;
    const candidate = new THREE.Vector3(cx, cy, cz);

    const distSelf = candidate.distanceTo(currentPos);
    const distOther = otherPos ? candidate.distanceTo(otherPos) : 3.0;
    const score = distSelf + Math.min(distOther, 4.0) * 0.45 + Math.random() * 0.8;

    if (score > bestScore) {
      bestScore = score;
      best = candidate;
    }
  }

  return best;
}

function wrapAngleDelta(delta: number): number {
  let d = delta;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return d;
}

export const FloatingButterflies: React.FC<FloatingButterfliesProps> = ({
  active = false,
  emergenceDelayMs = 150,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;

    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      // Gracefully skip if WebGL is unavailable on the device
      return;
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const canvas = renderer.domElement;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    canvas.style.pointerEvents = "none";
    container.appendChild(canvas);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 14);

    let bounds = computeVisibleBounds(camera);

    const computeButterflyWorldSize = (vw: number, baseScale: number) => {
      // Responsive visual size: delicate on phones, graceful on desktop
      const responsiveFactor = vw < 480 ? 0.82 : vw < 768 ? 0.92 : 1.05;
      return 1.32 * responsiveFactor * baseScale;
    };

    const textureLoader = new THREE.TextureLoader();
    const wingGeometry = new THREE.PlaneGeometry(1, 1, 20, 12);
    const shadowGeometry = new THREE.PlaneGeometry(1, 1, 1, 1);

    const loadedTextures: THREE.Texture[] = [];
    const materials: THREE.ShaderMaterial[] = [];
    const agents: ButterflyAgent[] = [];

    const baseDelaySec = emergenceDelayMs / 1000;

    BUTTERFLY_CONFIGS.forEach((cfg, idx) => {
      const texture = textureLoader.load(cfg.textureUrl);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
      loadedTextures.push(texture);

      const wingMaterial = new THREE.ShaderMaterial({
        vertexShader: BUTTERFLY_VERTEX_SHADER,
        fragmentShader: BUTTERFLY_FRAGMENT_SHADER,
        uniforms: {
          uMap: { value: texture },
          uFlapPhase: { value: cfg.phaseOffset },
          uFlapAmp: { value: cfg.flapAmp },
          uOpacity: { value: 0 },
          uTint: { value: new THREE.Vector3(...cfg.tint) },
        },
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      materials.push(wingMaterial);

      const shadowMaterial = new THREE.ShaderMaterial({
        vertexShader: SHADOW_VERTEX_SHADER,
        fragmentShader: SHADOW_FRAGMENT_SHADER,
        uniforms: {
          uOpacity: { value: 0 },
        },
        transparent: true,
        depthWrite: false,
      });
      materials.push(shadowMaterial);

      const mesh = new THREE.Mesh(wingGeometry, wingMaterial);
      const shadowMesh = new THREE.Mesh(shadowGeometry, shadowMaterial);

      // Start gently near the center of the open envelope and flutter outward
      const startPos = new THREE.Vector3(
        (idx === 0 ? -0.35 : 0.35),
        -0.15 + idx * 0.25,
        0.2
      );
      const startVel = new THREE.Vector3(
        cfg.initialDirX * cfg.cruiseSpeed * 1.15,
        cfg.initialDirY * cfg.cruiseSpeed * 1.15,
        (idx === 0 ? 0.2 : -0.15)
      );

      const initialTarget = new THREE.Vector3(
        (idx === 0 ? -0.52 : 0.52) * bounds.halfW,
        (idx === 0 ? 0.42 : 0.28) * bounds.halfH,
        idx === 0 ? 0.4 : -0.3
      );

      const baseSize = computeButterflyWorldSize(width, cfg.baseScale);
      mesh.position.copy(startPos);
      mesh.scale.setScalar(baseSize * 0.45);
      mesh.renderOrder = 10 + idx;

      shadowMesh.position.set(startPos.x + 0.18, startPos.y - 0.26, startPos.z - 0.7);
      shadowMesh.scale.set(baseSize * 0.75, baseSize * 0.55, 1);
      shadowMesh.renderOrder = 2 + idx;

      scene.add(shadowMesh);
      scene.add(mesh);

      const initialHeading = Math.atan2(startVel.y, startVel.x) - Math.PI / 2;

      agents.push({
        config: cfg,
        mesh,
        shadowMesh,
        pos: startPos,
        vel: startVel,
        target: initialTarget,
        waypointTimer: 2.8 + idx * 1.1,
        flapPhase: cfg.phaseOffset,
        glideTimer: 2.2 + idx * 1.3,
        glideDuration: 0,
        isGliding: false,
        prevHeading: initialHeading,
        bankAngle: 0,
        age: 0,
        emergenceDelay: baseDelaySec + idx * 0.35,
        baseSize,
      });
    });

    // Reusable math temporaries to avoid per-frame GC allocations
    const desired = new THREE.Vector3();
    const steer = new THREE.Vector3();
    const diff = new THREE.Vector3();
    const targetEuler = new THREE.Euler(0, 0, 0, "ZXY");
    const targetQuat = new THREE.Quaternion();

    let animFrameId = 0;
    let lastTime = performance.now();
    let elapsed = 0;

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (w === 0 || h === 0) return;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(w, h);
      bounds = computeVisibleBounds(camera);

      for (const agent of agents) {
        agent.baseSize = computeButterflyWorldSize(w, agent.config.baseScale);
      }
    };

    window.addEventListener("resize", handleResize);

    const animate = (now: number) => {
      animFrameId = window.requestAnimationFrame(animate);

      // Clamp delta time so tab switches never cause sudden jumps
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      elapsed += dt;

      const { halfW, halfH } = bounds;

      for (let i = 0; i < agents.length; i++) {
        const agent = agents[i];
        const other = agents[1 - i];
        const cfg = agent.config;

        if (elapsed < agent.emergenceDelay) {
          continue;
        }

        agent.age += dt;

        // Smooth entrance fade-in and scale-up as the butterflies emerge
        const entranceT = Math.min(agent.age / 1.15, 1.0);
        const easedEntrance = 1 - Math.pow(1 - entranceT, 3);

        // Update waypoint when close or after timer expires
        agent.waypointTimer -= dt;
        const distToTarget = agent.pos.distanceTo(agent.target);
        if (distToTarget < 1.15 || agent.waypointTimer <= 0) {
          agent.target.copy(pickNextWaypoint(agent.pos, halfW, halfH, other?.pos));
          agent.waypointTimer = 3.6 + Math.random() * 2.8;
        }

        // 1. Seek steering toward wandering waypoint
        desired.subVectors(agent.target, agent.pos);
        const targetDist = desired.length();
        if (targetDist > 0.001) {
          desired.divideScalar(targetDist);
          // Gently ease speed when gracefully curving near a waypoint
          const speedFactor = THREE.MathUtils.clamp(targetDist / 1.8, 0.65, 1.15);
          desired.multiplyScalar(cfg.cruiseSpeed * speedFactor);
        }

        // 2. Layered sinusoidal curl wander for organic, silky curved trajectories
        const s = cfg.wanderSeed;
        const wanderX =
          Math.sin(elapsed * 0.72 + s) * 0.58 +
          Math.cos(elapsed * 1.31 + s * 1.7) * 0.34;
        const wanderY =
          Math.cos(elapsed * 0.63 + s * 1.3) * 0.52 +
          Math.sin(elapsed * 1.17 + s * 0.8) * 0.30;
        const wanderZ = Math.sin(elapsed * 0.55 + s * 2.1) * 0.42;

        desired.x += wanderX;
        desired.y += wanderY;
        desired.z += wanderZ;

        // 3. Soft viewport boundary cushion so they roam freely without vanishing offscreen
        const padX = Math.min(halfW * 0.14, 0.9);
        const padY = Math.min(halfH * 0.12, 0.8);
        const limitX = Math.max(halfW - padX, 0.5);
        const limitY = Math.max(halfH - padY, 0.5);

        if (agent.pos.x > limitX) {
          desired.x -= (agent.pos.x - limitX) * 2.6;
        } else if (agent.pos.x < -limitX) {
          desired.x += (-limitX - agent.pos.x) * 2.6;
        }

        if (agent.pos.y > limitY) {
          desired.y -= (agent.pos.y - limitY) * 2.6;
        } else if (agent.pos.y < -limitY) {
          desired.y += (-limitY - agent.pos.y) * 2.6;
        }

        if (agent.pos.z > 1.55) {
          desired.z -= (agent.pos.z - 1.55) * 2.4;
        } else if (agent.pos.z < -1.35) {
          desired.z += (-1.35 - agent.pos.z) * 2.4;
        }

        // 4. Gentle pair separation so they dance near each other without colliding
        if (other && elapsed >= other.emergenceDelay) {
          diff.subVectors(agent.pos, other.pos);
          const sepDist = diff.length();
          if (sepDist > 0.001 && sepDist < 2.0) {
            const repel = ((2.0 - sepDist) / 2.0) * 1.45;
            desired.addScaledVector(diff.divideScalar(sepDist), repel);
          }
        }

        // Apply smooth acceleration steering
        steer.subVectors(desired, agent.vel);
        const steerSmooth = 1 - Math.exp(-1.85 * dt);
        agent.vel.addScaledVector(steer, steerSmooth);

        // Clamp speed to keep flight calm, airy, and hypnotic
        const currentSpeed = agent.vel.length();
        const minSpeed = cfg.cruiseSpeed * 0.48;
        const maxSpeed = cfg.cruiseSpeed * 1.38;
        if (currentSpeed > maxSpeed) {
          agent.vel.multiplyScalar(maxSpeed / currentSpeed);
        } else if (currentSpeed < minSpeed && currentSpeed > 0.001) {
          agent.vel.multiplyScalar(minSpeed / currentSpeed);
        }

        // Integrate position
        agent.pos.addScaledVector(agent.vel, dt);

        // Natural flap + brief gliding cycles
        agent.glideTimer -= dt;
        if (!agent.isGliding && agent.glideTimer <= 0) {
          // Only enter a short graceful glide when not climbing steeply
          if (agent.vel.y < 0.55) {
            agent.isGliding = true;
            agent.glideDuration = 0.35 + Math.random() * 0.45;
          } else {
            agent.glideTimer = 1.2 + Math.random() * 1.4;
          }
        }

        let targetFlapFreq = cfg.baseFlapFreq;
        let targetFlapAmp = cfg.flapAmp;

        if (agent.isGliding) {
          agent.glideDuration -= dt;
          // Slow down gently into a soaring open-wing posture
          targetFlapFreq = cfg.baseFlapFreq * 0.28;
          targetFlapAmp = cfg.flapAmp * 0.45;
          if (agent.glideDuration <= 0) {
            agent.isGliding = false;
            agent.glideTimer = 2.4 + Math.random() * 2.8;
          }
        } else {
          // Flap slightly brisker when climbing or turning
          const climbBoost = THREE.MathUtils.clamp(agent.vel.y * 0.85, -1.2, 2.4);
          targetFlapFreq = cfg.baseFlapFreq + climbBoost + Math.sin(elapsed * 1.9 + s) * 1.1;
        }

        agent.flapPhase += targetFlapFreq * dt;

        // Smoothly interpolate flap amplitude for silky glide transitions
        const matUniforms = agent.mesh.material.uniforms;
        matUniforms.uFlapPhase.value = agent.flapPhase;
        matUniforms.uFlapAmp.value = THREE.MathUtils.lerp(
          matUniforms.uFlapAmp.value,
          targetFlapAmp,
          1 - Math.exp(-5.0 * dt)
        );
        matUniforms.uOpacity.value = easedEntrance * 0.96;

        // 3D Orientation: heading along flight path + subtle 3/4 pitch + turn banking
        const heading = Math.atan2(agent.vel.y, agent.vel.x) - Math.PI / 2;
        const turnRate = dt > 0.0001 ? wrapAngleDelta(heading - agent.prevHeading) / dt : 0;
        agent.prevHeading = heading;

        const desiredBank = THREE.MathUtils.clamp(-turnRate * 0.24, -0.52, 0.52);
        agent.bankAngle = THREE.MathUtils.lerp(
          agent.bankAngle,
          desiredBank,
          1 - Math.exp(-4.5 * dt)
        );

        // Gentle pitch tilts wings slightly toward the viewer for rich 3D depth
        const pitch =
          0.34 +
          THREE.MathUtils.clamp(agent.vel.z * 0.16, -0.22, 0.22) +
          Math.sin(agent.flapPhase) * 0.05;

        targetEuler.set(pitch, agent.bankAngle, heading, "ZXY");
        targetQuat.setFromEuler(targetEuler);

        const orientSmooth = 1 - Math.exp(-6.2 * dt);
        agent.mesh.quaternion.slerp(targetQuat, orientSmooth);

        // Subtle flutter bounce perpendicular to screen in flight
        agent.mesh.position.copy(agent.pos);

        // Smooth scale during entrance + very subtle organic breath
        const scale = agent.baseSize * (0.45 + 0.55 * easedEntrance);
        agent.mesh.scale.setScalar(scale);

        // Soft floating shadow offset slightly down-right and behind the butterfly
        const altitudeFactor = THREE.MathUtils.clamp((agent.pos.z + 1.5) / 3.0, 0.25, 1.0);
        const wingSpread = 0.58 + 0.42 * Math.abs(Math.cos(0.24 + Math.sin(agent.flapPhase) * matUniforms.uFlapAmp.value));
        agent.shadowMesh.position.set(
          agent.pos.x + 0.16 + altitudeFactor * 0.14,
          agent.pos.y - 0.22 - altitudeFactor * 0.18,
          agent.pos.z - 0.75
        );
        agent.shadowMesh.rotation.z = heading;
        agent.shadowMesh.scale.set(
          scale * 0.78 * wingSpread,
          scale * 0.58,
          1
        );
        agent.shadowMesh.material.uniforms.uOpacity.value =
          easedEntrance * (0.14 - altitudeFactor * 0.05);
      }

      renderer.render(scene, camera);
    };

    animFrameId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(animFrameId);
      window.removeEventListener("resize", handleResize);

      wingGeometry.dispose();
      shadowGeometry.dispose();
      materials.forEach((m) => m.dispose());
      loadedTextures.forEach((t) => t.dispose());
      renderer.dispose();

      if (canvas.parentNode === container) {
        container.removeChild(canvas);
      }
    };
  }, [active, emergenceDelayMs]);

  if (!active) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 z-[150] pointer-events-none overflow-hidden select-none"
    />
  );
};

export default FloatingButterflies;
