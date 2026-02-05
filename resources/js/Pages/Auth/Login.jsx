import React, { useState, useEffect } from 'react'
import AppLayout from '@/Layouts/AppLayout'
import { useForm, Link } from '@inertiajs/react'

export default function Login() {
    const form = useForm({ email: '', password: '', remember: false })
    const [touched, setTouched] = useState({ email: false, password: false })

    function submit(e) {
        e.preventDefault()
        form.post('/login', {
            preserveScroll: true,
            onError: () => {
                // Mark fields as touched when errors occur
                setTouched({ email: true, password: true })
            }
        })
    }

    const generalErrors = Object.keys(form.errors)
        .filter(k => !['email', 'password', 'remember'].includes(k))
        .map(k => form.errors[k])

    // Clear errors when user starts typing
    useEffect(() => {
        if (form.errors.email && form.data.email) {
            form.clearErrors('email')
        }
    }, [form.data.email])

    useEffect(() => {
        if (form.errors.password && form.data.password) {
            form.clearErrors('password')
        }
    }, [form.data.password])

    return (
        <AppLayout>
            <div className="max-w-md mx-auto mt-8">
                <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700">
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back</h1>
                        <p className="text-gray-600 dark:text-gray-400">Sign in to your account to continue</p>
                    </div>

                    {generalErrors.length > 0 && (
                        <div className="mb-6 p-4 border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 rounded-r">
                            <div className="flex items-start">
                                <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <div className="flex-1">
                                    {generalErrors.map((err, i) => (
                                        <div key={i} className="text-sm font-medium">{err}</div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <input
                                    id="email"
                                    type="email"
                                    value={form.data.email}
                                    onChange={e => form.setData('email', e.target.value)}
                                    onBlur={() => setTouched({ ...touched, email: true })}
                                    className={`block w-full rounded-lg border px-4 py-3 transition-colors ${
                                        form.errors.email && touched.email
                                            ? 'border-red-500 bg-red-50 dark:bg-red-900/20 focus:ring-red-500 focus:border-red-500'
                                            : 'border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-blue-500 focus:border-blue-500'
                                    } text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`}
                                    placeholder="you@example.com"
                                    aria-invalid={!!form.errors.email && touched.email}
                                    disabled={form.processing}
                                />
                                {form.errors.email && touched.email && (
                                    <div className="absolute right-3 top-3">
                                        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            {form.errors.email && touched.email && (
                                <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {form.errors.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type="password"
                                    value={form.data.password}
                                    onChange={e => form.setData('password', e.target.value)}
                                    onBlur={() => setTouched({ ...touched, password: true })}
                                    className={`block w-full rounded-lg border px-4 py-3 transition-colors ${
                                        form.errors.password && touched.password
                                            ? 'border-red-500 bg-red-50 dark:bg-red-900/20 focus:ring-red-500 focus:border-red-500'
                                            : 'border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-blue-500 focus:border-blue-500'
                                    } text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`}
                                    placeholder="••••••••"
                                    aria-invalid={!!form.errors.password && touched.password}
                                    disabled={form.processing}
                                />
                                {form.errors.password && touched.password && (
                                    <div className="absolute right-3 top-3">
                                        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            {form.errors.password && touched.password && (
                                <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {form.errors.password}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    checked={form.data.remember}
                                    onChange={e => form.setData('remember', e.target.checked)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    disabled={form.processing}
                                />
                                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                    Remember me
                                </label>
                            </div>
                            <Link 
                                href="/forgot-password" 
                                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={form.processing}
                            className={`w-full flex items-center justify-center px-4 py-3 rounded-lg font-medium text-white transition-all ${
                                form.processing
                                    ? 'bg-blue-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                            } shadow-sm`}
                        >
                            {form.processing ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                <span>Sign in</span>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Don't have an account?{' '}
                            <Link href="/register" className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}