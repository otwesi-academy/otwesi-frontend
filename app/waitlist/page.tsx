"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "@/lib/clientApi";

export default function WaitlistPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");

        try {

            const formData = new FormData();
            formData.append("email", email);

            const res = await api.post("/waitlist/join", formData)

            setMessage("You're on the list 🎉 We’ll be in touch soon.");
            setEmail("");
        } catch (err: any) {
            setError(err.response?.data?.detail || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
            {/* Background Gradient (same as Hero) */}
            <div className="absolute inset-0 bg-linear-to-br  from-[#0b0f2c] via-[#101637] to-[#13204d]" />

            {/* Floating Shapes */}
            <div className="absolute top-24 left-10 w-24 h-24 bg-white/20 rounded-xl blur-xl animate-[float_6s_ease-in-out_infinite]" />
            <div className="absolute bottom-20 right-20 w-32 h-32 bg-yellow-300/20 rounded-full blur-2xl animate-[float2_8s_ease-in-out_infinite]" />

            {/* Card */}
            <div className="relative z-10 w-full max-w-md">
                <div className="backdrop-blur-md bg-black/20 p-8 sm:p-10 rounded-3xl border border-white/20 shadow-xl text-center">

                    <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
                        Join the Waitlist
                    </h1>

                    <p className="text-white/90 mb-8">
                        Be among the first to access Otwesi Academy and start building,
                        branding, and monetizing your digital skills.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="email"
                            required
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="
                w-full px-5 py-3 rounded-full
                bg-white/90 text-gray-900
                placeholder-gray-500
                outline-none focus:ring-2 focus:ring-yellow-300
              "
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="
                w-full px-6 py-3 rounded-full
                text-lg font-semibold
                bg-white text-indigo-700
                hover:bg-gray-200 transition
                shadow-lg disabled:opacity-70
              "
                        >
                            {loading ? "Joining..." : "Join Waitlist"}
                        </button>
                    </form>

                    {message && (
                        <p className="mt-4 text-sm text-green-200 font-medium">
                            {message}
                        </p>
                    )}

                    {error && (
                        <p className="mt-4 text-sm text-red-200 font-medium">
                            {error}
                        </p>
                    )}

                    <div className="mt-8">
                        <Link
                            href="/"
                            className="text-sm text-white/70 hover:text-white transition"
                        >
                            ← Back to home
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
