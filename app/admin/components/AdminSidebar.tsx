"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

const links = [
    { name: "Dashboard", href: "/admin" },
    { name: "Courses", href: "/admin/courses" },
    { name: "Ebooks", href: "/admin/ebooks" },
    { name: "Blogposts", href: "/admin/blogposts" },
    { name: "Orders", href: "/admin/orders" },
    { name: "Users", href: "/admin/users" },
    { name: "Attendance", href: "/admin/attendance" },
    { name: "Waitlist", href: "/admin/waitlist" },
];

export default function AdminSidebar({
    open,
    setOpen,
}: {
    open: boolean;
    setOpen: (v: boolean) => void;
}) {
    const pathname = usePathname();

    return (
        <>
            {/* Overlay for mobile */}
            {open && (
                <div
                    onClick={() => setOpen(false)}
                    className="fixed inset-0 bg-black bg-opacity-40 md:hidden z-30"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed md:static top-0 left-0 h-full w-64 
          bg-gray-800 border-r border-gray-700 
          p-6 z-40 transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
            >
                {/* Close button on mobile */}
                <button
                    className="md:hidden absolute top-4 right-4"
                    onClick={() => setOpen(false)}
                >
                    <X size={22} className="text-white" />
                </button>

                <h2 className="text-2xl font-bold text-white mb-8">Admin Panel</h2>

                <nav className="flex flex-col gap-3">
                    {links.map((l) => (
                        <Link
                            key={l.href}
                            href={l.href}
                            onClick={() => setOpen(false)}
                            className={`
                px-3 py-2 rounded-lg 
                ${pathname === l.href
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-300 hover:bg-gray-700 hover:text-white"}
              `}
                        >
                            {l.name}
                        </Link>
                    ))}
                </nav>
            </aside>
        </>
    );
}
