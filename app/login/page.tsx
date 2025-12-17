"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { api } from "@/lib/clientApi";

export default function LoginPage() {
    const router = useRouter();
    const { user, login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            router.replace("/");
        }
    }, [user, router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
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
                        className="w-full mt-1 p-2 rounded bg-gray-700 border"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>

                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        className="w-full mt-1 p-2 rounded bg-gray-700 border"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded disabled:opacity-70"
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

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
