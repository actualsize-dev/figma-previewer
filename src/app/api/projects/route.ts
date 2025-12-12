import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      where: {
        deletedAt: null
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Error reading projects:', error);
    return NextResponse.json({ projects: [] }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, figmaUrl, clientLabel } = body;

    // Validate required fields
    if (!name || !figmaUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate slug from name
    let slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    // Check if slug already exists and append number if needed
    let finalSlug = slug;
    let counter = 1;

    while (true) {
      const existingProject = await prisma.project.findUnique({
        where: { slug: finalSlug }
      });

      if (!existingProject) {
        break;
      }

      finalSlug = `${slug}-${counter}`;
      counter++;
    }

    const finalClientLabel = clientLabel || 'Uncategorized';

    // Ensure client record exists in clients table (for metadata like descriptions)
    if (finalClientLabel && finalClientLabel !== 'Uncategorized') {
      await prisma.client.upsert({
        where: { clientLabel: finalClientLabel },
        update: {}, // Don't update anything if it exists
        create: { clientLabel: finalClientLabel }, // Create if it doesn't exist
      });
    }

    // Create new project
    const newProject = await prisma.project.create({
      data: {
        name,
        slug: finalSlug,
        figmaUrl,
        clientLabel: finalClientLabel
      }
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}