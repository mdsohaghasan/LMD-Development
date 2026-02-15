import React, { useState } from 'react'
import StudentUserLayout from '@/Layouts/StudentUserLayout'
import { useForm } from '@inertiajs/react'
import { usePage } from '@inertiajs/react'

export default function UserSettings() {
    const { auth } = usePage().props
    const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true')
    const [language, setLanguage] = useState(auth.user?.language || 'en')

    const toggleDarkMode = () => {
        const newDarkMode = !darkMode
        setDarkMode(newDarkMode)
        localStorage.setItem('darkMode', newDarkMode)
        document.documentElement.classList.toggle('dark', newDarkMode)
    }

    const handleLanguageChange = (e) => {
        const newLang = e.target.value
        setLanguage(newLang)
        // You can add an API call here to save language preference
    }

    return (
        <StudentUserLayout>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

            {/* Appearance Settings */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Appearance</h2>
                
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-medium text-gray-900">Dark Mode</h3>
                        <p className="text-sm text-gray-600">Toggle dark mode theme</p>
                    </div>
                    <button
                        onClick={toggleDarkMode}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            darkMode ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                darkMode ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                    </button>
                </div>
            </div>

            {/* Language Settings */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Language</h2>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Language
                    </label>
                    <select
                        value={language}
                        onChange={handleLanguageChange}
                        className="w-full md:w-64 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="en">English</option>
                        <option value="bn">Bangla</option>
                        <option value="ar">Arabic</option>
                    </select>
                </div>
            </div>

            {/* Account Settings */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h2>
                
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-medium text-gray-900">Email Notifications</h3>
                            <p className="text-sm text-gray-600">Receive email updates about your courses</p>
                        </div>
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-medium text-gray-900">Course Updates</h3>
                            <p className="text-sm text-gray-600">Get notified when new lessons are added</p>
                        </div>
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
                    </div>
                </div>
            </div>
        </StudentUserLayout>
    )
}
