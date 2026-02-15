import React from 'react';
import AdminTeacherLayout from '@/Layouts/AdminTeacherLayout';
import { useForm, Link } from '@inertiajs/react';

export default function EditCourse({ course }) {
  const { data, setData, put, processing, errors } = useForm({
    title: course.title || '',
    description: course.description || '',
    teacher_id: course.teacher_id || '',
    is_published: course.is_published || false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    put(`/admin/courses/${course.id}`);
  };

  return (
    <AdminTeacherLayout role="admin">
          <h1 className="text-2xl font-bold mb-6">Edit Course</h1>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
            <div>
              <label className="block mb-1">Title</label>
              <input type="text" className="w-full border rounded p-2" value={data.title} onChange={e => setData('title', e.target.value)} />
              {errors.title && <div className="text-red-600 text-sm">{errors.title}</div>}
            </div>
            <div>
              <label className="block mb-1">Description</label>
              <textarea className="w-full border rounded p-2" value={data.description} onChange={e => setData('description', e.target.value)} />
              {errors.description && <div className="text-red-600 text-sm">{errors.description}</div>}
            </div>
            <div>
              <label className="block mb-1">Teacher ID</label>
              <input type="number" className="w-full border rounded p-2" value={data.teacher_id} onChange={e => setData('teacher_id', e.target.value)} />
              {errors.teacher_id && <div className="text-red-600 text-sm">{errors.teacher_id}</div>}
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={data.is_published} onChange={e => setData('is_published', e.target.checked)} />
              <label>Published</label>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={processing}>Update</button>
              <Link href="/admin/courses" className="px-4 py-2 bg-gray-200 rounded">Cancel</Link>
            </div>
          </form>
    </AdminTeacherLayout>
  );
}
