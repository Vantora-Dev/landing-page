"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import type { MutableRefObject } from "react";
import * as THREE from "three";
import {
  HERO_CAMERA,
  POSTER_PROGRESS,
  buildEdges,
  buildGrid,
  heroViewOffset,
  knownAt,
} from "./hero.config";

/**
 * The one 3D moment on the site.
 *
 * A floor of machines seen in plan. Cold, unlinked plates are anonymous
 * visitors; a wavefront crosses the grid and the machines it passes warm to
 * amber, lift slightly, and connect to their known neighbours. It starts at
 * exactly the state the static poster is frozen in, so the crossfade continues
 * the picture instead of replacing it.
 *
 * Performance shape, in order of importance:
 *  - three meshes total: plates, drums, connections. No lights, no shadows,
 *    no postprocessing, no loaded assets.
 *  - plate matrices are written once; only drum colours/matrices and line
 *    colours are touched per frame (~150 instances).
 *  - device pixel ratio capped at 1.5 and the loop stops entirely when the
 *    hero scrolls out of view or the tab is hidden.
 */

const COLD = new THREE.Color("#2b2b33");
/** Plate outline when the machine is still anonymous. */
const COLD_PLATE = new THREE.Color("#2b2b33");
const WARM = new THREE.Color("#fbbf24");
/** Plate outline once the customer is known — the poster's amber stroke. */
const WARM_PLATE = new THREE.Color("#8a6614");
/** Unlit connections sink to the hero background rather than using alpha. */
const VOID = new THREE.Color("#0b0b0f");

/** Seconds for the wavefront to finish crossing the grid. */
const SWEEP_SECONDS = 13;

type SceneProps = {
  /** 0 at the top of the hero, 1 once it has scrolled fully out. */
  scrollRef: MutableRefObject<number>;
};

