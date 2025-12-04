import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const project = await prisma.project.findUnique({
      where: { id }
    });

    if (!project || !project.deletedAt) {
      return NextResponse.json({ error: 'Deleted project not found' }, { status: 404 });
    }

    // Check for slug conflicts with active projects
    const slugConflict = await prisma.project.findFirst({
      where: {
        slug: project.slug,
        deletedAt: null,
        id: { not: id }
      }
    });

    let newSlug = project.slug;
    if (slugConflict) {
      // Generate new slug with timestamp
      const timestamp = Date.now();
      newSlug = `${project.slug}-restored-${timestamp}`;
    }

    // Restore project by removing deletedAt and potentially updating slug
    const restoredProject = await prisma.project.update({
      where: { id },
      data: {
        slug: newSlug,
        deletedAt: null
      }
    });

    return NextResponse.json({ 
      message: 'Project restored successfully',
      project: restoredProject 
    });
  } catch (error) {
    console.error('Error restoring project:', error);
    return NextResponse.json({ error: 'Failed to restore project' }, { status: 500 });
  }
}