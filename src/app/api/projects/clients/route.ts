import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      where: {
        deletedAt: null,
        NOT: {
          OR: [
            { clientLabel: '' },
            { clientLabel: 'Uncategorized' },
            { clientLabel: null }
          ]
        }
      },
      select: {
        clientLabel: true
      },
      distinct: ['clientLabel']
    });
    
    // Extract and sort unique client labels
    const clients = projects
      .map((p: { clientLabel: string }) => p.clientLabel)
      .filter((label: string | null) => label && label !== 'Uncategorized')
      .sort();
    
    return NextResponse.json({ clients });
  } catch (error) {
    console.error('Error fetching client labels:', error);
    return NextResponse.json({ clients: [] });
  }
}