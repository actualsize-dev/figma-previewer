import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ clientLabel: string }> }
) {
  try {
    const { clientLabel } = await params;
    const body = await request.json();
    const { description } = body;

    // Upsert the client with the description
    const client = await prisma.client.upsert({
      where: { clientLabel },
      update: { description },
      create: { clientLabel, description },
    });

    return NextResponse.json(client);
  } catch (error) {
    console.error('Error updating client description:', error);
    return NextResponse.json(
      { error: 'Failed to update client description' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ clientLabel: string }> }
) {
  try {
    const { clientLabel } = await params;

    const client = await prisma.client.findUnique({
      where: { clientLabel },
    });

    return NextResponse.json({ description: client?.description || null });
  } catch (error) {
    console.error('Error fetching client description:', error);
    return NextResponse.json(
      { error: 'Failed to fetch client description' },
      { status: 500 }
    );
  }
}
