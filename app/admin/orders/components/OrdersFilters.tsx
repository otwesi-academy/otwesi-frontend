"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface Props {
    defaultStatus?: string;
    defaultFrom?: string;
    defaultTo?: string;
    defaultBuyerEmail?: string;
    defaultPaymentMethod?: string; // new
}

export default function OrdersFilters({
    defaultStatus = "",
    defaultFrom = "",
    defaultTo = "",
    defaultBuyerEmail = "",
    defaultPaymentMethod = "",
}: Props) {
    const router = useRouter();
    const params = useSearchParams();

    function updateParam(key: string, value: string) {
        const newParams = new URLSearchParams(params.toString());
        value ? newParams.set(key, value) : newParams.delete(key);
        newParams.set("page", "1"); // reset page
        router.push(`/admin/orders?${newParams.toString()}`);
    }

    return (
        <div className="flex flex-wrap gap-4 mb-6">
            {/* Status Filter */}
            <select
                className="bg-gray-800 text-white px-3 py-2 rounded"
                defaultValue={defaultStatus}
                onChange={(e) => updateParam("status", e.target.value)}
            >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="cancelled">Cancelled</option>
            </select>


            {/* Date Filters */}
            <input
                type="date"
                className="bg-gray-800 text-white px-3 py-2 rounded"
                defaultValue={defaultFrom}
                onChange={(e) => updateParam("from", e.target.value)}
            />
            <input
                type="date"
                className="bg-gray-800 text-white px-3 py-2 rounded"
                defaultValue={defaultTo}
                onChange={(e) => updateParam("to", e.target.value)}
            />

            {/* Buyer Email Filter */}
            <input
                type="text"
                placeholder="Buyer email"
                className="bg-gray-800 text-white px-3 py-2 rounded"
                defaultValue={defaultBuyerEmail}
                onChange={(e) => updateParam("buyer_email", e.target.value)}
            />

            {/* Payment Method Filter */}
            <select
                className="bg-gray-800 text-white px-3 py-2 rounded"
                defaultValue={defaultPaymentMethod}
                onChange={(e) => updateParam("payment_method", e.target.value)}
            >
                <option value="">All Payment Methods</option>
                <option value="paystack">Paystack</option>
                <option value="whatsapp">Whatsapp</option>
                <option value="selar">Selar</option>
            </select>
        </div>
    );
}
