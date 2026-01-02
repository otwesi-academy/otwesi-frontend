"use client"

import { useState } from "react"
import { api } from "@/lib/clientApi"
import Link from "next/link"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // reset UI state
        setError("")
        setSuccess(false)
        setLoading(true)

        try {
            await api.post("/users/password-reset-request", { email })

            // clear input + show success
            setEmail("")
            setSuccess(true)
        } catch (err: any) {
            setError(
                err?.response?.data?.detail ||
                err?.response?.data?.message ||
                "Something went wrong"
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-md mx-auto py-12">
            <h1 className="text-3xl font-bold text-center mb-6">
                Forgot Password
            </h1>

            <form 
                onSubmit={handleSubmit}
                className="space-y-4 bg-gray-800 p-6 rounded-xl shadow">
                
                {error && (
                    <p className="text-red-500 text-sm text-center">
                        {error}
                    </p>
                )}

                {success && (
                    <p className="text-green-600 text-sm text-center">
                        If the email exists, a password reset link has been sent.
                    </p>
                )}

                <div>
                    <label className="block text-sm text-gray-100 mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@doe.com"
                        required
                        disabled={loading || success}
                        className="w-full mt-1 p-2 rounded bg-gray-700 border focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading || success}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-70"
                >
                    {loading
                        ? "Sending..."
                        : success
                            ? "Email sent 🎊"
                            : "Send reset link"}
                </button>
            </form>

            <p className="text-sm text-center text-gray-600 mt-6">
                <Link href="/login" className="text-blue-600 hover:underline">
                    Back to login
                </Link>
            </p>
        </div>
    )
}
