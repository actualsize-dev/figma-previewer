import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ clientLabel: string }> }
) {
  try {
    const { clientLabel: rawClientLabel } = await params;
    const clientLabel = decodeURIComponent(rawClientLabel);

    // Permanently delete all projects for this client
    const result = await prisma.project.deleteMany({
      where: {
        clientLabel,
        deletedAt: { not: null }
      }
    });

    return NextResponse.json({
      success: true,
      deletedCount: result.count
    });
  } catch (error) {
    console.error('Error permanently deleting client:', error);
    return NextResponse.json(
      { error: 'Failed to permanently delete client' },
      { status: 500 }
    );
  }
}
