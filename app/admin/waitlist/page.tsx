"use client";

import { useEffect, useState } from "react";
import { parseISO } from "date-fns";
import { api, API_BASE_URL } from "@/lib/clientApi";



type WaitlistItem = {
    id: string;
    email: string;
    created_at: string;
};

export default function AdminWaitlistPage() {
    const [items, setItems] = useState<WaitlistItem[]>([]);
    const [loading, setLoading] = useState(false);

    // optional search + pagination (can remove if not needed)
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const limit = 20;
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchWaitlist();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    useEffect(() => {
        const t = setTimeout(() => {
            setPage(1);
            fetchWaitlist(1, search);
        }, 300);
        return () => clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    async function fetchWaitlist(p = page, s = search) {
        try {
            setLoading(true);
            const res = await api.get("/waitlist/list", {
                params: {
                    page: p,
                    limit,
                    search: s || undefined,
                },
            });
            console.log(res.data.waitlists);
            
            setItems(res.data.waitlists || []);
            setTotalPages(res.data.total_pages || 1);
            console.log(items);
        } catch (err) {
            console.error("fetchWaitlist error", err);
            setItems([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    }

    function exportCSV() {
        window.open(`${API_BASE_URL}/waitlist/export/csv`);
    }

    function exportExcel() {
        window.open(`${API_BASE_URL}/waitlist/export/excel`);
    }

    return (
        <div className="text-white max-w-4xl mx-auto py-8">
            <h1 className="text-3xl font-bold mb-6">Waitlist Manager</h1>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <input
                    placeholder="Search email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="p-2 rounded bg-gray-800 border border-gray-700 text-white flex-grow"
                />

                <div className="flex gap-2">
                    <button
                        onClick={exportCSV}
                        className="bg-gray-700 px-4 py-2 rounded"
                    >
                        Export CSV
                    </button>
                    <button
                        onClick={exportExcel}
                        className="bg-gray-700 px-4 py-2 rounded"
                    >
                        Export Excel
                    </button>
                </div>
            </div>

            {/* Table */}
            {loading ? (
                <p>Loading waitlist...</p>
            ) : items.length === 0 ? (
                <p>No waitlist entries yet.</p>
            ) : (
                <div className="bg-gray-900 rounded shadow overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-800 text-sm uppercase text-gray-400">
                            <tr>
                                <th className="p-3">Email</th>
                                <th className="p-3">Date Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((w) => (
                                <tr
                                    key={w.id}
                                    className="border-b border-gray-800 hover:bg-gray-800/40"
                                >
                                    <td className="p-3 font-medium">{w.email}</td>
                                    <td className="p-3 text-sm text-gray-400">
                                        {parseISO(w.created_at).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-400">
                    Page {page} of {totalPages}
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
