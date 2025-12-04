'use client';

import { useState, useMemo } from 'react';
import ProjectList from './ProjectList';

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
}

export default function ProjectsWithGrouping({ projects }: ProjectsWithGroupingProps) {
  const [selectedClient, setSelectedClient] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'client'>('date');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Group projects by client (with search filter applied)
  const projectsByClient = useMemo(() => {
    let filteredProjects = projects;
    
    // Apply search filter first
    if (searchTerm.trim()) {
      filteredProjects = projects.filter(p => 
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
  }, [projects, searchTerm]);

  const clientLabels = Object.keys(projectsByClient).sort();

  // Filter and sort projects
  const displayedProjects = useMemo(() => {
    let filtered = projects;

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
  }, [projects, selectedClient, sortBy, searchTerm]);

  const groupedView = sortBy === 'client' && selectedClient === 'all';

  if (groupedView) {
    return (
      <div className="space-y-8">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Filter:</label>
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="text-sm border border-gray-300 rounded px-3 py-1 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Clients</option>
                {clientLabels.map(client => (
                  <option key={client} value={client}>{client}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Group by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'client')}
                className="text-sm border border-gray-300 rounded px-3 py-1 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="date">Date</option>
                <option value="client">Client</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-sm border border-gray-300 rounded px-3 py-2 w-64 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {clientLabels.length > 0 ? (
          clientLabels.map(client => (
            <div key={client} className="space-y-4">
              <div className="flex items-center space-x-3">
                <h2 className="text-xl font-semibold text-gray-900">{client}</h2>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {projectsByClient[client].length} project{projectsByClient[client].length !== 1 ? 's' : ''}
                </span>
              </div>
              <ProjectList initialProjects={projectsByClient[client]} />
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No projects found
            </h3>
            <p className="text-gray-600 mb-4">
              No projects match your search "{searchTerm}"
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
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
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Filter:</label>
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="text-sm border border-gray-300 rounded px-3 py-1 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Clients</option>
              {clientLabels.map(client => (
                <option key={client} value={client}>{client}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'client')}
              className="text-sm border border-gray-300 rounded px-3 py-1 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="date">Date</option>
              <option value="client">Client</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-sm border border-gray-300 rounded px-3 py-2 w-64 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {displayedProjects.length > 0 ? (
        <ProjectList initialProjects={displayedProjects} />
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            No projects found
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? `No projects match your search "${searchTerm}"` : 'No projects available'}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Clear Search
            </button>
          )}
        </div>
      )}
    </div>
  );
}