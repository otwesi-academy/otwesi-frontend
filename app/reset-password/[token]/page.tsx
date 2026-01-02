"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { api } from "@/lib/clientApi"
import { Eye, EyeOff } from "lucide-react"

const MIN_PASSWORD_LENGTH = 6

export default function ResetPasswordPage() {
    const { token } = useParams<{ token: string }>()
    const router = useRouter()

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const isPasswordTooShort =
        password.length > 0 && password.length < MIN_PASSWORD_LENGTH

    const passwordsDoNotMatch =
        confirmPassword.length > 0 && password !== confirmPassword

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (password.length < MIN_PASSWORD_LENGTH) {
            setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long`)
            return
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        setLoading(true)

        try {
            await api.post(`/users/password-reset-confirm/${token}`, {
                password,
                confirm_password: confirmPassword,
            })

            router.push("/login")
        } catch (err: any) {
            setError(
                err?.response?.data?.detail ||
                "Invalid or expired token"
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-md mx-auto py-12">
            <h1 className="text-3xl font-bold text-center mb-6">
                Reset Password
            </h1>

            <form
                onSubmit={handleSubmit}
                className="space-y-4 bg-gray-800 p-6 rounded-xl shadow"
            >
                {error && (
                    <p className="text-red-500 text-sm text-center">
                        {error}
                    </p>
                )}

                {/* New Password */}
                <div>
                    <label className="block text-sm text-gray-600 mb-1">
                        New Password
                    </label>

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`w-full border rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2
                  ${isPasswordTooShort
                                    ? "border-red-400 focus:ring-red-400"
                                    : "border-gray-300 focus:ring-blue-500"
                                }`}
                            required
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    {isPasswordTooShort && (
                        <p className="text-xs text-red-500 mt-1">
                            Password must be at least {MIN_PASSWORD_LENGTH} characters
                        </p>
                    )}
                </div>

                {/* Confirm Password */}
                <div>
                    <label className="block text-sm text-gray-600 mb-1">
                        Confirm Password
                    </label>

                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={`w-full border rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2
                  ${passwordsDoNotMatch
                                    ? "border-red-400 focus:ring-red-400"
                                    : "border-gray-300 focus:ring-blue-500"
                                }`}
                            required
                        />

                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    {passwordsDoNotMatch && (
                        <p className="text-xs text-red-500 mt-1">
                            Passwords do not match
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={
                        loading ||
                        password.length < MIN_PASSWORD_LENGTH ||
                        password !== confirmPassword
                    }
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-70"
                >
                    {loading ? "Resetting..." : "Reset password"}
                </button>
            </form>
        </div>
    )
}
