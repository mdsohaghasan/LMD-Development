import React from 'react'
import AppLayout from '@/Layouts/AppLayout'
import { Link } from '@inertiajs/react'

export default function Home({ courses }) {
    return (
        <AppLayout>
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome to our LMS gg</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Browse our featured courses below.</p>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.data?.map((course) => (
                        <div key={course.id} className="p-4 border rounded bg-white dark:bg-slate-800">
                            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{course.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{course.description}</p>
                            <div className="mt-4 flex justify-between items-center">
                                <Link href={`/courses/${course.id}`} className="text-blue-600">View</Link>
                                <span className="text-sm text-gray-500">By {course.teacher?.name}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6">
                    <Link href="/courses" className="px-4 py-2 bg-blue-600 text-white rounded">Browse all courses</Link>
                </div>
            </div>
        </AppLayout>
    )
}
