"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";


import { useAuth } from "../context/AuthContext";


const Layout = ({ children }: { children: React.ReactNode }) => {
    const [mobileOpen, setMobileOpen] = useState(false);

    const { user, logout } = useAuth();


    return (
        <div className="min-h-screen flex flex-col">
            {/* HEADER */}
            <header className="px-4 sm:px-6 lg:px-8 py-3 bg-gray-100 dark:bg-gray-800 shadow-md flex justify-between items-center">
                <Link href="/" className="text-center">

                    <img 
                        src="/otwesi_logo1.jpg"
                        alt="logo" 
                        width="120" 
                        className="rounded-2xl"
                    />
                    {/* <h1 className="text-xl sm:text-2xl font-bold leading-tight">
                        OTWESI <br />
                        <span className="tracking-widest text-sm sm:text-base">ACADEMY</span>
                    </h1> */}
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center space-x-6">
                    <Link href="/courses">Courses</Link>
                    <Link href="/ebooks">Ebooks</Link>
                    <Link href="/blogposts">Blog</Link>
                    <Link href="/attendance">Attendance</Link>
                    <Link href="/contact">Contact</Link>
                    <Link href="/about">About Us</Link>

                    {user ? (
                        <>
                            <span className="font-semibold">Hello, {user.fullname}</span>
                            <button onClick={logout} className="text-red-500 hover:underline">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login">Login</Link>
                            <Link href="/register">Register</Link>
                        </>
                    )}

                </nav>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle Menu"
                >
                    {mobileOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </header>

            {/* Mobile Dropdown Menu */}
            {mobileOpen && (
                <div className="md:hidden bg-gray-100 dark:bg-gray-800 px-4 sm:px-6 py-4 space-y-4 shadow-lg">
                    <Link href="/courses" onClick={() => setMobileOpen(false)} className="block py-2 px-3 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                        Courses
                    </Link>
                    <Link href="/ebooks" onClick={() => setMobileOpen(false)} className="block py-2 px-3 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                        Ebooks
                    </Link>
                    <Link href="/blogposts" onClick={() => setMobileOpen(false)} className="block py-2 px-3 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                        Blog
                    </Link>
                    <Link href="/attendance" onClick={() => setMobileOpen(false)} className="block py-2 px-3 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                        Attendance
                    </Link>
                    <Link href="/contact" onClick={() => setMobileOpen(false)} className="block py-2 px-3 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                        Contact
                    </Link>
                    <Link href="/about" onClick={() => setMobileOpen(false)} className="block py-2 px-3 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                        About Us
                    </Link>

                    {user ? (
                        <>
                            <span className="block py-2 px-3">Hello, {user.fullname}</span>
                            <button
                                onClick={() => {
                                    logout();
                                    setMobileOpen(false);
                                }}
                                className="block py-2 px-3 rounded text-red-500 hover:underline"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" onClick={() => setMobileOpen(false)} className="block py-2 px-3 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                                Login
                            </Link>
                            <Link href="/register" onClick={() => setMobileOpen(false)} className="block py-2 px-3 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            )}


            {/* MAIN */}
            <main className="flex-1 px-3 sm:px-6 lg:px-8 w-full max-w-7xl mx-auto">
                {children}
            </main>

            {/* FOOTER */}
            <footer className="p-6 text-center bg-gray-100 dark:bg-gray-800 mt-10">
                © 2025 OTWESI ACADEMY. All rights reserved.
            </footer>
        </div>
    );
};

export default Layout;
