import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import AdminSidebar from '@/Layouts/AdminSidebar';
import { Link, usePage } from '@inertiajs/react';

export default function CoursesIndex({ courses }) {
  return (
    <AppLayout>
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Courses</h1>
            <Link href="/admin/courses/create" className="px-4 py-2 bg-blue-600 text-white rounded">Create Course</Link>
          </div>
          <table className="min-w-full bg-white dark:bg-slate-800 rounded shadow">
            <thead>
              <tr>
                <th className="p-2 text-left">Title</th>
                <th className="p-2 text-left">Teacher</th>
                <th className="p-2 text-left">Published</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.data.map(course => (
                <tr key={course.id} className="border-b dark:border-slate-700">
                  <td className="p-2">{course.title}</td>
                  <td className="p-2">{course.teacher?.name}</td>
                  <td className="p-2">{course.is_published ? 'Yes' : 'No'}</td>
                  <td className="p-2">
                    <Link href={`/admin/courses/${course.id}/edit`} className="text-blue-600 mr-2">Edit</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
