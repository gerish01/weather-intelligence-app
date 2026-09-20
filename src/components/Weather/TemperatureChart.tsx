import React, { useState } from 'react';
import { DailyForecast, TemperatureUnit } from '../../types';
import { formatTemp } from '../../utils/weatherCodes';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Sparkles, Activity } from 'lucide-react';

interface TemperatureChartProps {
  daily: DailyForecast;
  unit: TemperatureUnit;
}

export const TemperatureChart: React.FC<TemperatureChartProps> = ({ daily, unit }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const times = daily.time || [];
  const maxTemps = daily.temperature_2m_max || [];
  const minTemps = daily.temperature_2m_min || [];

  if (times.length === 0) return null;

  // Chart coordinate space
  const width = 800;
  const height = 260;
  const paddingLeft = 50;
  const paddingRight = 50;
  const paddingTop = 40;
  const paddingBottom = 50;

  const innerWidth = width - paddingLeft - paddingRight;
  const innerHeight = height - paddingTop - paddingBottom;

  // Scaling bounds
  const allTemps = [...maxTemps, ...minTemps];
  const absMin = Math.min(...allTemps);
  const absMax = Math.max(...allTemps);
  const range = Math.max(absMax - absMin, 4);
  const chartMin = Math.floor(absMin - range * 0.12);
  const chartMax = Math.ceil(absMax + range * 0.12);

  const getY = (temp: number) => {
    return paddingTop + innerHeight - ((temp - chartMin) / (chartMax - chartMin)) * innerHeight;
  };

  const getX = (index: number) => {
    if (times.length <= 1) return paddingLeft + innerWidth / 2;
    return paddingLeft + (index / (times.length - 1)) * innerWidth;
  };

  // Smooth cubic Bézier spline
  const buildSmoothPath = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return '';
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[Math.max(i - 1, 0)];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[Math.min(i + 2, points.length - 1)];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
    return path;
  };

  const maxPoints = maxTemps.map((temp, i) => ({ x: getX(i), y: getY(temp) }));
  const minPoints = minTemps.map((temp, i) => ({ x: getX(i), y: getY(temp) }));

  const maxPath = buildSmoothPath(maxPoints);
  const minPath = buildSmoothPath(minPoints);

  // Shaded area between high and low curves
  const reversedMinPoints = [...minPoints].reverse();
  const areaPath = maxPoints.length > 0
    ? `${maxPath} L ${reversedMinPoints[0].x} ${reversedMinPoints[0].y} ` +
      reversedMinPoints.slice(1).map((p) => `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ') +
      ' Z'
    : '';

  const formatDayLabel = (dateStr: string, index: number) => {
    if (index === 0) return 'Today';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString(undefined, { weekday: 'short' });
  };

  const formatFullDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
  };

  return (
    <div id="temperature-trends-card" className="w-full bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xl shadow-slate-200/40 dark:shadow-none backdrop-blur-md">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 dark:bg-amber-400/20 dark:text-amber-400 flex items-center justify-center shadow-xs">
            <TrendingUp size={20} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              7-Day Temperature Trend Dynamics
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Spline analysis of expected daytime highs vs. nocturnal minimums
            </p>
          </div>
        </div>

        {/* Legend pills */}
        <div className="flex items-center gap-3 text-xs font-semibold">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>Daily Maximum (High)</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-700 dark:text-sky-300">
            <span className="w-2 h-2 rounded-full bg-sky-500"></span>
            <span>Daily Minimum (Low)</span>
          </div>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative w-full overflow-x-auto pb-2">
        <div className="min-w-[660px] w-full">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto overflow-visible select-none"
          >
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
                <stop offset="50%" stopColor="#0284c7" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0.02" />
              </linearGradient>

              <linearGradient id="highStroke" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="50%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>

              <linearGradient id="lowStroke" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#0284c7" />
                <stop offset="50%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
            </defs>

            {/* Grid horizontal lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = paddingTop + ratio * innerHeight;
              const val = Math.round(chartMax - ratio * (chartMax - chartMin));
              return (
                <g key={ratio}>
                  <line
                    x1={paddingLeft - 10}
                    y1={y}
                    x2={width - paddingRight + 10}
                    y2={y}
                    stroke="currentColor"
                    className="text-slate-100 dark:text-slate-800/80"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                  <text
                    x={paddingLeft - 16}
                    y={y + 4}
                    textAnchor="end"
                    className="text-[11px] fill-slate-400 dark:fill-slate-500 font-mono"
                  >
                    {formatTemp(val, unit)}
                  </text>
                </g>
              );
            })}

            {/* Area between curves */}
            {areaPath && (
              <path
                d={areaPath}
                fill="url(#areaGradient)"
                className="transition-all duration-300"
              />
            )}

            {/* High temperature spline line */}
            <path
              d={maxPath}
              fill="none"
              stroke="url(#highStroke)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Low temperature spline line */}
            <path
              d={minPath}
              fill="none"
              stroke="url(#lowStroke)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data points and hover zones */}
            {times.map((dateStr, i) => {
              const x = getX(i);
              const maxPoint = maxPoints[i];
              const minPoint = minPoints[i];
              const isHovered = hoveredIndex === i;

              return (
                <g
                  key={dateStr}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Vertical guide cursor */}
                  {isHovered && (
                    <line
                      x1={x}
                      y1={paddingTop - 15}
                      x2={x}
                      y2={height - paddingBottom + 5}
                      stroke="currentColor"
                      className="text-slate-300 dark:text-slate-600"
                      strokeWidth="2"
                      strokeDasharray="3 3"
                    />
                  )}

                  {/* Invisible broad hover rect */}
                  <rect
                    x={x - innerWidth / (times.length * 2)}
                    y={paddingTop - 15}
                    width={innerWidth / times.length}
                    height={innerHeight + 35}
                    fill="transparent"
                  />

                  {/* High point circle & pill */}
                  <circle
                    cx={maxPoint.x}
                    cy={maxPoint.y}
                    r={isHovered ? 7 : 5}
                    className="fill-amber-500 stroke-white dark:stroke-slate-900 transition-all duration-200 shadow-sm"
                    strokeWidth="2.5"
                  />

                  <text
                    x={maxPoint.x}
                    y={maxPoint.y - 10}
                    textAnchor="middle"
                    className="text-[11px] font-bold fill-amber-600 dark:fill-amber-400 font-mono select-none"
                  >
                    {formatTemp(maxTemps[i], unit)}
                  </text>

                  {/* Low point circle & pill */}
                  <circle
                    cx={minPoint.x}
                    cy={minPoint.y}
                    r={isHovered ? 7 : 5}
                    className="fill-sky-500 stroke-white dark:stroke-slate-900 transition-all duration-200 shadow-sm"
                    strokeWidth="2.5"
                  />

                  <text
                    x={minPoint.x}
                    y={minPoint.y + 18}
                    textAnchor="middle"
                    className="text-[11px] font-semibold fill-sky-600 dark:fill-sky-400 font-mono select-none"
                  >
                    {formatTemp(minTemps[i], unit)}
                  </text>

                  {/* Day text at bottom */}
                  <text
                    x={x}
                    y={height - 12}
                    textAnchor="middle"
                    className={`text-xs select-none transition-all ${
                      isHovered
                        ? 'font-bold fill-slate-900 dark:fill-white scale-110'
                        : 'font-medium fill-slate-500 dark:fill-slate-400'
                    }`}
                  >
                    {formatDayLabel(dateStr, i)}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Dynamic Inspector Detail Strip */}
      {hoveredIndex !== null && times[hoveredIndex] && (
        <div className="mt-2 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between flex-wrap gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="font-bold text-slate-900 dark:text-white">
              {formatFullDate(times[hoveredIndex])}
            </span>
            {hoveredIndex === 0 && (
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase">
                Active Observation
              </span>
            )}
          </div>

          <div className="flex items-center gap-5">
            <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold">
              <ArrowUpRight size={15} />
              <span>Max: {formatTemp(maxTemps[hoveredIndex], unit)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sky-600 dark:text-sky-400 font-bold">
              <ArrowDownRight size={15} />
              <span>Min: {formatTemp(minTemps[hoveredIndex], unit)}</span>
            </div>
            <div className="text-slate-500 dark:text-slate-400 font-mono hidden sm:inline">
              Difference: {formatTemp(Math.abs(maxTemps[hoveredIndex] - minTemps[hoveredIndex]), unit)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
