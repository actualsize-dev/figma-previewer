import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

function createSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { name } = await request.json();

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Project name is required' }, { status: 400 });
    }

    const project = await prisma.project.findUnique({
      where: { id }
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Generate new slug from name
    const newSlug = createSlug(name);

    // Check if new slug conflicts with existing projects (excluding current project)
    const existingProject = await prisma.project.findFirst({
      where: {
        slug: newSlug,
        id: { not: id },
        deletedAt: null
      }
    });

    if (existingProject) {
      return NextResponse.json({ 
        error: 'A project with this name already exists' 
      }, { status: 409 });
    }

    // Update the project
    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        name: name.trim(),
        slug: newSlug
      }
    });

    return NextResponse.json({
      message: 'Project renamed successfully',
      project: updatedProject,
      oldSlug: project.slug,
      newSlug: newSlug
    });
  } catch (error) {
    console.error('Error renaming project:', error);
    return NextResponse.json({ 
      error: 'Failed to rename project' 
    }, { status: 500 });
  }
}