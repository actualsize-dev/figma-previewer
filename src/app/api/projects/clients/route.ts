import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      where: {
        deletedAt: null
      },
      select: {
        clientLabel: true
      }
    });
    
    // Extract and sort unique client labels
    const allLabels = projects.map(p => p.clientLabel);
    const uniqueLabels = [...new Set(allLabels)];
    const clients = uniqueLabels
      .filter(label => label && label !== '' && label !== 'Uncategorized')
      .sort();
    
    return NextResponse.json({ clients });
  } catch (error) {
    console.error('Error fetching client labels:', error);
    return NextResponse.json({ clients: [] });
  }
}