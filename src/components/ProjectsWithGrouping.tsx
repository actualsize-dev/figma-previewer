'use client';

import { useState, useMemo } from 'react';
import ProjectList from './ProjectList';
import InlineEdit from './InlineEdit';
import ShareLinksManager from './ShareLinksManager';
import { Grid3x3, List } from 'lucide-react';

type Project = {
  id: string;
  name: string;
  slug: string;
  figmaUrl: string;
  clientLabel?: string;
  createdAt: string;
};

interface ProjectsWithGroupingProps {
  projects: Project[];
  initialSelectedClient?: string;
}

export default function ProjectsWithGrouping({ projects, initialSelectedClient }: ProjectsWithGroupingProps) {
  const [selectedClient, setSelectedClient] = useState<string>(initialSelectedClient || 'all');
  const [sortBy, setSortBy] = useState<'date' | 'client'>('date');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [projectsList, setProjectsList] = useState<Project[]>(projects);

  // Group projects by client (with search filter applied)
  const projectsByClient = useMemo(() => {
    let filteredProjects = projectsList;
    
    // Apply search filter first
    if (searchTerm.trim()) {
      filteredProjects = projectsList.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.clientLabel && p.clientLabel.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    const groups: { [key: string]: Project[] } = {};
    
    filteredProjects.forEach(project => {
      const client = project.clientLabel || 'Uncategorized';
      if (!groups[client]) {
        groups[client] = [];
      }
      groups[client].push(project);
    });

    // Sort projects within each group by date
    Object.keys(groups).forEach(client => {
      groups[client].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    });

    return groups;
  }, [projectsList, searchTerm]);

  const clientLabels = Object.keys(projectsByClient).sort();

  // Filter and sort projects
  const displayedProjects = useMemo(() => {
    let filtered = projectsList;

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.clientLabel && p.clientLabel.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply client filter
    if (selectedClient !== 'all') {
      filtered = filtered.filter(p => (p.clientLabel || 'Uncategorized') === selectedClient);
    }

    if (sortBy === 'date') {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      filtered.sort((a, b) => {
        const clientA = a.clientLabel || 'Uncategorized';
        const clientB = b.clientLabel || 'Uncategorized';
        if (clientA === clientB) {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return clientA.localeCompare(clientB);
      });
    }

    return filtered;
  }, [projectsList, selectedClient, sortBy, searchTerm]);

  const handleClientRename = async (oldClientName: string, newClientName: string) => {
    try {
      const response = await fetch('/api/projects/clients/rename', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          oldClientLabel: oldClientName, 
          newClientLabel: newClientName 
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to rename client category');
      }

      // Update local state to reflect the change
      setProjectsList(prevProjects => 
        prevProjects.map(project => 
          project.clientLabel === oldClientName 
            ? { ...project, clientLabel: newClientName }
            : project
        )
      );

    } catch (error) {
      console.error('Error renaming client category:', error);
      alert(error instanceof Error ? error.message : 'Failed to rename client category');
      throw error;
    }
  };

  const groupedView = sortBy === 'client' && selectedClient === 'all';

  if (groupedView) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-foreground">Filter:</label>
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="text-sm bg-background border border-border rounded px-3 py-1 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              >
                <option value="all">All Clients</option>
                {clientLabels.map(client => (
                  <option key={client} value={client}>{client}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-foreground">Group by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'client')}
                className="text-sm bg-background border border-border rounded px-3 py-1 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              >
                <option value="date">Date</option>
                <option value="client">Client</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-sm bg-background border border-border rounded px-3 py-2 pr-8 w-full sm:w-64 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
                title="Grid view"
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'list'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {clientLabels.length > 0 ? (
          clientLabels.map(client => (
            <div key={client} className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {client === 'Uncategorized' ? (
                    <h2 className="text-lg font-semibold text-foreground">{client}</h2>
                  ) : (
                    <InlineEdit
                      value={client}
                      onSave={(newName) => handleClientRename(client, newName)}
                      className="text-lg font-semibold text-foreground"
                      inputClassName="text-lg font-semibold"
                      placeholder="Client category name..."
                    />
                  )}
                  <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-md whitespace-nowrap">
                    {projectsByClient[client].length} project{projectsByClient[client].length !== 1 ? 's' : ''}
                  </span>
                </div>
                {client !== 'Uncategorized' && (
                  <ShareLinksManager clientLabel={client} />
                )}
              </div>
              <ProjectList initialProjects={projectsByClient[client]} viewMode={viewMode} />
            </div>
          ))
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No projects found
            </h3>
            <p className="text-muted-foreground mb-6">
              No projects match your search "{searchTerm}"
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="btn btn-primary"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {selectedClient !== 'all' && selectedClient !== 'Uncategorized' && (
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <h2 className="text-lg font-semibold text-foreground">{selectedClient}</h2>
            <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-md whitespace-nowrap">
              {displayedProjects.length} project{displayedProjects.length !== 1 ? 's' : ''}
            </span>
          </div>
          <ShareLinksManager clientLabel={selectedClient} />
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-foreground">Filter:</label>
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="text-sm bg-background border border-border rounded px-3 py-1 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            >
              <option value="all">All Clients</option>
              {clientLabels.map(client => (
                <option key={client} value={client}>{client}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-foreground">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'client')}
              className="text-sm bg-background border border-border rounded px-3 py-1 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            >
              <option value="date">Date</option>
              <option value="client">Client</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-sm bg-background border border-border rounded px-3 py-2 pr-8 w-full sm:w-64 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'grid'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
              title="Grid view"
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'list'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
              title="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {displayedProjects.length > 0 ? (
        <ProjectList initialProjects={displayedProjects} viewMode={viewMode} />
      ) : (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No projects found
          </h3>
          <p className="text-muted-foreground mb-6">
            {searchTerm ? `No projects match your search "${searchTerm}"` : 'No projects available'}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="btn btn-primary"
            >
              Clear Search
            </button>
          )}
        </div>
      )}
    </div>
  );
}