import { NextRequest, NextResponse } from 'next/server';
import { generateFigmaThumbnail } from '@/lib/figma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { figmaUrl } = body;

    if (!figmaUrl) {
      return NextResponse.json(
        { error: 'Figma URL is required' },
        { status: 400 }
      );
    }

    // Generate thumbnail
    const thumbnail = await generateFigmaThumbnail(figmaUrl);
    
    if (!thumbnail) {
      return NextResponse.json(
        { 
          error: 'Unable to generate thumbnail',
          message: 'This could be due to missing Figma API token, invalid URL, or file permissions'
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ thumbnail });
    
  } catch (error) {
    console.error('Thumbnail generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate thumbnail' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const figmaUrl = searchParams.get('url');

  if (!figmaUrl) {
    return NextResponse.json(
      { error: 'Figma URL parameter is required' },
      { status: 400 }
    );
  }

  try {
    const thumbnail = await generateFigmaThumbnail(figmaUrl);
    
    if (!thumbnail) {
      return NextResponse.json(
        { 
          error: 'Unable to generate thumbnail',
          message: 'This could be due to missing Figma API token, invalid URL, or file permissions'
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ thumbnail });
    
  } catch (error) {
    console.error('Thumbnail generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate thumbnail' },
      { status: 500 }
    );
  }
}