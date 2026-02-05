import React from 'react'
import AppLayout from '@/Layouts/AppLayout'
import { Link } from '@inertiajs/react'

export default function CoursesIndex({ courses }) {
    return (
        <AppLayout>
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Courses</h1>

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
            </div>
        </AppLayout>
    )
}
