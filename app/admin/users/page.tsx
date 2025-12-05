'use client';

import React, { useEffect, useState } from "react";

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(true);

    // Form state
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("user"); // internal value: "user" or "admin"
    const [password, setPassword] = useState("");

    const [editingUserId, setEditingUserId] = useState<string | null>(null);
    const [formVisible, setFormVisible] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Search & Pagination
    const [search, setSearch] = useState("");
    const [sortOrder, setSortOrder] = useState("newest");
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 10;

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            console.error("Failed to fetch users:", err);
        } finally {
            setLoadingUsers(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const resetForm = () => {
        setFullname("");
        setEmail("");
        setRole("user");
        setPassword("");
        setEditingUserId(null);
        setFormVisible(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!fullname.trim() || !email.trim() || (!editingUserId && !password.trim())) {
            alert("Please fill all required fields");
            return;
        }

        setSubmitting(true);

        try {
            const token = localStorage.getItem("token");

            const url = editingUserId
                ? `${process.env.NEXT_PUBLIC_API_URL}/users/${editingUserId}`
                : `${process.env.NEXT_PUBLIC_API_URL}/users/admin/register`;

            const method = editingUserId ? "PUT" : "POST";

            const body: any = {
                fullname,
                email,
                is_admin: role === "admin", // convert dropdown to boolean
            };
            if (!editingUserId) body.password = password; // only for new user

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                const err = await res.json();
                console.error("Error:", err);
                alert("Failed to save user");
                return;
            }

            fetchUsers();
            resetForm();
        } catch (err) {
            console.error(err);
            alert("An error occurred");
        } finally {
            setSubmitting(false);
        }
    };

    const loadUserForEditing = (user: any) => {
        setEditingUserId(user._id);
        setFullname(user.fullname);
        setEmail(user.email);
        setRole(user.is_admin ? "admin" : "user"); // convert boolean to dropdown value
        setFormVisible(true);
    };

    const deleteUser = async (userId: string) => {
        if (!confirm("Are you sure you want to delete this user?")) return;

        try {
            const token = localStorage.getItem("token");
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchUsers();
        } catch (err) {
            console.error(err);
            alert("Failed to delete user");
        }
    };

    const filteredUsers = users
        .filter((u) =>
            u.fullname.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) =>
            sortOrder === "newest"
                ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                : new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );

    const indexOfLast = currentPage * perPage;
    const indexOfFirst = indexOfLast - perPage;
    const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredUsers.length / perPage);

    const exportCSV = () => {
        if (!filteredUsers || filteredUsers.length === 0) return;

        const headers = ["Fullname", "Email", "Role", "Date Joined"];
        const rows = filteredUsers.map((u) => [
            u.fullname,
            u.email,
            u.is_admin ? "Admin" : "User",
            u.created_at ? new Date(u.created_at).toLocaleDateString() : "",
        ]);

        const csvContent =
            [headers, ...rows]
                .map((e) => e.map((v) => `"${v}"`).join(","))
                .join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `users_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="p-6 text-white max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Manage Users</h1>

                <div className="flex gap-2">
                    {!formVisible && (
                        <button
                            onClick={() => setFormVisible(true)}
                            className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg font-semibold"
                        >
                            + Add User
                        </button>
                    )}

                    <button
                        onClick={exportCSV}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold"
                    >
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Collapsible Form */}
            {formVisible && (
                <form
                    onSubmit={handleSubmit}
                    className="bg-gray-900 p-6 rounded-lg border border-gray-700 space-y-4"
                >
                    <h2 className="text-xl font-semibold">
                        {editingUserId ? "Edit User" : "Add User"}
                    </h2>

                    <input
                        type="text"
                        placeholder="Fullname"
                        required
                        className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700"
                        value={fullname}
                        onChange={(e) => setFullname(e.target.value)}
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        required
                        className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700"
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>

                    {!editingUserId && (
                        
                        <input
                            type="password"
                            placeholder="Password (minimum of 6 characters)"
                            required
                            className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    )}

                    <div className="flex gap-2 justify-end">
                        <button
                            type="button"
                            onClick={resetForm}
                            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
                        >
                            {submitting
                                ? editingUserId
                                    ? "Updating..."
                                    : "Creating..."
                                : editingUserId
                                    ? "Update User"
                                    : "Create User"}
                        </button>
                    </div>
                </form>
            )}

            {/* Search & Sort */}
            <div className="flex flex-col md:flex-row justify-between gap-2">
                <input
                    type="text"
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border p-2 rounded w-full md:w-1/3 bg-gray-800"
                />

                <select
                    className="border p-2 rounded w-full md:w-1/6 bg-gray-800"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                </select>
            </div>

            {/* Users Table */}
            {loadingUsers ? (
                <p>Loading...</p>
            ) : (
                <>
                    <table className="w-full border-collapse mt-4">
                        <thead>
                            <tr className="bg-gray-800 text-white">
                                <th className="border p-2">Fullname</th>
                                <th className="border p-2">Email</th>
                                <th className="border p-2">Role</th>
                                <th className="border p-2">Date Joined</th>
                                <th className="border p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentUsers.map((user) => (
                                <tr key={user._id} className="border">
                                    <td className="p-2">{user.fullname}</td>
                                    <td className="p-2">{user.email}</td>
                                    <td className="p-2 capitalize">{user.is_admin ? "Admin" : "User"}</td>
                                    <td className="p-2">
                                        {user.created_at
                                            ? new Date(user.created_at).toLocaleDateString()
                                            : ""}
                                    </td>
                                    <td className="p-2 flex gap-2">
                                        <button
                                            className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 rounded text-sm"
                                            onClick={() => loadUserForEditing(user)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
                                            onClick={() => deleteUser(user._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-4 gap-2">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                                <button
                                    key={num}
                                    onClick={() => setCurrentPage(num)}
                                    className={`px-3 py-1 rounded ${num === currentPage
                                        ? "bg-indigo-600 text-white"
                                        : "bg-gray-700 text-white"
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
