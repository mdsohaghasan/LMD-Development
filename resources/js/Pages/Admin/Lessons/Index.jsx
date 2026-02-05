import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import AdminSidebar from '@/Layouts/AdminSidebar';
import { Link } from '@inertiajs/react';

export default function LessonsIndex({ course, lessons }) {
  return (
    <AppLayout>
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Lessons for {course.title}</h1>
            <Link href={`/admin/courses/${course.id}/lessons/create`} className="px-4 py-2 bg-blue-600 text-white rounded">Add Lesson</Link>
          </div>
          <table className="min-w-full bg-white dark:bg-slate-800 rounded shadow">
            <thead>
              <tr>
                <th className="p-2 text-left">Title</th>
                <th className="p-2 text-left">Type</th>
                <th className="p-2 text-left">Order</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {lessons.data.map(lesson => (
                <tr key={lesson.id} className="border-b dark:border-slate-700">
                  <td className="p-2">{lesson.title}</td>
                  <td className="p-2">{lesson.type}</td>
                  <td className="p-2">{lesson.order}</td>
                  <td className="p-2">
                    <Link href={`/admin/courses/${course.id}/lessons/${lesson.id}/edit`} className="text-blue-600 mr-2">Edit</Link>
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
