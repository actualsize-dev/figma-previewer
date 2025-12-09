import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ clientLabel: string }> }
) {
  try {
    const { clientLabel: rawClientLabel } = await params;
    const clientLabel = decodeURIComponent(rawClientLabel);
    const body = await request.json();
    const { projectIds } = body;

    if (!Array.isArray(projectIds) || projectIds.length === 0) {
      return NextResponse.json(
        { error: 'Invalid project IDs' },
        { status: 400 }
      );
    }

    // Restore selected projects
    const result = await prisma.project.updateMany({
      where: {
        id: { in: projectIds },
        clientLabel,
        deletedAt: { not: null }
      },
      data: {
        deletedAt: null
      }
    });

    return NextResponse.json({
      success: true,
      restoredCount: result.count
    });
  } catch (error) {
    console.error('Error restoring selected projects:', error);
    return NextResponse.json(
      { error: 'Failed to restore projects' },
      { status: 500 }
    );
  }
}
