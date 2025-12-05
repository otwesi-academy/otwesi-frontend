"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";

interface AdminRouteWrapperProps {
    children: React.ReactNode;
}

export default function AdminRouteWrapper({ children }: AdminRouteWrapperProps) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Wait until auth state is loaded
        if (!loading) {
            if (!user || !user.is_admin) {
                router.replace("/login"); // or "/" if you prefer
            }
        }
    }, [user, loading, router]);

    // Show loading while checking auth
    if (loading) return <p className="text-center mt-20">Checking permissions...</p>;

    // If user is not admin, prevent flash
    if (!user || !user.is_admin) return null;

    return <>{children}</>;
}
