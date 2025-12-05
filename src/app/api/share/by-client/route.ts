import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const clientLabel = searchParams.get('clientLabel');

    if (!clientLabel) {
      return NextResponse.json(
        { error: 'Client label is required' },
        { status: 400 }
      );
    }

    const shareLinks = await prisma.shareLink.findMany({
      where: { clientLabel },
      orderBy: { createdAt: 'desc' },
    });

    // Generate full URLs for each share link
    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    const baseUrl = `${protocol}://${host}`;

    const shareLinksWithUrls = shareLinks.map(link => ({
      id: link.id,
      token: link.token,
      clientLabel: link.clientLabel,
      expiresAt: link.expiresAt,
      createdAt: link.createdAt,
      url: `${baseUrl}/share/${link.token}`,
    }));

    return NextResponse.json({
      success: true,
      shareLinks: shareLinksWithUrls,
    });
  } catch (error) {
    console.error('Error fetching share links:', error);
    return NextResponse.json(
      { error: 'Failed to fetch share links' },
      { status: 500 }
    );
  }
}
