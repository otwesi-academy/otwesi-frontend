"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { parseISO } from "date-fns";

import { courseApi } from "@/lib/serverApi";
import { Course } from "@/types/types";


export default function CoursesPage() {
    
    const [courses, setCourses] = useState<Course[]>([]);
    const [search, setSearch] = useState("");
    const [filtered, setFiltered] = useState<Course[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 6;

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await courseApi.listCourses()
                
                setCourses(data);
                setFiltered(data);    
            } catch (error: any) {
                console.error(error);   
            }
        };

        fetchCourses();
        
    }, []);


    useEffect(() => {
        const filteredCourses = courses.filter((c) =>
            c.title.toLowerCase().includes(search.toLowerCase())
        );
        setFiltered(filteredCourses);
        setCurrentPage(1);
    }, [search, courses]);

    const indexOfLast = currentPage * perPage;
    const indexOfFirst = indexOfLast - perPage;
    const currentCourses = filtered.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filtered.length / perPage);

    // Render star rating
    const renderStars = (rating: number = 4) => {
        const full = Math.floor(rating);
        const half = rating % 1 >= 0.5 ? 1 : 0;
        const empty = 5 - full - half;

        return (
            <div className="flex items-center space-x-1 text-yellow-400">
                {Array(full).fill(0).map((_, i) => <span key={`f${i}`}>★</span>)}
                {half ? <span>½</span> : null}
                {Array(empty).fill(0).map((_, i) => (
                    <span key={`e${i}`} className="text-gray-600">★</span>
                ))}
            </div>
        );
    };

    const isNew = (dateStr: string) => {
        const date = parseISO(dateStr);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        return diff <= 7 * 24 * 60 * 60 * 1000; // 7 days
    };

    return (
        <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-8">Our Courses</h1>

            {/* Search */}
            <div className="flex justify-center mb-8">
                <input
                    type="text"
                    placeholder="Search courses..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full max-w-md px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            {/* Courses Grid */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 ">
                {currentCourses.map((course) => (
                    <Link
                        key={course._id}
                        href={`/courses/${course.slug}`}
                        className="block bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition overflow-hidden relative"
                    >
                        {/* New badge */}
                        {isNew(course.created_at) && (
                            <span className="absolute top-3 left-3 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-semibold z-10">
                                NEW
                            </span>
                        )}

                        <img
                            src={course.thumbnail_url}
                            alt={course.title}
                            className="w-full h-48 object-cover"
                        />

                        <div className="p-6 flex flex-col">
                            {/* Title + Description */}
                            <div className="mb-4">
                                <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
                                <p className="text-gray-300">
                                    {course.description.length > 80
                                        ? course.description.slice(0, 80) + "..."
                                        : course.description}
                                </p>
                            </div>

                            {/* Price + Level + Rating */}
                            <div className="mt-auto flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium px-3 py-1 bg-indigo-700 text-white rounded-full">
                                        {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                                    </span>
                                    <span className="text-lg font-bold text-white">
                                        ${course.price.toFixed(2)}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    {renderStars(course.rating)}
                                    <span className="text-sm text-gray-400">
                                        50 enrolled
                                    </span>
                                </div>
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
                                : "bg-gray-700 text-white"
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
