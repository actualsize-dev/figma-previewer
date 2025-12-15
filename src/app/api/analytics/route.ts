import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const days = parseInt(searchParams.get('days') || '90');

    // Calculate the start date
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get all projects
    const projects = await prisma.project.findMany({
      where: {
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        clientLabel: true,
      },
      orderBy: {
        clientLabel: 'asc',
      },
    });

    // Get view counts grouped by project and date
    const views = await prisma.$queryRaw<Array<{
      project_id: string;
      date: Date;
      view_count: bigint;
    }>>`
      SELECT
        project_id,
        DATE(viewed_at) as date,
        COUNT(*) as view_count
      FROM project_views
      WHERE viewed_at >= ${startDate}
      GROUP BY project_id, DATE(viewed_at)
      ORDER BY date ASC
    `;

    // Transform the data into a structure suitable for the frontend
    const projectAnalytics = projects.map(project => {
      const projectViews = views
        .filter(v => v.project_id === project.id)
        .map(v => ({
          date: v.date.toISOString().split('T')[0],
          views: Number(v.view_count),
        }));

      // Fill in missing dates with 0 views
      const viewsMap = new Map(projectViews.map(v => [v.date, v.views]));
      const allDates: Array<{ date: string; views: number }> = [];

      for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(date.getDate() - (days - 1 - i));
        const dateStr = date.toISOString().split('T')[0];
        allDates.push({
          date: dateStr,
          views: viewsMap.get(dateStr) || 0,
        });
      }

      return {
        projectId: project.id,
        projectName: project.name,
        projectSlug: project.slug,
        clientLabel: project.clientLabel,
        views: allDates,
        totalViews: allDates.reduce((sum, v) => sum + v.views, 0),
      };
    });

    // Sort by total views descending
    projectAnalytics.sort((a, b) => b.totalViews - a.totalViews);

    return NextResponse.json({
      projects: projectAnalytics,
      dateRange: {
        start: startDate.toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0],
        days,
      },
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
