'use client';

import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle/ThemeToggle';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">TodoApp</h1>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-foreground/70 hover:text-primary transition-colors"
            >
              Login
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-pretty mb-6 text-foreground">
            Organize Your Life with Smart Tasks
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto text-pretty">
            Powerful task management with priorities, tags, search, and filtering.
            Stay organized and boost your productivity.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/signup"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-8 rounded-lg shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="bg-muted hover:bg-muted/80 text-muted-foreground font-semibold py-3 px-8 rounded-lg border border-border transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-foreground mb-16">
            Powerful Organization Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card border border-border p-8 rounded-xl shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Smart Priorities</h3>
              <p className="text-muted-foreground">
                Assign high, medium, or low priority to tasks with visual indicators.
                Focus on what matters most.
              </p>
            </div>

            <div className="bg-card border border-border p-8 rounded-xl shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Flexible Tags</h3>
              <p className="text-muted-foreground">
                Organize tasks with custom tags. Group by work, personal, or any category you need.
              </p>
            </div>

            <div className="bg-card border border-border p-8 rounded-xl shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Powerful Search</h3>
              <p className="text-muted-foreground">
                Find tasks instantly with keyword search. Filter by status, priority, or tags.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-16">
            Get Started in 3 Simple Steps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Sign Up</h3>
              <p className="text-muted-foreground">
                Create your free account in seconds
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-secondary">2</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Add Tasks</h3>
              <p className="text-muted-foreground">
                Create tasks with priorities and tags
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Organize</h3>
              <p className="text-muted-foreground">
                Search, filter, and sort to stay organized
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-foreground mb-8">
            Intuitive Dashboard
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Manage your tasks with visual priority indicators, tags, and powerful filtering.
          </p>

          {/* Mock Dashboard Preview */}
          <div className="bg-card border border-border rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
              <h3 className="text-lg font-semibold text-foreground">My Tasks</h3>
              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                <div className="relative flex-1 lg:flex-none">
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <div className="absolute left-3 top-2.5 text-muted-foreground">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                <select className="rounded-lg border border-input bg-background text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                  <option>All Status</option>
                  <option>Pending</option>
                  <option>Completed</option>
                </select>

                <select className="rounded-lg border border-input bg-background text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                  <option>All Priorities</option>
                  <option>High Priority</option>
                  <option>Medium Priority</option>
                  <option>Low Priority</option>
                </select>

                <select className="rounded-lg border border-input bg-background text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                  <option>All Tags</option>
                  <option>Work</option>
                  <option>Personal</option>
                  <option>Urgent</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {/* Sample Task Card 1 */}
              <div className="group relative rounded-lg border border-border bg-background p-6 shadow-sm hover:shadow-md transition-all">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100/70 dark:bg-red-500/20 px-3 py-1.5 text-xs font-semibold text-red-700 dark:text-red-300 border border-red-200/50 dark:border-red-500/30">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-600 dark:bg-red-400" />
                    High
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 dark:bg-green-900/30 px-3 py-1 text-xs font-semibold text-green-700 dark:text-green-300 border border-green-200/50 dark:border-green-500/30">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    Completed
                  </span>
                </div>
                <div className="mb-4">
                  <h3 className="text-base font-semibold text-muted-foreground line-through">
                    Complete project proposal
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    Finish the quarterly project proposal document and send to stakeholders
                  </p>
                </div>
                <div className="mb-4 space-y-0.5 text-xs text-muted-foreground">
                  <p>Created: Feb 1, 2026</p>
                  <p>Updated: Feb 5, 2026</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-secondary/15 px-3 py-1.5 text-xs font-medium text-secondary dark:bg-secondary/20">
                    work
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-secondary/15 px-3 py-1.5 text-xs font-medium text-secondary dark:bg-secondary/20">
                    urgent
                  </span>
                </div>
              </div>

              {/* Sample Task Card 2 */}
              <div className="group relative rounded-lg border border-border bg-background p-6 shadow-sm hover:shadow-md transition-all">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100/70 dark:bg-amber-500/20 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300 border border-amber-200/50 dark:border-amber-500/30">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-600 dark:bg-amber-400" />
                    Medium
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300 border border-amber-200/50 dark:border-amber-500/30">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    Pending
                  </span>
                </div>
                <div className="mb-4">
                  <h3 className="text-base font-semibold text-foreground">
                    Schedule team meeting
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    Set up recurring team sync for project updates
                  </p>
                </div>
                <div className="mb-4 space-y-0.5 text-xs text-muted-foreground">
                  <p>Created: Feb 5, 2026</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-secondary/15 px-3 py-1.5 text-xs font-medium text-secondary dark:bg-secondary/20">
                    work
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-secondary/15 px-3 py-1.5 text-xs font-medium text-secondary dark:bg-secondary/20">
                    meeting
                  </span>
                </div>
              </div>

              {/* Sample Task Card 3 */}
              <div className="group relative rounded-lg border border-border bg-background p-6 shadow-sm hover:shadow-md transition-all">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100/70 dark:bg-blue-500/20 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-500/30">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                    Low
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300 border border-amber-200/50 dark:border-amber-500/30">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    Pending
                  </span>
                </div>
                <div className="mb-4">
                  <h3 className="text-base font-semibold text-foreground">
                    Organize desk space
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    Clean up and arrange office supplies for better workflow
                  </p>
                </div>
                <div className="mb-4 space-y-0.5 text-xs text-muted-foreground">
                  <p>Created: Feb 6, 2026</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-secondary/15 px-3 py-1.5 text-xs font-medium text-secondary dark:bg-secondary/20">
                    personal
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-blue-300 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to boost your productivity?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
            Join thousands of users who organize their tasks better with TodoApp.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-primary-foreground hover:bg-primary-foreground/90 text-primary font-semibold py-3 px-8 rounded-lg transition-all hover:shadow-lg hover:-translate-y-0.5"
          >
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2026 TodoApp. Organize your life, boost your productivity.
          </p>
        </div>
      </footer>
    </div>
  );
}
