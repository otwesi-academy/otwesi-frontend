"use client";

import { useEffect, useState } from "react";
import AdminCard from "./components/AdminCard";
import { useAuth } from "../../context/AuthContext";
import { api } from "@/lib/clientApi";

export default function AdminDashboard() {
    const { user } = useAuth(); // get user from context
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        if (!user || !user.is_admin) {
            setLoading(false); // stop loading if not authorized
            return;
        }

        const fetchStats = async () => {
            try {
                const res = await api.get("/admin/stats");
                setStats(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchStats();
    }, [user]);

    if (loading) return <p className="text-white">Loading...</p>;
    if (!user || !user.is_admin)
        return <p className="text-red-500">Access Denied</p>;
    if (!stats) return <p className="text-white">Loading dashboard...</p>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8 text-white">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AdminCard title="Courses" count={stats.courses} />
                <AdminCard title="Ebooks" count={stats.ebooks} />
                <AdminCard title="Blogposts" count={stats.blogposts} />
                <AdminCard title="Reviews" count={stats.reviews} />
                <AdminCard title="Users" count={stats.users} />
                <AdminCard title="Orders" count={stats.orders} />
                <AdminCard title="Waitlists" count={stats.waitlists} />
                <AdminCard title="Online Classes" count={stats.attendance} />
            </div>
        </div>
    );
}
