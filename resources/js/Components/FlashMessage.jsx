import React, { useEffect, useState } from 'react'
import { usePage } from '@inertiajs/react'

export default function FlashMessage() {
    const { flash } = usePage().props
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        if (flash?.success || flash?.error) {
            setVisible(true)
            const t = setTimeout(() => setVisible(false), 4000)
            return () => clearTimeout(t)
        }
    }, [flash?.success, flash?.error])

    if (!visible) return null

    return (
        <div className="fixed top-4 right-4 z-50">
            {flash?.success && (
                <div className="px-4 py-2 bg-green-600 text-white rounded shadow">{flash.success}</div>
            )}
            {flash?.error && (
                <div className="px-4 py-2 bg-red-600 text-white rounded shadow">{flash.error}</div>
            )}
        </div>
    )
}
