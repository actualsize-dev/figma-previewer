'use client';

import { useState } from 'react';
import Link from 'next/link';
import CopyLinkButton from './CopyLinkButton';
import DeleteProjectButton from './DeleteProjectButton';
import EditableClientLabel from './EditableClientLabel';
import InlineEdit from './InlineEdit';
import FigmaThumbnail from './FigmaThumbnail';

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
  compact?: boolean;
}

export default function ProjectCard({ project, onProjectDeleted, onProjectUpdated, compact = false }: ProjectCardProps) {
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

  if (compact) {
    return (
      <div className="bg-card border border-border rounded-lg px-4 py-3 transition-all hover:shadow-sm hover:border-foreground/20 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <InlineEdit
                value={currentProject.name}
                onSave={handleNameUpdate}
                className="text-sm font-semibold text-foreground truncate"
                inputClassName="text-sm font-semibold"
                placeholder="Project name..."
              />
              <EditableClientLabel
                projectId={currentProject.id}
                currentLabel={currentProject.clientLabel || 'Uncategorized'}
                onLabelUpdate={handleLabelUpdate}
              />
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
              <span className="whitespace-nowrap">Created {new Date(currentProject.createdAt).toLocaleDateString()}</span>
              <span className="font-mono truncate">actualsize.digital/{currentProject.slug}</span>
            </div>
          </div>
          <div className="flex sm:items-center gap-2 sm:flex-shrink-0 w-full sm:w-auto min-w-0">
            <Link
              href={`/${currentProject.slug}`}
              className="btn btn-primary text-xs px-2 sm:px-3 py-1 whitespace-nowrap flex-1 sm:flex-none text-center min-w-0"
            >
              View
            </Link>
            <CopyLinkButton slug={currentProject.slug} className="text-xs px-2 sm:px-3 py-1 whitespace-nowrap flex-1 sm:flex-none text-center min-w-0" compact={true} />
            <DeleteProjectButton
              projectId={currentProject.id}
              projectName={currentProject.name}
              onDelete={onProjectDeleted}
              className="flex-1 sm:flex-none min-w-0"
              compact={true}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden project-card transition-all hover:shadow-sm">
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 mr-4">
            <InlineEdit
              value={currentProject.name}
              onSave={handleNameUpdate}
              className="text-base font-semibold text-foreground block w-full"
              inputClassName="text-base font-semibold w-full"
              placeholder="Project name..."
            />
          </div>
          <EditableClientLabel
            projectId={currentProject.id}
            currentLabel={currentProject.clientLabel || 'Uncategorized'}
            onLabelUpdate={handleLabelUpdate}
          />
        </div>

        <div className="flex items-center space-x-4 mb-4">
          <p className="text-sm text-muted-foreground">
            Created {new Date(currentProject.createdAt).toLocaleDateString()}
          </p>
        </div>

        <p className="text-xs text-muted-foreground mb-4 font-mono bg-muted px-2 py-1 rounded inline-block">
          actualsize.digital/{currentProject.slug}
        </p>

        <div className="mb-6">
          <FigmaThumbnail
            figmaUrl={currentProject.figmaUrl}
            alt={`${currentProject.name} Figma design preview`}
            className="w-full h-48 border border-border"
          />
        </div>

        <div className="space-y-2">
          <Link
            href={`/${currentProject.slug}`}
            className="btn btn-primary w-full text-sm"
          >
            View Prototype
          </Link>
          <CopyLinkButton slug={currentProject.slug} />
          <a
            href={currentProject.figmaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline w-full text-sm"
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