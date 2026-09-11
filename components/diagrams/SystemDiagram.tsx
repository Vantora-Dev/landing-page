/**
 * How the parts actually connect.
 *
 * Hand-drawn SVG rather than an icon set, because the point of the picture is
 * the direction of flow: every channel a customer can use writes into one
 * record, and everything we operate reads back out of it. That relationship is
 * the product, and no stock icon row communicates it.
 *
 * Rendered inside a horizontally scrollable container on narrow screens (see
 * the System section) so the labels never shrink below readable size.
 */

const inputs = [
  { label: "Channel", name: "Website" },
  { label: "Channel", name: "Wash-and-fold ordering" },
  { label: "Channel", name: "Pickup & delivery" },
  { label: "Channel", name: "Memberships" },
];

const outputs = [
  { label: "Acts on it", name: "SMS & email automation" },
  { label: "Acts on it", name: "Google profile & reviews" },
  { label: "Reports on it", name: "Owner dashboard" },
];

const INPUT_W = 220;
const INPUT_GAP = 20;
const OUTPUT_W = 300;
const OUTPUT_GAP = 20;
const LEFT = 30;

export function SystemDiagram() {
  return (
    <svg
      viewBox="0 0 1000 500"
      role="img"
      aria-labelledby="system-diagram-title system-diagram-desc"
      className="h-auto w-full"
    >
      <title id="system-diagram-title">
        How the LaundroGrid system is connected
      </title>
      <desc id="system-diagram-desc">
        Four customer channels — the website, wash-and-fold ordering, pickup and
        delivery, and memberships — all write into a single customer record.
        Marketing automation, Google Business Profile management and the owner
        dashboard all read back out of that same record.
      </desc>

      <defs>
        <marker
          id="sd-arrow"
          viewBox="0 0 8 8"
          refX="6"
          refY="4"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <path d="M0 0 L8 4 L0 8 z" fill="#a1a1aa" />
        </marker>
      </defs>

      {/* Channels a customer can use */}
      {inputs.map((item, index) => {
        const x = LEFT + index * (INPUT_W + INPUT_GAP);
        return (
          <g key={item.name}>
            <rect
              x={x}
              y={30}
              width={INPUT_W}
              height={88}
              rx="6"
              fill="#ffffff"
              stroke="#e3e1de"
            />
            <text
              x={x + 20}
              y={57}
              fontSize="10"
              letterSpacing="1.6"
              fill="#57575f"
              fontFamily="var(--font-mono), monospace"
            >
              {item.label.toUpperCase()}
            </text>
            <text
              x={x + 20}
              y={85}
              fontSize="16"
              fill="#17171b"
              fontFamily="var(--font-sans), sans-serif"
            >
              {item.name.length > 22 ? item.name.split(" ")[0] : item.name}
            </text>
            {item.name.length > 22 ? (
              <text
                x={x + 20}
                y={105}
                fontSize="16"
                fill="#17171b"
                fontFamily="var(--font-sans), sans-serif"
              >
                {item.name.split(" ").slice(1).join(" ")}
              </text>
            ) : null}

            <line
              x1={x + INPUT_W / 2}
              y1={118}
              x2={x + INPUT_W / 2}
              y2={222}
              stroke="#d6d3d0"
              strokeWidth="1.5"
              markerEnd="url(#sd-arrow)"
            />
          </g>
        );
      })}

      <text
        x={LEFT}
        y={185}
        fontSize="10"
        letterSpacing="1.6"
        fill="#92400e"
        fontFamily="var(--font-mono), monospace"
      >
        EVERY ORDER WRITES A CUSTOMER
      </text>

      {/* The spine: the thing a laundromat has never had */}
      <rect x={LEFT} y={230} width={940} height={72} rx="6" fill="#0e0e11" />
      <circle cx={LEFT + 26} cy={266} r="4" fill="#fbbf24" />
      <text
        x={LEFT + 44}
        y={262}
        fontSize="17"
        fill="#fafaf9"
        fontFamily="var(--font-sans), sans-serif"
      >
        The customer record
      </text>
      <text
        x={LEFT + 44}
        y={284}
        fontSize="13"
        fill="#a1a1aa"
        fontFamily="var(--font-sans), sans-serif"
      >
        Name, contact details, every order, every membership — one place, yours.
      </text>

      <text
        x={LEFT}
        y={345}
        fontSize="10"
        letterSpacing="1.6"
        fill="#57575f"
        fontFamily="var(--font-mono), monospace"
      >
        AND EVERYTHING ELSE READS FROM IT
      </text>

      {/* What we run off the record */}
      {outputs.map((item, index) => {
        const x = LEFT + index * (OUTPUT_W + OUTPUT_GAP);
        return (
          <g key={item.name}>
            <line
              x1={x + OUTPUT_W / 2}
              y1={302}
              x2={x + OUTPUT_W / 2}
              y2={392}
              stroke="#d6d3d0"
              strokeWidth="1.5"
              markerEnd="url(#sd-arrow)"
            />
            <rect
              x={x}
              y={400}
              width={OUTPUT_W}
              height={78}
              rx="6"
              fill="#ffffff"
              stroke="#e3e1de"
            />
            <text
              x={x + 20}
              y={427}
              fontSize="10"
              letterSpacing="1.6"
              fill="#57575f"
              fontFamily="var(--font-mono), monospace"
            >
              {item.label.toUpperCase()}
            </text>
            <text
              x={x + 20}
              y={455}
              fontSize="16"
              fill="#17171b"
              fontFamily="var(--font-sans), sans-serif"
            >
              {item.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
