import React from 'react'
import AppLayout from '@/Layouts/AppLayout'
import { usePage } from '@inertiajs/react'

export default function CourseShow({ course }) {
    const { auth } = usePage().props
    const csrf = typeof document !== 'undefined' ? document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') : ''

    return (
        <AppLayout>
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{course.title}</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-300">{course.description}</p>
                <p className="mt-1 text-sm text-gray-500">Instructor: {course.teacher?.name}</p>

                <div className="mt-4">
                    {auth.user ? (
                        <form action={`/courses/${course.id}/enroll`} method="post">
                            <input type="hidden" name="_token" value={csrf} />
                            <button className="px-4 py-2 bg-green-600 text-white rounded">Enroll</button>
                        </form>
                    ) : (
                        <a href="/login" className="px-4 py-2 bg-blue-600 text-white rounded">Log in to enroll</a>
                    )}
                </div>

                <div className="mt-6">
                    <h2 className="text-xl font-semibold">Lessons</h2>
                    <ul className="mt-2 space-y-2">
                        {course.lessons?.map((lesson) => (
                            <li key={lesson.id} className="text-gray-700 dark:text-gray-300">{lesson.title}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </AppLayout>
    )
}
