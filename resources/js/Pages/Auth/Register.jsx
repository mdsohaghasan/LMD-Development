import React, { useState, useEffect } from 'react'
import AppLayout from '@/Layouts/AppLayout'
import { useForm, Link } from '@inertiajs/react'

export default function Register() {
    const form = useForm({ name: '', email: '', password: '', password_confirmation: '' })
    const [touched, setTouched] = useState({ name: false, email: false, password: false, password_confirmation: false })
    const [passwordStrength, setPasswordStrength] = useState(0)

    function submit(e) {
        e.preventDefault()
        form.post('/register', {
            preserveScroll: true,
            onError: () => {
                // Mark all fields as touched when errors occur
                setTouched({ name: true, email: true, password: true, password_confirmation: true })
            }
        })
    }

    // Calculate password strength
    useEffect(() => {
        const password = form.data.password
        if (!password) {
            setPasswordStrength(0)
            return
        }

        let strength = 0
        if (password.length >= 8) strength++
        if (/[a-z]/.test(password)) strength++
        if (/[A-Z]/.test(password)) strength++
        if (/[0-9]/.test(password)) strength++
        if (/[^a-zA-Z0-9]/.test(password)) strength++

        setPasswordStrength(strength)
    }, [form.data.password])

    // Clear errors when user starts typing
    useEffect(() => {
        if (form.errors.name && form.data.name) {
            form.clearErrors('name')
        }
    }, [form.data.name])

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

    useEffect(() => {
        if (form.errors.password_confirmation && form.data.password_confirmation) {
            form.clearErrors('password_confirmation')
        }
    }, [form.data.password_confirmation])

    const getPasswordStrengthColor = () => {
        if (passwordStrength <= 2) return 'bg-red-500'
        if (passwordStrength <= 3) return 'bg-yellow-500'
        return 'bg-green-500'
    }

    const getPasswordStrengthText = () => {
        if (passwordStrength <= 2) return 'Weak'
        if (passwordStrength <= 3) return 'Medium'
        return 'Strong'
    }

    const generalErrors = Object.keys(form.errors)
        .filter(k => !['name', 'email', 'password', 'password_confirmation'].includes(k))
        .map(k => form.errors[k])

    return (
        <AppLayout>
            <div className="max-w-md mx-auto mt-8">
                <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700">
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create Account</h1>
                        <p className="text-gray-600 dark:text-gray-400">Sign up to get started with your learning journey</p>
                    </div>

                    {(generalErrors.length > 0 || Object.keys(form.errors).length > 0) && (
                        <div className="mb-6 p-4 border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 rounded-r">
                            <div className="flex items-start">
                                <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <div className="flex-1">
                                    {generalErrors.map((err, i) => (
                                        <div key={i} className="text-sm font-medium">{err}</div>
                                    ))}
                                    {Object.keys(form.errors).filter(k => ['name', 'email', 'password', 'password_confirmation'].includes(k)).length > 0 && (
                                        <div className="text-sm font-medium mt-1">Please fix the errors below</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <input
                                    id="name"
                                    type="text"
                                    value={form.data.name}
                                    onChange={e => form.setData('name', e.target.value)}
                                    onBlur={() => setTouched({ ...touched, name: true })}
                                    className={`block w-full rounded-lg border px-4 py-3 transition-colors ${
                                        form.errors.name && touched.name
                                            ? 'border-red-500 bg-red-50 dark:bg-red-900/20 focus:ring-red-500 focus:border-red-500'
                                            : 'border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-blue-500 focus:border-blue-500'
                                    } text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`}
                                    placeholder="John Doe"
                                    aria-invalid={!!form.errors.name && touched.name}
                                    disabled={form.processing}
                                />
                                {form.errors.name && touched.name && (
                                    <div className="absolute right-3 top-3">
                                        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            {form.errors.name && touched.name && (
                                <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {form.errors.name}
                                </p>
                            )}
                        </div>

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
                            {form.data.password && (
                                <div className="mt-2">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs text-gray-600 dark:text-gray-400">Password strength</span>
                                        <span className={`text-xs font-medium ${getPasswordStrengthColor().replace('bg-', 'text-')}`}>
                                            {getPasswordStrengthText()}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full transition-all ${getPasswordStrengthColor()}`}
                                            style={{ width: `${(passwordStrength / 5) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}
                            {form.errors.password && touched.password && (
                                <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {form.errors.password}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password_confirmation"
                                    type="password"
                                    value={form.data.password_confirmation}
                                    onChange={e => form.setData('password_confirmation', e.target.value)}
                                    onBlur={() => setTouched({ ...touched, password_confirmation: true })}
                                    className={`block w-full rounded-lg border px-4 py-3 transition-colors ${
                                        form.errors.password_confirmation && touched.password_confirmation
                                            ? 'border-red-500 bg-red-50 dark:bg-red-900/20 focus:ring-red-500 focus:border-red-500'
                                            : form.data.password_confirmation && form.data.password === form.data.password_confirmation
                                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20 focus:ring-green-500 focus:border-green-500'
                                            : 'border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-blue-500 focus:border-blue-500'
                                    } text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`}
                                    placeholder="••••••••"
                                    aria-invalid={!!form.errors.password_confirmation && touched.password_confirmation}
                                    disabled={form.processing}
                                />
                                {form.errors.password_confirmation && touched.password_confirmation && (
                                    <div className="absolute right-3 top-3">
                                        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                                {!form.errors.password_confirmation && form.data.password_confirmation && form.data.password === form.data.password_confirmation && (
                                    <div className="absolute right-3 top-3">
                                        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            {form.errors.password_confirmation && touched.password_confirmation && (
                                <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {form.errors.password_confirmation}
                                </p>
                            )}
                            {!form.errors.password_confirmation && form.data.password_confirmation && form.data.password === form.data.password_confirmation && (
                                <p className="mt-2 text-sm text-green-600 dark:text-green-400 flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Passwords match
                                </p>
                            )}
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
                                    <span>Creating account...</span>
                                </>
                            ) : (
                                <span>Create Account</span>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Already have an account?{' '}
                            <Link href="/login" className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}