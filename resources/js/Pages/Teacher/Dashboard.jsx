import React from 'react'
import AdminTeacherLayout from '@/Layouts/AdminTeacherLayout'
import { Link } from '@inertiajs/react'

export default function TeacherDashboard({ courses = [], stats = {} }) {
    const today = new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    })

    return (
        <AdminTeacherLayout role="teacher">
            {/* Greeting */}
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    As-Salamu Alikum, Today: {today}
                </h1>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Courses */}
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">MY COURSES</h3>
                        <span className="text-green-600 text-sm font-semibold">+{courses.length} ↑</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalCourses || courses.length || 0}</p>
                </div>

                {/* Total Students */}
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">MY STUDENTS</h3>
                        <span className="text-green-600 text-sm font-semibold">+{stats.totalStudents || 0} ↑</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalStudents || 0}</p>
                </div>

                {/* Total Lessons */}
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">TOTAL LESSONS</h3>
                        <span className="text-green-600 text-sm font-semibold">+{stats.totalLessons || 0} ↑</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalLessons || 0}</p>
                </div>

                {/* Pending Assignments */}
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">PENDING REVIEWS</h3>
                        <span className="text-red-600 text-sm font-semibold">{stats.pendingAssignments || 0}</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.pendingAssignments || 0}</p>
                </div>
            </div>

            {/* My Courses */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">My Courses</h2>
                    <Link
                        href="/teacher/courses"
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                        View All →
                    </Link>
                </div>
                {courses.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500 dark:text-gray-400 mb-4">No courses yet</p>
                        <Link
                            href="/teacher/courses"
                            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Create Your First Course
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {courses.slice(0, 6).map((course) => (
                            <div key={course.id} className="border border-gray-200 dark:border-slate-700 rounded-lg p-4 hover:shadow-lg transition-shadow">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{course.title}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{course.description}</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        {course.enrollments_count || 0} Students
                                    </span>
                                    <Link
                                        href={`/teacher/courses/${course.id}`}
                                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                    >
                                        Manage →
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Students */}
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Students</h2>
                    <div className="space-y-3">
                        <p className="text-sm text-gray-500 dark:text-gray-400">View student enrollments in your courses</p>
                        <Link
                            href="/teacher/courses"
                            className="inline-block text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                            View All Students →
                        </Link>
                    </div>
                </div>

                {/* Pending Assignments */}
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Pending Assignments</h2>
                    <div className="space-y-3">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            You have {stats.pendingAssignments || 0} assignments waiting for review
                        </p>
                        <Link
                            href="/teacher/assignments"
                            className="inline-block text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                            Review Assignments →
                        </Link>
                    </div>
                </div>
            </div>
        </AdminTeacherLayout>
    )
}
