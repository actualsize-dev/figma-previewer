'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { useState, useRef, useEffect } from 'react';
import { LogOut, User } from 'lucide-react';

interface HeaderProps {
  activeTab?: 'projects' | 'clients' | 'deleted';
}

export default function Header({ activeTab }: HeaderProps) {
  const { data: session } = useSession();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await signOut({ callbackUrl: '/login' });
    } catch (error) {
      console.error('Sign out error:', error);
      // Force redirect if signOut fails
      window.location.href = '/login';
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop layout */}
        <div className="hidden sm:flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-semibold text-foreground hover:text-muted-foreground transition-colors">
              Figma Concierge
            </Link>
            <nav className="flex items-center space-x-2">
              {activeTab === 'projects' ? (
                <span className="text-sm font-medium text-foreground relative px-3 py-1.5">
                  Projects
                  <div className="absolute bottom-[-16px] left-0 right-0 h-0.5 bg-foreground"></div>
                </span>
              ) : (
                <Link href="/projects" className="text-sm text-muted-foreground nav-link">
                  Projects
                </Link>
              )}
              {activeTab === 'clients' ? (
                <span className="text-sm font-medium text-foreground relative px-3 py-1.5">
                  Clients
                  <div className="absolute bottom-[-16px] left-0 right-0 h-0.5 bg-foreground"></div>
                </span>
              ) : (
                <Link href="/clients" className="text-sm text-muted-foreground nav-link">
                  Clients
                </Link>
              )}
              {activeTab === 'deleted' ? (
                <span className="text-sm font-medium text-foreground relative px-3 py-1.5">
                  Deleted
                  <div className="absolute bottom-[-16px] left-0 right-0 h-0.5 bg-foreground"></div>
                </span>
              ) : (
                <Link href="/projects/deleted" className="text-sm text-muted-foreground nav-link">
                  Deleted
                </Link>
              )}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/" className="btn btn-primary text-sm">
              New Project
            </Link>
            {session?.user && (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      className="w-8 h-8 rounded-full border border-border"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center border border-border">
                      <User className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-lg py-2 z-[100]">
                    <div className="px-4 py-3 border-b border-border">
                      <p className="text-sm font-medium text-foreground">{session.user.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{session.user.email}</p>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="w-full px-4 py-2 text-sm text-left text-muted-foreground hover:bg-muted transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile layout */}
        <div className="sm:hidden">
          {/* Top line: Figma Concierge + New Project button + User */}
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-semibold text-foreground hover:text-muted-foreground transition-colors">
              Figma Concierge
            </Link>
            <div className="flex items-center gap-2">
              <Link href="/" className="btn btn-primary text-sm">
                New Project
              </Link>
              {session?.user && (
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center hover:opacity-80 transition-opacity"
                  >
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || 'User'}
                        className="w-8 h-8 rounded-full border border-border"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center border border-border">
                        <User className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-lg py-2 z-[100]">
                      <div className="px-4 py-3 border-b border-border">
                        <p className="text-sm font-medium text-foreground">{session.user.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{session.user.email}</p>
                      </div>
                      <button
                        onClick={handleSignOut}
                        className="w-full px-4 py-2 text-sm text-left text-muted-foreground hover:bg-muted transition-colors flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          {/* Bottom line: Navigation */}
          <div className="pb-4">
            <nav className="flex items-center space-x-2">
              {activeTab === 'projects' ? (
                <span className="text-sm font-medium text-foreground relative px-3 py-1.5">
                  Projects
                  <div className="absolute bottom-[-20px] left-0 right-0 h-0.5 bg-foreground"></div>
                </span>
              ) : (
                <Link href="/projects" className="text-sm text-muted-foreground nav-link">
                  Projects
                </Link>
              )}
              {activeTab === 'clients' ? (
                <span className="text-sm font-medium text-foreground relative px-3 py-1.5">
                  Clients
                  <div className="absolute bottom-[-20px] left-0 right-0 h-0.5 bg-foreground"></div>
                </span>
              ) : (
                <Link href="/clients" className="text-sm text-muted-foreground nav-link">
                  Clients
                </Link>
              )}
              {activeTab === 'deleted' ? (
                <span className="text-sm font-medium text-foreground relative px-3 py-1.5">
                  Deleted
                  <div className="absolute bottom-[-20px] left-0 right-0 h-0.5 bg-foreground"></div>
                </span>
              ) : (
                <Link href="/projects/deleted" className="text-sm text-muted-foreground nav-link">
                  Deleted
                </Link>
              )}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
