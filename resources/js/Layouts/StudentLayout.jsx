import React from 'react'
import { Link } from '@inertiajs/react'

export default function StudentLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                    <div className="flex gap-6">
                        {/* Left profile/navigation column */}
                        <aside className="w-64 border-r pr-6">
                            <div className="flex flex-col items-center text-center mb-6">
                                <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-2xl text-blue-600">SH</div>
                                <div className="mt-3 font-semibold text-gray-900 dark:text-white">Student Name</div>
                                <div className="text-sm text-gray-500 dark:text-gray-300">Student</div>
                            </div>

                            <nav className="space-y-2">
                                <Link href="/student" className="block py-2 px-3 rounded hover:bg-blue-50 dark:hover:bg-slate-700">Dashboard</Link>
                                <Link href="/student/enrollments" className="block py-2 px-3 rounded hover:bg-blue-50 dark:hover:bg-slate-700">Enrolled Courses</Link>
                                <Link href="/student/progress" className="block py-2 px-3 rounded hover:bg-blue-50 dark:hover:bg-slate-700">Progress</Link>
                                <Link href="/student/assignments" className="block py-2 px-3 rounded hover:bg-blue-50 dark:hover:bg-slate-700">Assignments</Link>
                                <Link href="/student/quizzes" className="block py-2 px-3 rounded hover:bg-blue-50 dark:hover:bg-slate-700">Quizzes</Link>
                                <Link href="/student/certificates" className="block py-2 px-3 rounded hover:bg-blue-50 dark:hover:bg-slate-700">Certificates</Link>
                                <Link href="/support" className="block py-2 px-3 rounded hover:bg-blue-50 dark:hover:bg-slate-700">Support</Link>
                            </nav>
                        </aside>

                        {/* Main content */}
                        <div className="flex-1">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
