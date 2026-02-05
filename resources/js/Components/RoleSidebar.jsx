import React from 'react'
import { Link, usePage } from '@inertiajs/react'

export default function RoleSidebar() {
    const { auth } = usePage().props
    const user = auth?.user
    const role = user?.role || 'guest'

    const renderLink = (href, label) => (
        <Link href={href} className="block py-2 px-3 rounded hover:bg-blue-50 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-200">{label}</Link>
    )

    const userMenu = (
        <div>
            <div className="mb-4 font-semibold text-gray-700 dark:text-gray-200">User Panel</div>
            {renderLink('/user', 'Dashboard')}
            {renderLink('/profile', 'My Profile')}
            {renderLink('/courses', 'Browse Courses')}
            {renderLink('/wishlist', 'Wishlist')}
            {renderLink('/orders', 'Order History')}
            {renderLink('/support', 'Support')}
        </div>
    )

    const studentMenu = (
        <div>
            <div className="mb-4 font-semibold text-gray-700 dark:text-gray-200">Student Panel</div>
            {renderLink('/student', 'Dashboard')}
            {renderLink('/student/enrollments', 'Enrolled Courses')}
            {renderLink('/student/progress', 'Progress')}
            {renderLink('/student/assignments', 'Assignments')}
            {renderLink('/student/quizzes', 'Quizzes & Exams')}
            {renderLink('/student/certificates', 'Certificates')}
            {renderLink('/support', 'Support')}
        </div>
    )

    const teacherMenu = (
        <div>
            <div className="mb-4 font-semibold text-gray-700 dark:text-gray-200">Teaching</div>
            {renderLink('/teacher', 'Dashboard')}
            {renderLink('/teacher/courses', 'My Courses')}
            {renderLink('/teacher/courses/create', 'Create Course')}
            {renderLink('/teacher/lessons', 'Lessons')}
            {renderLink('/teacher/assignments', 'Assignments')}
            {renderLink('/teacher/quizzes', 'Quizzes')}
            {renderLink('/teacher/live-classes', 'Live Classes')}
            {renderLink('/teacher/students', 'My Students')}
            {renderLink('/support', 'Support')}
        </div>
    )

    const adminMenu = (
        <div>
            <div className="mb-4 font-semibold text-gray-700 dark:text-gray-200">Admin Panel</div>
            {renderLink('/admin', 'Dashboard')}
            {renderLink('/admin/courses', 'Courses')}
            {renderLink('/admin/lessons', 'Lessons')}
            {renderLink('/admin/users', 'Users')}
            {renderLink('/admin/payments', 'Payments')}
            {renderLink('/admin/reports', 'Reports')}
            {renderLink('/admin/settings', 'Settings')}
        </div>
    )

    return (
        <aside className="w-72 bg-white dark:bg-slate-800 rounded shadow p-4 min-h-[70vh]">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-lg text-blue-600">{user?.name?.split(' ').map(n => n[0]).slice(0,2).join('') || 'U'}</div>
                <div>
                    <div className="font-semibold text-gray-900 dark:text-white">{user?.name || 'Guest'}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-300">{role?.toUpperCase()}</div>
                </div>
            </div>

            <nav className="space-y-4">
                {/* Everyone sees basic user items */}
                {userMenu}

                {/* Student-specific items only if role student or (user promoted with enrollments) */}
                {role === 'student' && studentMenu}

                {/* Teacher-specific */}
                {role === 'teacher' && teacherMenu}

                {/* Admin-specific */}
                {role === 'admin' && adminMenu}

                <div className="mt-6">
                    <form method="post" action="/logout">
                        <button type="submit" className="w-full py-2 px-3 rounded bg-red-600 text-white">Logout</button>
                    </form>
                </div>
            </nav>
        </aside>
    )
}
