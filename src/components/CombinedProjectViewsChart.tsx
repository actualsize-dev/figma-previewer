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
  const [viewMode, setViewMode] = React.useState<'project' | 'client'>('project');
  const [visibleItems, setVisibleItems] = React.useState<Set<string>>(
    new Set(projects.map((p) => p.projectId))
  );

  // Aggregate data by client
  const clientData = React.useMemo(() => {
    const clientMap = new Map<string, {
      clientLabel: string;
      views: Array<{ date: string; views: number }>;
      totalViews: number;
    }>();

    projects.forEach((project) => {
      if (!clientMap.has(project.clientLabel)) {
        // Initialize client data with same structure as projects
        const emptyViews = project.views.map(v => ({ date: v.date, views: 0 }));
        clientMap.set(project.clientLabel, {
          clientLabel: project.clientLabel,
          views: emptyViews,
          totalViews: 0,
        });
      }

      const client = clientMap.get(project.clientLabel)!;
      // Aggregate views by date
      project.views.forEach((view, idx) => {
        client.views[idx].views += view.views;
      });
      client.totalViews += project.totalViews;
    });

    return Array.from(clientMap.values());
  }, [projects]);

  // Reset visible items when view mode changes
  React.useEffect(() => {
    if (viewMode === 'project') {
      setVisibleItems(new Set(projects.map((p) => p.projectId)));
    } else {
      setVisibleItems(new Set(clientData.map((c) => c.clientLabel)));
    }
  }, [viewMode, projects, clientData]);

  // Transform data: merge all items into single dataset by date
  const chartData = React.useMemo(() => {
    const dataByDate = new Map<string, any>();

    const items = viewMode === 'project' ? projects : clientData;

    // Initialize all dates
    items[0]?.views.forEach((v) => {
      dataByDate.set(v.date, { date: v.date });
    });

    // Add each item's views
    if (viewMode === 'project') {
      projects.forEach((project) => {
        project.views.forEach((v) => {
          const entry = dataByDate.get(v.date);
          if (entry) {
            entry[project.projectId] = v.views;
          }
        });
      });
    } else {
      clientData.forEach((client) => {
        client.views.forEach((v) => {
          const entry = dataByDate.get(v.date);
          if (entry) {
            entry[client.clientLabel] = v.views;
          }
        });
      });
    }

    return Array.from(dataByDate.values());
  }, [projects, clientData, viewMode]);

  // Build chart config dynamically
  const chartConfig = React.useMemo(() => {
    const config: ChartConfig = {};
    if (viewMode === 'project') {
      projects.forEach((project) => {
        const colors = getClientColors(project.clientLabel);
        config[project.projectId] = {
          label: project.projectName,
          color: colors.stroke,
        };
      });
    } else {
      clientData.forEach((client) => {
        const colors = getClientColors(client.clientLabel);
        config[client.clientLabel] = {
          label: client.clientLabel,
          color: colors.stroke,
        };
      });
    }
    return config;
  }, [projects, clientData, viewMode]);

  const toggleItem = (itemId: string) => {
    setVisibleItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
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
            <div className="flex items-center gap-3 mb-2">
              <CardTitle className="text-lg">
                {viewMode === 'project' ? 'Project' : 'Client'} Views Over Time
              </CardTitle>
              <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                <button
                  onClick={() => setViewMode('project')}
                  className={`text-xs px-3 py-1 rounded transition-colors ${
                    viewMode === 'project'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  By Project
                </button>
                <button
                  onClick={() => setViewMode('client')}
                  className={`text-xs px-3 py-1 rounded transition-colors ${
                    viewMode === 'client'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  By Client
                </button>
              </div>
            </div>
            <CardDescription>
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
              {viewMode === 'project' ? (
                projects.map((project) => {
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
                })
              ) : (
                clientData.map((client) => {
                  const colors = getClientColors(client.clientLabel);
                  return (
                    <linearGradient
                      key={client.clientLabel}
                      id={`fill-${client.clientLabel}`}
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
                })
              )}
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                // Parse as local date to avoid timezone conversion
                const [year, month, day] = value.split('-').map(Number);
                const date = new Date(year, month - 1, day);
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

                // Parse as local date to avoid timezone conversion
                const [year, month, day] = label.split('-').map(Number);
                const date = new Date(year, month - 1, day);

                return (
                  <div className="bg-background border border-border rounded-lg shadow-lg p-3">
                    <p className="text-sm text-muted-foreground mb-2">
                      {date.toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                    <div className="space-y-1">
                      {payload.map((entry: any) => {
                        let displayName: string;
                        if (viewMode === 'project') {
                          const project = projects.find(p => p.projectId === entry.dataKey);
                          displayName = project?.projectName || String(entry.dataKey);
                        } else {
                          displayName = String(entry.dataKey);
                        }
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
            {viewMode === 'project' ? (
              projects.map((project) => {
                if (!visibleItems.has(project.projectId)) return null;
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
              })
            ) : (
              clientData.map((client) => {
                if (!visibleItems.has(client.clientLabel)) return null;
                const colors = getClientColors(client.clientLabel);
                return (
                  <Area
                    key={client.clientLabel}
                    dataKey={client.clientLabel}
                    type="monotone"
                    fill={`url(#fill-${client.clientLabel})`}
                    stroke={colors.stroke}
                    strokeWidth={2}
                    fillOpacity={0.4}
                    baseValue={0}
                  />
                );
              })
            )}
            <ChartLegend
              content={
                <ChartLegendContent
                  onClick={(e: any) => {
                    const itemId = Object.keys(chartConfig).find(
                      (key) => chartConfig[key].label === e.value
                    );
                    if (itemId) {
                      toggleItem(itemId);
                    }
                  }}
                />
              }
            />
          </AreaChart>
        </ChartContainer>

        {/* Item Details */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {viewMode === 'project' ? (
            projects.map((project) => {
              const colors = getClientColors(project.clientLabel);
              return (
                <button
                  key={project.projectId}
                  onClick={() => toggleItem(project.projectId)}
                  className={`text-left p-3 rounded-lg border transition-all ${
                    visibleItems.has(project.projectId)
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
            })
          ) : (
            clientData.map((client) => {
              const colors = getClientColors(client.clientLabel);
              const projectCount = projects.filter(p => p.clientLabel === client.clientLabel).length;
              return (
                <button
                  key={client.clientLabel}
                  onClick={() => toggleItem(client.clientLabel)}
                  className={`text-left p-3 rounded-lg border transition-all ${
                    visibleItems.has(client.clientLabel)
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
                      {client.clientLabel}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mb-1">
                    {projectCount} project{projectCount !== 1 ? 's' : ''}
                  </div>
                  <div className="text-lg font-bold text-foreground">{client.totalViews.toLocaleString()} views</div>
                </button>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
