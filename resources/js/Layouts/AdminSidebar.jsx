import React from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function AdminSidebar() {
  const { auth } = usePage().props;
  const user = auth?.user;

  return (
    <aside className="w-72 bg-white dark:bg-slate-800 min-h-screen p-6 border-r dark:border-slate-700">
      <div className="mb-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-lg text-blue-600">{user?.name?.split(' ').map(n => n[0]).slice(0,2).join('') || 'A'}</div>
        <div>
          <div className="font-semibold text-gray-900 dark:text-white">{user?.name || 'Admin'}</div>
          <div className="text-sm text-gray-500 dark:text-gray-300">Administrator</div>
        </div>
      </div>

      <nav className="flex flex-col gap-2">
        <Link className="font-semibold text-lg mb-4 text-blue-600 dark:text-blue-400" href="/admin">Overview</Link>
        <Link className="py-2 px-3 rounded hover:bg-blue-50 dark:hover:bg-slate-700" href="/admin/courses">Courses</Link>
        <Link className="py-2 px-3 rounded hover:bg-blue-50 dark:hover:bg-slate-700" href="/admin/lessons">Lessons</Link>
        <Link className="py-2 px-3 rounded hover:bg-blue-50 dark:hover:bg-slate-700" href="/admin/users">Users</Link>
        <Link className="py-2 px-3 rounded hover:bg-blue-50 dark:hover:bg-slate-700" href="/admin/payments">Payments</Link>
        <Link className="py-2 px-3 rounded hover:bg-blue-50 dark:hover:bg-slate-700" href="/admin/reports">Reports</Link>
        <Link className="py-2 px-3 rounded hover:bg-blue-50 dark:hover:bg-slate-700" href="/admin/settings">Settings</Link>
      </nav>
    </aside>
  );
}
