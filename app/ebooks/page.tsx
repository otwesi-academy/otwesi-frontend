"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { parseISO } from "date-fns";

interface Ebook {
    _id: string;
    title: string;
    description: string;
    slug: string;
    price: number;
    thumbnail_url: string;
    ebook_file_url: string;
    created_at: string;
    updated_at: string;
}

export default function EbooksPage() {
    const [ebooks, setEbooks] = useState<Ebook[]>([]);
    const [search, setSearch] = useState("");
    const [filtered, setFiltered] = useState<Ebook[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 6;

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/ebooks`)
            .then((res) => res.json())
            .then((data) => {
                setEbooks(data);
                setFiltered(data);
            });
    }, []);

    // Handle search
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

    // Highlight "NEW" items (7 days)
    const isNew = (dateStr: string) => {
        const date = parseISO(dateStr);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        return diff <= 7 * 24 * 60 * 60 * 1000;
    };

    return (
        <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-8">Our eBooks</h1>

            {/* Search */}
            <div className="flex justify-center mb-8">
                <input
                    type="text"
                    placeholder="Search eBooks..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full max-w-md px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            {/* Grid */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {currentEbooks.map((ebook) => (
                    <Link
                        key={ebook._id}
                        href={`/ebooks/${ebook.slug}`}
                        className="block bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition overflow-hidden relative"
                    >
                        {/* NEW badge */}
                        {isNew(ebook.created_at) && (
                            <span className="absolute top-3 left-3 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-semibold z-10">
                                NEW
                            </span>
                        )}

                        <img
                            src={ebook.thumbnail_url}
                            alt={ebook.title}
                            className="w-full h-48 object-cover"
                        />

                        <div className="p-6 flex flex-col">
                            {/* Title + Description */}
                            <div className="mb-4">
                                <h2 className="text-xl font-semibold mb-2">
                                    {ebook.title}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-300">
                                    {ebook.description.length > 80
                                        ? ebook.description.slice(0, 80) + "..."
                                        : ebook.description}
                                </p>
                            </div>

                            {/* Price */}
                            <div className="mt-auto flex justify-between items-center">
                                <span className="text-lg font-bold text-gray-900 dark:text-white">
                                    ₦{ebook.price.toLocaleString()}
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    eBook
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-10 space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                        <button
                            key={num}
                            onClick={() => setCurrentPage(num)}
                            className={`px-4 py-2 rounded-md ${num === currentPage
                                    ? "bg-indigo-600 text-white"
                                    : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
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
