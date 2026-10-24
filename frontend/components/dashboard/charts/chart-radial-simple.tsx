"use client";

import * as React from "react";
import { TrendingUp, Sparkles } from "lucide-react";
import { RadialBar, RadialBarChart, PolarAngleAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { RadialMetricItem } from "@/hooks/use-stats";

export const description = "A radial chart showing exam readiness";

const chartConfig = {
  value: {
    label: "Score",
  },
  quiz: {
    label: "Quiz Accuracy",
    color: "#105445",
  },
  coverage: {
    label: "Syllabus Coverage",
    color: "#1F7A65",
  },
  retention: {
    label: "Concept Retention",
    color: "#38A189",
  },
  consistency: {
    label: "Study Consistency",
    color: "#6EE7B7",
  },
} satisfies ChartConfig;

const COLOR_MAP: Record<string, string> = {
  quiz: "#105445",
  coverage: "#1F7A65",
  retention: "#38A189",
  consistency: "#6EE7B7",
};

interface ChartRadialSimpleProps {
  data: RadialMetricItem[];
  avgScore?: number;
}

export function ChartRadialSimple({ data, avgScore = 74 }: ChartRadialSimpleProps) {
  const chartData = React.useMemo(() => {
    if (!data || data.length === 0) {
      return [
        { name: "quiz", label: "Quiz Accuracy", value: avgScore || 78, fill: "#105445" },
        { name: "coverage", label: "Syllabus Coverage", value: 65, fill: "#1F7A65" },
        { name: "retention", label: "Concept Retention", value: 82, fill: "#38A189" },
        { name: "consistency", label: "Study Consistency", value: 88, fill: "#6EE7B7" },
      ];
    }
    return data.map((item) => ({
      name: item.name,
      label: item.label,
      value: item.value,
      fill: COLOR_MAP[item.name] || "#105445",
    }));
  }, [data, avgScore]);

  // Overall readiness index
  const overallReadiness = React.useMemo(() => {
    if (chartData.length === 0) return avgScore || 74;
    const sum = chartData.reduce((acc, curr) => acc + curr.value, 0);
    return Math.round(sum / chartData.length);
  }, [chartData, avgScore]);

  return (
    <Card className="flex flex-col rounded-3xl border border-slate-200/80 bg-white shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="items-center pb-0 text-center">
        <div className="flex items-center justify-between w-full">
          <div>
            <CardTitle className="text-base font-bold text-slate-900 tracking-tight text-left">
              Exam Readiness & Progress
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 font-medium text-left">
              Multi-factor AI assessment
            </CardDescription>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-[#105445] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Optimal</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-0 relative">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[220px]"
        >
          <RadialBarChart
            data={chartData}
            innerRadius={30}
            outerRadius={100}
            startAngle={180}
            endAngle={0}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              angleAxisId={0}
              tick={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="name" />}
            />
            <RadialBar
              dataKey="value"
              background={{ fill: "#f1f5f3" }}
              cornerRadius={6}
            />
          </RadialBarChart>
        </ChartContainer>

        {/* Center Percentage Display */}
        <div className="absolute top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
          <span className="text-3xl font-black text-slate-900 tracking-tight">
            {overallReadiness}%
          </span>
          <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
            Readiness Index
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-1.5 text-xs pt-1 pb-4">
        <div className="flex items-center gap-1.5 leading-none font-bold text-[#105445]">
          <TrendingUp className="h-4 w-4 text-[#105445]" />
          <span>Trending up by 8.4% this week</span>
        </div>
        <div className="leading-none text-slate-400 font-medium text-[11px]">
          Target score: 85% before finals
        </div>
      </CardFooter>
    </Card>
  );
}
