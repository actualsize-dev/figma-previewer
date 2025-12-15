'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Header from '@/components/Header';
import ProjectViewsChart from '@/components/ProjectViewsChart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BarChart3 } from 'lucide-react';

type ProjectAnalytics = {
  projectId: string;
  projectName: string;
  projectSlug: string;
  clientLabel: string;
  views: Array<{ date: string; views: number }>;
  totalViews: number;
};

type AnalyticsData = {
  projects: ProjectAnalytics[];
  dateRange: {
    start: string;
    end: string;
    days: number;
  };
};

export default function InsightsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('90');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchAnalytics();
    }
  }, [status, timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/analytics?days=${timeRange}`);
      if (!response.ok) throw new Error('Failed to fetch analytics');
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const totalAllViews = analytics?.projects.reduce((sum, p) => sum + p.totalViews, 0) || 0;
  const projectsWithViews = analytics?.projects.filter(p => p.totalViews > 0) || [];

  return (
    <div className="min-h-screen bg-background">
      <Header activeTab="insights" />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Insights</h1>
                <p className="text-muted-foreground mt-1">
                  Project view analytics and trends
                </p>
              </div>
            </div>

            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="180">Last 180 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-sm text-muted-foreground mb-1">Total Views</div>
              <div className="text-3xl font-bold text-foreground">{totalAllViews.toLocaleString()}</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-sm text-muted-foreground mb-1">Active Projects</div>
              <div className="text-3xl font-bold text-foreground">{projectsWithViews.length}</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-sm text-muted-foreground mb-1">Avg Views per Project</div>
              <div className="text-3xl font-bold text-foreground">
                {projectsWithViews.length > 0
                  ? Math.round(totalAllViews / projectsWithViews.length).toLocaleString()
                  : 0}
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="space-y-6">
          {analytics && analytics.projects.length > 0 ? (
            analytics.projects.map((project) => (
              <ProjectViewsChart
                key={project.projectId}
                projectName={project.projectName}
                projectSlug={project.projectSlug}
                clientLabel={project.clientLabel}
                data={project.views}
                totalViews={project.totalViews}
              />
            ))
          ) : (
            <div className="bg-card border border-border rounded-lg p-12 text-center">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Analytics Data</h3>
              <p className="text-muted-foreground">
                No project views have been recorded yet. Start sharing your projects to see analytics here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
