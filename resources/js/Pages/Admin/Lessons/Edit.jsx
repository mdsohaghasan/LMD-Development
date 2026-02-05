import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import AdminSidebar from '@/Layouts/AdminSidebar';
import { useForm, Link } from '@inertiajs/react';

export default function EditLesson({ course, lesson }) {
  const { data, setData, put, processing, errors } = useForm({
    title: lesson.title || '',
    content: lesson.content || '',
    type: lesson.type || 'text',
    order: lesson.order || 0,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    put(`/admin/courses/${course.id}/lessons/${lesson.id}`);
  };

  return (
    <AppLayout>
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 p-8">
          <h1 className="text-2xl font-bold mb-6">Edit Lesson for {course.title}</h1>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
            <div>
              <label className="block mb-1">Title</label>
              <input type="text" className="w-full border rounded p-2" value={data.title} onChange={e => setData('title', e.target.value)} />
              {errors.title && <div className="text-red-600 text-sm">{errors.title}</div>}
            </div>
            <div>
              <label className="block mb-1">Content</label>
              <textarea className="w-full border rounded p-2" value={data.content} onChange={e => setData('content', e.target.value)} />
              {errors.content && <div className="text-red-600 text-sm">{errors.content}</div>}
            </div>
            <div>
              <label className="block mb-1">Type</label>
              <select className="w-full border rounded p-2" value={data.type} onChange={e => setData('type', e.target.value)}>
                <option value="text">Text</option>
                <option value="video">Video</option>
                <option value="pdf">PDF</option>
                <option value="audio">Audio</option>
              </select>
              {errors.type && <div className="text-red-600 text-sm">{errors.type}</div>}
            </div>
            <div>
              <label className="block mb-1">Order</label>
              <input type="number" className="w-full border rounded p-2" value={data.order} onChange={e => setData('order', e.target.value)} />
              {errors.order && <div className="text-red-600 text-sm">{errors.order}</div>}
            </div>
            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={processing}>Update</button>
              <Link href={`/admin/courses/${course.id}/lessons`} className="px-4 py-2 bg-gray-200 rounded">Cancel</Link>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
