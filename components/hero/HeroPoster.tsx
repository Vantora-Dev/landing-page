import {
  POSTER_PROGRESS,
  POSTER_VIEWBOX,
  buildEdges,
  buildGrid,
  knownAt,
  projectNode,
  type ProjectedNode,
} from "./hero.config";

/**
 * The static hero, rendered on the server.
 *
 * This is the LCP element. It paints with the HTML, needs no JavaScript, and
 * is a complete hero on its own — on a device without WebGL, on a low-power
 * phone, or under prefers-reduced-motion, this is all anyone ever sees, and
 * nothing looks missing.
 *
 * Emitted as a handful of merged <path> elements rather than ~400 individual
 * shapes, to keep the document small.
 */

const r1 = (n: number) => Math.round(n * 10) / 10;

/** A sharp square plate — a machine seen from above, in plan. */
function plate(node: ProjectedNode, lift: number): string {
  const s = r1(node.size);
  const x = r1(node.sx - node.size / 2);
  const y = r1(node.sy - node.size / 2 - lift);
  return `M${x} ${y}h${s}v${s}h-${s}Z`;
}

export function HeroPoster({ className = "" }: { className?: string }) {
  const nodes = buildGrid().map(projectNode);
  const known = nodes.map((n) => knownAt(n.wave, POSTER_PROGRESS));

  const anonymous = nodes.filter((_, i) => known[i] < 0.5);
  const lit = nodes.filter((_, i) => known[i] >= 0.5);

  // The next few machines about to become known. These fade in over ~1.2s on
  // load, hinting at the movement the WebGL scene takes over. The global
  // prefers-reduced-motion rule collapses the animation, leaving them lit.
  const waking = nodes.filter(
    (n, i) => known[i] < 0.5 && n.wave < POSTER_PROGRESS + 0.13,
  );

  const litEdges = buildEdges().filter(
    ([a, b]) => known[a] >= 0.5 && known[b] >= 0.5,
  );

  const edgePath = litEdges
    .map(([a, b]) => {
      const p = nodes[a];
      const q = nodes[b];
      return `M${r1(p.sx)} ${r1(p.sy)}L${r1(q.sx)} ${r1(q.sy)}`;
    })
    .join("");

  return (
    <>
      <svg
        viewBox={`0 0 ${POSTER_VIEWBOX.width} ${POSTER_VIEWBOX.height}`}
        preserveAspectRatio="xMidYMax slice"
        className={`absolute inset-0 h-full w-full ${className}`}
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id="lg-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="34%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
          </linearGradient>
          <mask id="lg-horizon">
            <rect
              width={POSTER_VIEWBOX.width}
              height={POSTER_VIEWBOX.height}
              fill="url(#lg-fade)"
            />
          </mask>
        </defs>

        {/* Everything fades into the horizon so the grid has no hard top edge */}
        <g mask="url(#lg-horizon)">
          {/* Connections between known customers */}
          <path
            d={edgePath}
            stroke="#fbbf24"
            strokeOpacity="0.28"
            strokeWidth="1"
            fill="none"
          />

          {/* Anonymous machines: outlined, cold, unconnected */}
          <path
            d={anonymous.map((n) => plate(n, 0)).join("")}
            fill="#101014"
            stroke="#2b2b33"
            strokeWidth="1"
          />

          {/* Known customers: warm, lifted, drum lit */}
          <path
            d={lit.map((n) => plate(n, n.size * 0.07)).join("")}
            fill="#1a160f"
            stroke="#fbbf24"
            strokeOpacity="0.55"
            strokeWidth="1"
          />
          {lit.map((n) => (
            <circle
              key={n.i}
              cx={r1(n.sx)}
              cy={r1(n.sy - n.size * 0.07)}
              r={r1(n.size * 0.21)}
              fill="#fbbf24"
              fillOpacity={r1(0.35 + n.scale / 300)}
            />
          ))}

          {/* The wavefront's next few, arriving on load */}
          <g className="lg-waking">
            {waking.map((n, index) => (
              <circle
                key={n.i}
                cx={r1(n.sx)}
                cy={r1(n.sy)}
                r={r1(n.size * 0.21)}
                fill="#fbbf24"
                style={{ animationDelay: `${index * 55}ms` }}
              />
            ))}
          </g>
        </g>
      </svg>

      <style>{`
        .lg-waking circle {
          opacity: 0;
          animation: lg-wake 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        @keyframes lg-wake {
          from { opacity: 0; }
          to { opacity: 0.42; }
        }
      `}</style>
    </>
  );
}
