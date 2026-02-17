'use client';

import { SignupForm } from '@/components/SignupForm/SignupForm';
import { ThemeToggle } from '@/components/ThemeToggle/ThemeToggle';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Theme Toggle */}
        <div className="flex justify-end">
          <ThemeToggle />
        </div>

        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary">
            TodoApp
          </h1>
          <h2 className="mt-2 text-lg text-muted-foreground">
            Create your account
          </h2>
        </div>

        {/* Signup Form */}
        <div className="rounded-xl border border-border bg-card px-8 py-10 shadow-lg">
          <SignupForm />
        </div>

        {/* Login Link */}
        <div className="text-center text-sm">
          <span className="text-muted-foreground">Already have an account? </span>
          <Link
            href="/login"
            className="font-medium text-primary hover:text-primary/80 hover:underline transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
