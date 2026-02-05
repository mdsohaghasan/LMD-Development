import React from 'react'
import AdminSidebar from '@/Layouts/AdminSidebar'

export default function AdminLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-slate-900">
            <div className="flex">
                <AdminSidebar />
                <div className="flex-1 p-8">
                    <header className="mb-6">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Admin Panel</h1>
                        </div>
                    </header>

                    <main>
                        {children}
                    </main>
                </div>
            </div>
        </div>
    )
}
