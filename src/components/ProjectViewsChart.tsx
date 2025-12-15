'use client';

import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

interface ProjectViewsChartProps {
  projectName: string;
  projectSlug: string;
  clientLabel: string;
  data: Array<{ date: string; views: number }>;
  totalViews: number;
}

export default function ProjectViewsChart({
  projectName,
  projectSlug,
  clientLabel,
  data,
  totalViews,
}: ProjectViewsChartProps) {
  const chartConfig = {
    views: {
      label: 'Views',
      color: 'var(--chart-1)',
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader className="flex flex-col space-y-0 border-b pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{projectName}</CardTitle>
            <CardDescription className="mt-1">
              {clientLabel} • actualsize.digital/{projectSlug}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-foreground">{totalViews.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Total Views</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[200px] w-full"
        >
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`fill-${projectSlug}`} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-views)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-views)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    });
                  }}
                  formatter={(value) => {
                    return [`${value} views`, 'Views'];
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="views"
              type="monotone"
              fill={`url(#fill-${projectSlug})`}
              stroke="var(--color-views)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
