"use client";

import { useEffect, useState } from "react";

export default function AttendancePage() {
    const [titles, setTitles] = useState<any[]>([]);
    const [selectedTitle, setSelectedTitle] = useState<any>(null);
    const [name, setName] = useState("");

    useEffect(() => {
        fetchTitles();
    }, []);

    async function fetchTitles() {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/attendance/titles`);
        const data = await res.json();
        setTitles(data);
    }

    async function submitAttendance() {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/attendance/submit`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                attendance_title_id: selectedTitle._id,
                student_name: name,
            }),
        });

        alert("Attendance submitted!");
        setSelectedTitle(null);
        setName("");
    }

    return (
        <div className="text-white">
            <h1 className="text-3xl font-bold mb-6">Class Attendance</h1>

            {/* If no title selected → show list */}
            {!selectedTitle && (
                <div className="space-y-4">
                    {titles.map((t) => (
                        <div
                            key={t._id}
                            className="p-4 bg-gray-800 rounded shadow cursor-pointer"
                            onClick={() => setSelectedTitle(t)}
                        >
                            {t.title}
                        </div>
                    ))}
                </div>
            )}

            {/* If title selected → show form */}
            {selectedTitle && (
                <div className="mt-6 p-4 bg-gray-900 rounded shadow">
                    <h2 className="text-xl font-bold mb-3">
                        Submit Attendance for: {selectedTitle.title}
                    </h2>

                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        className="p-2 rounded text-white mb-4 w-full bg-gray-800 border border-gray-700 grow"
                    />

                    <button
                        onClick={submitAttendance}
                        className="bg-green-600 px-4 py-2 rounded w-full"
                    >
                        Submit
                    </button>

                    <button
                        className="mt-3 text-red-400 bg-gray-600 border-gray-700 p-2 rounded"
                        onClick={() => setSelectedTitle(null)}
                    >
                        Back
                    </button>
                </div>
            )}
        </div>
    );
}
