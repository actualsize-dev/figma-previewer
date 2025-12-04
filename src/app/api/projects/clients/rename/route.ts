import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PATCH(request: NextRequest) {
  try {
    const { oldClientLabel, newClientLabel } = await request.json();

    if (!oldClientLabel || !newClientLabel || !newClientLabel.trim()) {
      return NextResponse.json({ 
        error: 'Both old and new client names are required' 
      }, { status: 400 });
    }

    // Check if new client name already exists
    const existingClient = await prisma.project.findFirst({
      where: {
        clientLabel: newClientLabel.trim(),
        deletedAt: null
      }
    });

    if (existingClient && newClientLabel.trim() !== oldClientLabel) {
      return NextResponse.json({ 
        error: 'A client with this name already exists' 
      }, { status: 409 });
    }

    // Update all projects with the old client label
    const result = await prisma.project.updateMany({
      where: {
        clientLabel: oldClientLabel
      },
      data: {
        clientLabel: newClientLabel.trim()
      }
    });

    return NextResponse.json({
      message: 'Client category renamed successfully',
      updatedCount: result.count,
      oldName: oldClientLabel,
      newName: newClientLabel.trim()
    });
  } catch (error) {
    console.error('Error renaming client category:', error);
    return NextResponse.json({ 
      error: 'Failed to rename client category' 
    }, { status: 500 });
  }
}