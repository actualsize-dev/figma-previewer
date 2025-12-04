import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const project = await prisma.project.findUnique({
      where: { id }
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (!project.deletedAt) {
      return NextResponse.json({ 
        error: 'Project must be soft deleted first' 
      }, { status: 400 });
    }

    // Permanently delete the project from the database
    await prisma.project.delete({
      where: { id }
    });

    return NextResponse.json({ 
      message: 'Project permanently deleted successfully',
      freedSlug: project.slug,
      freedName: project.name
    });
  } catch (error) {
    console.error('Error permanently deleting project:', error);
    return NextResponse.json({ 
      error: 'Failed to permanently delete project' 
    }, { status: 500 });
  }
}