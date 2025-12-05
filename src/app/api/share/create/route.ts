import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { randomBytes } from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clientLabel, expiresInDays } = body;

    if (!clientLabel) {
      return NextResponse.json(
        { error: 'Client label is required' },
        { status: 400 }
      );
    }

    // Generate a secure random token (8 bytes = 16 hex characters)
    const token = randomBytes(8).toString('hex');

    // Calculate expiration date if specified
    let expiresAt: Date | null = null;
    if (expiresInDays && expiresInDays > 0) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiresInDays);
    }

    // Create the share link
    const shareLink = await prisma.shareLink.create({
      data: {
        token,
        clientLabel,
        expiresAt,
      },
    });

    // Generate the full share URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const shareUrl = `${baseUrl}/share/${token}`;

    return NextResponse.json({
      success: true,
      shareLink: {
        id: shareLink.id,
        token: shareLink.token,
        clientLabel: shareLink.clientLabel,
        expiresAt: shareLink.expiresAt,
        createdAt: shareLink.createdAt,
        url: shareUrl,
      },
    });
  } catch (error) {
    console.error('Error creating share link:', error);
    return NextResponse.json(
      { error: 'Failed to create share link' },
      { status: 500 }
    );
  }
}
