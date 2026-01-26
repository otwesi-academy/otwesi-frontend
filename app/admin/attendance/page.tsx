"use client";

import { useEffect, useState } from "react";
import { parseISO } from "date-fns";

import { api, API_BASE_URL } from "@/lib/clientApi";

type Title = {
    _id: string;
    title: string;
    created_at: string;
    attendee_count: number;
};

type Attendee = {
    _id: string;
    student_name: string;
    submitted_at: string;
};

export default function AdminAttendancePage() {
    const [titles, setTitles] = useState<Title[]>([]);
    const [newTitle, setNewTitle] = useState("");
    const [editId, setEditId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [selectedTitle, setSelectedTitle] = useState<Title | null>(null);

    // attendees list + search + pagination
    const [attendees, setAttendees] = useState<Attendee[]>([]);
    const [attSearch, setAttSearch] = useState("");
    const [attPage, setAttPage] = useState(1);
    const [attLimit] = useState(20);
    const [attTotalPages, setAttTotalPages] = useState(1);
    const [attLoading, setAttLoading] = useState(false);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchTitles();
    }, []);

    async function fetchTitles() {
        try {
            setLoading(true);
            const res = await api.get("/attendance/titles");
            setTitles(res.data);
        } catch (err) {
            console.error("fetchTitles error", err);
        } finally {
            setLoading(false);
        }
    }

    async function createTitle() {
        if (!newTitle.trim()) return;
        try {
            await api.post("/attendance/create", { title: newTitle });
            setNewTitle("");
            await fetchTitles();
        } catch (err: any) {
            console.error("createTitle", err);
            alert(err?.response?.data?.detail || "Could not create title");
        }
    }

    function openEdit(t: Title) {
        setEditId(t._id);
        setEditTitle(t.title);
    }

    async function saveEdit() {
        if (!editId || !editTitle.trim()) return;
        try {
            await api.put(`/attendance/${editId}`, { title: editTitle });
            setEditId(null);
            setEditTitle("");
            await fetchTitles();
        } catch (err) {
            console.error("saveEdit", err);
            alert("Could not update title");
        }
    }

    async function deleteTitle(id: string) {
        if (!confirm("Delete this attendance title?")) return;
        try {
            await api.delete(`/attendance/${id}`);
            await fetchTitles();
        } catch (err) {
            console.error("deleteTitle", err);
            alert("Could not delete title");
        }
    }

    function exportCSV(id: string) {
        window.open(`${API_BASE_URL}/attendance/${id}/export/csv`);
    }

    function exportExcel(id: string) {
        window.open(`${API_BASE_URL}/attendance/${id}/export/excel`);
    }

    // === Attendees modal ===
    function openAttendeesModal(t: Title) {
        setSelectedTitle(t);
        setAttPage(1);
        setAttSearch("");
        setShowModal(true);
    }

    useEffect(() => {
        if (!showModal || !selectedTitle) return;
        fetchAttendees(selectedTitle._id, attSearch, attPage, attLimit);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showModal, selectedTitle, attPage]);

    useEffect(() => {
        if (!showModal || !selectedTitle) return;
        const timer = setTimeout(() => {
            setAttPage(1);
            fetchAttendees(selectedTitle._id, attSearch, 1, attLimit);
        }, 350);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [attSearch]);

    async function fetchAttendees(titleId: string, search: string, page: number, limit: number) {
        try {
            setAttLoading(true);
            const res = await api.get(`/attendance/${titleId}/list`, {
                params: { search: search || undefined, page, limit },
            });
            const payload = res.data;
            setAttendees(payload.attendees || []);
            setAttTotalPages(payload.total_pages || 1);
        } catch (err) {
            console.error("fetchAttendees", err);
            setAttendees([]);
            setAttTotalPages(1);
        } finally {
            setAttLoading(false);
        }
    }

    return (
        <div className="text-white max-w-4xl mx-auto py-8">
            <h1 className="text-3xl font-bold mb-6">Attendance Manager</h1>

            {/* Create Title */}
            <div className="flex gap-3 mb-6">
                <input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Enter class title"
                    className="p-2 rounded text-white bg-gray-800 border border-gray-700 flex-grow"
                />
                <button onClick={createTitle} className="bg-blue-600 px-4 py-2 rounded">
                    Add
                </button>
            </div>

            {/* Titles List */}
            {loading ? (
                <p>Loading titles...</p>
            ) : (
                <div className="space-y-3">
                    {titles.length === 0 && <p>No attendance titles yet.</p>}
                    {titles.map((t) => (
                        <div
                            key={t._id}
                            className="p-4 bg-gray-800 rounded shadow flex items-center justify-between"
                        >
                            <div>
                                <div className="font-semibold">{t.title}</div>
                                <div className="text-sm text-gray-400">{parseISO(t.created_at).toLocaleString()}</div>
                            </div>

                            <div className="flex items-center gap-3">

                                <button onClick={() => openAttendeesModal(t)} className="bg-green-600 px-3 py-1 rounded">
                                    View
                                </button>

                                <button onClick={() => openEdit(t)} className="bg-yellow-500 px-3 py-1 rounded">
                                    Edit
                                </button>

                                <button onClick={() => deleteTitle(t._id)} className="bg-red-600 px-3 py-1 rounded">
                                    Delete
                                </button>

                                <div className="bg-gray-700 px-2 py-1 rounded">
                                    <select
                                        defaultValue=""
                                        onChange={(e) => {
                                            const v = e.target.value;
                                            if (v === "csv") exportCSV(t._id);
                                            if (v === "excel") exportExcel(t._id);
                                            e.currentTarget.value = "";
                                        }}
                                        className="bg-transparent outline-none"
                                    >
                                        <option value="">Export</option>
                                        <option value="csv">CSV</option>
                                        <option value="excel">Excel</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Edit Inline */}
            {editId && (
                <div className="mt-6 bg-gray-900 p-4 rounded">
                    <h3 className="font-semibold mb-2">Edit Title</h3>
                    <input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="p-2 rounded bg-gray-800 w-full mb-3 text-white"
                    />
                    <div className="flex gap-2">
                        <button onClick={saveEdit} className="bg-blue-600 px-3 py-1 rounded">Save</button>
                        <button
                            onClick={() => { setEditId(null); setEditTitle(""); }}
                            className="bg-gray-600 px-3 py-1 rounded"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Attendees Modal */}
            {showModal && selectedTitle && (
                <div className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center p-6">
                    <div className="bg-gray-900 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
                        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold">Attendees — {selectedTitle.title}</h2>
                                <div className="text-sm text-gray-400">{attendees.length ?? 0} total</div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button onClick={() => exportCSV(selectedTitle._id)} className="px-3 py-1 bg-gray-700 rounded">CSV</button>
                                <button onClick={() => exportExcel(selectedTitle._id)} className="px-3 py-1 bg-gray-700 rounded">Excel</button>
                                <button onClick={() => { setShowModal(false); setSelectedTitle(null); }} className="px-3 py-1 bg-red-600 rounded">Close</button>
                            </div>
                        </div>

                        <div className="p-4">
                            <input
                                placeholder="Search attendee..."
                                value={attSearch}
                                onChange={(e) => setAttSearch(e.target.value)}
                                className="w-full p-2 rounded bg-gray-800 text-white mb-3"
                            />

                            {attLoading ? (
                                <p>Loading attendees...</p>
                            ) : attendees.length === 0 ? (
                                <p>No attendees found.</p>
                            ) : (
                                <ul className="space-y-2 max-h-72 overflow-auto">
                                    {attendees.map((a) => (
                                        <li key={a._id} className="p-2 border-b border-gray-800">
                                            <div className="font-semibold">{a.student_name}</div>
                                            <div className="text-sm text-gray-400">{parseISO(a.submitted_at).toLocaleString()}</div>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            <div className="flex items-center justify-between mt-4">
                                <div className="text-sm text-gray-400">Page {attPage} of {attTotalPages}</div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setAttPage((p) => Math.max(1, p - 1))}
                                        disabled={attPage === 1}
                                        className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
                                    >
                                        Prev
                                    </button>
                                    <button
                                        onClick={() => setAttPage((p) => Math.min(attTotalPages, p + 1))}
                                        disabled={attPage === attTotalPages}
                                        className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
