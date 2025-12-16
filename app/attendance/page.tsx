"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";


export default function AttendancePage() {
    const [titles, setTitles] = useState<any[]>([]);
    const [selectedTitle, setSelectedTitle] = useState<any>(null);
    const [name, setName] = useState("");

    useEffect(() => {
        fetchTitles();
    }, []);

    async function fetchTitles() {
        try {
            const res = await api.get("/attendance/titles");
            setTitles(res.data);
        } catch (err) {
            console.error("Failed to fetch titles:", err);
        }
    }


    async function submitAttendance() {
        if (!selectedTitle?._id || !name.trim()) {
            alert("Please enter a name.");
            return;
        }

        try {
            await api.post("/attendance/submit", {
                attendance_title_id: selectedTitle._id,
                student_name: name,
            });

            alert("Attendance submitted!");
            setSelectedTitle(null);
            setName("");
        } catch (err) {
            console.error("Failed to submit attendance:", err);
            alert("Failed to submit attendance.");
        }
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
                        required
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
