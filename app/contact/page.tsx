"use client";

import { useState } from "react";

export default function ContactPage() {
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState<null | string>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/contact`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ fullname, email, message }),
                }
            );

            if (!res.ok) {
                throw new Error("Failed to send message");
            }

            setStatus("success");
            setFullname("");
            setEmail("");
            setMessage("");
        } catch (error) {
            setStatus("error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-3xl mx-auto py-16 px-4">
            <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>

            <p className="text-center text-gray-600 dark:text-gray-300 mb-10">
                Have a question, feedback, or need support?
                Send us a message and we’ll get back to you shortly.
            </p>

            <form
                onSubmit={handleSubmit}
                className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg space-y-6"
            >
                {/* Full Name */}
                <div>
                    <label className="block mb-2 font-medium">Full Name</label>
                    <input
                        type="text"
                        value={fullname}
                        onChange={(e) => setFullname(e.target.value)}
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 
                                   bg-white dark:bg-gray-900 text-gray-900 dark:text-white
                                   focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter your name"
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="block mb-2 font-medium">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 
                                   bg-white dark:bg-gray-900 text-gray-900 dark:text-white
                                   focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter your email"
                    />
                </div>

                {/* Message */}
                <div>
                    <label className="block mb-2 font-medium">Message</label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        rows={5}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 
                                   bg-white dark:bg-gray-900 text-gray-900 dark:text-white
                                   focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Write your message here..."
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-lg bg-indigo-600 text-white font-semibold
                               hover:bg-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Sending..." : "Send Message"}
                </button>

                {/* Status Messages */}
                {status === "success" && (
                    <p className="text-green-600 text-center mt-2">
                        Message sent successfully! ✔️
                    </p>
                )}

                {status === "error" && (
                    <p className="text-red-600 text-center mt-2">
                        Failed to send message. Try again.
                    </p>
                )}
            </form>
        </div>
    );
}
