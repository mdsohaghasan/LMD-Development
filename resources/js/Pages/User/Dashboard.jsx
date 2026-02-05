import React from 'react'
import StudentUserLayout from '@/Layouts/StudentUserLayout'
import { Link } from '@inertiajs/react'

export default function UserDashboard({ stats = {} }) {
    const wishlistCount = stats?.wishlist_count || 0
    const ordersCount = stats?.orders_count || 0
    const supportTicketsCount = stats?.support_tickets_count || 0

    return (
        <StudentUserLayout>
            {/* Profile Photo Prompt */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="text-xl">⚠️</span>
                    <span className="text-gray-700">Set Your Profile Photo</span>
                </div>
                <Link
                    href="/user/profile"
                    className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    Click Here
                </Link>
            </div>

            {/* Dashboard Header */}
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Enrolled Courses Card - Shows 0 for normal users */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex flex-col items-center text-center">
                        <div className="text-4xl mb-4">📚</div>
                        <div className="text-4xl font-bold text-gray-900 mb-2">0</div>
                        <div className="text-gray-600 font-medium">Enrolled Courses</div>
                        <p className="text-sm text-gray-500 mt-2">Enroll in a course to get started</p>
                    </div>
                </div>

                {/* Active Courses Card */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex flex-col items-center text-center">
                        <div className="text-4xl mb-4">🎓</div>
                        <div className="text-4xl font-bold text-gray-900 mb-2">0</div>
                        <div className="text-gray-600 font-medium">Active Courses</div>
                    </div>
                </div>

                {/* Completed Courses Card */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex flex-col items-center text-center">
                        <div className="text-4xl mb-4">🏆</div>
                        <div className="text-4xl font-bold text-gray-900 mb-2">0</div>
                        <div className="text-gray-600 font-medium">Completed Courses</div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="space-y-3">
                        <Link
                            href="/user/courses/browse"
                            className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <span className="font-medium text-gray-900">Browse Courses</span>
                            <span className="text-gray-600 ml-2">→</span>
                        </Link>
                        <Link
                            href="/user/wishlist"
                            className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <span className="font-medium text-gray-900">View Wishlist ({wishlistCount})</span>
                            <span className="text-gray-600 ml-2">→</span>
                        </Link>
                        <Link
                            href="/user/orders"
                            className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <span className="font-medium text-gray-900">Order History ({ordersCount})</span>
                            <span className="text-gray-600 ml-2">→</span>
                        </Link>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Support</h2>
                    <div className="space-y-3">
                        <Link
                            href="/user/support"
                            className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <span className="font-medium text-gray-900">Support Tickets ({supportTicketsCount})</span>
                            <span className="text-gray-600 ml-2">→</span>
                        </Link>
                        <Link
                            href="/user/profile"
                            className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <span className="font-medium text-gray-900">Update Profile</span>
                            <span className="text-gray-600 ml-2">→</span>
                        </Link>
                    </div>
                </div>
            </div>
        </StudentUserLayout>
    )
}
