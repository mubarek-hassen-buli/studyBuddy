"use client";

import * as React from "react";
import { TrendingUp, ChevronDown } from "lucide-react";
import { useProgressMetrics, ProgressTimelinePoint } from "@/hooks/use-progress-metrics";

interface FormattedPoint {
  date: string;
  displayDate: string;
  score: number; // 0 to 100
  minutes: number;
  sessions: number;
}

export function FolioProgressChart() {
  const [selectedRange, setSelectedRange] = React.useState<7 | 30>(7);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [activePointIndex, setActivePointIndex] = React.useState<number>(0);

  const { metrics, isLoading } = useProgressMetrics(selectedRange);

  // Fallback points if loading or empty
  const points: FormattedPoint[] = React.useMemo(() => {
    if (metrics?.timeline && metrics.timeline.length > 0) {
      return metrics.timeline.map((p) => {
        // Display score as minutes studied normalized to a 60-min daily target
        const pct = Math.min(100, Math.round((p.minutes / 60) * 100));
        return {
          date: p.date,
          displayDate: p.day,
          score: pct,
          minutes: p.minutes,
          sessions: p.sessions,
        };
      });
    }

    // Default 7-day placeholder curve if brand new
    return [
      { date: "1", displayDate: "Mon", score: 20, minutes: 12, sessions: 1 },
      { date: "2", displayDate: "Tue", score: 35, minutes: 21, sessions: 1 },
      { date: "3", displayDate: "Wed", score: 50, minutes: 30, sessions: 1 },
      { date: "4", displayDate: "Thu", score: 40, minutes: 24, sessions: 1 },
      { date: "5", displayDate: "Fri", score: 70, minutes: 42, sessions: 2 },
      { date: "6", displayDate: "Sat", score: 85, minutes: 51, sessions: 2 },
      { date: "7", displayDate: "Sun", score: 60, minutes: 36, sessions: 1 },
    ];
  }, [metrics]);

  // Keep active point in range
  React.useEffect(() => {
    if (points.length > 0 && activePointIndex >= points.length) {
      setActivePointIndex(points.length - 1);
    }
  }, [points.length, activePointIndex]);

  const activePoint = points[activePointIndex] || points[0];

  // SVG dimensions for scalable curve
  const width = 500;
  const height = 180;
  const paddingX = 20;
  const paddingY = 25;

  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  // Calculate coordinates
  const coords = points.map((p, idx) => {
    const x = paddingX + (idx / Math.max(1, points.length - 1)) * chartWidth;
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
  const areaPath =
    coords.length > 0
      ? `${linePath} L ${coords[coords.length - 1].x} ${height} L ${coords[0].x} ${height} Z`
      : "";

  const activeCoord = coords[activePointIndex] || coords[0];

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
              {metrics?.totalMinutes ? `${metrics.totalMinutes} mins total` : "Your learning journey, at a glance."}
            </p>
          </div>
        </div>

        {/* Range Selector Pill */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1 bg-[#07241C] border border-[#174F3F] text-emerald-100 px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer hover:bg-[#093025] transition-colors"
          >
            <span>Last {selectedRange} days</span>
            <ChevronDown className="w-3.5 h-3.5 text-emerald-300" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-32 bg-[#07241C] border border-[#174F3F] rounded-xl shadow-xl z-30 py-1 overflow-hidden">
              <button
                type="button"
                onClick={() => {
                  setSelectedRange(7);
                  setDropdownOpen(false);
                }}
                className={`w-full text-left px-3 py-1.5 text-xs ${
                  selectedRange === 7 ? "text-emerald-300 font-bold bg-white/5" : "text-emerald-100/70 hover:bg-white/5"
                }`}
              >
                Last 7 days
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedRange(30);
                  setDropdownOpen(false);
                }}
                className={`w-full text-left px-3 py-1.5 text-xs ${
                  selectedRange === 30 ? "text-emerald-300 font-bold bg-white/5" : "text-emerald-100/70 hover:bg-white/5"
                }`}
              >
                Last 30 days
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Chart Layout: Y-axis + SVG Area Curve */}
      <div className="relative flex-1 flex items-stretch mt-2 z-10">
        {/* Y-Axis Labels */}
        <div className="flex flex-col justify-between text-[10px] text-emerald-200/50 font-medium pr-2 pb-6 select-none shrink-0">
          <span>60m</span>
          <span>45m</span>
          <span>30m</span>
          <span>15m</span>
          <span>0m</span>
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
            {areaPath && <path d={areaPath} fill="url(#folioAreaGradient)" />}

            {/* Glowing Smooth Line */}
            {linePath && (
              <path
                d={linePath}
                fill="none"
                stroke="#34D399"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

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
                  {activePoint.displayDate} ({activePoint.date})
                </p>
                <p className="text-xs font-bold text-white leading-tight mt-0.5 whitespace-nowrap">
                  {activePoint.minutes}m studied • {activePoint.sessions} session{activePoint.sessions === 1 ? "" : "s"}
                </p>
              </div>
            </div>
          )}

          {/* X-Axis Date Labels */}
          <div className="flex justify-between text-[10px] text-emerald-200/60 font-medium pt-2 select-none overflow-hidden">
            {points.map((p, idx) => {
              // For 30 days view, only display every 5th label to prevent clutter
              if (selectedRange === 30 && idx % 5 !== 0 && idx !== points.length - 1) {
                return null;
              }
              return (
                <span
                  key={p.date + idx}
                  onClick={() => setActivePointIndex(idx)}
                  className={`cursor-pointer transition-colors ${
                    activePointIndex === idx ? "text-emerald-300 font-bold" : "hover:text-emerald-200"
                  }`}
                >
                  {p.displayDate}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
