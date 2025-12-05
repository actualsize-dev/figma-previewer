// Figma API utilities for generating thumbnails

export interface FigmaThumbnail {
  url: string;
  fileId: string;
  nodeId?: string;
}

/**
 * Extract file ID from Figma URL
 * Supports both file and prototype URLs
 */
export function extractFigmaFileId(url: string): string | null {
  try {
    // Handle different Figma URL formats:
    // https://www.figma.com/file/FILE_ID/...
    // https://www.figma.com/proto/FILE_ID/...
    // https://www.figma.com/design/FILE_ID/...
    
    const regex = /figma\.com\/(file|proto|design)\/([A-Za-z0-9]+)/;
    const match = url.match(regex);
    
    if (match && match[2]) {
      return match[2];
    }
    
    return null;
  } catch (error) {
    console.error('Error extracting Figma file ID:', error);
    return null;
  }
}

/**
 * Generate thumbnail URL using Figma REST API
 */
export async function generateFigmaThumbnail(
  figmaUrl: string,
  apiToken?: string
): Promise<FigmaThumbnail | null> {
  try {
    const fileId = extractFigmaFileId(figmaUrl);
    if (!fileId) {
      console.error('Invalid Figma URL format');
      return null;
    }

    // Use API token from environment variable if not provided
    const token = apiToken || process.env.FIGMA_ACCESS_TOKEN;
    if (!token) {
      console.warn('No Figma API token available - thumbnails disabled');
      return null;
    }

    // Call Figma REST API to get file thumbnails
    const response = await fetch(
      `https://api.figma.com/v1/images/${fileId}?format=png&scale=2`,
      {
        headers: {
          'X-Figma-Token': token,
        },
      }
    );

    if (!response.ok) {
      console.error('Figma API error:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    
    // Get the first available image URL
    const imageUrls = data.images;
    if (imageUrls && Object.keys(imageUrls).length > 0) {
      const firstNodeId = Object.keys(imageUrls)[0];
      const imageUrl = imageUrls[firstNodeId];
      
      if (imageUrl) {
        return {
          url: imageUrl,
          fileId,
          nodeId: firstNodeId,
        };
      }
    }

    console.warn('No thumbnail images available for Figma file:', fileId);
    return null;
    
  } catch (error) {
    console.error('Error generating Figma thumbnail:', error);
    return null;
  }
}

/**
 * Get Figma file metadata (name, description, etc.)
 */
export async function getFigmaFileInfo(
  figmaUrl: string,
  apiToken?: string
): Promise<any | null> {
  try {
    const fileId = extractFigmaFileId(figmaUrl);
    if (!fileId) return null;

    const token = apiToken || process.env.FIGMA_ACCESS_TOKEN;
    if (!token) return null;

    const response = await fetch(
      `https://api.figma.com/v1/files/${fileId}`,
      {
        headers: {
          'X-Figma-Token': token,
        },
      }
    );

    if (!response.ok) {
      console.error('Figma API error:', response.status);
      return null;
    }

    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error('Error fetching Figma file info:', error);
    return null;
  }
}