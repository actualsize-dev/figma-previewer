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

    // First, get file info to find the first canvas/frame
    const fileInfoResponse = await fetch(
      `https://api.figma.com/v1/files/${fileId}`,
      {
        headers: {
          'X-Figma-Token': token,
        },
      }
    );

    if (!fileInfoResponse.ok) {
      console.error('Figma file info API error:', fileInfoResponse.status, fileInfoResponse.statusText);
      return null;
    }

    const fileInfo = await fileInfoResponse.json();
    
    // Find the first canvas (page) and its best frame for thumbnail
    let nodeId = null;
    if (fileInfo.document?.children) {
      const firstCanvas = fileInfo.document.children[0];
      if (firstCanvas && firstCanvas.children && firstCanvas.children.length > 0) {
        // Filter to only frames with bounding boxes (skip videos and other special elements)
        const validFrames = firstCanvas.children.filter(
          (child: any) => child.type === 'FRAME' && child.absoluteBoundingBox
        );

        if (validFrames.length > 0) {
          // Look for the largest valid frame (likely the main artboard)
          let bestFrame = validFrames[0];
          for (const child of validFrames) {
            const currentArea = child.absoluteBoundingBox.width * child.absoluteBoundingBox.height;
            const bestArea = bestFrame.absoluteBoundingBox.width * bestFrame.absoluteBoundingBox.height;

            if (currentArea > bestArea) {
              bestFrame = child;
            }
          }
          nodeId = bestFrame.id;
        } else {
          // Fallback to the canvas itself
          nodeId = firstCanvas.id;
        }
      } else {
        // Fallback to the canvas itself
        nodeId = firstCanvas.id;
      }
    }

    if (!nodeId) {
      console.warn('No valid nodes found for thumbnail generation');
      return null;
    }

    // Now generate thumbnail for the specific node
    // Use scale=0.5 for better performance and svg_include_id to ensure proper cropping
    const thumbnailResponse = await fetch(
      `https://api.figma.com/v1/images/${fileId}?ids=${nodeId}&format=png&scale=0.5&svg_include_id=true&use_absolute_bounds=false`,
      {
        headers: {
          'X-Figma-Token': token,
        },
      }
    );

    if (!thumbnailResponse.ok) {
      console.error('Figma thumbnail API error:', thumbnailResponse.status, thumbnailResponse.statusText);
      return null;
    }

    const thumbnailData = await thumbnailResponse.json();
    
    // Get the thumbnail URL
    const imageUrl = thumbnailData.images?.[nodeId];
    if (imageUrl) {
      return {
        url: imageUrl,
        fileId,
        nodeId,
      };
    }

    console.warn('No thumbnail URL returned for node:', nodeId);
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