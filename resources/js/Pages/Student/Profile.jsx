import React from 'react'
import StudentUserLayout from '@/Layouts/StudentUserLayout'
import { useForm } from '@inertiajs/react'
import UserProfile from '@/Pages/User/Profile'

export default function StudentProfile({ user }) {
    // Reuse the same profile component
    return <UserProfile user={user} />
}
