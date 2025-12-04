import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { clientLabel } = await request.json();

    const project = await prisma.project.findUnique({
      where: { id }
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Update the client label
    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        clientLabel: clientLabel || 'Uncategorized'
      }
    });

    return NextResponse.json({ 
      message: 'Client label updated successfully',
      project: updatedProject
    });
  } catch (error) {
    console.error('Error updating client label:', error);
    return NextResponse.json({ error: 'Failed to update client label' }, { status: 500 });
  }
}