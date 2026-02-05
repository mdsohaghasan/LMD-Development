import React, { useState } from 'react'
import { Link, usePage, router } from '@inertiajs/react'

export default function AdminTeacherLayout({ children, role = 'admin' }) {
    const { auth } = usePage().props
    const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true')
    const user = auth.user

    const toggleDarkMode = () => {
        const newDarkMode = !darkMode
        setDarkMode(newDarkMode)
        localStorage.setItem('darkMode', newDarkMode)
        document.documentElement.classList.toggle('dark', newDarkMode)
    }

    const handleLogout = (e) => {
        e.preventDefault()
        router.post('/logout')
    }

    // Navigation items based on role
    const getNavItems = () => {
        if (role === 'admin') {
            return [
                { section: 'Overview', items: [
                    { label: 'Overview', icon: '📊', href: '/admin/dashboard' }
                ]},
                { section: 'Academy', items: [
                    { label: 'Overview', icon: '🔄', href: '/admin/courses' },
                    { label: 'Student', icon: '👤', href: '/admin/users?role=student' },
                    { label: 'Classroom', icon: '🖥️', href: '/admin/classrooms' },
                    { label: 'Subject/Course', icon: '📚', href: '/admin/courses' },
                    { label: 'Exam', icon: '📋', href: '/admin/exams' },
                    { label: 'Result', icon: '📄', href: '/admin/results' },
                    { label: 'Attendance/Routine', icon: '📅', href: '/admin/attendance' },
                    { label: 'Teacher', icon: '👨‍🏫', href: '/admin/users?role=teacher' },
                ]},
                { section: 'Account', items: [
                    { label: 'Overview', icon: '🔄', href: '/admin/payments' },
                    { label: 'Income', icon: '💰', href: '/admin/payments' },
                    { label: 'Expanse', icon: '💳', href: '/admin/expenses' },
                    { label: 'Salary', icon: '💵', href: '/admin/salary' },
                ]}
            ]
        } else {
            // Teacher navigation
            return [
                { section: 'Overview', items: [
                    { label: 'Overview', icon: '📊', href: '/teacher/dashboard' }
                ]},
                { section: 'Academy', items: [
                    { label: 'Overview', icon: '🔄', href: '/teacher/courses' },
                    { label: 'Student', icon: '👤', href: '/teacher/students' },
                    { label: 'Classroom', icon: '🖥️', href: '/teacher/live-classes' },
                    { label: 'Subject/Course', icon: '📚', href: '/teacher/courses' },
                    { label: 'Exam', icon: '📋', href: '/teacher/quizzes' },
                    { label: 'Result', icon: '📄', href: '/teacher/results' },
                    { label: 'Attendance/Routine', icon: '📅', href: '/teacher/attendance' },
                ]},
                { section: 'Account', items: [
                    { label: 'Overview', icon: '🔄', href: '/teacher/payments' },
                    { label: 'Income', icon: '💰', href: '/teacher/income' },
                ]}
            ]
        }
    }

    const navItems = getNavItems()
    const basePath = role === 'admin' ? '/admin' : '/teacher'

    return (
        <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
            <div className="flex flex-col h-screen">
                {/* Top Header */}
                <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Left Side - Logo and Search */}
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                                    {role === 'admin' ? 'A' : 'T'}
                                </div>
                                <span className="text-xl font-bold text-gray-900 dark:text-white">
                                    {role === 'admin' ? 'Habrul Ummah' : 'Teacher Panel'}
                                </span>
                            </div>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Type to search"
                                    className="w-64 pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                            </div>
                        </div>

                        {/* Right Side - Icons and Profile */}
                        <div className="flex items-center gap-4">
                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                                <span className="text-xl">🔲</span>
                            </button>
                            <button className="relative p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                                <span className="text-xl">🔔</span>
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>
                            <button
                                onClick={toggleDarkMode}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            >
                                <span className="text-xl">{darkMode ? '☀️' : '🌙'}</span>
                            </button>
                            <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-slate-600 flex items-center justify-center">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <span className="text-gray-600 dark:text-gray-300 font-semibold">
                                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex flex-1 overflow-hidden">
                    {/* Left Sidebar */}
                    <aside className="w-64 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 overflow-y-auto">
                        <div className="p-4">
                            {/* Visit Site Button */}
                            <Link
                                href="/"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg mb-6 block text-center transition-colors"
                            >
                                + Visit Site
                            </Link>

                            {/* Navigation Sections */}
                            {navItems.map((section, sectionIndex) => (
                                <div key={sectionIndex} className="mb-6">
                                    <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-2">
                                        {section.section}
                                    </div>
                                    <nav className="space-y-1">
                                        {section.items.map((item, itemIndex) => {
                                            const isActive = window.location.pathname === item.href ||
                                                           (item.label === 'Overview' && section.section === 'Overview' && 
                                                            (window.location.pathname === '/admin/dashboard' || window.location.pathname === '/teacher/dashboard'))
                                            return (
                                                <Link
                                                    key={itemIndex}
                                                    href={item.href}
                                                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                                                        isActive
                                                            ? 'bg-blue-600 text-white'
                                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                                                    }`}
                                                >
                                                    <span className="text-lg">{item.icon}</span>
                                                    <span className="text-sm font-medium">{item.label}</span>
                                                </Link>
                                            )
                                        })}
                                    </nav>
                                </div>
                            ))}
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-slate-900">
                        <div className="p-6">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}
