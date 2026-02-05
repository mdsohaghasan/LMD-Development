import React from 'react'
import AdminTeacherLayout from '@/Layouts/AdminTeacherLayout'

export default function AdminDashboard({ stats = {}, recentActivity = [] }) {
    const today = new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    })

    return (
        <AdminTeacherLayout role="admin">
            {/* Greeting */}
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    As-Salamu Alikum, Today: {today}
                </h1>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Students */}
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">TOTAL STUDENTS</h3>
                        <span className="text-green-600 text-sm font-semibold">+36% ↑</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalStudents || 0}</p>
                </div>

                {/* Total Sales */}
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">TOTAL SALES</h3>
                        <span className="text-red-600 text-sm font-semibold">+14% ↓</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        ${(stats.totalRevenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                </div>

                {/* Total Orders */}
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">TOTAL ORDERS</h3>
                        <span className="text-green-600 text-sm font-semibold">+36% ↑</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalOrders || 0}</p>
                </div>

                {/* Total Customers */}
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">TOTAL CUSTOMERS</h3>
                        <span className="text-green-600 text-sm font-semibold">+36% ↑</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {(stats.totalStudents || 0) + (stats.totalUsers || 0)}
                    </p>
                </div>
            </div>

            {/* Charts and Lists Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Sales Report */}
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Sales Report</h2>
                        <div className="flex items-center gap-2">
                            <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded">12 Months</button>
                            <button className="px-3 py-1 text-gray-600 dark:text-gray-400 text-sm rounded hover:bg-gray-100 dark:hover:bg-slate-700">6 Months</button>
                            <button className="px-3 py-1 text-gray-600 dark:text-gray-400 text-sm rounded hover:bg-gray-100 dark:hover:bg-slate-700">30 Days</button>
                            <button className="px-3 py-1 text-gray-600 dark:text-gray-400 text-sm rounded hover:bg-gray-100 dark:hover:bg-slate-700">7 Days</button>
                            <button className="px-3 py-1 text-gray-600 dark:text-gray-400 text-sm rounded hover:bg-gray-100 dark:hover:bg-slate-700">Export PDF</button>
                        </div>
                    </div>
                    <div className="h-64 bg-gray-50 dark:bg-slate-900 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500 dark:text-gray-400">Chart visualization coming soon</p>
                    </div>
                </div>

                {/* Traffic Sources */}
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Traffic Sources</h2>
                        <select className="px-3 py-1 border border-gray-300 dark:border-slate-600 rounded text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                            <option>Last 12 Months</option>
                        </select>
                    </div>
                    <div className="space-y-4">
                        {[
                            { name: 'Direct', value: 143382, percentage: 100 },
                            { name: 'Referral', value: 87974, percentage: 61 },
                            { name: 'Social Media', value: 45211, percentage: 32 },
                            { name: 'Twitter', value: 21893, percentage: 15 },
                        ].map((source, index) => (
                            <div key={index}>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">{source.name}</span>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">{source.value.toLocaleString()}</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                                    <div 
                                        className="bg-blue-600 h-2 rounded-full" 
                                        style={{ width: `${source.percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Transactions and Recent Customers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Transactions */}
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Transactions</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Lorem ipsum dolor sit amet, consectetur adipiscing.</p>
                        </div>
                        <a href="/admin/payments" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                            See All Transactions →
                        </a>
                    </div>
                    <div className="space-y-4">
                        {[
                            { card: 'Visa card **** 4831', amount: '$182.94', date: 'Jan 17, 2022', platform: 'Amazon', status: 'Completed' },
                            { card: 'Mastercard **** 6442', amount: '$99.00', date: 'Jan 17, 2022', platform: 'Facebook', status: 'Completed' },
                        ].map((transaction, index) => (
                            <div key={index} className="flex items-center justify-between p-4 border border-gray-100 dark:border-slate-700 rounded-lg">
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">{transaction.card}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{transaction.platform} • {transaction.date}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-gray-900 dark:text-white">{transaction.amount}</p>
                                    <span className="inline-flex items-center gap-1 text-xs text-green-600">
                                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                        {transaction.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Customers */}
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Customers</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Lorem ipsum dolor sit ametis.</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {[
                            { name: 'Jenny Wilson', email: 'w.lawson@example.com', amount: '$11,234', location: 'Austin' },
                            { name: 'Devon Lane', email: 'dat.robert@example.com', amount: '$11,159', location: 'New York' },
                        ].map((customer, index) => (
                            <div key={index} className="flex items-center justify-between p-4 border border-gray-100 dark:border-slate-700 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-semibold">
                                        {customer.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">{customer.name}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{customer.email}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-500">{customer.location}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-gray-900 dark:text-white">{customer.amount}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminTeacherLayout>
    )
}
