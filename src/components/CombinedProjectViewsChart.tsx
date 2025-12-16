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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { getCategoryColor } from '@/utils/categoryColors';

interface ProjectAnalytics {
  projectId: string;
  projectName: string;
  projectSlug: string;
  clientLabel: string;
  views: Array<{ date: string; views: number }>;
  totalViews: number;
}

interface CombinedProjectViewsChartProps {
  projects: ProjectAnalytics[];
  dateRange: {
    start: string;
    end: string;
    days: number;
  };
}

// Convert CSS variables to hex colors for SVG
const categoryColorHex = [
  { bg: '#10233D', text: '#0070F3' }, // blue
  { bg: '#291800', text: '#E5990C' }, // orange
  { bg: '#0A2818', text: '#10B981' }, // green
  { bg: '#2D1B4E', text: '#A78BFA' }, // purple
  { bg: '#3D1726', text: '#F472B6' }, // pink
  { bg: '#0B3A3A', text: '#2DD4BF' }, // teal
];

// Get colors that match the client label system
const getClientColors = (clientLabel: string) => {
  const categoryColor = getCategoryColor(clientLabel);

  // Find matching hex colors
  let colorIndex = 0;
  if (categoryColor.bg === 'var(--ds-category-blue-bg)') colorIndex = 0;
  else if (categoryColor.bg === 'var(--ds-category-orange-bg)') colorIndex = 1;
  else if (categoryColor.bg === 'var(--ds-category-green-bg)') colorIndex = 2;
  else if (categoryColor.bg === 'var(--ds-category-purple-bg)') colorIndex = 3;
  else if (categoryColor.bg === 'var(--ds-category-pink-bg)') colorIndex = 4;
  else if (categoryColor.bg === 'var(--ds-category-teal-bg)') colorIndex = 5;

  return {
    stroke: categoryColorHex[colorIndex].text,
    fill: categoryColorHex[colorIndex].bg,
  };
};

export default function CombinedProjectViewsChart({
  projects,
  dateRange,
}: CombinedProjectViewsChartProps) {
  const [visibleProjects, setVisibleProjects] = React.useState<Set<string>>(
    new Set(projects.map((p) => p.projectId))
  );

  // Transform data: merge all projects into single dataset by date
  const chartData = React.useMemo(() => {
    const dataByDate = new Map<string, any>();

    // Initialize all dates
    projects[0]?.views.forEach((v) => {
      dataByDate.set(v.date, { date: v.date });
    });

    // Add each project's views
    projects.forEach((project) => {
      project.views.forEach((v) => {
        const entry = dataByDate.get(v.date);
        if (entry) {
          entry[project.projectId] = v.views;
        }
      });
    });

    return Array.from(dataByDate.values());
  }, [projects]);

  // Build chart config dynamically
  const chartConfig = React.useMemo(() => {
    const config: ChartConfig = {};
    projects.forEach((project) => {
      const colors = getClientColors(project.clientLabel);
      config[project.projectId] = {
        label: project.projectName,
        color: colors.stroke,
      };
    });
    return config;
  }, [projects]);

  const toggleProject = (projectId: string) => {
    setVisibleProjects((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(projectId)) {
        newSet.delete(projectId);
      } else {
        newSet.add(projectId);
      }
      return newSet;
    });
  };

  const totalAllViews = projects.reduce((sum, p) => sum + p.totalViews, 0);

  return (
    <Card>
      <CardHeader className="flex flex-col space-y-0 border-b border-border pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">Project Views Over Time</CardTitle>
            <CardDescription className="mt-1">
              Showing views for the last {dateRange.days} days
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-foreground">{totalAllViews.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Total Views</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[400px] w-full"
        >
          <AreaChart
            data={chartData}
            margin={{ top: 30, right: 30, bottom: 80, left: 30 }}
          >
            <defs>
              {projects.map((project) => {
                const colors = getClientColors(project.clientLabel);
                return (
                  <linearGradient
                    key={project.projectId}
                    id={`fill-${project.projectId}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor={colors.fill}
                      stopOpacity={1}
                    />
                    <stop
                      offset="15%"
                      stopColor={colors.fill}
                      stopOpacity={1}
                    />
                    <stop
                      offset="60%"
                      stopColor={colors.fill}
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="100%"
                      stopColor={colors.fill}
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                );
              })}
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
              domain={[0, 'auto']}
            />
            <ChartTooltip
              cursor={false}
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;

                return (
                  <div className="bg-background border border-border rounded-lg shadow-lg p-3">
                    <p className="text-sm text-muted-foreground mb-2">
                      {new Date(label).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                    <div className="space-y-1">
                      {payload.map((entry: any) => {
                        const project = projects.find(p => p.projectId === entry.dataKey);
                        const displayName = project?.projectName || String(entry.dataKey);
                        const truncated = displayName.length > 20
                          ? displayName.substring(0, 20) + '...'
                          : displayName;

                        return (
                          <div key={entry.dataKey} className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: entry.color }}
                              />
                              <span className="text-sm text-foreground">{truncated}</span>
                            </div>
                            <span className="text-sm font-medium text-foreground tabular-nums">
                              {entry.value}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              }}
            />
            {projects.map((project) => {
              if (!visibleProjects.has(project.projectId)) return null;
              const colors = getClientColors(project.clientLabel);
              return (
                <Area
                  key={project.projectId}
                  dataKey={project.projectId}
                  type="monotone"
                  fill={`url(#fill-${project.projectId})`}
                  stroke={colors.stroke}
                  strokeWidth={2}
                  fillOpacity={0.4}
                  baseValue={0}
                />
              );
            })}
            <ChartLegend
              content={
                <ChartLegendContent
                  onClick={(e: any) => {
                    const projectId = Object.keys(chartConfig).find(
                      (key) => chartConfig[key].label === e.value
                    );
                    if (projectId) {
                      toggleProject(projectId);
                    }
                  }}
                />
              }
            />
          </AreaChart>
        </ChartContainer>

        {/* Project Details */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {projects.map((project) => {
            const colors = getClientColors(project.clientLabel);
            return (
              <button
                key={project.projectId}
                onClick={() => toggleProject(project.projectId)}
                className={`text-left p-3 rounded-lg border transition-all ${
                  visibleProjects.has(project.projectId)
                    ? 'border-border bg-card hover:border-primary/50'
                    : 'border-border bg-muted/50 opacity-50 hover:opacity-70'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: colors.stroke }}
                  />
                  <div className="text-sm font-medium text-foreground truncate">
                    {project.projectName}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mb-1">{project.clientLabel}</div>
                <div className="text-lg font-bold text-foreground">{project.totalViews.toLocaleString()} views</div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
