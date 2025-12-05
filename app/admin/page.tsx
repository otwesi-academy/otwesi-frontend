import AdminCard from "./components/AdminCard";

export default async function AdminDashboard() {
    const stats = {
        courses: 12,
        ebooks: 8,
        blogposts: 25,
        reviews: 40,
        users: 102,
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8 text-white">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AdminCard title="Courses" count={stats.courses} />
                <AdminCard title="Ebooks" count={stats.ebooks} />
                <AdminCard title="Blogposts" count={stats.blogposts} />
                <AdminCard title="Reviews" count={stats.reviews} />
                <AdminCard title="Users" count={stats.users} />
            </div>
        </div>
    );
}
