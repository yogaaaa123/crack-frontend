'use client';

import { useState, type ReactNode } from 'react';
import { ShieldCheck, LayoutDashboard, Building2, LogOut, Menu, X } from 'lucide-react';
import Link from 'next/link';

interface Props {
  children: ReactNode;
}

export function SuperAdminShell({ children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-slate-200/60 bg-white/80 backdrop-blur-xl transition-transform duration-300 md:static md:z-auto md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-14 items-center justify-between border-b border-slate-200/60 px-4 md:h-16 md:px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-orange-600 text-white shadow-md md:h-9 md:w-9">
              <ShieldCheck className="h-4 w-4 md:h-5 md:w-5" />
            </div>
            <div>
              <span className="block text-sm font-bold tracking-tight text-slate-900 md:text-base">
                CrackPOS
              </span>
              <span className="block text-[10px] font-medium leading-tight text-slate-400 md:text-[11px]">
                Super Admin
              </span>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 md:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
            Platform
          </p>
          <ul className="flex flex-col gap-0.5">
            <li>
              <Link
                href="/super-admin/dashboard"
                onClick={() => setSidebarOpen(false)}
                className="group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-900"
              >
                <LayoutDashboard className="h-4.5 w-4.5 shrink-0 text-slate-400 group-hover:text-slate-600" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/super-admin/tenants"
                onClick={() => setSidebarOpen(false)}
                className="group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-900"
              >
                <Building2 className="h-4.5 w-4.5 shrink-0 text-slate-400 group-hover:text-slate-600" />
                Tenants
              </Link>
            </li>
          </ul>
        </nav>

        <div className="border-t border-slate-200/60 p-3">
          <form action="/super-admin/login" method="get">
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-all hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="h-4.5 w-4.5 shrink-0" />
              Logout
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200/60 bg-white/70 px-4 backdrop-blur-md md:h-16 md:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition-all hover:bg-slate-100 md:hidden"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-sm font-semibold tracking-tight text-slate-900 md:text-lg">
                Platform Administration
              </h1>
              <p className="hidden text-xs text-slate-400 md:block">
                {new Date().toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
          <span className="rounded-lg bg-rose-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-rose-600 md:px-2.5 md:py-1 md:text-[11px]">
            Super Admin
          </span>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
