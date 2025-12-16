"use client";

import { useEffect, useState } from "react";
import { api } from "../../../lib/api";


export default function AdminEbooksPage() {
    const [ebooks, setEbooks] = useState<any[]>([]);
    const [loadingEbooks, setLoadingEbooks] = useState(true);

    // Form state
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [selarId, setSelarId] = useState("");
    

    const [editingSlug, setEditingSlug] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [formVisible, setFormVisible] = useState(false);

    // Search & Pagination
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 6;
    const [filtered, setFiltered] = useState<any[]>([]);


    const fetchEbooks = async () => {
        try {
            const res = await api.get("/ebooks");
            const data = res.data
            setEbooks(data);
            setFiltered(data);
        } catch (e) {
            console.error("Failed to fetch ebooks:", e);
        } finally {
            setLoadingEbooks(false);
        }

    }

    useEffect(() => {
        fetchEbooks();
    }, []);

    // Filter ebooks when search changes
    useEffect(() => {
        const filteredList = ebooks.filter((e) =>
            e.title.toLowerCase().includes(search.toLowerCase())
        );
        setFiltered(filteredList);
        setCurrentPage(1);
    }, [search, ebooks]);

    const indexOfLast = currentPage * perPage;
    const indexOfFirst = indexOfLast - perPage;
    const currentEbooks = filtered.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filtered.length / perPage);

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setPrice("");
        setThumbnail(null);
        setSelarId("");
        setEditingSlug(null);
        setFormVisible(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!title.trim() || !description.trim() || !price) {
            alert("Please fill all required fields");
            return;
        }

        setSubmitting(true);

        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("price", price);

            if (thumbnail) formData.append("thumbnail", thumbnail);

            formData.append("selar_product_id", selarId);

            const endpoint = editingSlug
                ? `/ebooks/${editingSlug}`
                : `/ebooks`;

            const method = editingSlug ? "put" : "post";

            await api({
                url: endpoint,
                method,
                data: formData,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            fetchEbooks();
            resetForm();
        } catch (err) {
            console.error(err);
            alert("Failed to submit ebook");
        } finally {
            setSubmitting(false);
        }
    };


    const deleteEbook = async (slug: string) => {
        if (!confirm("Are you sure you want to delete this ebook?")) return;

        try {
            await api.delete(`/ebooks/${slug}`);
            fetchEbooks();
        } catch (err) {
            console.error(err);
            alert("Failed to delete ebook");
        }
    };


    const loadEbookForEditing = (ebook: any) => {
        setEditingSlug(ebook.slug);
        setTitle(ebook.title);
        setDescription(ebook.description);
        setPrice(ebook.price);
        setSelarId(ebook.selar_product_id);
        setThumbnail(ebook.thumbnail_url);
        setFormVisible(true); // show form when editing
    };

    return (
        <div className="p-6 text-white max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Manage Ebooks</h1>
                {!formVisible && (
                    <button
                        onClick={() => setFormVisible(true)}
                        className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg font-semibold text-white"
                    >
                        Create Ebook
                    </button>
                )}
            </div>

            {/* Collapsible Form */}
            {formVisible && (
                <form
                    onSubmit={handleSubmit}
                    className="bg-gray-900 p-6 rounded-lg mb-8 border border-gray-700 space-y-4"
                >
                    <h2 className="text-xl font-semibold">
                        {editingSlug ? "Edit Ebook" : "Add Ebook"}
                    </h2>

                    <input
                        type="text"
                        placeholder="Title"
                        required
                        className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <textarea
                        placeholder="Description"
                        required
                        rows={4}
                        className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <input
                        type="number"
                        placeholder="Price"
                        required
                        className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />

                    <input
                        type="text"
                        placeholder="Selar product ID"
                        required
                        className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
                        value={selarId}
                        onChange={(e) => setSelarId(e.target.value)}
                    />

                    <div>
                        <label className="block mb-1 text-sm">Thumbnail</label>
                        <input
                            type="file"
                            accept="image/*"
                            required
                            onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
                            className="w-full text-white bg-blue-300"
                        />
                    </div>

                    <div className="flex justify-between gap-2">
                        <button
                            type="submit"
                            disabled={submitting}
                            className={`flex-1 py-2 rounded-lg font-semibold text-white ${submitting
                                ? "bg-indigo-400 cursor-not-allowed"
                                : "bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                                }`}
                        >
                            {submitting
                                ? editingSlug
                                    ? "Updating..."
                                    : "Creating..."
                                : editingSlug
                                    ? "Update Ebook"
                                    : "Create Ebook"}
                        </button>

                        <button
                            type="button"
                            onClick={resetForm}
                            className="flex-1 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 font-semibold text-white"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {/* Search */}
            <div className="flex justify-center mb-4">
                <input
                    type="text"
                    placeholder="Search ebooks..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full max-w-md px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            {/* Ebook Grid */}
            {loadingEbooks ? (
                <p className="text-gray-400">Loading...</p>
            ) : currentEbooks.length === 0 ? (
                <p className="text-gray-400">No ebooks found.</p>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentEbooks.map((ebook) => (
                        <div
                            key={ebook.slug}
                            className="bg-gray-900 p-4 rounded-lg border border-gray-700"
                        >
                            {ebook.thumbnail_url && (
                                <img
                                    src={ebook.thumbnail_url}
                                    alt={ebook.title}
                                    className="w-full h-40 object-cover rounded-lg mb-4"
                                />
                            )}

                            <h2 className="font-semibold text-lg">{ebook.title}</h2>
                            <p className="text-gray-400 text-sm">{ebook.description}</p>
                            <p className="mt-2 font-semibold">${ebook.price}</p>

                            <div className="flex gap-3 mt-4">
                                <button
                                    className="px-3 py-2 border border-gray-600 text-gray-300 hover:bg-gray-700 rounded-lg font-semibold"
                                    onClick={() => loadEbookForEditing(ebook)}
                                >
                                    Edit
                                </button>

                                <button
                                    className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold text-white"
                                    onClick={() => deleteEbook(ebook.slug)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-10 space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                        <button
                            key={num}
                            onClick={() => setCurrentPage(num)}
                            className={`px-4 py-2 rounded-md ${num === currentPage
                                ? "bg-indigo-600 text-white"
                                : "bg-gray-200 text-gray-900"
                                }`}
                        >
                            {num}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
