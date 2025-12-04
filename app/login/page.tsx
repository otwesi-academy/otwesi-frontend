"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useAuth } from "../../context/AuthContext";

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
            router.replace("/"); // redirect logged-in users
        }
    }, [user, router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.detail || "Invalid login credentials");
                setLoading(false);
                return;
            }

            // Save user in context
            console.log(data.user);
            
            login(data.user, data.access_token);

            router.replace("/"); // redirect home/dashboard
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto py-12">
            <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>

            <form
                onSubmit={handleLogin}
                className="space-y-4 bg-gray-100 dark:bg-gray-800 p-6 rounded-xl shadow"
            >
                {error && <p className="text-red-500 text-sm">{error}</p>}

                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        className="w-full mt-1 p-2 rounded bg-white dark:bg-gray-700 border"
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
                        className="w-full mt-1 p-2 rounded bg-white dark:bg-gray-700 border"
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
