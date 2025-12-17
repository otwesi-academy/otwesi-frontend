"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useAuth } from "../../context/AuthContext";
import { api } from "@/lib/clientApi";

export default function RegisterPage() {
    const router = useRouter();
    const { user, login } = useAuth();

    const [fullname, setFullname] = useState("");
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

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const { data } = await api.post("/users/auth/register", {
                fullname,
                email,
                password,
            });

            // Option 1 (recommended): redirect to login
            router.replace("/login");

            // Option 2 (if backend logs user in automatically)
            // login(data.user);
            // router.replace("/");

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
                </div>

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
                    <input
                        type="password"
                        placeholder="minimum of 6 characters"
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
