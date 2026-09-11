/**
 * The hero grid, defined once and used twice:
 *
 *  - HeroPoster renders it as static SVG on the server. It paints immediately,
 *    is the LCP element, and is the entire hero when WebGL is unavailable.
 *  - HeroScene renders the same grid in WebGL and animates onward from exactly
 *    where the poster stops, so the crossfade continues the image rather than
 *    replacing it.
 *
 * The picture is the argument: grey, unconnected machines (anonymous walk-ins)
 * warm to amber and link up (known customers) as a wavefront crosses the floor.
 */

export const GRID_COLS = 12;
export const GRID_ROWS = 12;
export const SPACING = 1;

/**
 * How far the wavefront has crossed the grid in the static poster.
 * HeroScene begins its animation at this value — the poster is frame zero.
 */
export const POSTER_PROGRESS = 0.42;

export type GridNode = {
  i: number;
  col: number;
  row: number;
  /** World position on the floor plane. Row 0 is furthest from camera. */
  x: number;
  z: number;
  /** 0–1 position along the wavefront's travel. Lower wakes first. */
  wave: number;
};

/** Deterministic pseudo-random in [0,1) so server and client agree exactly. */
function hash(i: number): number {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}

export function buildGrid(): GridNode[] {
  const nodes: GridNode[] = [];
  const halfCols = (GRID_COLS - 1) / 2;
  const halfRows = (GRID_ROWS - 1) / 2;

  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      const i = row * GRID_COLS + col;
      // Sweeps left to right, leaning slightly toward the near rows so the
      // large machines at the front of the floor take part rather than sitting
      // dark. The scatter stops the front reading as a hard ruled line.
      const wave =
        0.78 * (col / (GRID_COLS - 1)) +
        0.22 * (1 - row / (GRID_ROWS - 1)) +
        (hash(i) - 0.5) * 0.11;

      nodes.push({
        i,
        col,
        row,
        x: (col - halfCols) * SPACING,
        z: (row - halfRows) * SPACING,
        wave: Math.min(Math.max(wave, 0), 1),
      });
    }
  }

  return nodes;
}

/** Orthogonal neighbours only — a floor plan of machines, not a cat's cradle. */
export function buildEdges(): Array<[number, number]> {
  const edges: Array<[number, number]> = [];

  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      const i = row * GRID_COLS + col;
      if (col < GRID_COLS - 1) edges.push([i, i + 1]);
      if (row < GRID_ROWS - 1) edges.push([i, i + GRID_COLS]);
    }
  }

  return edges;
}

/**
 * How "known" a node is at a given wavefront position: 0 anonymous, 1 known.
 * Smooth over a narrow band so nodes flip individually rather than in ranks.
 */
export function knownAt(wave: number, progress: number): number {
  const t = (progress - wave + 0.06) / 0.12;
  const c = Math.min(Math.max(t, 0), 1);
  return c * c * (3 - 2 * c);
}

/* ---------------------------------------------------------------------------
   Poster projection.

   A ground-plane perspective done by hand so the SVG can be rendered on the
   server with no runtime and no layout dependency: screen scale falls off as
   1/depth, which is what a camera does.
   --------------------------------------------------------------------------- */

/**
 * Wide and shallow on purpose: the grid occupies a band across the bottom of
 * the hero, below the headline, rather than sitting behind the type.
 */
export const POSTER_VIEWBOX = { width: 1600, height: 360 };

const FOCAL = 596;
const CAM_HEIGHT = 2.29;
const NEAR_DEPTH = 4.2;
const HORIZON_Y = 5.2;

/**
 * The same pinhole camera, expressed for three.js.
 *
 * The poster's projection puts its principal point at the very top of the
 * viewBox (a tilt-shift, not a pitched camera), so the WebGL camera looks
 * straight down -Z from CAM_HEIGHT and renders a *crop* of a taller frame via
 * setViewOffset. Deriving it from the same constants rather than eyeballing a
 * lookAt is what makes the poster-to-canvas crossfade land pixel for pixel.
 */
export const HERO_CAMERA = {
  position: [0, CAM_HEIGHT, NEAR_DEPTH + (GRID_ROWS - 1) / 2] as [number, number, number],
  /** Height of the notional full frame the viewBox is the bottom slice of. */
  fullHeight: 2 * (POSTER_VIEWBOX.height - HORIZON_Y),
  fov: (2 * Math.atan((POSTER_VIEWBOX.height - HORIZON_Y) / FOCAL) * 180) / Math.PI,
  aspect: POSTER_VIEWBOX.width / (2 * (POSTER_VIEWBOX.height - HORIZON_Y)),
  /** Matches the plate geometry to the poster's square size. */
  plateSize: 0.56 * SPACING,
  drumRadius: 0.56 * SPACING * 0.21,
};

/**
 * Reproduces SVG `preserveAspectRatio="xMidYMax slice"` as a three.js view
 * offset, so the canvas crops exactly where the poster crops at any size.
 */
export function heroViewOffset(canvasWidth: number, canvasHeight: number) {
  const { width: vw, height: vh } = POSTER_VIEWBOX;
  const scale = Math.max(canvasWidth / vw, canvasHeight / vh);
  const width = canvasWidth / scale;
  const height = canvasHeight / scale;

  return {
    fullWidth: vw,
    fullHeight: HERO_CAMERA.fullHeight,
    offsetX: (vw - width) / 2,
    // The viewBox is the bottom `vh` of the full frame; `slice` then anchors
    // the visible rect to the bottom of the viewBox (yMax).
    offsetY: HERO_CAMERA.fullHeight - height,
    width,
    height,
  };
}

export type ProjectedNode = GridNode & {
  sx: number;
  sy: number;
  /** Edge length of the machine plate in SVG units. */
  size: number;
  scale: number;
};

export function projectNode(node: GridNode): ProjectedNode {
  // Row 0 sits furthest away; the front row sits at NEAR_DEPTH.
  const depth = NEAR_DEPTH + (GRID_ROWS - 1 - node.row) * SPACING;
  const scale = FOCAL / depth;

  return {
    ...node,
    scale,
    sx: POSTER_VIEWBOX.width / 2 + node.x * scale,
    sy: HORIZON_Y + CAM_HEIGHT * scale,
    size: 0.56 * SPACING * scale,
  };
}

/**
 * Height of the band the grid lives in, anchored to the bottom of the hero.
 * Used by the backdrop (to frame poster + canvas) and by the hero content (as
 * a spacer), so the type can never land on top of the machines.
 */
export const HERO_BAND_HEIGHT = "h-[22svh] sm:h-[26svh] md:h-[30svh]";