function Grid({ scrollRef }: SceneProps) {
  const nodes = useMemo(() => buildGrid(), []);
  const edges = useMemo(() => buildEdges(), []);

  const plates = useRef<THREE.InstancedMesh>(null);
  const drums = useRef<THREE.InstancedMesh>(null);
  const lines = useRef<THREE.LineSegments>(null);
  const group = useRef<THREE.Group>(null);

  const pointerActive = useRef(false);
  const pointerPoint = useRef(new THREE.Vector3(0, 0, 0));
  const glowStrength = useRef(0);

  const scratch = useMemo(
    () => ({
      matrix: new THREE.Matrix4(),
      position: new THREE.Vector3(),
      quaternion: new THREE.Quaternion(),
      scale: new THREE.Vector3(1, 1, 1),
      color: new THREE.Color(),
      plane: new THREE.Plane(new THREE.Vector3(0, 1, 0), 0),
      raycaster: new THREE.Raycaster(),
      hit: new THREE.Vector3(),
    }),
    [],
  );

  // Geometries are pre-rotated flat so per-instance matrices carry position only.
  /**
   * A square annulus lying flat: the outline of a machine seen in plan, which
   * is what the poster draws as a 1px stroke. Eight triangles, shared by every
   * instance, so the whole floor is still a single draw call.
   */
  const plateGeometry = useMemo(() => {
    const outer = HERO_CAMERA.plateSize / 2;
    const inner = outer - 0.012;

    const positions = new Float32Array([
      -outer, 0, -outer, outer, 0, -outer, outer, 0, outer, -outer, 0, outer,
      -inner, 0, -inner, inner, 0, -inner, inner, 0, inner, -inner, 0, inner,
    ]);

    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setIndex([
      0, 1, 5, 0, 5, 4,
      1, 2, 6, 1, 6, 5,
      2, 3, 7, 2, 7, 6,
      3, 0, 4, 3, 4, 7,
    ]);
    return g;
  }, []);

  const drumGeometry = useMemo(() => {
    const g = new THREE.CircleGeometry(HERO_CAMERA.drumRadius, 14);
    g.rotateX(-Math.PI / 2);
    return g;
  }, []);

  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(edges.length * 2 * 3);
    const colors = new Float32Array(edges.length * 2 * 3);

    edges.forEach(([a, b], index) => {
      const offset = index * 6;
      positions[offset] = nodes[a].x;
      positions[offset + 1] = 0.004;
      positions[offset + 2] = nodes[a].z;
      positions[offset + 3] = nodes[b].x;
      positions[offset + 4] = 0.004;
      positions[offset + 5] = nodes[b].z;
    });

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geometry;
  }, [edges, nodes]);

  useEffect(() => {
    return () => {
      plateGeometry.dispose();
      drumGeometry.dispose();
      lineGeometry.dispose();
    };
  }, [plateGeometry, drumGeometry, lineGeometry]);

  // Plate matrices never change — write them once.
  useLayoutEffect(() => {
    const mesh = plates.current;
    if (!mesh) return;

    nodes.forEach((node, index) => {
      scratch.position.set(node.x, 0, node.z);
      scratch.matrix.compose(scratch.position, scratch.quaternion, scratch.scale);
      mesh.setMatrixAt(index, scratch.matrix);
      mesh.setColorAt(index, COLD_PLATE);
    });

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [nodes, scratch]);

  useFrame((state, delta) => {
    const drumMesh = drums.current;
    const plateMesh = plates.current;
    const lineMesh = lines.current;
    if (!drumMesh || !plateMesh || !lineMesh) return;

    const elapsed = state.clock.elapsedTime;
    const scroll = scrollRef.current;

    // Time carries the wavefront; scrolling can run ahead of it, never behind.
    const byTime = POSTER_PROGRESS + (elapsed / SWEEP_SECONDS) * (1 - POSTER_PROGRESS);
    const byScroll = POSTER_PROGRESS + scroll * 0.85;
    const progress = Math.min(Math.max(byTime, byScroll), 1.08);

    // A slow pulse travelling through the connected network once it exists.
    const pulse = ((elapsed * 0.14) % 1.4) - 0.2;

    // Pointer glow eases in only after a real pointer move, so touch devices
    // and un-touched desktops never get a stray highlight in the middle.
    const targetGlow = pointerActive.current ? 1 : 0;
    glowStrength.current += (targetGlow - glowStrength.current) * Math.min(delta * 4, 1);

    if (pointerActive.current) {
      scratch.raycaster.setFromCamera(state.pointer, state.camera);
      if (scratch.raycaster.ray.intersectPlane(scratch.plane, scratch.hit)) {
        pointerPoint.current.lerp(scratch.hit, Math.min(delta * 6, 1));
      }
    }

    const heat = new Float32Array(nodes.length);

    for (let index = 0; index < nodes.length; index++) {
      const node = nodes[index];
      const known = knownAt(node.wave, progress);

      const wavePulse =
        0.42 * Math.exp(-((node.wave - pulse) ** 2) / 0.0035) * known;

      const dx = node.x - pointerPoint.current.x;
      const dz = node.z - pointerPoint.current.z;
      const proximity =
        0.34 * glowStrength.current * Math.exp(-(dx * dx + dz * dz) / 2.2);

      const value = Math.min(known + wavePulse + proximity * (0.35 + known), 1);
      heat[index] = value;

      // Drum: colour, brightness and a small lift toward the camera.
      scratch.color.copy(COLD).lerp(WARM, value).multiplyScalar(0.5 + 0.5 * value);
      drumMesh.setColorAt(index, scratch.color);

      scratch.position.set(node.x, known * 0.14 + wavePulse * 0.05, node.z);
      scratch.matrix.compose(scratch.position, scratch.quaternion, scratch.scale);
      drumMesh.setMatrixAt(index, scratch.matrix);

      // The outline warms; the drum is what actually reads as "lit".
      scratch.color.copy(COLD_PLATE).lerp(WARM_PLATE, Math.min(value * 1.15, 1));
      plateMesh.setColorAt(index, scratch.color);
    }

    drumMesh.instanceMatrix.needsUpdate = true;
    if (drumMesh.instanceColor) drumMesh.instanceColor.needsUpdate = true;
    if (plateMesh.instanceColor) plateMesh.instanceColor.needsUpdate = true;

    // Connections exist only where both ends are known. Unlit edges are given
    // the background colour rather than alpha, which keeps the line material
    // opaque and cheap.
    const colors = lineGeometry.getAttribute("color") as THREE.BufferAttribute;
    const array = colors.array as Float32Array;

    for (let index = 0; index < edges.length; index++) {
      const [a, b] = edges[index];
      const strength = Math.min(heat[a], heat[b]);
      scratch.color.copy(VOID).lerp(WARM, strength * 0.45);
      const offset = index * 6;
      array[offset] = scratch.color.r;
      array[offset + 1] = scratch.color.g;
      array[offset + 2] = scratch.color.b;
      array[offset + 3] = scratch.color.r;
      array[offset + 4] = scratch.color.g;
      array[offset + 5] = scratch.color.b;
    }
    colors.needsUpdate = true;

    // Pointer parallax, damped, and a gentle recede as the hero scrolls away.
    if (group.current) {
      const targetY = state.pointer.x * 0.052 * glowStrength.current;
      const targetX = -state.pointer.y * 0.028 * glowStrength.current;
      const damp = Math.min(delta * 2.4, 1);
      group.current.rotation.y += (targetY - group.current.rotation.y) * damp;
      group.current.rotation.x += (targetX - group.current.rotation.x) * damp;
      group.current.position.z = -scroll * 1.6;
      group.current.position.y = -scroll * 0.4;
    }
  });

  return (
    <group
      ref={group}
      onPointerMove={() => {
        pointerActive.current = true;
      }}
    >
      {/* Invisible catcher so pointer moves anywhere over the hero register */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <instancedMesh
        ref={plates}
        args={[plateGeometry, undefined, nodes.length]}
        frustumCulled={false}
      >
        <meshBasicMaterial toneMapped={false} side={THREE.DoubleSide} />
      </instancedMesh>

      <instancedMesh
        ref={drums}
        args={[drumGeometry, undefined, nodes.length]}
        frustumCulled={false}
      >
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>

      <lineSegments ref={lines} geometry={lineGeometry} frustumCulled={false}>
        <lineBasicMaterial vertexColors toneMapped={false} />
      </lineSegments>
    </group>
  );
}

/**
 * Applies the poster's exact projection to the R3F camera.
 *
 * R3F sets `aspect` from the canvas on every resize, which is the wrong aspect
 * here — the frustum belongs to a taller notional frame and the canvas shows a
 * crop of it. Both are therefore overwritten whenever the canvas resizes.
 */
function CameraRig() {
  const camera = useThree((state) => state.camera) as THREE.PerspectiveCamera;
  const size = useThree((state) => state.size);

  useLayoutEffect(() => {
    const view = heroViewOffset(size.width, size.height);

    camera.fov = HERO_CAMERA.fov;
    camera.aspect = HERO_CAMERA.aspect;
    // The camera looks straight down -Z; the tilt is entirely in the offset.
    camera.rotation.set(0, 0, 0);
    camera.setViewOffset(
      view.fullWidth,
      view.fullHeight,
      view.offsetX,
      view.offsetY,
      view.width,
      view.height,
    );
    camera.updateProjectionMatrix();
  }, [camera, size]);

  return null;
}

export default function HeroScene({
  scrollRef,
  active,
  onReady,
  onFail,
}: SceneProps & {
  active: boolean;
  onReady: () => void;
  onFail: () => void;
}) {
  return (
    <Canvas
      // Capped for mid-range phones: above 1.5 this scene gains nothing
      // visually and loses a third of the frame budget.
      dpr={[1, 1.5]}
      frameloop={active ? "always" : "never"}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        // The poster's gradient stays visible underneath.
        premultipliedAlpha: true,
      }}
      // Framed to sit low and wide, matching the poster's flat floor band.
      camera={{
        position: HERO_CAMERA.position,
        fov: HERO_CAMERA.fov,
        near: 0.1,
        far: 60,
      }}
      performance={{ min: 0.5 }}
      onCreated={({ gl }) => {
        gl.setClearAlpha(0);

        // A lost context must fall back to the poster rather than leaving a
        // blank rectangle where the hero was.
        gl.domElement.addEventListener(
          "webglcontextlost",
          (event) => {
            event.preventDefault();
            onFail();
          },
          { once: true },
        );

        onReady();
      }}
      style={{ position: "absolute", inset: 0 }}
    >
      <CameraRig />
      <Grid scrollRef={scrollRef} />
    </Canvas>
  );
}
