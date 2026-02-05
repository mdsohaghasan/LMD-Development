import React, { useState } from 'react'
import { Link, usePage } from '@inertiajs/react'
import LanguageSwitcher from '@/Components/LanguageSwitcher'
import FlashMessage from '@/Components/FlashMessage'

export default function AppLayout({ children }) {
    const { auth } = usePage().props
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true')

    const toggleDarkMode = () => {
        const newDarkMode = !darkMode
        setDarkMode(newDarkMode)
        localStorage.setItem('darkMode', newDarkMode)
        document.documentElement.classList.toggle('dark', newDarkMode)
    }

    const userRole = auth.user ? auth.user.role : null
    const dashboardLink = auth.user
        ? (userRole === 'admin' ? '/admin' : userRole === 'teacher' ? '/teacher' : userRole === 'student' ? '/student' : '/user')
        : '/'

    return (
        <div className={darkMode ? 'dark' : ''}>
            <FlashMessage />
            <div className="min-h-screen bg-white dark:bg-slate-900">
                {/* Navigation */}
                <nav className="bg-white dark:bg-slate-800 shadow">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center">
                                <Link href={dashboardLink} className="text-xl font-bold text-blue-600 dark:text-blue-400">
                                    LMS
                                </Link>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <LanguageSwitcher />
                                </div>
                                <button
                                    onClick={toggleDarkMode}
                                    className="p-2 rounded-lg bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300"
                                >
                                    {darkMode ? '☀️' : '🌙'}
                                </button>
                                {auth.user ? (
                                    <>
                                        <span className="text-gray-700 dark:text-gray-300">{auth.user.name}</span>
                                        <Link href="/logout" method="post" className="px-4 py-2 bg-red-600 text-white rounded">
                                            Logout
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        {/* SPA navigation to Inertia auth pages */}
                                        <Link href="/login" className="px-4 py-2 bg-blue-600 text-white rounded">Login</Link>
                                        <Link href="/register" className="px-4 py-2 bg-gray-200 rounded">Register</Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Main content */}
                <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
