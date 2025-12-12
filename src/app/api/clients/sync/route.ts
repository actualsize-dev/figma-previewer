import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * Sync endpoint to ensure all client labels from projects exist in the clients table
 * This is useful for backfilling existing data or fixing inconsistencies
 */
export async function POST() {
  try {
    // Get all unique client labels from projects
    const projects = await prisma.project.findMany({
      select: {
        clientLabel: true
      }
    });

    const uniqueLabels = [...new Set(projects.map(p => p.clientLabel))]
      .filter(label => label && label !== 'Uncategorized');

    // Upsert each client label into the clients table
    const results = await Promise.all(
      uniqueLabels.map(async (clientLabel) => {
        return await prisma.client.upsert({
          where: { clientLabel },
          update: {}, // Don't update if exists
          create: { clientLabel },
        });
      })
    );

    return NextResponse.json({
      message: 'Clients synced successfully',
      synced: results.length,
      clients: results.map(c => c.clientLabel)
    });
  } catch (error) {
    console.error('Error syncing clients:', error);
    return NextResponse.json(
      { error: 'Failed to sync clients' },
      { status: 500 }
    );
  }
}
