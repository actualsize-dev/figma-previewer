'use client';

import { useState } from 'react';
import Link from 'next/link';
import CopyLinkButton from './CopyLinkButton';
import DeleteProjectButton from './DeleteProjectButton';
import EditableClientLabel from './EditableClientLabel';
import InlineEdit from './InlineEdit';

type Project = {
  id: string;
  name: string;
  slug: string;
  figmaUrl: string;
  clientLabel?: string;
  createdAt: string;
};

interface ProjectCardProps {
  project: Project;
  onProjectDeleted: (id: string) => void;
  onProjectUpdated?: (updatedProject: Project) => void;
}

export default function ProjectCard({ project, onProjectDeleted, onProjectUpdated }: ProjectCardProps) {
  const [currentProject, setCurrentProject] = useState(project);

  const handleLabelUpdate = (newLabel: string) => {
    setCurrentProject(prev => ({ ...prev, clientLabel: newLabel }));
  };

  const handleNameUpdate = async (newName: string) => {
    try {
      const response = await fetch(`/api/projects/${currentProject.id}/rename`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newName }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to rename project');
      }

      const result = await response.json();
      const updatedProject = {
        ...currentProject,
        name: result.project.name,
        slug: result.project.slug
      };
      
      setCurrentProject(updatedProject);
      
      if (onProjectUpdated) {
        onProjectUpdated(updatedProject);
      }

      // Show success message if slug changed
      if (result.oldSlug !== result.newSlug) {
        alert(`Project renamed successfully! URL updated to: actualsize.digital/${result.newSlug}`);
      }
    } catch (error) {
      console.error('Error renaming project:', error);
      alert(error instanceof Error ? error.message : 'Failed to rename project');
      throw error; // Re-throw to let InlineEdit handle the error state
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 mr-4">
            <InlineEdit
              value={currentProject.name}
              onSave={handleNameUpdate}
              className="text-lg font-semibold text-gray-900 block w-full"
              inputClassName="text-lg font-semibold w-full"
              placeholder="Project name..."
            />
          </div>
          <EditableClientLabel
            projectId={currentProject.id}
            currentLabel={currentProject.clientLabel || 'Uncategorized'}
            onLabelUpdate={handleLabelUpdate}
          />
        </div>
        <p className="text-sm text-gray-500 mb-2">
          Created {new Date(currentProject.createdAt).toLocaleDateString()}
        </p>
        <p className="text-xs text-gray-400 mb-4 font-mono">
          actualsize.digital/{currentProject.slug}
        </p>
        
        <div className="space-y-2">
          <Link
            href={`/${currentProject.slug}`}
            className="block w-full text-center py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
          >
            View Prototype
          </Link>
          <CopyLinkButton slug={currentProject.slug} />
          <a
            href={currentProject.figmaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center py-2 px-4 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
          >
            Open in Figma
          </a>
          <DeleteProjectButton 
            projectId={currentProject.id}
            projectName={currentProject.name}
            onDelete={onProjectDeleted}
          />
        </div>
      </div>
    </div>
  );
}