# Figma Thumbnails Setup

To enable Figma thumbnail generation, you need to set up a Figma API token.

## Steps to Enable Thumbnails:

1. **Get Figma API Token:**
   - Go to [Figma Account Settings](https://www.figma.com/settings)
   - Scroll down to "Personal Access Tokens"
   - Click "Create a new personal access token"
   - Give it a name like "Figma Concierge Thumbnails"
   - Copy the generated token

2. **Add Environment Variable:**
   Add the token to your environment variables:
   ```bash
   FIGMA_ACCESS_TOKEN=your_figma_token_here
   ```

3. **Deploy:**
   - For local development: Add to `.env.local`
   - For Vercel: Add in Project Settings → Environment Variables

## How It Works:

- **Automatic**: When a project card loads, it automatically attempts to generate a thumbnail
- **Fallback**: If no token is provided or the API fails, it shows a placeholder
- **Performance**: Thumbnails are generated on-demand and cached by the browser
- **Security**: The API token is only used server-side, never exposed to the client

## Troubleshooting:

- **No thumbnails showing**: Check that `FIGMA_ACCESS_TOKEN` is set correctly
- **403 errors**: Ensure the Figma files are accessible with your account
- **Invalid URL**: Make sure the Figma URLs are valid prototype or file links

## Supported Figma URLs:

- `https://www.figma.com/file/FILE_ID/...`
- `https://www.figma.com/proto/FILE_ID/...`
- `https://www.figma.com/design/FILE_ID/...`