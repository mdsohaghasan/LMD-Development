import React from 'react'
import StudentUserLayout from '@/Layouts/StudentUserLayout'
import { Link } from '@inertiajs/react'

export default function StudentDashboard({ enrollments = [], stats = {} }) {
    const enrolledCount = enrollments?.length || 0
    const activeCount = enrollments?.filter(e => e.status === 'active').length || 0
    const completedCount = enrollments?.filter(e => e.status === 'completed').length || 0

    return (
        <StudentUserLayout>
            {/* Profile Photo Prompt */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="text-xl">⚠️</span>
                    <span className="text-gray-700">Set Your Profile Photo</span>
                </div>
                <Link
                    href="/student/profile"
                    className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    Click Here
                </Link>
            </div>

            {/* Dashboard Header */}
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Enrolled Courses Card */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex flex-col items-center text-center">
                        <div className="text-4xl mb-4">📚</div>
                        <div className="text-4xl font-bold text-gray-900 mb-2">{enrolledCount}</div>
                        <div className="text-gray-600 font-medium">Enrolled Courses</div>
                    </div>
                </div>

                {/* Active Courses Card */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex flex-col items-center text-center">
                        <div className="text-4xl mb-4">🎓</div>
                        <div className="text-4xl font-bold text-gray-900 mb-2">{activeCount}</div>
                        <div className="text-gray-600 font-medium">Active Courses</div>
                    </div>
                </div>

                {/* Completed Courses Card */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex flex-col items-center text-center">
                        <div className="text-4xl mb-4">🏆</div>
                        <div className="text-4xl font-bold text-gray-900 mb-2">{completedCount}</div>
                        <div className="text-gray-600 font-medium">Completed Courses</div>
                    </div>
                </div>
            </div>

            {/* Recent Enrollments */}
            {enrollments && enrollments.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">My Enrolled Courses</h2>
                    <div className="space-y-4">
                        {enrollments.slice(0, 5).map((enrollment) => (
                            <div key={enrollment.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <span className="text-2xl">📚</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{enrollment.course?.title || 'Course'}</h3>
                                        <p className="text-sm text-gray-600">Progress: {enrollment.progress_percentage || 0}%</p>
                                    </div>
                                </div>
                                <Link
                                    href={`/student/courses/${enrollment.course_id}`}
                                    className="text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    View Course →
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </StudentUserLayout>
    )
}
