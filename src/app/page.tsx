'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ClientCategoryInput from '@/components/ClientCategoryInput';
import BrandingFooter from '@/components/BrandingFooter';
import Header from '@/components/Header';

export default function HomePage() {
  const [projectName, setProjectName] = useState('');
  const [figmaUrl, setFigmaUrl] = useState('');
  const [clientLabel, setClientLabel] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const createSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!projectName.trim() || !figmaUrl.trim()) {
      alert('Please fill in both fields');
      return;
    }

    // Validate Figma URL
    if (!figmaUrl.includes('figma.com') || !figmaUrl.includes('proto')) {
      alert('Please enter a valid Figma prototype URL');
      return;
    }

    setIsLoading(true);

    try {
      const slug = createSlug(projectName);
      
      // Save project data
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: projectName,
          slug,
          figmaUrl,
          clientLabel: clientLabel || 'Uncategorized',
          createdAt: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        // Redirect to the new project page
        router.push(`/${slug}`);
      } else {
        alert('Failed to create project');
      }
    } catch (error) {
      alert('Error creating project');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Main content area */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          {/* Hero section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4 tracking-tight">
              Create Figma Prototype Pages
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Transform your Figma prototypes into standalone, shareable pages with custom URLs and professional presentation.
            </p>
          </div>

          {/* Form card */}
          <div className="bg-card border border-border rounded-lg p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="projectName" className="block text-sm font-medium text-foreground">
                  Project Name
                </label>
                <input
                  id="projectName"
                  type="text"
                  required
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g., Autos Creative Direction"
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
                {projectName && (
                  <p className="text-sm text-muted-foreground mt-2">
                    URL: <span className="font-mono text-foreground">actualsize.digital/{createSlug(projectName)}</span>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="clientLabel" className="block text-sm font-medium text-foreground">
                  Client/Category <span className="text-muted-foreground">(optional)</span>
                </label>
                <ClientCategoryInput
                  value={clientLabel}
                  onChange={setClientLabel}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="figmaUrl" className="block text-sm font-medium text-foreground">
                  Figma Prototype URL
                </label>
                <input
                  id="figmaUrl"
                  type="url"
                  required
                  value={figmaUrl}
                  onChange={(e) => setFigmaUrl(e.target.value)}
                  placeholder="https://www.figma.com/proto/..."
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
                <p className="text-xs text-muted-foreground">
                  Ensure your Figma prototype has public viewing permissions
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary w-full h-10"
              >
                {isLoading ? 'Creating...' : 'Create Project Page'}
              </button>
            </form>
          </div>

          {/* Additional info */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Already have projects? <a href="/projects" className="btn btn-subtle text-sm inline">View all projects →</a>
            </p>
          </div>
        </div>
      </main>

      <BrandingFooter />
    </div>
  );
}
