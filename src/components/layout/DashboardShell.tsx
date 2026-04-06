'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  Menu,
  X,
  MessageSquare,
  FolderOpen,
  BookOpen,
  Receipt,
  Mic,
  GraduationCap,
  BarChart3,
  Users,
  FileText,
  Sun,
  Moon,
  LogOut,
  ChevronDown,
  Stethoscope,
} from 'lucide-react';

interface DashboardShellProps {
  user: {
    id: string;
    email: string;
    full_name: string;
    role: string;
    avatar_url?: string;
  };
  children: React.ReactNode;
}

const navigationItems = [
  { href: '/dashboard', label: 'Chat', icon: MessageSquare },
  { href: '/dashboard/cases', label: 'Cases', icon: FolderOpen },
  { href: '/dashboard/protocols', label: 'Protocols', icon: BookOpen },
  { href: '/dashboard/estimates', label: 'Estimates', icon: Receipt },
  { href: '/dashboard/recordings', label: 'Recordings', icon: Mic },
  { href: '/dashboard/quiz', label: 'Quiz', icon: GraduationCap },
  { href: '/dashboard/audit', label: 'Audit', icon: BarChart3 },
];

const adminNavigationItems = [
  { href: '/dashboard/admin/users', label: 'Users', icon: Users },
  { href: '/dashboard/admin/documents', label: 'Documents', icon: FileText },
];

export function DashboardShell({ user, children }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedModel, setSelectedModel] = useState('claude-sonnet-4');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Initialize theme and model from localStorage
  useEffect(() => {
    setMounted(true);
    const savedModel = localStorage.getItem('vetgl_model') || 'claude-sonnet-4';
    setSelectedModel(savedModel);

    const savedTheme = localStorage.getItem('vetgl_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const darkMode = savedTheme ? savedTheme === 'dark' : prefersDark;
    setIsDarkMode(darkMode);

    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('vetgl_theme', newDarkMode ? 'dark' : 'light');

    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Handle model change
  const handleModelChange = (model: string) => {
    setSelectedModel(model);
    localStorage.setItem('vetgl_model', model);
  };

  // Handle logout
  const handleLogout = async () => {
    const supabase = await createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  const isAdmin = user.role === 'admin';
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  if (!mounted) return null;

  return (
    <div className="flex h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-[var(--bg-sidebar)] border-r border-[var(--border-primary)] transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-6 border-b border-[var(--border-primary)]">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--accent-light)]">
              <Stethoscope className="w-6 h-6 text-[var(--accent)]" />
            </div>
            <span className="text-xl font-bold text-[var(--text-primary)]">VETGL.AI</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2 scrollbar-thin">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(item.href);
                    setSidebarOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    active
                      ? 'bg-[var(--accent-light)] text-[var(--accent)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </a>
              );
            })}

            {/* Admin Section */}
            {isAdmin && (
              <>
                <div className="pt-4 mt-4 border-t border-[var(--border-primary)]">
                  <p className="px-4 py-2 text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
                    Admin
                  </p>
                  {adminNavigationItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                      <a
                        key={item.href}
                        href={item.href}
                        onClick={(e) => {
                          e.preventDefault();
                          router.push(item.href);
                          setSidebarOpen(false);
                        }}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          active
                            ? 'bg-[var(--accent-light)] text-[var(--accent)]'
                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </a>
                    );
                  })}
                </div>
              </>
            )}
          </nav>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-[var(--bg-secondary)] border-b border-[var(--border-primary)] flex items-center justify-between px-6 gap-4">
          {/* Left: Menu toggle + Model selector */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors md:hidden"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>

            {/* Model selector */}
            <select
              value={selectedModel}
              onChange={(e) => handleModelChange(e.target.value)}
              className="px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-primary)] rounded-lg text-sm text-[var(--text-primary)] hover:border-[var(--accent)] focus:border-[var(--accent)] focus:outline-none transition-colors"
            >
              <option value="claude-sonnet-4">Claude Sonnet 4</option>
              <option value="claude-opus-4">Claude Opus 4</option>
              <option value="gpt-4o">GPT-4o</option>
              <option value="gpt-4o-mini">GPT-4o Mini</option>
            </select>
          </div>

          {/* Right: Theme toggle + User menu */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
              title={isDarkMode ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-[var(--text-secondary)]" />
              ) : (
                <Moon className="w-5 h-5 text-[var(--text-secondary)]" />
              )}
            </button>

            {/* User dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-[var(--accent-light)] flex items-center justify-center text-[var(--accent)] text-sm font-semibold">
                  {(user.full_name || user.email)
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()}
                </div>
                <span className="hidden sm:inline text-sm text-[var(--text-primary)]">
                  {user.full_name || user.email}
                </span>
                <ChevronDown className="w-4 h-4 text-[var(--text-secondary)]" />
              </button>

              {/* Dropdown menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg shadow-lg z-10">
                  <div className="px-4 py-3 border-b border-[var(--border-primary)]">
                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      {user.full_name || 'User'}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)]">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-[var(--bg-tertiary)] transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-auto bg-[var(--bg-primary)]">
          {children}
        </main>
      </div>
    </div>
  );
}
