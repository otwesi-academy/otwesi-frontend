"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react"

import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/clientApi";

const MIN_PASSWORD_LENGTH = 6


export default function RegisterPage() {
    const router = useRouter();
    const { user } = useAuth();

    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false)

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            router.replace("/");
        }
    }, [user, router]);

    const isPasswordTooShort =
        password.length > 0 && password.length < MIN_PASSWORD_LENGTH

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password.length < MIN_PASSWORD_LENGTH) {
            setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`)
            return
        }

        setLoading(true);

        try {
            await api.post("/users/auth/register", {
                fullname,
                email,
                password,
            });

            router.replace("/login");


        } catch (err: any) {
            const message =
                err?.response?.data?.detail ||
                err?.response?.data?.message ||
                "Registration failed";

            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto py-12">
            <h1 className="text-3xl font-bold mb-6 text-center">
                Create Account
            </h1>

            <form
                onSubmit={handleRegister}
                className="space-y-4 bg-gray-800 p-6 rounded-xl shadow"
            >
                {error && <p className="text-red-500 text-sm">{error}</p>}

                <div>
                    <label>Full Name</label>
                    <input
                        type="text"
                        className="w-full mt-1 p-2 rounded bg-gray-700 border"
                        value={fullname}
                        placeholder="John Doe"
                        onChange={(e) => setFullname(e.target.value)}
                        required
                        disabled={loading}
                    />

                    <div>
                        <label>Email</label>
                        <input
                            type="email"
                            className="w-full mt-1 p-2 rounded bg-gray-700 border"
                            value={email}
                            placeholder="john@doe.com"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label>Password</label>

                        <div className="relative">

                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Minimum of 6 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                                className={`w-full mt-1 p-2 rounded bg-gray-700 border focus:outline-none focus:ring-2
                            ${isPasswordTooShort
                                        ? "border-red-400 focus:ring-red-400"
                                        : "border-gray-300 focus:ring-blue-500"
                                    }`}
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white hover:text-gray-900"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                disabled={loading}
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


                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded disabled:opacity-70"
                    disabled={loading || password.length < MIN_PASSWORD_LENGTH}
                >
                    {loading ? "Creating account..." : "Register"}
                </button>

                <p className="text-center text-sm mt-2">
                    Already have an account?{" "}
                    <Link href="/login" className="text-blue-600 hover:underline">
                        Click here to login
                    </Link>
                </p>

                <p className="text-center text-sm mt-2">
                    By continuing you agree to our{" "}
                    <Link href="/terms" className="text-red-600 hover:underline">
                        Terms
                    </Link>{" "}
                    &{" "}
                    <Link
                        href="/privacy-policy"
                        className="text-red-600 hover:underline"
                    >
                        Privacy Policy
                    </Link>
                </p>
            </form>
        </div>
    );
}
