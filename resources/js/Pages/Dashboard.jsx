import React from 'react'
import AppLayout from '@/Layouts/AppLayout'

export default function Dashboard() {
    return (
        <AppLayout>
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome to the LMS Dashboard</h1>
                <p className="mt-4 text-gray-600 dark:text-gray-400">This is the initial SPA test page. Use the sidebar to navigate.</p>
            </div>
        </AppLayout>
    )
}
