"use client";

import { useState } from "react";
import AdminSidebar from "./components/AdminSidebar";
import { Menu } from "lucide-react";
import AdminRouteWrapper from "./components/AdminRouteWrapper";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);

    return (

        <AdminRouteWrapper>

            <div className="flex min-h-screen bg-gray-900 text-gray-100">
                {/* Sidebar */}
                <AdminSidebar open={open} setOpen={setOpen} />

                {/* Main Content */}
                <main className="flex-1 p-8">
                    {/* Mobile toggle button */}
                    <button
                        className="md:hidden mb-4 p-2 rounded bg-gray-800 border border-gray-700"
                        onClick={() => setOpen(true)}
                    >
                        <Menu size={22} />
                    </button>

                    {children}
                </main>
            </div>
        </AdminRouteWrapper>
    );
}
