# Figma Prototype Host

A Next.js application for hosting Figma prototypes on custom subdomain pages.

## Features

- 🎨 **Custom Project Pages**: Create unique URLs for each prototype (e.g., `actualsize.digital/autos-creative-direction`)
- 🖼️ **Full-Screen Experience**: Figma prototypes display in full width/height for immersive experience
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- 💾 **Project Management**: Simple JSON-based storage for projects
- 🔗 **Easy Sharing**: Clean, professional URLs for client presentations

## How to Use

1. **Create a Project**: Enter project name and Figma prototype URL
2. **Get Custom URL**: Automatically generates clean URL slug
3. **Share**: Send the custom URL - prototype displays full-screen
4. **Manage**: View all projects on `/projects` page

## Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
npm start
```

## Deployment

This app is designed to be deployed on Vercel with the `actualsize.digital` domain:

1. Connect your repo to Vercel
2. Set up custom domain: `actualsize.digital`
3. Deploy!

## File Structure

```
src/
├── app/
│   ├── page.tsx              # Homepage with form
│   ├── [slug]/page.tsx       # Dynamic project pages
│   ├── projects/page.tsx     # Projects listing
│   ├── api/projects/route.ts # API for project CRUD
│   └── layout.tsx            # Root layout
├── components/
│   └── FigmaEmbed.tsx        # Figma iframe component
└── data/
    └── projects.json         # Project storage (auto-created)
```

## Environment

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **File-based storage** (easily upgradeable to database)

## Notes

- Figma prototypes must have public viewing permissions
- URLs are automatically sanitized to create clean slugs
- Full-screen embedding optimized for prototype presentation