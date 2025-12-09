import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ clientLabel: string }> }
) {
  try {
    const { clientLabel: rawClientLabel } = await params;
    const clientLabel = decodeURIComponent(rawClientLabel);

    // Restore all projects for this client
    const result = await prisma.project.updateMany({
      where: {
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
    console.error('Error restoring client:', error);
    return NextResponse.json(
      { error: 'Failed to restore client' },
      { status: 500 }
    );
  }
}
