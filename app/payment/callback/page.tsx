"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaymentCallback() {
    const params = useSearchParams();
    const order_id = params.get("order");
    const selar_ref = params.get("ref");

    const [status, setStatus] = useState("Verifying payment...");

    useEffect(() => {
        if (!order_id || !selar_ref) return;

        const verify = async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/verify-payment`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ order_id, selar_ref })
            });

            const data = await res.json();

            if (data.paid) {
                setStatus("Payment successful! Redirecting...");
                setTimeout(() => {
                    window.location.href = `/library/${order_id}`;
                }, 1500);
            } else {
                setStatus("Payment failed. Contact support.");
            }
        };

        verify();
    }, [order_id, selar_ref]);

    return (
        <div className="min-h-screen flex items-center justify-center text-xl">
            {status}
        </div>
    );
}
