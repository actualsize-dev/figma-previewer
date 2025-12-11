# Authentication Setup Guide

This application uses NextAuth.js with Google OAuth for authentication. All routes except public share links are protected and require login with an `@actualsize.com` email address.

## Prerequisites

- Google Cloud Console account (actual size team should have this)
- Access to the Actual Size Google Workspace

## Google OAuth Setup

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name it "Figma Concierge" (or similar)
4. Click "Create"

### 2. Enable Google+ API

1. In your project, go to "APIs & Services" → "Library"
2. Search for "Google+ API"
3. Click on it and click "Enable"

### 3. Configure OAuth Consent Screen

1. Go to "APIs & Services" → "OAuth consent screen"
2. Select "Internal" (if you have Google Workspace) or "External"
   - Internal: Only @actualsize.com users can sign in
   - External: Requires verification but more flexible for testing
3. Click "Create"
4. Fill in the required fields:
   - App name: **Figma Concierge**
   - User support email: Your email
   - Developer contact email: Your email
5. Click "Save and Continue"
6. Skip "Scopes" (click "Save and Continue")
7. Skip "Test users" if using Internal type
8. Review and click "Back to Dashboard"

### 4. Create OAuth Client ID

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Select "Web application"
4. Name it "Figma Concierge Web Client"
5. Add Authorized JavaScript origins:
   ```
   http://localhost:3000
   https://your-production-domain.vercel.app
   ```
6. Add Authorized redirect URIs:
   ```
   http://localhost:3000/api/auth/callback/google
   https://your-production-domain.vercel.app/api/auth/callback/google
   ```
7. Click "Create"
8. **Save the Client ID and Client Secret** - you'll need these!

### 5. Update Environment Variables

#### Local Development

Update `.env.local`:
```bash
GOOGLE_CLIENT_ID="your-client-id-from-step-4"
GOOGLE_CLIENT_SECRET="your-client-secret-from-step-4"
```

#### Production (Vercel)

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add these variables:
   ```
   NEXTAUTH_URL=https://your-production-domain.vercel.app
   NEXTAUTH_SECRET=TXmWLXicZMDhglVmfIND9fa87+2Octhe4qpHlbxnuHw=
   GOOGLE_CLIENT_ID=your-client-id-from-step-4
   GOOGLE_CLIENT_SECRET=your-client-secret-from-step-4
   ```
4. Redeploy your application

## Testing Authentication

### Local Testing

1. Start the development server:
   ```bash
   npm run dev
   ```
2. Navigate to `http://localhost:3000`
3. You should be redirected to `/login`
4. Click "Sign in with Google"
5. Sign in with your @actualsize.com email
6. You should be redirected back to the app

### Production Testing

1. Deploy to Vercel
2. Navigate to your production URL
3. Test the same flow as local

## Domain Restriction

The app is configured to **only allow @actualsize.com email addresses**. This is enforced in:
- `src/lib/auth.ts` - Server-side validation in the `signIn` callback
- Users with other email domains will see an "Access Denied" error

## Protected Routes

The following routes require authentication:
- `/` - Home/create project page
- `/projects` - All projects
- `/clients` - Client management
- `/projects/deleted` - Deleted items
- `/api/*` - All API routes (except `/api/auth` and `/api/share`)

## Public Routes

These routes remain accessible without login:
- `/login` - Login page
- `/share/[token]` - Public share links
- `/[slug]` - Public prototype viewer

## Troubleshooting

### "Access Denied" Error
- Make sure you're using an @actualsize.com email address
- Check that the Google OAuth consent screen is set to "Internal" for your workspace

### Redirect URI Mismatch
- Verify the redirect URIs in Google Cloud Console match exactly
- Format: `http://localhost:3000/api/auth/callback/google` (note: no trailing slash)

### "Invalid Client" Error
- Double-check your `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- Make sure they're from the same OAuth client in Google Cloud Console

### Session Not Persisting
- Check that your database connection is working
- Verify the User, Account, Session, and VerificationToken tables exist
- Run `npx prisma db push` if needed

## Security Notes

- The `NEXTAUTH_SECRET` has been pre-generated and is already in `.env.local`
- Never commit `.env.local` to git (it's already in `.gitignore`)
- Rotate the `NEXTAUTH_SECRET` if it's ever compromised
- The domain restriction (`@actualsize.com`) is enforced at the application level

## Need Help?

If you run into issues:
1. Check the console for error messages
2. Verify all environment variables are set correctly
3. Make sure the database is accessible
4. Try restarting the development server
