import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const deletedProjects = await prisma.project.findMany({
      where: {
        deletedAt: { not: null }
      },
      orderBy: {
        deletedAt: 'desc'
      }
    });
    
    return NextResponse.json(deletedProjects);
  } catch (error) {
    console.error('Error reading deleted projects:', error);
    return NextResponse.json([], { status: 500 });
  }
}