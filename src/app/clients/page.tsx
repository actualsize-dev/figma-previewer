'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import ClientCard from '@/components/ClientCard';
import NewClientCard from '@/components/NewClientCard';
import BrandingFooter from '@/components/BrandingFooter';
import Header from '@/components/Header';
import { Grid3x3, List } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

type Project = {
  id: string;
  clientLabel: string;
};

type Client = {
  label: string;
  projectCount: number;
  description?: string | null;
};

export default function ClientsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [clientDescriptions, setClientDescriptions] = useState<Map<string, string | null>>(new Map());
  const [selectedClients, setSelectedClients] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/projects');
        const data = await response.json();
        setProjects(data.projects || []);

        // Fetch descriptions for all clients
        const clientLabels = (data.projects || [])
          .map((p: Project) => p.clientLabel)
          .filter((label: string) => !!label && label !== 'Uncategorized');
        const uniqueClients: string[] = Array.from(new Set(clientLabels));

        const descriptionsMap = new Map<string, string | null>();
        await Promise.all(
          uniqueClients.map(async (clientLabel: string) => {
            try {
              const descResponse = await fetch(`/api/clients/${encodeURIComponent(clientLabel)}/description`);
              const descData = await descResponse.json();
              descriptionsMap.set(clientLabel, descData.description);
            } catch (error) {
              console.error(`Error fetching description for ${clientLabel}:`, error);
            }
          })
        );
        setClientDescriptions(descriptionsMap);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const clients = useMemo(() => {
    const clientMap = new Map<string, number>();

    projects.forEach((project) => {
      const label = project.clientLabel || 'Uncategorized';
      if (label !== 'Uncategorized') {
        clientMap.set(label, (clientMap.get(label) || 0) + 1);
      }
    });

    return Array.from(clientMap.entries())
      .map(([label, count]) => ({
        label,
        projectCount: count,
        description: clientDescriptions.get(label) || null
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [projects, clientDescriptions]);

  const filteredClients = useMemo(() => {
    if (!searchTerm.trim()) return clients;

    return clients.filter((client) =>
      client.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [clients, searchTerm]);

  const handleClientUpdated = (oldLabel: string, newLabel: string) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.clientLabel === oldLabel
          ? { ...project, clientLabel: newLabel }
          : project
      )
    );
  };

  const handleProjectAdded = async () => {
    // Refresh projects list
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      setProjects(data.projects || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleNewClient = () => {
    const clientName = prompt('Enter new client name:');
    if (clientName && clientName.trim()) {
      // Create a dummy project for this client (will be replaced by proper modal later)
      alert(`Client "${clientName}" will be created. Add a project for this client to make it appear in the list.`);
    }
  };

  const handleDescriptionUpdated = (clientLabel: string, description: string | null) => {
    setClientDescriptions((prev) => {
      const newMap = new Map(prev);
      newMap.set(clientLabel, description);
      return newMap;
    });
  };

  const toggleClientSelection = (clientLabel: string) => {
    setSelectedClients(prev => {
      const newSet = new Set(prev);
      if (newSet.has(clientLabel)) {
        newSet.delete(clientLabel);
      } else {
        newSet.add(clientLabel);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedClients.size === filteredClients.length) {
      setSelectedClients(new Set());
    } else {
      setSelectedClients(new Set(filteredClients.map(c => c.label)));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedClients.size === 0) return;

    const count = selectedClients.size;
    const totalProjects = filteredClients
      .filter(c => selectedClients.has(c.label))
      .reduce((sum, c) => sum + c.projectCount, 0);

    const confirmMessage = `Are you sure you want to delete ${count} client${count !== 1 ? 's' : ''} and move ${totalProjects} project${totalProjects !== 1 ? 's' : ''} to the deleted section?`;

    if (!confirm(confirmMessage)) {
      return;
    }

    setIsProcessing(true);

    try {
      const deletePromises = Array.from(selectedClients).map(clientLabel =>
        fetch(`/api/clients/${encodeURIComponent(clientLabel)}`, {
          method: 'DELETE',
        })
      );

      const results = await Promise.all(deletePromises);
      const failedDeletes = results.filter(r => !r.ok);

      if (failedDeletes.length > 0) {
        throw new Error(`Failed to delete ${failedDeletes.length} client(s)`);
      }

      // Refresh projects list to update client counts
      const response = await fetch('/api/projects');
      const data = await response.json();
      setProjects(data.projects || []);

      setSelectedClients(new Set());
      alert(`${count} client${count !== 1 ? 's have' : ' has'} been deleted and moved to the deleted clients section.`);
    } catch (error) {
      console.error('Error deleting clients:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete clients. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const showBulkActions = viewMode === 'list' && selectedClients.size > 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header activeTab="clients" />

      {/* Main content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {isLoading ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 animate-spin text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <p className="text-muted-foreground">Loading clients...</p>
            </div>
          ) : clients.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No clients yet
              </h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Create projects with client labels to see them organized here.
              </p>
              <Link href="/" className="btn btn-primary">
                Create Your First Project
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-semibold text-foreground">Clients</h1>
                  <p className="text-muted-foreground mt-1">
                    Manage your clients and share links
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {filteredClients.length} client{filteredClients.length !== 1 ? 's' : ''}
                </div>
              </div>

              {/* Bulk actions bar */}
              {showBulkActions && (
                <div className="bg-primary/10 border border-primary/20 rounded-lg px-4 py-3 flex items-center justify-between">
                  <div className="text-sm font-medium text-foreground">
                    {selectedClients.size} client{selectedClients.size !== 1 ? 's' : ''} selected
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedClients(new Set())}
                      className="btn btn-outline text-xs px-3 py-1"
                    >
                      Clear Selection
                    </button>
                    <button
                      onClick={handleBulkDelete}
                      disabled={isProcessing}
                      className="btn btn-destructive text-xs px-3 py-1"
                    >
                      {isProcessing ? 'Processing...' : `Delete ${selectedClients.size} Client${selectedClients.size !== 1 ? 's' : ''}`}
                    </button>
                  </div>
                </div>
              )}

              {/* Controls */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="relative flex-1 w-full sm:w-auto sm:max-w-md">
                  <input
                    type="text"
                    placeholder="Search clients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="text-sm bg-background border border-border rounded px-3 py-2 pr-8 w-full text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
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

              {/* Select all checkbox (list view only) */}
              {viewMode === 'list' && filteredClients.length > 0 && (
                <div className="bg-muted/30 rounded-lg px-4 py-2 flex items-center gap-3">
                  <Checkbox
                    checked={selectedClients.size === filteredClients.length && filteredClients.length > 0}
                    onCheckedChange={toggleSelectAll}
                  />
                  <label className="text-sm text-muted-foreground cursor-pointer" onClick={toggleSelectAll}>
                    Select all clients
                  </label>
                </div>
              )}

              {/* Clients grid/list */}
              {filteredClients.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    No clients found
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    No clients match your search "{searchTerm}"
                  </p>
                  <button onClick={() => setSearchTerm('')} className="btn btn-primary">
                    Clear Search
                  </button>
                </div>
              ) : (
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                      : 'space-y-4'
                  }
                >
                  {viewMode === 'grid' && (
                    <NewClientCard onProjectAdded={handleProjectAdded} />
                  )}
                  {filteredClients.map((client) => (
                    viewMode === 'list' ? (
                      <div key={client.label} className="flex items-start gap-3">
                        <Checkbox
                          checked={selectedClients.has(client.label)}
                          onCheckedChange={() => toggleClientSelection(client.label)}
                          className="mt-3"
                        />
                        <div className="flex-1">
                          <ClientCard
                            client={client}
                            onClientUpdated={handleClientUpdated}
                            onProjectAdded={handleProjectAdded}
                            onDescriptionUpdated={handleDescriptionUpdated}
                            compact={true}
                          />
                        </div>
                      </div>
                    ) : (
                      <ClientCard
                        key={client.label}
                        client={client}
                        onClientUpdated={handleClientUpdated}
                        onProjectAdded={handleProjectAdded}
                        onDescriptionUpdated={handleDescriptionUpdated}
                        compact={false}
                      />
                    )
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <BrandingFooter />
    </div>
  );
}
