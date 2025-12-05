"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface BlogPost {
    title: string;
    slug: string;
    content: string;
    thumbnail_url: string | null;
    category: string;
    author: {
        username?: string;
        fullname?: string;
        email?: string;
    };
    created_at: string;
}

export default function BlogListPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [search, setSearch] = useState("");
    const [filtered, setFiltered] = useState<BlogPost[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 6;

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogposts`)
            .then((res) => res.json())
            .then((data) => {
                setPosts(data);
                setFiltered(data);
            });
    }, []);

    useEffect(() => {
        const searchLower = search.toLowerCase();

        const filteredPosts = posts.filter((post) =>
            post.title.toLowerCase().includes(searchLower)
        );

        setFiltered(filteredPosts);
        setCurrentPage(1);
    }, [search, posts]);

    const indexOfLast = currentPage * perPage;
    const indexOfFirst = indexOfLast - perPage;
    const currentPosts = filtered.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filtered.length / perPage);

    return (
        <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-8">Latest Blog Posts</h1>

            {/* Search */}
            <div className="flex justify-center mb-8">
                <input
                    type="text"
                    placeholder="Search blog posts..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full max-w-md px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            {/* Blog Grid */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {currentPosts.map((post) => {
                    let preview = "";
                    try {
                        const blocks = JSON.parse(post.content);
                        preview = blocks
                            .filter((b: any) => b.type === "text")
                            .map((b: any) => b.content)
                            .join(" ")
                            .slice(0, 150); // first 150 chars
                    } catch (err) {
                        console.error("Failed to parse content for preview:", err);
                        preview = "";
                    }

                    const authorName =
                        post.author?.fullname ||
                        post.author?.username ||
                        post.author?.email ||
                        "Unknown";

                    return (
                        <Link
                            key={post.slug}
                            href={`/blogposts/${post.slug}`}
                            className="block bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition overflow-hidden"
                        >
                            {post.thumbnail_url && (
                                <Image
                                    src={post.thumbnail_url}
                                    width={600}
                                    height={400}
                                    alt={post.title}
                                    className="w-full h-48 object-cover"
                                />
                            )}

                            <div className="p-6 flex flex-col">
                                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>

                                <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
                                    {preview}...
                                </p>

                                <div className="mt-auto pt-4 flex justify-between text-sm text-gray-500">
                                    <span>{authorName}</span>
                                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </Link>
                    );
                })}
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
