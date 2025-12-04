'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ClientCategoryInput from '@/components/ClientCategoryInput';

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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Figma Prototype Host
          </h1>
          <p className="text-gray-600">
            Create a custom page for your Figma prototype
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-2">
              Project Name
            </label>
            <input
              id="projectName"
              type="text"
              required
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g., Autos Creative Direction"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {projectName && (
              <p className="mt-2 text-sm text-gray-500">
                URL: actualsize.digital/<span className="font-mono">{createSlug(projectName)}</span>
              </p>
            )}
          </div>

          <div>
            <label htmlFor="clientLabel" className="block text-sm font-medium text-gray-700 mb-2">
              Client/Category (optional)
            </label>
            <ClientCategoryInput
              value={clientLabel}
              onChange={setClientLabel}
            />
          </div>

          <div>
            <label htmlFor="figmaUrl" className="block text-sm font-medium text-gray-700 mb-2">
              Figma Prototype URL
            </label>
            <input
              id="figmaUrl"
              type="url"
              required
              value={figmaUrl}
              onChange={(e) => setFigmaUrl(e.target.value)}
              placeholder="https://www.figma.com/proto/..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="mt-2 text-xs text-gray-500">
              Make sure your Figma prototype has public viewing permissions
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating...' : 'Create Project Page'}
          </button>
        </form>

        <div className="text-center">
          <a 
            href="/projects" 
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            View all projects
          </a>
        </div>
      </div>
    </div>
  );
}
