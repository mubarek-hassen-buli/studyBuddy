"use client";

import * as React from "react";
import { Pie, PieChart, Cell } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { DocumentBreakdownItem } from "@/hooks/use-stats";

export const description = "A pie chart with a legend for study materials";

const chartConfig = {
  count: {
    label: "Materials",
  },
  pdf: {
    label: "PDF Notes",
    color: "#105445",
  },
  docx: {
    label: "Word Docs",
    color: "#1F7A65",
  },
  ppt: {
    label: "Presentations",
    color: "#38A189",
  },
  txt: {
    label: "Markdown & Text",
    color: "#6EE7B7",
  },
} satisfies ChartConfig;

const COLOR_PALETTE: Record<string, string> = {
  pdf: "#105445",
  docx: "#1F7A65",
  ppt: "#38A189",
  txt: "#6EE7B7",
};

interface ChartPieLegendProps {
  data: DocumentBreakdownItem[];
  totalDocuments?: number;
}

export function ChartPieLegend({ data, totalDocuments = 0 }: ChartPieLegendProps) {
  const chartData = React.useMemo(() => {
    if (!data || data.length === 0) {
      return [
        { fileType: "pdf", count: 14, fill: "#105445" },
        { fileType: "docx", count: 8, fill: "#1F7A65" },
        { fileType: "ppt", count: 5, fill: "#38A189" },
        { fileType: "txt", count: 3, fill: "#6EE7B7" },
      ];
    }
    return data.map((item) => ({
      fileType: item.fileType,
      count: item.count,
      fill: COLOR_PALETTE[item.fileType] || "#105445",
    }));
  }, [data]);

  const total = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0);
  }, [chartData]);

  return (
    <Card className="flex flex-col rounded-3xl border border-slate-200/80 bg-white shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="items-center pb-0 text-center">
        <div className="flex items-center justify-between w-full">
          <div>
            <CardTitle className="text-base font-bold text-slate-900 tracking-tight text-left">
              Knowledge Distribution
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 font-medium text-left">
              Materials broken down by format
            </CardDescription>
          </div>
          <div className="text-xs font-bold text-[#105445] bg-[#105445]/10 px-2.5 py-1 rounded-full">
            {total} Docs
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-4 pt-1">
        <ChartContainer
          config={chartConfig}
          className="mx-auto h-[260px] w-full"
        >
          <PieChart margin={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="fileType" />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="fileType"
              cx="50%"
              cy="40%"
              innerRadius={44}
              outerRadius={68}
              paddingAngle={3}
              strokeWidth={2}
              stroke="#ffffff"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <ChartLegend
              verticalAlign="bottom"
              content={
                <ChartLegendContent
                  nameKey="fileType"
                  className="pt-2 flex-wrap justify-center gap-x-4 gap-y-1.5 text-[11px] font-medium"
                />
              }
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
