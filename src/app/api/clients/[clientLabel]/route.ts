import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ clientLabel: string }> }
) {
  try {
    const { clientLabel: rawClientLabel } = await params;
    const clientLabel = decodeURIComponent(rawClientLabel);

    // Mark all projects with this client label as deleted
    await prisma.project.updateMany({
      where: {
        clientLabel,
        deletedAt: null
      },
      data: {
        deletedAt: new Date()
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting client:', error);
    return NextResponse.json(
      { error: 'Failed to delete client' },
      { status: 500 }
    );
  }
}
