"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/clientApi";

const MIN_PASSWORD_LENGTH = 6

export default function LoginPage() {
    const router = useRouter();
    const { user, login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const isPasswordTooShort = password.length > 0 && password.length < MIN_PASSWORD_LENGTH;

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            router.replace("/");
        }
    }, [user, router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password.length < MIN_PASSWORD_LENGTH) {
            setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
            return;
        }

        setLoading(true);

        try {
            const { data } = await api.post("/users/auth/login", {
                email,
                password,
            });

            // Save only user info in context
            login(data.user);

            router.replace("/");
        } catch (err: any) {
            const message =
                err?.response?.data?.detail ||
                err?.response?.data?.message ||
                "Invalid login credentials";

            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto py-12">
            <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>

            <form
                onSubmit={handleLogin}
                className="space-y-4 bg-gray-800 p-6 rounded-xl shadow"
            >
                {error && <p className="text-red-500 text-sm">{error}</p>}

                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        className="w-full mt-1 p-2 rounded bg-gray-700 border focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={email}
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
                            className="w-full mt-1 p-2 rounded bg-gray-700 border focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                            aria-label="Toggle password visibility"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>

                    </div>
                    
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded disabled:opacity-70"
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

                <p className="text-sm text-right">
                    <Link
                        href="/forgot-password"
                        className="text-blue-600 hover:underline"
                    >
                        Forgot password?
                    </Link>
                </p>

                <p className="text-center text-sm mt-2">
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="text-blue-600 hover:underline">
                        Create one here
                    </Link>
                </p>
            </form>
        </div>
    );
}
