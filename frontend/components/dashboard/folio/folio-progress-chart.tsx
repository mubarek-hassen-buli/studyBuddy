"use client";

import * as React from "react";
import { TrendingUp, ChevronDown } from "lucide-react";

interface ProgressPoint {
  date: string;
  displayDate: string;
  score: number; // 0 to 100
}

const DEFAULT_POINTS: ProgressPoint[] = [
  { date: "2026-10-18", displayDate: "Oct 18", score: 38 },
  { date: "2026-10-19", displayDate: "Oct 19", score: 32 },
  { date: "2026-10-20", displayDate: "Oct 20", score: 52 },
  { date: "2026-10-21", displayDate: "Oct 21", score: 44 },
  { date: "2026-10-22", displayDate: "Oct 22", score: 85 },
  { date: "2026-10-23", displayDate: "Oct 23", score: 62 },
  { date: "2026-10-24", displayDate: "Oct 24", score: 60 },
];

export function FolioProgressChart() {
  const [selectedRange, setSelectedRange] = React.useState("Last 7 days");
  const [activePointIndex, setActivePointIndex] = React.useState<number>(4); // Default to Oct 22 peak!

  const points = DEFAULT_POINTS;
  const activePoint = points[activePointIndex];

  // SVG dimensions for scalable curve
  const width = 500;
  const height = 180;
  const paddingX = 20;
  const paddingY = 25;

  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  // Calculate coordinates
  const coords = points.map((p, idx) => {
    const x = paddingX + (idx / (points.length - 1)) * chartWidth;
    const y = paddingY + chartHeight - (p.score / 100) * chartHeight;
    return { x, y, ...p };
  });

  // Generate smooth cubic bezier SVG path
  const generateBezierPath = (pts: typeof coords) => {
    if (pts.length === 0) return "";
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const cp1x = p0.x + (p1.x - p0.x) / 2;
      const cp1y = p0.y;
      const cp2x = p0.x + (p1.x - p0.x) / 2;
      const cp2y = p1.y;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
    }
    return d;
  };

  const linePath = generateBezierPath(coords);
  const areaPath = `${linePath} L ${coords[coords.length - 1].x} ${height} L ${coords[0].x} ${height} Z`;

  const activeCoord = coords[activePointIndex];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#0D382B] p-5 text-white shadow-xs border border-emerald-950/20 flex flex-col justify-between h-full min-h-[300px]">
      {/* Background ambient glow */}
      <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-emerald-400/10 blur-2xl pointer-events-none" />

      {/* Top Header Row */}
      <div className="flex items-center justify-between mb-3 z-10">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-white/10 flex items-center justify-center text-emerald-300 shrink-0 border border-emerald-400/20">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white tracking-tight">Study Progress</h4>
            <p className="text-[11px] text-emerald-100/70 font-medium leading-none mt-0.5">
              Your learning journey, at a glance.
            </p>
          </div>
        </div>

        {/* Range Selector Pill */}
        <div className="flex items-center gap-1 bg-[#07241C] border border-[#174F3F] text-emerald-100 px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer hover:bg-[#093025] transition-colors">
          <span>{selectedRange}</span>
          <ChevronDown className="w-3.5 h-3.5 text-emerald-300" />
        </div>
      </div>

      {/* Chart Layout: Y-axis + SVG Area Curve */}
      <div className="relative flex-1 flex items-stretch mt-2 z-10">
        {/* Y-Axis Labels */}
        <div className="flex flex-col justify-between text-[10px] text-emerald-200/50 font-medium pr-2 pb-6 select-none shrink-0">
          <span>100%</span>
          <span>75%</span>
          <span>50%</span>
          <span>25%</span>
          <span>0%</span>
        </div>

        {/* SVG Graphic Container */}
        <div className="relative flex-1 flex flex-col justify-between">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full overflow-visible"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="folioAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34D399" stopOpacity="0.45" />
                <stop offset="50%" stopColor="#10B981" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#047857" stopOpacity="0.0" />
              </linearGradient>

              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Subtle horizontal grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
              const yPos = paddingY + chartHeight * pct;
              return (
                <line
                  key={idx}
                  x1={paddingX}
                  y1={yPos}
                  x2={width - paddingX}
                  y2={yPos}
                  stroke="#174E3E"
                  strokeWidth="0.8"
                  strokeDasharray="3 3"
                />
              );
            })}

            {/* Filled Area */}
            <path d={areaPath} fill="url(#folioAreaGradient)" />

            {/* Glowing Smooth Line */}
            <path
              d={linePath}
              fill="none"
              stroke="#34D399"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Peak Tooltip Vertical Dotted Line */}
            {activeCoord && (
              <>
                <line
                  x1={activeCoord.x}
                  y1={activeCoord.y}
                  x2={activeCoord.x}
                  y2={height}
                  stroke="#34D399"
                  strokeWidth="1.2"
                  strokeDasharray="3 3"
                />

                {/* Glowing Circle Dot on Peak */}
                <circle
                  cx={activeCoord.x}
                  cy={activeCoord.y}
                  r="5"
                  fill="#34D399"
                  stroke="#0D382B"
                  strokeWidth="2.5"
                  className="filter drop-shadow-sm"
                />
              </>
            )}

            {/* Clickable Hover Zones for all points */}
            {coords.map((c, i) => (
              <circle
                key={i}
                cx={c.x}
                cy={c.y}
                r="14"
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setActivePointIndex(i)}
                onClick={() => setActivePointIndex(i)}
              />
            ))}
          </svg>

          {/* Floating Peak Tooltip Capsule */}
          {activeCoord && (
            <div
              className="absolute z-20 pointer-events-none transform -translate-x-1/2"
              style={{
                left: `${(activeCoord.x / width) * 100}%`,
                top: `${Math.max(0, (activeCoord.y / height) * 100 - 38)}%`,
              }}
            >
              <div className="bg-[#07241C] border border-[#1B5746] rounded-xl px-2.5 py-1.5 shadow-lg shadow-black/40 text-center">
                <p className="text-[10px] text-emerald-200/70 font-medium leading-none">
                  {activePoint.displayDate}
                </p>
                <p className="text-xs font-bold text-white leading-tight mt-0.5 whitespace-nowrap">
                  Quiz score: {activePoint.score}%
                </p>
              </div>
            </div>
          )}

          {/* X-Axis Date Labels */}
          <div className="flex justify-between text-[10px] text-emerald-200/60 font-medium pt-2 select-none">
            {points.map((p, idx) => (
              <span
                key={p.date}
                onClick={() => setActivePointIndex(idx)}
                className={`cursor-pointer transition-colors ${
                  activePointIndex === idx ? "text-emerald-300 font-bold" : "hover:text-emerald-200"
                }`}
              >
                {p.displayDate}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
