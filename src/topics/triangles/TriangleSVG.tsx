import type { TriangleQuestion } from "./triangleData";

interface TriangleSVGProps {
  triangle: TriangleQuestion;
  showAngles: boolean;
  highlightResult?: boolean;
}

export default function TriangleSVG({ triangle, showAngles, highlightResult }: TriangleSVGProps) {
  const { points, sides, angles } = triangle;
  const [p0, p1, p2] = points;

  const pathD = `M ${p0[0]} ${p0[1]} L ${p1[0]} ${p1[1]} L ${p2[0]} ${p2[1]} Z`;

  const midpoint = (a: number[], b: number[]): [number, number] => [
    (a[0] + b[0]) / 2,
    (a[1] + b[1]) / 2,
  ];

  const offset = (mid: [number, number], center: [number, number], dist: number): [number, number] => {
    const dx = mid[0] - center[0];
    const dy = mid[1] - center[1];
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    return [mid[0] + (dx / len) * dist, mid[1] + (dy / len) * dist];
  };

  const center: [number, number] = [
    (p0[0] + p1[0] + p2[0]) / 3,
    (p0[1] + p1[1] + p2[1]) / 3,
  ];

  const sideEdges: [[number, number], number][] = [
    [offset(midpoint(p0, p1), center, 18), sides[0]],
    [offset(midpoint(p1, p2), center, 18), sides[1]],
    [offset(midpoint(p2, p0), center, 18), sides[2]],
  ];

  const hasRightAngle = angles.includes(90);
  const rightAngleIdx = angles.indexOf(90);

  const equalSides = sides.filter((s, i, arr) => arr.indexOf(s) !== arr.lastIndexOf(s));
  const equalLength = equalSides.length > 0 ? equalSides[0] : null;

  return (
    <svg viewBox="0 0 300 240" className="mx-auto w-full max-w-xs">
      {/* Triangle fill */}
      <path
        d={pathD}
        fill={highlightResult ? "rgba(124, 58, 237, 0.15)" : "rgba(255, 255, 255, 0.05)"}
        stroke="white"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Right angle marker */}
      {hasRightAngle && rightAngleIdx !== -1 && (() => {
        const vertex = points[rightAngleIdx];
        const prev = points[(rightAngleIdx + 2) % 3];
        const next = points[(rightAngleIdx + 1) % 3];

        const size = 15;
        const dx1 = prev[0] - vertex[0];
        const dy1 = prev[1] - vertex[1];
        const len1 = Math.sqrt(dx1 * dx1 + dy1 * dy1) || 1;
        const dx2 = next[0] - vertex[0];
        const dy2 = next[1] - vertex[1];
        const len2 = Math.sqrt(dx2 * dx2 + dy2 * dy2) || 1;

        const ux1 = (dx1 / len1) * size;
        const uy1 = (dy1 / len1) * size;
        const ux2 = (dx2 / len2) * size;
        const uy2 = (dy2 / len2) * size;

        const sqPath = `M ${vertex[0] + ux1} ${vertex[1] + uy1} L ${vertex[0] + ux1 + ux2} ${vertex[1] + uy1 + uy2} L ${vertex[0] + ux2} ${vertex[1] + uy2}`;
        return <path d={sqPath} fill="none" stroke="#facc15" strokeWidth="2" />;
      })()}

      {/* Side length labels */}
      {sideEdges.map(([pos, len], i) => (
        <text
          key={`side-${i}`}
          x={pos[0]}
          y={pos[1]}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-sm font-bold"
          fill={equalLength !== null && len === equalLength ? "#34d399" : "#93c5fd"}
        >
          {len}
        </text>
      ))}

      {/* Tick marks for equal sides */}
      {equalLength !== null &&
        sides.map((s, i) => {
          if (s !== equalLength) return null;
          const a = points[i];
          const b = points[(i + 1) % 3];
          const mid = midpoint(a, b);
          const dx = b[0] - a[0];
          const dy = b[1] - a[1];
          const len = Math.sqrt(dx * dx + dy * dy) || 1;
          const nx = -dy / len;
          const ny = dx / len;
          return (
            <line
              key={`tick-${i}`}
              x1={mid[0] + nx * 5}
              y1={mid[1] + ny * 5}
              x2={mid[0] - nx * 5}
              y2={mid[1] - ny * 5}
              stroke="#34d399"
              strokeWidth="2"
            />
          );
        })}

      {/* Angle labels */}
      {showAngles &&
        angles.map((angle, i) => {
          const vertex = points[i];
          const anglePos = offset(
            [vertex[0], vertex[1]] as [number, number],
            center,
            -20
          );
          return (
            <text
              key={`angle-${i}`}
              x={anglePos[0]}
              y={anglePos[1]}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs"
              fill={angle === 90 ? "#facc15" : angle > 90 ? "#f87171" : "#a5b4fc"}
            >
              {angle}°
            </text>
          );
        })}

      {/* Vertices */}
      {points.map((p, i) => (
        <circle key={`v-${i}`} cx={p[0]} cy={p[1]} r="4" fill="white" />
      ))}
    </svg>
  );
}
