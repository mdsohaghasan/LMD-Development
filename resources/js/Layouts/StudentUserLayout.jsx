import React, { useState, useEffect } from 'react'
import { Link, usePage, router } from '@inertiajs/react'

export default function StudentUserLayout({ children }) {
    const { auth, url } = usePage().props
    const [activeTab, setActiveTab] = useState('dashboard')
    const user = auth.user
    
    // Update active tab when URL changes
    useEffect(() => {
        const currentPath = url.replace(/\/$/, '')
        const activeItem = menuItems.find(item => {
            const itemPath = item.href.replace(/\/$/, '')
            return currentPath === itemPath || 
                   (item.id === 'dashboard' && (currentPath === '/student' || currentPath === '/user')) ||
                   (item.id === 'courses' && (currentPath.startsWith('/student/courses') || currentPath.startsWith('/user/courses'))) ||
                   (item.id === 'quizzes' && currentPath.startsWith('/student/quizzes')) ||
                   (item.id === 'orders' && (currentPath.startsWith('/student/orders') || currentPath.startsWith('/user/orders'))) ||
                   (item.id === 'wishlist' && currentPath.startsWith('/user/wishlist')) ||
                   (item.id === 'qa' && (currentPath.startsWith('/student/support') || currentPath.startsWith('/user/support'))) ||
                   (item.id === 'profile' && (currentPath.startsWith('/student/profile') || currentPath.startsWith('/user/profile')))
        })
        if (activeItem) {
            setActiveTab(activeItem.id)
        }
    }, [url])

    const getInitials = (name) => {
        if (!name) return 'U'
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }

    const handleLogout = (e) => {
        e.preventDefault()
        router.post('/logout')
    }

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: '📊', href: user?.role === 'student' ? '/student' : '/user' },
        { id: 'profile', label: 'My Profile', icon: '👤', href: user?.role === 'student' ? '/student/profile' : '/user/profile' },
        { id: 'courses', label: 'Enrolled Courses', icon: '🎓', href: user?.role === 'student' ? '/student/courses' : '/user/courses/browse' },
        { id: 'reviews', label: 'Reviews', icon: '⭐', href: user?.role === 'student' ? '/student/reviews' : '/user/reviews' },
        { id: 'quizzes', label: 'My Quiz Attempts', icon: '📝', href: user?.role === 'student' ? '/student/quizzes' : '#' },
        { id: 'wishlist', label: 'Wishlist', icon: '🔖', href: user?.role === 'student' ? '/user/wishlist' : '/user/wishlist' },
        { id: 'orders', label: 'Order History', icon: '🛒', href: user?.role === 'student' ? '/student/orders' : '/user/orders' },
        { id: 'qa', label: 'Question & Answer', icon: '💬', href: user?.role === 'student' ? '/student/support' : '/user/support' },
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="flex">
                {/* Left Sidebar */}
                <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
                    <div className="p-6">
                        {/* User Avatar and Greeting */}
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-semibold">
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        getInitials(user?.name || 'User')
                                    )}
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Hello,</div>
                                    <div className="text-lg font-semibold text-gray-900">{user?.name || 'User'}</div>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Menu */}
                        <nav className="space-y-1">
                            {menuItems.map((item) => {
                                const currentPath = (url || window.location.pathname).replace(/\/$/, '')
                                const itemPath = item.href.replace(/\/$/, '')
                                const isActive = currentPath === itemPath || 
                                               (item.id === 'dashboard' && (currentPath === '/student' || currentPath === '/user')) ||
                                               (item.id === 'courses' && (currentPath.startsWith('/student/courses') || currentPath.startsWith('/user/courses'))) ||
                                               (item.id === 'quizzes' && currentPath.startsWith('/student/quizzes')) ||
                                               (item.id === 'orders' && (currentPath.startsWith('/student/orders') || currentPath.startsWith('/user/orders'))) ||
                                               (item.id === 'wishlist' && currentPath.startsWith('/user/wishlist')) ||
                                               (item.id === 'qa' && (currentPath.startsWith('/student/support') || currentPath.startsWith('/user/support'))) ||
                                               (item.id === 'profile' && (currentPath.startsWith('/student/profile') || currentPath.startsWith('/user/profile')))
                                return (
                                    <Link
                                        key={item.id}
                                        href={item.href}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                            isActive
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                        onClick={() => setActiveTab(item.id)}
                                    >
                                        <span className="text-xl">{item.icon}</span>
                                        <span className="font-medium">{item.label}</span>
                                    </Link>
                                )
                            })}

                            {/* Divider */}
                            <div className="border-t border-gray-200 my-4"></div>

                            {/* Settings and Logout */}
                            <Link
                                href={user?.role === 'student' ? '/student/settings' : '/user/settings'}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                <span className="text-xl">⚙️</span>
                                <span className="font-medium">Settings</span>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                <span className="text-xl">🚪</span>
                                <span className="font-medium">Logout</span>
                            </button>
                        </nav>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 bg-gray-50">
                    <div className="p-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
