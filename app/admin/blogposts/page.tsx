"use client";

import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { api } from "../../../lib/api";


type Block = {
    id: string;
    type: "text" | "image";
    content: string;
};

type BlogPost = {
    title: string;
    slug: string;
    content: string; // JSON string of blocks
    thumbnail_url?: string;
    created_at: string;
};

export default function AdminBlogPostsPage() {
    const [blogposts, setBlogposts] = useState<BlogPost[]>([]);
    const [loadingPosts, setLoadingPosts] = useState(true);
    const [search, setSearch] = useState("");
    const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 6;

    // Form state
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState("");
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [editingSlug, setEditingSlug] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);


    const fetchBlogposts = async () => {
        try {
            const res = await api.get("/blogposts")
            setBlogposts(res.data);
        } catch (err) {
            console.error(err);
            
        } finally {
            setLoadingPosts(false);
        }
    }

    useEffect(() => {
        fetchBlogposts();
    }, []);

    // Search filtering
    useEffect(() => {
        const filtered = blogposts.filter(post =>
            post.title.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredPosts(filtered);
        setCurrentPage(1);
    }, [search, blogposts]);

    const indexOfLast = currentPage * perPage;
    const indexOfFirst = indexOfLast - perPage;
    const currentPosts = filteredPosts.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredPosts.length / perPage);

    // Reset form
    const resetForm = () => {
        setTitle("");
        setThumbnail(null);
        setBlocks([]);
        setEditingSlug(null);
        setShowForm(false);
    };

    // Add / Edit Blocks
    const addBlock = (type: "text" | "image" = "text") => {
        setBlocks([...blocks, { id: uuidv4(), type, content: "" }]);
    };

    const updateBlock = (id: string, content: string) => {
        setBlocks(blocks.map(b => (b.id === id ? { ...b, content } : b)));
    };

    const removeBlock = (id: string) => {
        setBlocks(blocks.filter(b => b.id !== id));
    };

    // Load blogpost for editing
    const loadBlogpostForEditing = (post: BlogPost) => {
        setEditingSlug(post.slug);
        setTitle(post.title);
        setThumbnail(null); // user can choose to replace
        try {
            const parsedBlocks: Block[] = JSON.parse(post.content).map((b: any) => ({
                id: uuidv4(),
                ...b
            }));
            setBlocks(parsedBlocks);
        } catch {
            setBlocks([]);
        }
        setShowForm(true);
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (
            !title.trim() || 
            blocks.length === 0 || 
            blocks.some(b => b.type === "text" && !b.content.trim())) {
                alert("Please fill all required fields");
                return;
        }

        setSubmitting(true);
        
        try {
            const formData = new FormData();
            formData.append("title", title);
            if (thumbnail) formData.append("thumbnail", thumbnail);
            formData.append("content", JSON.stringify(blocks));

            const endpoint = editingSlug
                ? `/blogposts/${editingSlug}`
                : `/blogposts`;
            console.log("here here: ", endpoint)
            const method = editingSlug ? "put" : "post";

            const res = await api({
                url: endpoint,
                method,
                data: formData,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            fetchBlogposts();
            resetForm();
            
        } catch (err) {
            console.error(err);
            alert("Failed to submit blogpost");
        } finally {
            setSubmitting(false);
        }

    }

    const deleteBlogpost = async (slug: string) => {
        if (!confirm("Are you sure you want to delete this blogpost?")) return;

        try {
            await api.delete(`/blogposts/${slug}`);
            fetchBlogposts();
        } catch (err) {
            console.error(err);
            alert("Failed to delete blogpost");
        }
    };


    return (
        <div className="p-6 max-w-7xl mx-auto text-white">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">Manage Blog Posts</h1>
                <div className="flex gap-2">
                    <button
                        className="px-4 py-2 bg-indigo-600 rounded-lg font-semibold hover:bg-indigo-700"
                        onClick={() => setShowForm(true)}
                    >
                        {editingSlug ? "Editing Blogpost" : "Add Blogpost"}
                    </button>
                    {showForm && (
                        <button
                            className="px-4 py-2 bg-gray-700 rounded-lg font-semibold hover:bg-gray-600"
                            onClick={resetForm}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </div>

            {/* Search */}
            <div className="flex justify-center mb-6">
                <input
                    type="text"
                    placeholder="Search blogposts..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full max-w-md px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            {/* Form */}
            {showForm && (
                <form
                    onSubmit={handleSubmit}
                    className="bg-gray-900 p-6 rounded-lg mb-8 border border-gray-700 space-y-4"
                >
                    <h2 className="text-xl font-semibold">{editingSlug ? "Edit Blogpost" : "Add Blogpost"}</h2>

                    <input
                        type="text"
                        placeholder="Title"
                        required
                        className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <div>
                        <label className="block mb-1 text-sm">Thumbnail</label>
                        <input
                            type="file"
                            accept="image/*"
                            required
                            onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
                            className="w-full text-white bg-gray-700 p-1 rounded"
                        />
                    </div>

                    <div className="space-y-3">
                        {blocks.map(block => (
                            <div key={block.id} className="p-2 border rounded-lg bg-gray-800 relative">
                                {block.type === "text" && (
                                    <textarea
                                        placeholder="Write text..."
                                        value={block.content}
                                        onChange={(e) => updateBlock(block.id, e.target.value)}
                                        className="w-full p-2 rounded bg-gray-700 text-white"
                                        rows={4}
                                    />
                                )}
                                {block.type === "image" && (
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => updateBlock(block.id, e.target.files?.[0]?.name || "")}
                                    />
                                )}
                                <button
                                    type="button"
                                    className="absolute top-1 right-1 text-red-500 font-bold"
                                    onClick={() => removeBlock(block.id)}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-2">
                        <button
                            type="button"
                            className="px-4 py-2 bg-indigo-500 rounded text-white font-semibold"
                            onClick={() => addBlock("text")}
                        >
                            Add Text
                        </button>
                        <button
                            type="button"
                            className="px-4 py-2 bg-green-500 rounded text-white font-semibold"
                            onClick={() => addBlock("image")}
                        >
                            Add Image
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className={`w-full py-2 rounded-lg font-semibold text-white ${submitting
                                ? "bg-indigo-400 cursor-not-allowed"
                                : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                            }`}
                    >
                        {submitting
                            ? editingSlug
                                ? "Updating..."
                                : "Creating..."
                            : editingSlug
                                ? "Update Blogpost"
                                : "Create Blogpost"}
                    </button>
                </form>
            )}

            {/* Blogposts Grid */}
            {loadingPosts ? (
                <p className="text-gray-400">Loading...</p>
            ) : filteredPosts.length === 0 ? (
                <p className="text-gray-400">No blogposts found.</p>
            ) : (
                <>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentPosts.map(post => (
                            <div key={post.slug} className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                                {post.thumbnail_url && (
                                    <img src={post.thumbnail_url} alt={post.title} className="w-full h-40 object-cover rounded-lg mb-4" />
                                )}

                                <h2 className="font-semibold text-lg">{post.title}</h2>

                                <div className="flex gap-3 mt-4">
                                    <button
                                        className="px-3 py-2 border border-gray-600 text-gray-300 hover:bg-gray-700 rounded-lg font-semibold"
                                        onClick={() => loadBlogpostForEditing(post)}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold text-white"
                                        onClick={() => deleteBlogpost(post.slug)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
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
                </>
            )}
        </div>
    );
}
