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

    // Use a transaction to update everything atomically
    const trimmedNewLabel = newClientLabel.trim();

    const result = await prisma.$transaction(async (tx) => {
      // 1. Update all projects with the old client label
      const projectsResult = await tx.project.updateMany({
        where: {
          clientLabel: oldClientLabel
        },
        data: {
          clientLabel: trimmedNewLabel
        }
      });

      // 2. Update all share links with the old client label
      const shareLinksResult = await tx.shareLink.updateMany({
        where: {
          clientLabel: oldClientLabel
        },
        data: {
          clientLabel: trimmedNewLabel
        }
      });

      // 3. Update or create the client record in the clients table
      // First, try to delete the old client record
      await tx.client.deleteMany({
        where: {
          clientLabel: oldClientLabel
        }
      });

      // Then, ensure the new client record exists
      if (trimmedNewLabel && trimmedNewLabel !== 'Uncategorized') {
        await tx.client.upsert({
          where: { clientLabel: trimmedNewLabel },
          update: {}, // Don't update if it exists
          create: { clientLabel: trimmedNewLabel }
        });
      }

      return {
        projectsUpdated: projectsResult.count,
        shareLinksUpdated: shareLinksResult.count
      };
    });

    return NextResponse.json({
      message: 'Client category renamed successfully',
      updatedCount: result.projectsUpdated,
      shareLinksUpdated: result.shareLinksUpdated,
      oldName: oldClientLabel,
      newName: trimmedNewLabel
    });
  } catch (error) {
    console.error('Error renaming client category:', error);
    return NextResponse.json({ 
      error: 'Failed to rename client category' 
    }, { status: 500 });
  }
}