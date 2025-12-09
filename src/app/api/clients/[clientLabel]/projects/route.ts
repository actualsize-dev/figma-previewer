import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ clientLabel: string }> }
) {
  try {
    const { clientLabel: rawClientLabel } = await params;
    const clientLabel = decodeURIComponent(rawClientLabel);

    // Get all deleted projects for this client
    const projects = await prisma.project.findMany({
      where: {
        clientLabel,
        deletedAt: { not: null }
      },
      orderBy: {
        deletedAt: 'desc'
      },
      select: {
        id: true,
        name: true,
        slug: true,
        createdAt: true,
        deletedAt: true
      }
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching client projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}
