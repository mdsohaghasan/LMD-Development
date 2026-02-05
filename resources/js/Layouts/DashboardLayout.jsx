import React from 'react'
import { usePage } from '@inertiajs/react'
import RoleSidebar from '@/Components/RoleSidebar'

export default function DashboardLayout({ children }) {
    const { auth } = usePage().props

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex gap-6">
                    <RoleSidebar />

                    <div className="flex-1">
                        <div className="mb-6">
                            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{auth.user ? `Hello, ${auth.user.name}` : 'Dashboard'}</h1>
                        </div>

                        <div>
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
